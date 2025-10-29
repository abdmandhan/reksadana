import prisma from '../index.js';
import { faker } from '@faker-js/faker';

export default async () => {
  const __agents = await prisma.agents.findMany();
  const individualInvestorType = await prisma.investor_types.findFirst({
    where: { name: 'Individual' },
  });
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
        agent_id:
          __agents[faker.number.int({ min: 0, max: __agents.length - 1 })].id,
        investor_type_id: individualInvestorType.id,
        version: 1,
      },
      update: {},
    });

    // heirs
    const investorHeirs = await prisma.investor_heirs.findMany({
      where: { investor_id: _investor.id },
    });
    if (investorHeirs.length == 0) {
      await prisma.investor_heirs.createMany({
        data: [
          {
            investor_id: _investor.id,
            name: faker.person.firstName(),
            relation_id: faker.number.int({ min: 1, max: 7 }),
          },
          {
            investor_id: _investor.id,
            name: faker.person.firstName(),
            relation_id: faker.number.int({ min: 1, max: 7 }),
          },
        ],
      });
    }

    // addresses
    const investorAddresses = await prisma.investor_addresses.findMany({
      where: { investor_id: _investor.id },
    });
    if (investorAddresses.length == 0) {
      await prisma.investor_addresses.create({
        data: {
          investor_id: _investor.id,
          address_type_id: faker.number.int({ min: 1, max: 3 }),
          province_id: '1',
          city_id: '1',
          district_id: '1',
          subdistrict_id: '1',
          postal_code: 'qasd',
          address: faker.location.streetAddress(),
          address_line_2: faker.location.secondaryAddress(),
        },
      });
    }

    // individual
    const investorIndividual = await prisma.investor_individuals.findFirst({
      where: { investor_id: _investor.id },
    });

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
        },
      });
    }
  };
  const investors = [
    'investor_01@gmail.com',
    'investor_02@gmail.com',
    'investor_03@gmail.com',
  ];
  for (let i = 0; i < investors.length; i++) {
    const investor = investors[i];
    await upsertInvestorIndividual(investor);
  }
};
