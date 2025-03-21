export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();
  if (!user) {
    return navigateTo("/auth");
  }

  if (((user.value as User) || { role: "" }).role !== "admin") {
    return navigateTo("/profile");
  }
});
