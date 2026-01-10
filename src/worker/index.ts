import { prisma } from '../database/client.js';
import { getConfig } from "../core/config.js";
import { HtmlFetcher } from "./fetchers/html.js";
import { Normalizer } from "./processors/normalizer.js";
import { EventFilter } from "./processors/filter.js";
import { EventHasher } from "./processors/hasher.js";
import { EventRepository } from "../database/repository.js";

async function main() {
  console.log("WORKER STARTED...");

  try {
    const config = getConfig();
    const activeSources = config.sources.filter(s => s.enabled && s.type === 'html');

    console.log(`Sources to process: ${activeSources.length}`);
    let totalNewEvents = 0;

    for (const source of activeSources) {
      console.log(`\nProcessing Source: ${source.name}`);

      try {
        const fetcher = new HtmlFetcher(source);
        const rawEvents = await fetcher.fetch();

        if (rawEvents.length === 0) {
          console.log("No raw events found.");
          continue;
        }

        const normalizedEvents = Normalizer.normalize(rawEvents);

        const filteredEvents = EventFilter.filter(normalizedEvents);
        const droppedCount = normalizedEvents.length - filteredEvents.length;

        if (filteredEvents.length === 0) {
          console.log(`All ${rawEvents.length} events were filtered out.`);
          continue;
        }

        const hashedEvents = filteredEvents.map(event => ({
          ...event,
          hash: EventHasher.generateHash(event)
        }));

        await EventRepository.saveEvents(hashedEvents, source.id);

        console.log(`Fetched: ${rawEvents.length} | Filtered Out: ${droppedCount} | Saved/Updated: ${hashedEvents.length}`);
        totalNewEvents += hashedEvents.length;

      } catch (err) {
        console.error(`Error processing ${source.name}:`, err);
      }
    }

    const dbCount = await prisma.event.count();
    console.log(`Processed in this run: ${totalNewEvents}`);
    console.log(`Total events in DB:    ${dbCount}`);

  } catch (error) {
    console.error("Critical Worker Error:", error);
  }
}

main();