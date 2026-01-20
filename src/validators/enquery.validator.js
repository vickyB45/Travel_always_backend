import { z } from "zod";

export const enquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone number too long"),

  destination: z
    .string()
    .min(2, "Destination is required"),

  arrival_date: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Invalid arrival date"
    ),

  guests: z
    .number()
    .int()
    .min(1, "At least 1 guest required")
    .optional(),

  special_requests: z
    .string()
    .max(500, "Special requests too long")
    .optional(),
});