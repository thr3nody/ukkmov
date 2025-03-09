export default defineEventHandler(async (event) => {
  try {
    const data = await useDrizzle().select().from(tables.users);
    return {
      success: true,
      users: data.map((usersData) => ({
        id: usersData.id,
        name: usersData.name,
        email: usersData.email,
        role: usersData.role,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred when fetching movies data.",
    };
  }
});
