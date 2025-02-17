declare module "#auth-utils" {
  interface User {
    id?: number; // ID is auto increment
    name: string;
    email: string;
    password?: string; // Only used for validation
    role: "admin" | "subscriber" | "author";
    createdAt: Date;
    updatedAt?: Date; // No update at all is possible
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
