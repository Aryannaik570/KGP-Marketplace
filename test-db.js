const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const profile = await prisma.founderProfile.findFirst();
    if (!profile) {
       console.log("No founder profile found");
       return;
    }
    const tech = await prisma.technology.create({
      data: {
        founderId: profile.id,
        title: "Test DB Insert",
        sector: "Deep Tech",
        patentStatus: "Not Filed",
        trl: 1,
      }
    });
    console.log("Inserted ID:", tech.id);
  } catch (e) {
    console.error("ERROR", e);
  }
}
run();
