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
            <Input id="name" placeholder="Name" v-model="name" />
          </div>
          <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input id="email" placeholder="Email" v-model="email" />
          </div>
          <div class="space-y-1">
            <Label for="password">Make a Password</Label>
            <Input id="password" placeholder="P4ssw0rd" v-model="password" />
          </div>
          <div class="space-y-1">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" placeholder="Conf1rm p4ssw0rd" v-model="confirmPassword" />
          </div>
          <div class="space-x-y">
            <p v-if="error">{{ error }}</p>
          </div>
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
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref("")

const error = ref<String>('')

const { signUp } = useAuth()

async function handleSignup() {
  error.value = ''
  
  if (password.value !== confirmPassword.value) {
    error.value = "Password doesn't match."
    return
  }

  try {
    await signUp(
      {
        name: name.value,
        email: email.value,
        password: password.value,
      },
      {
        callbackUrl: '/profile',
        redirect: true,
      }
    )
  } catch (error: any) {
    console.error("Sign Up fail with error:", error)
  }
}
</script>