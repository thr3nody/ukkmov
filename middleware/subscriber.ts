export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()

  if (((user.value as User) || {role: ''}).role !== 'subscriber') {
    return navigateTo('/profile')
  }
})
