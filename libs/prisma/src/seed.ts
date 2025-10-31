import prisma from './index.js';
import seedReferences from './seeds/references.js';
import seedUsers from './seeds/users.js';
import seedAgents from './seeds/agents.js';
import seedInvestors from './seeds/investors.js';
import { faker } from '@faker-js/faker';

type MinRestType = 'AMOUNT' | 'UNIT';

const main = async () => {
  await seedReferences();
  await seedUsers();

  const maker = await prisma.users.findFirst({ where: { username: 'maker1' } });
  const approver = await prisma.users.findFirst({
    where: { username: 'approver1' },
  });

  if (!maker || !approver) return;

  await seedAgents();
  await seedInvestors();

  // seed funds
  const moneyMarketFundType = await prisma.fund_types.findFirst({
    where: { name: 'Money Market' },
  });
  if (!moneyMarketFundType) return;

  const bank = await prisma.banks.findFirst({
    include: { bank_branchs: true },
  });

  if (!bank || bank.bank_branchs.length == 0) return;

  const maxUnitIssued = [0, 1_000, 10_000, 100_000, 1_000_000, 10_000_000];
  const minRed = [10_000, 20_000, 50_000, 100_000];
  const recommendSub = [10_000, 20_000, 50_000, 100_000]
  const minRest: MinRestType[] = ['AMOUNT', 'UNIT']
  const minRestAmount = [0, 10_000, 20_000, 50_000, 100_000]

  const upsertFunds = async (name: string, code: string) => {
    const launched_at = faker.date.past();
    const start_date = launched_at.setDate(launched_at.getDate() + 10);

    const _fund = await prisma.funds.upsert({
      where: { code },
      create: {
        name,
        ksei_code: code,
        code,
        color: faker.color.rgb(),
        fund_type_id: moneyMarketFundType.id,
        bank_id: bank.id,
        bank_branch_id: bank.bank_branchs[0].id,
        account_number: faker.number
          .int({ min: 1000000000, max: 9999999999 })
          .toString(),
        account_name: `Reksadana ${name}`,

        launched_at,

        max_red_percentage: faker.number.int({ min: 90, max: 100 }),
        max_switch_percentage: faker.number.int({ min: 90, max: 100 }),
        max_unit_issued:
          maxUnitIssued[
          faker.number.int({ min: 0, max: maxUnitIssued.length - 1 })
          ], // maximal unit yang bisa dibeli -> 0 -> unlimited

        min_red: minRed[faker.number.int({ min: 0, max: minRed.length - 1 })], // in rupiah
        min_sub: minRed[faker.number.int({ min: 0, max: minRed.length - 1 })], // in rupiah
        min_swin: minRed[faker.number.int({ min: 0, max: minRed.length - 1 })], // in rupiah
        min_swout: minRed[faker.number.int({ min: 0, max: minRed.length - 1 })], // in rupiah

        recommend_sub: recommendSub,
        recommend_red: recommendSub,
        recommend_switch: recommendSub,

        sub_settlement_days: faker.number.int({ min: 0, max: 3 }),
        red_settlement_days: faker.number.int({ min: 0, max: 3 }),
        switching_settlement_days: faker.number.int({ min: 0, max: 3 }),

        min_rest_red: minRest[faker.number.int({ min: 0, max: minRest.length - 1 })],
        min_rest_red_amount: minRestAmount[faker.number.int({ min: 0, max: minRestAmount.length - 1 })],
        min_rest_switch: minRest[faker.number.int({ min: 0, max: minRest.length - 1 })],
        min_rest_switch_amount: minRestAmount[faker.number.int({ min: 0, max: minRestAmount.length - 1 })],

        initial_nav: 10_000_000_000,
        initial_unit: 10_000_000,
        initial_nav_per_unit: 1_000,

        management_fee_rate: 2, //2%
        valuation_basis: 365,

        start_date: new Date(start_date),

        can_switch_to: 'all',
        can_switch_to_list: [],

        fee_sub: 0.0,
        fee_red: 0.0,
        fee_swin: 0.0,
        fee_swout: 0.0,

        is_active: true,
        is_public: true,
        is_syaria: false,

        desc: faker.lorem.paragraph(),
        policy: faker.lorem.paragraph(),
        strategy: faker.lorem.paragraph(),
        goals: faker.lorem.paragraph(),

        can_redeem: true,
        can_subscript: true,
        can_switch: true,

        version: 1,
      },
      update: {},
    });

    // seed navs
    // const navs = await prisma.fund_navs.findMany({ where: { fund_id: _fund.id } })
    // if (navs.length == 0) {
    // create nav from start_date to now
    const _start_date = new Date(_fund.start_date);
    const now = new Date();
    const days = Math.ceil((now.getTime() - _start_date.getTime()) / (1000 * 60 * 60 * 24));
    for (let i = 0; i < days; i++) {
      const date = new Date(start_date);
      date.setDate(date.getDate() + i);
      // fake increase / decrease nav from initial_nav
      const initial_nav = _fund.initial_nav;
      const initial_unit = _fund.initial_unit;
      const nav = initial_nav.toNumber() + (initial_nav.toNumber() * faker.number.float({ min: -0.01, max: 0.01 }));
      const nav_per_unit = nav / initial_unit.toNumber();
      const outstanding_unit = initial_unit.toNumber() + (initial_unit.toNumber() * faker.number.float({ min: -0.01, max: 0.01 }));
      const management_fee_rate = _fund.management_fee_rate;
      const management_fee = nav * management_fee_rate.toNumber() / 100 / _fund.valuation_basis;
      const formatted_date = `${date.toISOString().split('T')[0]}`;
      await prisma.fund_navs.upsert({
        where: { fund_id_date: { fund_id: _fund.id, date: new Date(formatted_date) } },
        create: { fund_id: _fund.id, date, nav: nav, nav_per_unit: nav_per_unit, outstanding_unit: outstanding_unit, management_fee },
        update: { nav: nav, nav_per_unit: nav_per_unit, outstanding_unit: outstanding_unit, management_fee },
      })
    }
    // }

  };

  const funds = [
    { name: 'Money Market 01', code: 'MM01' },
    { name: 'Money Market 02', code: 'MM02' },
  ];

  for (const fund of funds) {
    await upsertFunds(fund.name, fund.code);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete');
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
