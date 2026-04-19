import Link from 'next/link';
export const dynamic = 'force-dynamic';
import TechCard from '../../components/TechCard';
import { technologies as mockTech } from '../../data/mock';
import { prisma } from '../../lib/prisma';
import { getSession } from '../../lib/auth';
import { deletedIds } from '../../lib/deletedIds';
import { redirect } from 'next/navigation';

export default async function TechnologiesDirectory() {
  const session = await getSession();
  if (!session) {
    redirect('/login?redirect=/technologies');
  }
  const dbTech = await prisma.technology.findMany({
    orderBy: { id: 'desc' }
  });

  const dbTechFormatted = dbTech.map(t => ({
    id: t.id,
    title: t.title,
    sector: t.sector || "Newly Added",
    patent: t.patentStatus,
    trl: t.trl,
    summary: t.abstract || (t.prototypeStatus ? (t.prototypeStatus.substring(0, 100) + '...') : ''),
    inventor: t.inventorName || "IIT KGP Innovator",
    image: t.thumbnailUrl
  }));

  const combinedTech = [...dbTechFormatted, ...mockTech].filter(tech => !deletedIds.has(tech.id));

  return (
    <div style={{ backgroundColor: 'var(--off-white)', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '36px' }}>Technologies Directory</h1>
          {session?.role === 'FOUNDER' && (
             <Link href="/dashboard/founder/add-technology" className="btn btn-primary">+ Add New Technology</Link>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '800px' }}>
          Explore validated metallurgical and materials science innovations from IIT Kharagpur. Use the filters to drill down into TRL, Patent Stage, or Sector.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {combinedTech.map(tech => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}
