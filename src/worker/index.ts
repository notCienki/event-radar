import { prisma } from '../database/client.js';
import { getConfig } from "../core/config.js";
import { HtmlFetcher } from "./fetchers/html.js";

async function main() {
  console.log("WORKER...");

  try {
    const config = getConfig();
    console.log(`Loaded configuration. Found ${config.sources.length} total sources.`);

    const htmlSources = config.sources.filter(s => s.enabled && s.type === 'html');
    console.log(`Processing ${htmlSources.length} HTML sources...`);

    for (const source of htmlSources) {
      console.log(`\nProcessing: ${source.name} ---`);

      try {
        const fetcher = new HtmlFetcher(source);

        const events = await fetcher.fetch();

        if (events.length > 0) {
          console.log(`Success! Found ${events.length} events.`);
          events.slice(0, 3).forEach(e => console.log(`   -> ${e.title} (${e.url})`));
        } else {
          console.log("No events found (check selectors or website content).");
        }

      } catch (err) {
        console.error(`Error processing ${source.name}:`, err);
      }
    }

  } catch (error) {
    console.error("Critical configuration error:");
    console.error(error);
  }

  const count = await prisma.event.count();
  console.log(`\nTotal events in DB: ${count}`);
}

main();