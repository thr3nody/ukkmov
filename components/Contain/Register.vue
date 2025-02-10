<template>
  <TabsContent value="register">
    <Card>
      <form @submit.prevent="handleSignup">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Join us.</CardDescription>
        </CardHeader>

        <CardContent class="space-y-2">
          <div class="space-y-1">
            <Label for="name">Name</Label>
            <Input id="name" placeholder="Name" v-model="credentials.name" type="text" />
          </div>
          <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input id="email" placeholder="Email" v-model="credentials.email" type="email" />
          </div>
          <div class="space-y-1">
            <Label for="password">Make a Password</Label>
            <Input id="password" placeholder="P4ssw0rd" v-model="credentials.password" type="password" />
          </div>
          <div class="space-y-1">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" placeholder="Conf1rm p4ssw0rd" v-model="confirmPassword" type="password" />
          </div>
          <ClientOnly>
            <Alert variant="destructive" v-if="passwordMismatch" class="flex space-x-2">
              <Icon name="ion:alert-circle-outline" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {{ passwordMismatch }}
                </AlertDescription>
              </div>
            </Alert>
          </ClientOnly>
        </CardContent>

        <CardFooter>
          <Button>
            Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  </TabsContent>
</template>

<script setup lang="ts">
const { fetch: refreshSession } = useUserSession()
const confirmPassword = ref('')

const credentials = reactive({
  name: '',
  email: '',
  password: ''
})

const error = ref<String>('')

const passwordMismatch = computed(() => {
  if (credentials.password && confirmPassword.value && credentials.password !== confirmPassword.value) {
    return "Passwords don't match."
  }
  return ''
})

async function handleSignup() {
  try {
    $fetch('/api/auth/register', {
      method: 'POST',
      body: credentials
    })
      .then(async () => {
        await refreshSession()
        await navigateTo('/profile')
      })
      .catch(() => {
        createError("Register fail.")
      })
  } catch {

  }
}
</script>