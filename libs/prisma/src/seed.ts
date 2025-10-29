import prisma from './index.js';
import seedReferences from './seeds/references.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const main = async () => {
  await seedReferences();
  // seed users

  const users = [
    {
      name: 'Admin',
      username: 'admin',
      password: '12341234',
      roles: ['Admin'],
    },
    {
      name: 'Maker 1',
      username: 'maker1',
      password: '12341234',
      roles: ['Maker'],
    },
    {
      name: 'Approver 1',
      username: 'approver1',
      password: '12341234',
      roles: ['Approver'],
    },
  ];

  await Promise.all(
    users.map(async (user) => {
      const _user = await prisma.users.upsert({
        where: { username: user.username },
        create: {
          name: user.name,
          username: user.username,
          password: bcrypt.hashSync(user.password, 10),
        },
        update: {
          name: user.name,
          username: user.username,
          password: bcrypt.hashSync(user.password, 10),
        },
      });

      for (const role of user.roles) {
        const _role = await prisma.roles.findFirst({ where: { name: role } });
        if (_role) {
          await prisma.user_roles.upsert({
            where: {
              user_id_role_id: { user_id: _user.id, role_id: _role.id },
            },
            create: {
              user_id: _user.id,
              role_id: _role.id,
            },
            update: {
              user_id: _user.id,
              role_id: _role.id,
            },
          });
        }
      }
    })
  );

  const maker = await prisma.users.findFirst({ where: { username: 'maker1' } });
  const approver = await prisma.users.findFirst({
    where: { username: 'approver1' },
  });

  if (!maker || !approver) return;

  const agentLevels = await prisma.agent_levels.findMany();
  const agentTypes = await prisma.agent_types.findMany();

  const agentRetail = agentTypes.find((a) => a.name == 'Retail');

  if (!agentRetail) return;

  // seed agents (retail)
  const agents = [
    {
      agent_level_id: agentLevels.find((a) => a.name == 'Head')?.id,
      agent_type_id: agentRetail.id,
      code: 'HEAD01',
      first_name: faker.person.firstName(),
      middle_name: faker.person.middleName(),
      last_name: faker.person.lastName(),
      email: 'head_agent@gmail.com',
      phone_number: faker.phone.number(),
      is_active: true,
      childrens: [
        {
          agent_level_id: agentLevels.find((a) => a.name == 'Sales')?.id,
          agent_type_id: agentRetail.id,
          code: 'SALES01',
          first_name: faker.person.firstName(),
          middle_name: faker.person.middleName(),
          last_name: faker.person.lastName(),
          email: 'sales_agent@gmail.com',
          phone_number: faker.phone.number(),
          is_active: true,
          childrens: [
            {
              agent_level_id: agentLevels.find((a) => a.name == 'Sub Sales')
                ?.id,
              agent_type_id: agentRetail.id,
              code: 'SUBSALES01',
              first_name: faker.person.firstName(),
              middle_name: faker.person.middleName(),
              last_name: faker.person.lastName(),
              email: 'sub_sales_agent@gmail.com',
              phone_number: faker.phone.number(),
              is_active: true,
            },
          ],
        },
      ],
    },
  ];

  const upsertAgent = async (agent: any, agent_parent_id?: number) => {
    const _agent = await prisma.agents.upsert({
      where: { code: agent.code },
      create: {
        agent_level_id: agent.agent_level_id!,
        agent_type_id: agent.agent_type_id,
        agent_parent_id,
        code: agent.code,
        first_name: agent.first_name,
        middle_name: agent.middle_name,
        last_name: agent.last_name,
        email: agent.email,
        phone_number: agent.phone_number,
        is_active: agent.is_active,
        created_at: new Date(),
        updated_at: new Date(),
      },
      update: {
        agent_level_id: agent.agent_level_id,
        agent_type_id: agent.agent_type_id,
        code: agent.code,
        first_name: agent.first_name,
        middle_name: agent.middle_name,
        last_name: agent.last_name,
        email: agent.email,
        phone_number: agent.phone_number,
        is_active: agent.is_active,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (agent.childrens) {
      for (let i = 0; i < agent.childrens.length; i++) {
        const child = agent.childrens[i];
        await upsertAgent(child, _agent.id);
      }
    }
  }

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    await upsertAgent(agent)
  }

  const __agents = await prisma.agents.findMany();
  const individualInvestorType = await prisma.investor_types.findFirst({ where: { name: 'Individual' } })
  if (!individualInvestorType) return;

  //seed investors (retail)
  const upsertInvestorIndividual = async (email: string) => {
    const _investor = await prisma.investors.upsert({
      where: { email },
      create: {
        email,
        first_name: faker.person.firstName(),
        middle_name: faker.person.middleName(),
        last_name: faker.person.lastName(),
        phone_number: faker.phone.number(),
        risk_level_id: 1,
        risk_point: faker.number.int({ min: 1, max: 100 }),
        sid: faker.string.uuid(),
        // random agent from __agents
        agent_id: __agents[faker.number.int({ min: 0, max: __agents.length - 1 })].id,
        investor_type_id: individualInvestorType.id,
        version: 1,
      },
      update: {}
    });

    // heirs
    const investorHeirs = await prisma.investor_heirs.findMany({ where: { investor_id: _investor.id } })
    if (investorHeirs.length == 0) {
      await prisma.investor_heirs.createMany({
        data: [
          { investor_id: _investor.id, name: faker.person.firstName(), relation_id: faker.number.int({ min: 1, max: 7 }), },
          { investor_id: _investor.id, name: faker.person.firstName(), relation_id: faker.number.int({ min: 1, max: 7 }), },
        ],
      });
    }

    // addresses
    const investorAddresses = await prisma.investor_addresses.findMany({ where: { investor_id: _investor.id } })
    if (investorAddresses.length == 0) {
      await prisma.investor_addresses.create({
        data: {
          investor_id: _investor.id,
          address_type_id: faker.number.int({ min: 1, max: 3 }),
          province_id: "1",
          city_id: "1",
          district_id: "1",
          subdistrict_id: "1",
          postal_code: "qasd",
          address: faker.location.streetAddress(),
          address_line_2: faker.location.secondaryAddress(),
        }
      })
    }

    // individual
    const investorIndividual = await prisma.investor_individuals.findFirst({ where: { investor_id: _investor.id } })

    if (!investorIndividual) {
      await prisma.investor_individuals.create({
        data: {
          investor_id: _investor.id,
          birth_date: faker.date.birthdate(),
          birth_place: faker.location.city(),
          mother_name: faker.person.fullName(),
          is_employee: faker.datatype.boolean(),
          tax_number: faker.string.uuid(),
          tax_effective_date: faker.date.past(),
          gender_id: faker.number.int({ min: 1, max: 2 }),
          education_id: faker.number.int({ min: 1, max: 8 }),
          card_type_id: faker.number.int({ min: 1, max: 2 }),
          card_number: faker.string.uuid(),
          income_id: faker.number.int({ min: 1, max: 6 }),
          income_source_id: faker.number.int({ min: 1, max: 10 }),
          marital_id: faker.number.int({ min: 1, max: 4 }),
          nationality_id: faker.number.int({ min: 1, max: 4 }),
          job_id: faker.number.int({ min: 1, max: 9 }),
          job_category_id: faker.number.int({ min: 1, max: 7 }),
          job_role_id: faker.number.int({ min: 1, max: 6 }),
        }
      })
    }
  }
  const investors = ['investor_01@gmail.com', 'investor_02@gmail.com', 'investor_03@gmail.com']
  for (let i = 0; i < investors.length; i++) {
    const investor = investors[i];
    await upsertInvestorIndividual(investor)
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
