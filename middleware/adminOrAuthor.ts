export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();
  if (!["admin", "author"].includes(user.value!.role)) {
    return navigateTo("/profile");
  }
});
