import bcrypt from 'bcryptjs';
import prisma from '../index.js';

export default async () => {
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
};
