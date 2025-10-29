import prisma from '../index.js';
import { faker } from '@faker-js/faker';

export default async () => {
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
  };

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    await upsertAgent(agent);
  }
};
