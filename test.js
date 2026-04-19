const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const u = await prisma.user.findFirst({ where: { role: 'FOUNDER' } });
  
  if (!u) {
    console.log("no founder user?");
    return;
  }

  try {
    let profile = await prisma.founderProfile.findUnique({
      where: { userId: u.id }
    });

    if (!profile) {
      profile = await prisma.founderProfile.create({
        data: { userId: u.id }
      });
    }

    const tech = await prisma.technology.create({
      data: {
        founderId: profile.id,
        title: "Manual Test",
        patentStatus: "Filed",
        trl: 3,
        prototypeStatus: "Test prototype",
        thumbnailUrl: null,
      }
    });
    console.log("Tech Created!", tech);
  } catch (e) {
    console.error("Prisma Error:", e);
  }
}
main();
