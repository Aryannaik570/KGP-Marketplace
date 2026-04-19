const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const profile = await prisma.founderProfile.findFirst();
    const tech = await prisma.technology.create({
      data: {
        founderId: profile.id,
        title: 'Server Test',
        trl: 5,
        patentStatus: 'Filed'
      }
    });
    console.log("Success", tech);
  } catch (e) {
    console.error("PRISMA ERROR", e.message);
  }
}
main();
