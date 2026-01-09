import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { ConfigSchema, type Config } from "./validation.js";

export function getConfig(): Config {
  const rawFile = readFileSync("./configs/sources.yaml", "utf-8");
  const rawConfig = parse(rawFile);
  const parsedConfig = ConfigSchema.parse(rawConfig);
  return parsedConfig;
}