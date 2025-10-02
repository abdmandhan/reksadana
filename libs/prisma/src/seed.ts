import prisma from "./index.js";
import bcryptjs from "bcryptjs";

const main = async () => {
  const users = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
    },
  ];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    await prisma.user.upsert({
      where: { email: user.email },
      create: {
        name: user.name,
        email: user.email,
        password: bcryptjs.hashSync(user.password, 10),
      },
      update: {
        name: user.name,
        password: bcryptjs.hashSync(user.password, 10),
      },
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
