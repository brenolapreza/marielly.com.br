import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z
    .string({
      description: "JWT Secret token",
    })
    .min(3),
  DATABASE_URL: z
    .string({
      description: "DATABASE URL",
    })
    .min(3),
  URL: z
    .string({
      description: "Url application",
    })
    .min(3),
});

export const env = envSchema.parse(process.env);
