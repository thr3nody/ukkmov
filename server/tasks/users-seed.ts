import type { User } from "#auth-utils";
import { hash as h } from "bcrypt";

export default defineTask({
  meta: {
    name: "db:users-seed",
    description: "Run database seed task for the users table.",
  },
  async run() {
    console.log("Running DB seed task...");
    const users: User[] = [
      {
        name: "Erine Moira",
        email: "erine@moira.org",
        password: "God Save the Queen",
        role: "admin",
        createdAt: new Date(),
      },
      {
        name: "Nathan Peregrine",
        email: "n@th.an",
        password: "God Save the King",
        role: "author",
        createdAt: new Date(),
      },
      {
        name: "Jessica Peregrine",
        email: "jessica@j.sc",
        password: "Divinity",
        role: "subscriber",
        createdAt: new Date(),
      },
    ];

    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        if (!user.password) {
          throw new Error("No password provided in seeding!");
        }

        const hashedPassword = await h(user.password, 12);
        return {
          ...user,
          password: hashedPassword,
        };
      }),
    );

    await useDrizzle().insert(tables.users).values(hashedUsers);
    return { result: "success" };
  },
});
