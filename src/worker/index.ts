import { prisma } from '../database/client.js';

async function main() {
  console.log("🤖 WORKER: Rozpoczynam pracę...");
  console.log("👉 Tutaj będzie logika pobierania danych (korzystając z fetchers/)");
  
  // Test bazy danych
  const count = await prisma.event.count();
  console.log(`📊 W bazie mamy obecnie ${count} eventów.`);
}

main();
