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
            <Input
              id="email"
              placeholder="Email"
              v-model="credentials.email"
              type="email"
            />
          </div>
          <div class="space-y-1">
            <Label for="password">Password</Label>
            <Input
              id="password"
              placeholder="P4ssw0rd"
              v-model="credentials.password"
              type="password"
            />
          </div>
        </CardContent>

        <CardFooter class="space-x-1">
          <Button type="submit"> Login </Button>
          <div v-if="message" class="text-red-500">{{ message }}</div>
        </CardFooter>
      </Card>
    </TabsContent>
  </form>
</template>

<script setup lang="ts">
const { fetch: refreshSession } = useUserSession();

const credentials = reactive({
  email: "",
  password: "",
});

const message = ref<string | undefined>("");

async function handleLogin() {
  try {
    if (!credentials.email || !credentials.password) {
      message.value = "Fill all the required field to login.";
      return;
    }

    const response = await $fetch<{ success: boolean; message?: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: credentials,
      },
    );

    if (response.success) {
      await refreshSession();
      await navigateTo("/profile");
    } else {
      message.value = response.message || "Login failed.";
    }
  } catch (error: any) {
    console.log("Error logging in:", error);
    message.value =
      error?.data?.message || error.message || "An error occurred.";
  }
}
</script>
