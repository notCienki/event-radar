export interface RawEvent {
  title: string;
  url: string;
  dateStr?: string;
  description?: string;
  sourceId: string;

  date?: Date;
  hash?: string;
}
