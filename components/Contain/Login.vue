<template>
  <form @submit.prevent="handleLogin">
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back.</CardDescription>
        </CardHeader>

        <CardContent class="space-y-2">
          <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input id="email" placeholder="Email" v-model="credentials.email" type="email" />
          </div>
          <div class="space-y-1">
            <Label for="password">Password</Label>
            <Input id="password" placeholder="P4ssw0rd" v-model="credentials.password" type="password" />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit">
            Login
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </form>
</template>

<script setup lang="ts">
const { fetch: refreshSession } = useUserSession()

const credentials = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  try {
    $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
      .then(async () => {
        await refreshSession()
        await navigateTo('/profile')
      })
      .catch(() => {
        createError("Login fail.")
      })
  } catch {

  }
}
</script>