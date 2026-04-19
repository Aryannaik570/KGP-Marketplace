import { technologies as mockTech } from '../../../data/mock';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { deletedIds } from '../../../lib/deletedIds';
import CompanyDashboardClient from './CompanyDashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CompanyDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'COMPANY') {
    redirect('/');
  }

  // Same deep fetch as the main directory
  const dbTech = await prisma.technology.findMany({
    orderBy: { id: 'desc' },
    include: { founder: { include: { user: true } } }
  });

  const dbTechFormatted = dbTech.map(t => ({
    id: t.id,
    title: t.title,
    sector: "Newly Added",
    patent: t.patentStatus,
    trl: t.trl,
    summary: t.prototypeStatus ? (t.prototypeStatus.substring(0, 100) + '...') : '',
    bottleneck: "Not specified.",
    innovation: t.prototypeStatus,
    inventor: t.founder?.user?.fullName || "IIT KGP Innovator",
    image: t.thumbnailUrl
  }));

  const combinedTech = [...dbTechFormatted, ...mockTech].filter(tech => !deletedIds.has(tech.id));

  return (
    <>
       {/* Inject the monolithic interactive discovery hub */}
       <CompanyDashboardClient initialTech={combinedTech} />
    </>
  );
}
