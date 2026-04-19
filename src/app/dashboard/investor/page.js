import { technologies as mockTech, startups as mockStartups } from '../../../data/mock';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { deletedIds } from '../../../lib/deletedIds';
import InvestorDashboardClient from './InvestorDashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InvestorDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'INVESTOR') {
    redirect('/');
  }

  // 1. Fetch real DB assets
  const [dbTech, dbStartups] = await Promise.all([
    prisma.technology.findMany({
      orderBy: { id: 'desc' },
      include: { founder: { include: { user: true } } }
    }),
    prisma.startup.findMany({
      orderBy: { id: 'desc' },
      include: { founder: { include: { user: true } } }
    })
  ]);

  // 2. Format Technologies
  const formattedTech = dbTech.map(t => ({
    id: t.id,
    type: 'technology',
    title: t.title,
    sector: t.sector || "Deep Tech",
    patent: t.patentStatus,
    trl: t.trl,
    summary: t.abstract || (t.prototypeStatus ? t.prototypeStatus.substring(0, 100) + '...' : ''),
    inventor: t.founder?.user?.fullName || "IIT KGP Researcher",
    image: t.thumbnailUrl,
    matchScore: 92,
    data: t
  }));

  // 3. Format Startups
  const formattedStartups = dbStartups.map(s => ({
    id: s.id,
    type: 'startup',
    title: s.name,
    sector: s.industry,
    stage: s.currentRaise || "Seed",
    ask: s.fundingRequired,
    summary: s.tagline || s.problem?.substring(0, 100) + '...',
    inventor: s.keyEmployees || s.founder?.user?.fullName || "Founder",
    image: s.logoUrl,
    matchScore: 89,
    data: s
  }));

  // 4. Combine with Mock Data (filtered for deletions)
  const combined = [
    ...formattedTech, 
    ...formattedStartups,
    ...mockTech.map(m => ({ ...m, type: 'technology', matchScore: 85 })),
    ...mockStartups.map(m => ({ ...m, type: 'startup', title: m.name, stage: 'Seed', matchScore: 82 }))
  ].filter(item => !deletedIds.has(item.id));

  return (
    <>
       <InvestorDashboardClient initialEntries={combined} />
    </>
  );
}
