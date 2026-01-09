import { RawEvent } from '../../core/types.js';
import { SourceConfig } from '../../core/validation.js'

export abstract class BaseFetcher {
  constructor(protected config: SourceConfig) { }

  abstract fetch(): Promise<RawEvent[]>;
}
