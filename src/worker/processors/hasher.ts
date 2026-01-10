import { createHash } from "node:crypto";
import { RawEvent } from "../../core/types.js";

export class EventHasher {
  static generateHash(event: RawEvent): string {
    const dataToHash = `${event.url}|${event.title}`;
    return createHash("md5").update(dataToHash).digest("hex");
  }
}