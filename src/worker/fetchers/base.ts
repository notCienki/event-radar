import { RawEvent } from '../../core/types.js';

export abstract class BaseFetcher {
  abstract fetch(): Promise<RawEvent[]>;
}
