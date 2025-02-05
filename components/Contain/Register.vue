<template>
  <TabsContent value="register">
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Join us.</CardDescription>
      </CardHeader>

        <CardContent class="space-y-2">
          <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input id="email" placeholder="Email" />
          </div>
          <div class="space-y-1">
            <Label for="password">Make a Password</Label>
            <Input id="password" placeholder="P4ssw0rd" />
          </div>
          <div class="space-y-1">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" placeholder="Conf1rm p4ssw0rd" />
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