// Współdzielone typy (używa ich i Worker i Web)
export interface RawEvent {
  title: string;
  url: string;
  dateStr?: string;
  description?: string;
  sourceId: string;
}
