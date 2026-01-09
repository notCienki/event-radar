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
