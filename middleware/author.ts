export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()

  if (((user.value as User) || {role: ''}).role !== 'author') {
    return navigateTo('/profile')
  }
})
