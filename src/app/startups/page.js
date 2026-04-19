import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { startups as mockStartups } from '../../data/mock';
import { prisma } from '../../lib/prisma';
import { getSession } from '../../lib/auth';
import { deletedIds } from '../../lib/deletedIds';
import DeleteStartupButton from '../../components/DeleteStartupButton';
import { redirect } from 'next/navigation';

export default async function StartupsDirectory() {
  const session = await getSession();
  if (!session) {
    redirect('/login?redirect=/startups');
  }
  const dbStartups = await prisma.startup.findMany({
    orderBy: { id: 'desc' }
  });

  const dbStartupsFormatted = dbStartups.map(su => ({
    id: su.id,
    name: su.name,
    tagline: su.tagline || su.shortDesc || "No pitch provided.",
    sector: su.industry,
    stage: su.currentRaise || "Bootstrapped",
    geography: su.headquarters || "Unknown",
    traction: su.primaryMetric || su.userCount || "Early Stage",
    ask: su.fundingRequired,
    keyMetric: su.revenueARR || su.growthRate || "Unlisted",
    founderNames: su.keyEmployees || "Founding Team",
    logoUrl: su.logoUrl
  }));

  const combinedStartups = [...dbStartupsFormatted, ...mockStartups].filter(startup => !deletedIds.has(startup.id));

  return (
    <div style={{ backgroundColor: 'var(--off-white)', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '36px' }}>Startups from IIT KGP MME</h1>
          {session?.role === 'FOUNDER' && (
             <Link href="/dashboard/founder/add-startup" className="btn btn-primary">+ Add New Startup</Link>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '800px' }}>
          Explore spin-outs and student-led deep tech ventures originating from our ecosystem.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {combinedStartups.map(startup => (
            <div key={startup.id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                 {startup.logoUrl ? (
                   <img src={startup.logoUrl} alt={startup.name} style={{width: '60px', height: '60px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '8px'}} />
                 ) : (
                   <div style={{width: '60px', height: '60px', background: '#F0F2F5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1A73E8'}}>{startup.name.charAt(0)}</div>
                 )}
                 <div>
                   <h3 style={{ fontSize: '20px', color: 'var(--iit-blue)', marginBottom: '4px' }}>{startup.name}</h3>
                   <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{startup.founderNames}</div>
                 </div>
               </div>
               
               <p style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px', fontWeight: '500', lineHeight: '1.4' }}>{startup.tagline}</p>
               
               <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                 <span className="badge badge-blue">{startup.sector}</span>
                 <span className="badge badge-orange">{startup.stage}</span>
                 <span className="badge badge-green" style={{background: '#E8ECEF', color: '#3C4043'}}>{startup.geography}</span>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', background: '#F8F9FA', padding: '12px', borderRadius: '8px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                   <span style={{ color: 'var(--text-secondary)' }}>Traction</span> <span style={{ fontWeight: 600 }}>{startup.traction}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                   <span style={{ color: 'var(--text-secondary)' }}>Funding Ask</span> <span style={{ fontWeight: 600 }}>{startup.ask}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                   <span style={{ color: 'var(--text-secondary)' }}>Key Metric</span> <span style={{ fontWeight: 600, color: '#1E8E3E' }}>{startup.keyMetric}</span>
                 </div>
               </div>

               <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                 <Link href={`/startups/${startup.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px' }}>View Profile</Link>
                 <button className="btn btn-outline" style={{ padding: '10px' }}>Save</button>
                 <DeleteStartupButton id={startup.id} />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
