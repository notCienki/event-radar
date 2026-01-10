import { prisma } from "./client.js";
import { RawEvent } from "../core/types.js";

export class EventRepository {
  static async saveEvents(events: RawEvent[], sourceId: string): Promise<number> {
    let savedCount = 0;

    for (const event of events) {
      if (!event.hash) continue;

      try {
        await prisma.event.upsert({
          where: { contentHash: event.hash },
          update: {
            updatedAt: new Date()
          },
          create: {
            title: event.title,
            url: event.url,
            contentHash: event.hash,
            sourceId: sourceId,
            city: "wroclaw",
            date: new Date(),
          }
        });
        savedCount++;
      } catch (error) {
        console.error(`Error saving event "${event.title}":`, error);
      }
    }

    return savedCount;
  }
}