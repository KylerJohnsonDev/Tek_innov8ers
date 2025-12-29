import { betterAuth } from "better-auth";
import { prismaClient } from "./db";
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prismaClient, {
    provider: "sqlite",
  }),
  // database: new Database("database.sqlite"),
  experimental: {
    joins: true
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
