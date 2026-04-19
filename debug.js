const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugLogic() {
  const u = await prisma.user.findFirst({ where: { role: 'FOUNDER' } });
  let profile = await prisma.founderProfile.findUnique({
    where: { userId: u.id }
  });

  if (!profile) {
    profile = await prisma.founderProfile.create({
      data: { userId: u.id }
    });
  }

  const data = {
    title: "Test Technology 1",
    patentStatus: "Not Filed",
    trl: "3",
    prototypeStatus: "We testing out...",
    thumbnailUrl: "/uploads/image.jpeg"
  };

  try {
    const tech = await prisma.technology.create({
      data: {
        founderId: profile.id,
        title: data.title,
        patentStatus: data.patentStatus,
        trl: parseInt(data.trl),
        prototypeStatus: data.prototypeStatus,
        thumbnailUrl: data.thumbnailUrl,
      }
    });
    console.log("Success:", tech);
  } catch (error) {
    console.error("Error creating technology:");
    console.error(error);
  }
}

debugLogic().then(() => prisma.$disconnect());
