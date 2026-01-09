import { RawEvent } from "../../core/types.js";

export class Normalizer {
  static normalize(events: RawEvent[]): RawEvent[] {
    return events.map(event => {
      return {
        ...event,
        title: this.cleanTitle(event.title),
        url: this.cleanUrl(event.url)
      };
    });
  }

  private static cleanTitle(title: string): string {
    return title
      .replace(/\s+/g, " ")
      .replace(/\n/g, "")
      .trim();
  }

  private static cleanUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.href;
    } catch {
      return url;
    }
  }
}