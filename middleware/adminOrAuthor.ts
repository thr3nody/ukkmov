export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();
  if (!user) {
    return navigateTo("/auth");
  }

  if (!["admin", "author"].includes(user.value!.role)) {
    return navigateTo("/profile");
  }
});
