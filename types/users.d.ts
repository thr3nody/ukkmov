interface Users {
  id?: string; // ID is auto generated by the db
  name: string;
  email: string;
  role: "admin" | "subscriber" | "author";
  createdAt: Date;
  updatedAt?: Date; // No update at all is possible
}
