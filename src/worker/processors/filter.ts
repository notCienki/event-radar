import { RawEvent } from "../../core/types.js";

export class EventFilter {
  private static readonly ALLOWLIST = [
    "it", "tech", "technology", "technologie", "code", "coding", "programowanie", "software",
    "developer", "development", "engineer", "engineering", "dev", "programista", "informatyka",
    "hackathon", "meetup", "workshop", "warsztat", "bootcamp",

    "java", "javascript", "python", "php", "c++", "c#", ".net", "rust", "go", "ruby", "swift", "kotlin",
    "react", "angular", "vue", "node", "typescript", "spring", "django", "laravel",

    "aws", "azure", "gcp", "cloud", "chmura", "docker", "kubernetes", "k8s", "devops",
    "sql", "nosql", "database", "baza danych", "data science", "big data", "analytics",
    "security", "cyber", "bezpieczeństwo", "network", "sieci", "linux",

    "ai", "sztuczna inteligencja", "artificial intelligence", "ml", "machine learning",
    "robotics", "robotyka", "iot", "blockchain", "crypto", "krypto", "web3", "metaverse",

    "startup", "start-up", "business", "biznes", "management", "zarządzanie",
    "founder", "ceo", "cto", "lider", "leader", "leadership", "przywództwo",
    "marketing", "sales", "sprzedaż", "ecommerce", "e-commerce", "fintech",
    "strategy", "strategia", "innowacje", "innovation", "investor", "inwestor", "vc",
    "networking", "pitch", "agile", "scrum", "kanban", "lean",

    "ux", "ui", "design", "produkt", "product", "grafika", "graphic", "art", "creative"
  ];

  static filter(events: RawEvent[]): RawEvent[] {
    return events.filter(event => this.isRelevant(event));
  }

  private static isRelevant(event: RawEvent): boolean {
    const text = (event.title + " " + event.url).toLowerCase();

    return this.ALLOWLIST.some(keyword => text.includes(keyword));
  }
}