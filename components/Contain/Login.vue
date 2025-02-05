<template>
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back.</CardDescription>
        </CardHeader>

          <CardContent class="space-y-2">
            <div class="space-y-1">
              <Label for="email">Email</Label>
              <Input id="email" placeholder="Email" />
            </div>
            <div class="space-y-1">
              <Label for="password">Password</Label>
              <Input id="password" placeholder="P4ssw0rd" />
            </div>
          </CardContent>

          <CardFooter>
            <Button @submit.prevent="">
              Login
            </Button>
          </CardFooter>
      </Card>
    </TabsContent>
</template>