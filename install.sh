#!/bin/zsh

echo "🏗️  Budowanie OSTATECZNEJ struktury Event Radar..."

# 2. Tworzymy strukturę Modularnego Monolitu
# CONFIGS
mkdir -p configs

# PRISMA (Baza danych)
mkdir -p prisma

# SRC - CORE (Współdzielone przez Web i Worker)
mkdir -p src/core
mkdir -p src/database

# SRC - WORKER (Twój Robot/Scraper)
mkdir -p src/worker/fetchers
mkdir -p src/worker/processors

# SRC - WEB (Twój przyszły Frontend/API)
mkdir -p src/web/routes

# 3. Tworzymy package.json
# Zauważ nowe skrypty: worker:dev oraz web:dev
cat <<EOF > package.json
{
  "name": "event-radar",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "worker:dev": "tsx watch src/worker/index.ts",
    "worker:start": "tsx src/worker/index.ts",
    "web:dev": "tsx watch src/web/server.ts",
    "web:start": "tsx src/web/server.ts",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "cheerio": "^1.0.0-rc.12",
    "commander": "^11.1.0",
    "date-fns": "^3.0.6",
    "dotenv": "^16.3.1",
    "fastify": "^4.25.0",
    "playwright": "^1.40.0",
    "rss-parser": "^3.13.0",
    "winston": "^3.11.0",
    "yaml": "^2.3.4",
    "zod": "^3.22.4",
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "prisma": "^5.7.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
EOF

# 4. Tworzymy tsconfig.json
cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
EOF

# 5. Tworzymy sources.yaml
cat <<EOF > configs/sources.yaml
sources:
  - id: "example-rss"
    name: "Przykładowy RSS"
    type: "rss"
    url: "https://example.com/feed.xml"
    city: "wroclaw"
    enabled: true
EOF

# 6. Tworzymy schema.prisma (Rozbudowane o pole description i isPublished)
cat <<EOF > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Event {
  id          String   @id @default(uuid())
  title       String
  url         String   @unique
  description String?
  date        DateTime?
  city        String   @default("wroclaw")
  sourceId    String
  
  // Pola systemowe
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Log {
  id        String   @id @default(uuid())
  level     String   // info, error
  message   String
  createdAt DateTime @default(now())
}
EOF

# 7. Gitignore
cat <<EOF > .gitignore
node_modules
dist
.env
*.db
*.db-journal
EOF

# 8. Generujemy pliki startowe (Placeholders)

# --- CORE ---
cat <<EOF > src/core/types.ts
// Współdzielone typy (używa ich i Worker i Web)
export interface RawEvent {
  title: string;
  url: string;
  dateStr?: string;
  description?: string;
  sourceId: string;
}
EOF

# --- DATABASE ---
cat <<EOF > src/database/client.ts
import { PrismaClient } from '@prisma/client';

// Singleton dla bazy danych - żeby nie tworzyć 100 połączeń
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
EOF

# --- WORKER (SCRAPER) ---
cat <<EOF > src/worker/index.ts
import { prisma } from '../database/client.js';

async function main() {
  console.log("🤖 WORKER: Rozpoczynam pracę...");
  console.log("👉 Tutaj będzie logika pobierania danych (korzystając z fetchers/)");
  
  // Test bazy danych
  const count = await prisma.event.count();
  console.log(\`📊 W bazie mamy obecnie \${count} eventów.\`);
}

main();
EOF

cat <<EOF > src/worker/fetchers/base.ts
import { RawEvent } from '../../core/types.js';

export abstract class BaseFetcher {
  abstract fetch(): Promise<RawEvent[]>;
}
EOF

# --- WEB (SERVER) ---
cat <<EOF > src/web/server.ts
import Fastify from 'fastify';
import { prisma } from '../database/client.js';

const server = Fastify();

server.get('/', async () => {
  return { hello: 'Event Radar Web API' };
});

server.get('/events', async () => {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' }
  });
  return events;
});

const start = async () => {
  try {
    console.log("🌍 WEB: Uruchamiam serwer na porcie 3000...");
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
EOF

echo "✅ STRUKTURA GOTOWA!"
echo "------------------------------------------------"
echo "1. Wejdź do folderu:    cd event-radar"
echo "2. Zainstaluj paczki:   npm install"
echo "3. Stwórz bazę:         npx prisma db push"
echo "------------------------------------------------"
echo "4. Uruchom WORKERA:     npm run worker:dev"
echo "   (To jest Twój scraper)"
echo ""
echo "5. Uruchom WEB:         npm run web:dev"
echo "   (To jest Twój serwer/frontend)"
echo "------------------------------------------------"