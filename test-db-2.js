const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const profile = await prisma.founderProfile.findFirst();
    if (!profile) {
       console.log("No founder profile found");
       process.exit(0);
    }
    const tech = await prisma.technology.create({
      data: {
        founderId: profile.id,
        title: "Matrix Test " + Date.now(),
        sector: "Deep Tech",
        patentStatus: "Not Filed",
        trl: 5,
        targetIndustries: "Aerospace",
        abstract: "Test matrix deployment"
      }
    });
    console.log("SUCCESSFULLY INSERTED ID:", tech.id);
  } catch (e) {
    console.error("PRISMA FAILURE:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
