const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const t = await prisma.technology.findMany();
  console.log('Technologies:', t);
  const s = await prisma.startup.findMany();
  console.log('Startups:', s);
}
main();
