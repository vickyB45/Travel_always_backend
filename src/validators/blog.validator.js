import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  highlight: z.string().min(2),
  desc: z.string().min(10),
  img: z.string().url(),
  metaData: z.array(z.string()).optional(),
  isActive: z.enum(["draft", "public"]).optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(3).optional(),
  highlight: z.string().min(2).optional(),
  desc: z.string().min(10).optional(),
  img: z.string().url().optional(),
  metaData: z.array(z.string()).optional(),
  isActive: z.enum(["draft", "public"]).optional(),
});
