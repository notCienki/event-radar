import { prisma } from '../database/client.js';
import { getConfig } from "../core/config.js";

async function main() {
  console.log("WORKER");

  try {
    console.log("Czytam plik configs/sources.yaml...");
    const config = getConfig();

    console.log("Konfiguracja jest poprawna.");
    console.log(`Znaleziono zrodel: ${config.sources.length}`);

  } catch (error) {
    console.error("Błąd konfiguracji:");
    console.error(error);
  }

  const count = await prisma.event.count();
  console.log(`W bazie mamy obecnie ${count} eventów.`);
}

main();
