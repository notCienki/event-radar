import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["html", "rss", "json"]),
  url: z.string().url(),
  city: z.string(),
  enabled: z.boolean().default(true),

  priority: z.enum(["low", "medium", "high", "very_high"]).default("medium"),

  selectors: z.object({
    container: z.string(),
    title: z.string(),
    url: z.string(),
    date: z.string().optional(),
  }).optional(),
});

export const ConfigSchema = z.object({
  sources: z.array(SourceSchema),
});

export type SourceConfig = z.infer<typeof SourceSchema>;
export type Config = z.infer<typeof ConfigSchema>;