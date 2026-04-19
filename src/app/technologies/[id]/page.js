import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { technologies as mockTech } from '../../../data/mock';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TechnologyDossier({ params }) {
  const { id } = await params;

  let techData = null;

  // 1. Check Mock Data
  const mockMatch = mockTech.find(t => t.id === id);
  if (mockMatch) {
    techData = {
      title: mockMatch.title,
      summary: mockMatch.summary,
      bottleneck: mockMatch.bottleneck || "No specific bottleneck provided in mock data.",
      innovation: mockMatch.innovation || "Standard implementation.",
      trl: mockMatch.trl,
      patent: mockMatch.patent,
      inventor: mockMatch.inventor,
      sector: mockMatch.sector,
      image: mockMatch.image,
      stageOfDev: "Lab tested",
      adoptionFriction: "Moderate",
      roiBand: "Moderate (1-3x)",
      targetIndustries: "Various",
      competitorLandscape: "None recorded.",
      regulatoryBurden: "None"
    };
  } else {
    // 2. Database Query
    try {
      const dbMatch = await prisma.technology.findUnique({
        where: { id },
        include: { founder: { include: { user: true } } }
      });
      if (dbMatch) {
        techData = {
          title: dbMatch.title,
          subtitle: dbMatch.subtitle,
          summary: dbMatch.abstract || dbMatch.prototypeStatus || "No abstract provided.",
          bottleneck: dbMatch.problemSolved || "Not specified.",
          innovation: dbMatch.mechanism || dbMatch.prototypeStatus || "No details provided.",
          novelty: dbMatch.novelty || "N/A",
          trl: dbMatch.trl,
          patent: dbMatch.patentStatus,
          inventor: dbMatch.inventorName || dbMatch.founder?.user?.fullName || "IIT KGP Innovator",
          department: dbMatch.department || "IIT KGP",
          sector: dbMatch.sector,
          image: dbMatch.thumbnailUrl,
          stageOfDev: dbMatch.stageOfDev || "Validation",
          targetIndustries: dbMatch.targetIndustries || "N/A",
          competitorLandscape: dbMatch.competitorLandscape || "N/A",
          roiBand: dbMatch.roiBand || "Moderate",
          adoptionFriction: dbMatch.adoptionFriction || "Moderate",
          capexEst: dbMatch.capexEst || "N/A",
          regulatoryBurden: dbMatch.regulatoryBurden || "N/A"
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!techData) {
    notFound();
  }

  const sectionStyle = {
    padding: '32px',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    marginBottom: '24px'
  };

  const headerStyle = {
    fontSize: '20px',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border)',
    color: 'var(--iit-blue)'
  };

  return (
    <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', maxWidth: '1200px' }}>
        
        {/* Left Column: Sections A through G */}
        <div style={{ flex: '1', minWidth: 0 }}>
          
          {/* Section A: Overview */}
          <div style={sectionStyle}>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-green">TRL {techData.trl}</span>
              <span className="badge badge-orange">{techData.sector}</span>
              <span className="badge badge-blue">{techData.stageOfDev}</span>
            </div>
            
            <h1 style={{ fontSize: '32px', color: 'var(--iit-blue)', marginBottom: '8px', lineHeight: '1.2' }}>{techData.title}</h1>
            {techData.subtitle && <h2 style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: 'normal' }}>{techData.subtitle}</h2>}
            
            {techData.image && (
              <img 
                src={techData.image} 
                alt="Technology schematic" 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border)' }} 
              />
            )}

            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Executive Abstract</h3>
            <p style={{ fontSize: '16px', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '24px' }}>
              {techData.summary}
            </p>

            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>The Problem Solved</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {techData.bottleneck}
            </p>
          </div>

          {/* Section B: Technical Depth */}
          <div style={sectionStyle}>
            <h2 style={headerStyle}>Technical Depth</h2>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Core Mechanism</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{techData.innovation}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Specific Novelty</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{techData.novelty}</p>
            </div>
          </div>

          {/* Section D & E: IP & Commercial Fit */}
          <div style={sectionStyle}>
            <h2 style={headerStyle}>Commercial & IP Intelligence</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
               <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>Intellectual Property</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '15px' }}>
                     <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Patent Status</span> <strong>{techData.patent}</strong>
                     </li>
                     <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Prior Art Density</span> <strong>Unknown</strong>
                     </li>
                  </ul>
               </div>
               <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>Commercialization</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '15px' }}>
                     <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Target Industry</span> <strong>{techData.targetIndustries}</strong>
                     </li>
                     <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Expected ROI</span> <strong>{techData.roiBand}</strong>
                     </li>
                     <li style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>CapEx Estimate</span> <strong>{techData.capexEst}</strong>
                     </li>
                  </ul>
               </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Competitor Landscape</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{techData.competitorLandscape}</p>
            </div>
          </div>

        </div>

        {/* Right Column: Section H Action Panel */}
        <div style={{ width: '380px', flexShrink: 0 }}>
           
           <div style={{ padding: '32px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--white)', position: 'sticky', top: '80px', marginBottom: '24px' }}>
             <h3 style={{ fontSize: '18px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Deal Action Panel</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Commercialization Score</span>
                 <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E8E3E' }}>{techData.trl * 10 + 15}/100</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Deployment Friction</span>
                 <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{techData.adoptionFriction}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Regulatory Burden</span>
                 <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{techData.regulatoryBurden}</span>
               </div>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>Request NDA</button>
               <button className="btn" style={{ width: '100%', padding: '14px', fontSize: '15px', background: '#F0F2F5', color: '#1A73E8', border: 'none' }}>Shortlist Deal</button>
               <button className="btn btn-outline" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>Message Researcher</button>
             </div>
           </div>

           <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--white)', position: 'sticky', top: '480px' }}>
             <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Primary Team (Section G)</h3>
             <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--iit-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {techData.inventor.charAt(0)}
                </div>
                <div>
                   <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{techData.inventor}</div>
                   <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{techData.department}</div>
                </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
