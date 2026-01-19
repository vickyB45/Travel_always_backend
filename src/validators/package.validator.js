import { z } from "zod";

// CREATE PACKAGE
export const createPackageSchema = z.object({
  title: z.string().min(3, "Title is required"),
  img: z.string().min(1, "Image is required"),
  desc: z.string().min(5, "Description is required"),
  price: z.string().min(1, "Price is required"),

  points: z.array(z.string()).optional(),

  metaData: z.array(z.string()).optional(),

  isPopular: z.boolean().optional(),

  isActive: z.enum(["draft", "public"]).optional(),
});

// UPDATE PACKAGE
export const updatePackageSchema = z.object({
  title: z.string().min(3).optional(),
  img: z.string().optional(),
  desc: z.string().min(5).optional(),
  price: z.string().optional(),

  points: z.array(z.string()).optional(),

  metaData: z.array(z.string()).optional(),

  isPopular: z.boolean().optional(),

  isActive: z.enum(["draft", "public"]).optional(),
});
