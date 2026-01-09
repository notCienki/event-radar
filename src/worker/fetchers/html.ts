import * as cheerio from 'cheerio';
import { BaseFetcher } from './base.js';
import { RawEvent } from '../../core/types.js';

export class HtmlFetcher extends BaseFetcher {
  async fetch(): Promise<RawEvent[]> {
    const { url, selectors, id } = this.config;

    if (!selectors) {
      console.warn(`[${id}] Missing selectors in config. Skipping.`);
      return [];
    }

    console.log(`[${id}] Fetching: ${url}`);

    try {
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7"
      };

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const events: RawEvent[] = [];

      const containerCount = $(selectors.container).length;
      if (containerCount === 0) {
        console.log(`[${id}] DEBUG: Found 0 containers. Selector: '${selectors.container}'`);
      }

      $(selectors.container).each((_, element) => {
        const el = $(element);

        const titleSelector = selectors.title;
        let title = "";

        if (titleSelector === "self") {
          title = el.text().trim();
        } else {
          title = el.find(titleSelector).text().trim();
        }

        const urlSelector = selectors.url;
        let eventUrl: string | undefined;

        if (urlSelector === "self") {
          eventUrl = el.attr("href");
        } else {
          eventUrl = el.find(urlSelector).attr("href");
        }

        if (title && eventUrl) {
          try {
            const absoluteUrl = new URL(eventUrl, url).href;
            events.push({
              title: title,
              url: absoluteUrl,
              sourceId: id,
            });
          } catch (e) {
          }
        }
      });

      console.log(`[${id}] Found ${events.length} events.`);
      return events;

    } catch (error) {
      console.error(`[${id}] Fetch error:`, error);
      return [];
    }
  }
}