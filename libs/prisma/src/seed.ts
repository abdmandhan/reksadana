import prisma from './index.js';
import seedReferences from './seeds/references.js';
import seedUsers from './seeds/users.js';
import seedAgents from './seeds/agents.js';
import seedInvestors from './seeds/investors.js';
import { faker } from '@faker-js/faker';

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

  const upsertFunds = async (name: string, code: string) => {
    const maxUnitIssued = [0, 1000, 10000, 100000, 1000000, 10000000];
    const minRed = [10_000, 20_000, 50_000, 100_000];
    const _fund = await prisma.funds.upsert({
      where: { code },
      create: {
        name,
        code,
        ksei_code: code,
        fund_type_id: moneyMarketFundType.id,
        bank_id: bank.id,
        bank_branch_id: bank.bank_branchs[0].id,
        account_number: faker.number
          .int({ min: 1000000000, max: 9999999999 })
          .toString(),
        account_name: `Reksadana ${name}`,
        launched_at: faker.date.past(),
        max_red_percentage: faker.number.int({ min: 90, max: 100 }),
        max_switch_percentage: faker.number.int({ min: 90, max: 100 }),
        max_unit_issued:
          maxUnitIssued[
            faker.number.int({ min: 0, max: maxUnitIssued.length - 1 })
          ], // maximal unit yang bisa dibeli -> 0 -> unlimited
        min_red: minRed[faker.number.int({ min: 0, max: minRed.length - 1 })], // in rupiah
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
  };

  const funds = [
    {
      name: 'Money Market 01',
      code: 'MM01',
      ksei_code: 'MM01',
      fund_type_id: moneyMarketFundType.id,
      bank_id: bank.id,
      bank_branch_id: bank.bank_branchs[0].id,
      // random number
      account_number: faker.number
        .int({ min: 1000000000, max: 9999999999 })
        .toString(),
      account_name: 'Reksadana Money Market 01',
      launched_at: faker.date.past(),
      max_red_percentage: 100,
      max_switch_percentage: 100,
      max_unit_issued: 1000, // TODO: what's the effects?

      min_red: 0,

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
      allocations: [{}],
    },
  ];
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
