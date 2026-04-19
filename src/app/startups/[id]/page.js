import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { startups as mockStartups } from '../../../data/mock';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function StartupDossier({ params }) {
  const { id } = await params;
  let dat = null;

  const mockMatch = mockStartups.find(s => s.id === id);
  if (mockMatch) {
    dat = {
      name: mockMatch.name, logoUrl: mockMatch.logoUrl,
      tagline: mockMatch.problem || "Solving core operational issues.", shortDesc: mockMatch.solution || "Deep tech platform.",
      problem: mockMatch.problem, solution: mockMatch.solution, urgencyWhyNow: "Market tailwinds accelerating.",
      revenueARR: "Undisclosed", growthRate: "Fast", userCount: "Early adopters", retention: "High", runway: "12 Mos", burnRate: "Under control",
      targetCustomer: "Enterprise", pricingModel: mockMatch.revenueModel, salesMotion: "Direct", margin: "SaaS",
      keyEmployees: mockMatch.founder || "Core Team", advisors: "IIT Alumni Network",
      targetMarket: mockMatch.industry, icp: "Decision Makers", competitorSet: "Fragmented incumbents",
      currentRaise: "Seed", amountRaised: "$500K", useOfFunds: "R&D and GTM",
      coreIp: "Pending patents", technicalMoat: "Data gravity",
      customers: "3 Active Pilots", pilots: "Top Tier Logos",
      industry: mockMatch.industry
    };
  } else {
    try {
      const dbMatch = await prisma.startup.findUnique({ where: { id }, include: { founder: { include: { user: true } } } });
      if (dbMatch) {
        dat = {
          name: dbMatch.name, logoUrl: dbMatch.logoUrl, tagline: dbMatch.tagline, shortDesc: dbMatch.shortDesc,
          problem: dbMatch.problem, solution: dbMatch.solution, urgencyWhyNow: dbMatch.urgencyWhyNow,
          revenueARR: dbMatch.revenueARR, growthRate: dbMatch.growthRate, userCount: dbMatch.userCount, retention: dbMatch.retention, runway: dbMatch.runway, burnRate: dbMatch.burnRate,
          targetCustomer: dbMatch.targetCustomer, pricingModel: dbMatch.pricingModel, salesMotion: dbMatch.salesMotion, margin: "N/A",
          keyEmployees: dbMatch.keyEmployees || dbMatch.founder?.user?.fullName || "Founder", advisors: dbMatch.advisors,
          targetMarket: dbMatch.targetMarket, icp: dbMatch.icp, competitorSet: dbMatch.competitorSet, differentiation: dbMatch.differentiation,
          currentRaise: dbMatch.currentRaise, amountRaised: dbMatch.amountRaised || dbMatch.valuationRange, useOfFunds: dbMatch.useOfFunds, fundingRequired: dbMatch.fundingRequired,
          coreIp: dbMatch.coreIp, technicalMoat: dbMatch.technicalMoat, universityLinkage: dbMatch.universityLinkage,
          customers: dbMatch.customers, pilots: dbMatch.pilots, grants: dbMatch.grants, lois: dbMatch.lois,
          industry: dbMatch.industry, foundedDate: dbMatch.foundedDate, headquarters: dbMatch.headquarters
        };
      }
    } catch(e) { console.error(e); }
  }

  if (!dat) notFound();

  const sec = { padding: '32px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' };
  const h2 = { fontSize: '20px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)', color: 'var(--iit-blue)' };
  const label = { fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' };
  const val = { fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '16px' };

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', maxWidth: '1200px' }}>
        
        {/* Main Canvas (Sections A - H) */}
        <div style={{ flex: '1', minWidth: 0 }}>
          
          {/* Section A: Overview */}
          <div style={sec}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
              {dat.logoUrl ? (
                <img src={dat.logoUrl} alt={dat.name} style={{width: '90px', height: '90px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '12px'}} />
              ) : (
                <div style={{width: '90px', height: '90px', background: '#F0F2F5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#1A73E8'}}>{dat.name.charAt(0)}</div>
              )}
              <div>
                <h1 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>{dat.name}</h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>{dat.tagline}</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <span className="badge badge-blue">{dat.industry}</span>
                  <span className="badge badge-green" style={{background: '#E8ECEF', color: '#3C4043'}}>{dat.headquarters || 'Remote'}</span>
                </div>
              </div>
            </div>
            
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>The Problem</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>{dat.problem}</p>

            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>The Solution</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{dat.solution}</p>
          </div>

          {/* Section B & C: Traction & Business Model */}
          <div style={sec}>
            <h2 style={h2}>Traction & Economics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div><div style={label}>Core Revenue / ARR</div><div style={val}>{dat.revenueARR || 'Pre-revenue'}</div></div>
              <div><div style={label}>Growth Rate</div><div style={val}>{dat.growthRate || 'N/A'}</div></div>
              <div><div style={label}>Active Users / Logos</div><div style={val}>{dat.userCount || 'N/A'}</div></div>
              <div><div style={label}>Net Retention</div><div style={val}>{dat.retention || 'N/A'}</div></div>
              <div><div style={label}>Burn Rate</div><div style={val}>{dat.burnRate || 'N/A'}</div></div>
              <div><div style={label}>Cash Runway</div><div style={val}>{dat.runway || 'N/A'}</div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', background: '#F8F9FA', padding: '24px', borderRadius: '8px' }}>
              <div><div style={label}>Pricing Model</div><div style={val}>{dat.pricingModel || 'Subscription'}</div></div>
              <div><div style={label}>Sales Motion</div><div style={val}>{dat.salesMotion || 'Direct Sales'}</div></div>
            </div>
          </div>

          {/* Section E: Market */}
          <div style={sec}>
            <h2 style={h2}>Market & Competition</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div><div style={label}>Target Market</div><div style={val}>{dat.targetMarket || dat.industry}</div></div>
              <div><div style={label}>Target Customer (ICP)</div><div style={val}>{dat.icp || dat.targetCustomer}</div></div>
            </div>
            <div><div style={label}>Competitor Set</div><div style={{...val, marginBottom: '24px'}}>{dat.competitorSet || 'Fragmented incumbents'}</div></div>
            <div><div style={label}>Why We Win (Differentiation)</div><div style={{...val, marginBottom: '0'}}>{dat.differentiation || 'High proprietary moats.'}</div></div>
          </div>

          {/* Section G: Product & IP */}
          <div style={sec}>
            <h2 style={h2}>Technology & Defensibility</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div><div style={label}>Core IP / Patents</div><div style={val}>{dat.coreIp || 'Internal trade secrets'}</div></div>
              <div><div style={label}>University Linkage</div><div style={val}>{dat.universityLinkage || 'Independent'}</div></div>
            </div>
            <div><div style={label}>Technical Moat</div><div style={{...val, marginBottom: '0'}}>{dat.technicalMoat || 'First mover data advantage.'}</div></div>
          </div>

          {/* Section H: Validation */}
          <div style={sec}>
            <h2 style={h2}>Validation & Social Proof</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div><div style={label}>Active Pilots</div><div style={val}>{dat.pilots || 'In discussions'}</div></div>
              <div><div style={label}>Signed LOIs</div><div style={val}>{dat.lois || 'None'}</div></div>
              <div><div style={label}>Key Customers</div><div style={val}>{dat.customers || 'Undisclosed'}</div></div>
              <div><div style={label}>Defense/Govt Grants</div><div style={{...val, marginBottom: '0'}}>{dat.grants || 'None'}</div></div>
            </div>
          </div>

        </div>

        {/* Right Sidebar (Section D, F, I) */}
        <div style={{ width: '360px', flexShrink: 0 }}>
          
          {/* Section I / F: Action & Funding */}
          <div style={{ padding: '32px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', position: 'sticky', top: '80px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Funding Status</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current Round</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{dat.currentRaise || 'Seed'}</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Target Ask</span>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1E8E3E' }}>{dat.fundingRequired || 'N/A'}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Prior Funding</span>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{dat.amountRaised || 'Bootstrapped'}</span>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>Request Introduction</button>
              <button className="btn btn-outline" style={{ width: '100%', padding: '14px' }}>View Pitch Deck</button>
            </div>
          </div>

          {/* Section D: Team */}
          <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', position: 'sticky', top: '440px' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Founding Team</h3>
            <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '16px' }}>
              <strong>Founders/Execs:</strong><br/>
              {dat.keyEmployees}
            </div>
            <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              <strong>Key Advisors:</strong><br/>
              {dat.advisors || 'Not explicitly listed.'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
