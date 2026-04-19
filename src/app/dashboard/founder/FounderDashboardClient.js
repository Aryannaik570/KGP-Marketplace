'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FounderDashboardClient({ profile, technologies, startups, session }) {
  const [activeTab, setActiveTab] = useState('Overview');

  // KPIs
  const kpis = [
    { label: 'Total Technologies', value: technologies.length },
    { label: 'Total Startups', value: startups.length },
    { label: 'Profile Views', value: '1,248', trend: '+12%' },
    { label: 'Firm Inquiries', value: '14', trend: '+3' },
    { label: 'Saved Assets', value: '67' },
    { label: 'Pending Actions', value: '2', color: '#DC2626' },
  ];

  const sidebarTabs = [
    'Overview', 'My Technologies', 'My Startups', 'Inquiries', 'Investor Interest',
    'Documents Vault', 'IP Status', 'Analytics', 'Messages'
  ];

  const renderSidebar = () => (
    <div style={{ width: '260px', flexShrink: 0, background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px 0', overflow: 'hidden' }}>
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--iit-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
          {session.fullName.charAt(0)}
        </div>
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{session.fullName}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Principal Investigator</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sidebarTabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '12px 24px', textAlign: 'left', background: activeTab === tab ? '#F0F4FF' : 'transparent', 
              color: activeTab === tab ? 'var(--iit-blue)' : 'var(--text-primary)', border: 'none', borderRight: activeTab === tab ? '3px solid var(--iit-blue)' : '3px solid transparent',
              fontWeight: activeTab === tab ? '600' : '400', cursor: 'pointer', transition: '0.2s', fontSize: '15px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 6 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{kpi.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: kpi.color || 'var(--text-primary)', lineHeight: '1' }}>{kpi.value}</div>
              {kpi.trend && <div style={{ fontSize: '12px', color: '#1E8E3E', fontWeight: '600', padding: '4px 8px', background: '#E6F4EA', borderRadius: '12px' }}>{kpi.trend}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Zone A: My Assets Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', color: 'var(--iit-blue)' }}>Proprietary Technologies</h2>
              <Link href="/dashboard/founder/add-technology" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '13px' }}>+ Add</Link>
            </div>
            {technologies.length === 0 ? <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No assets listed.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {technologies.map(tech => (
                  <div key={tech.id} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FA' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {tech.thumbnailUrl ? <img src={tech.thumbnailUrl} style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}} /> : <div style={{width: '40px', height: '40px', background: '#E8EAED', borderRadius: '4px'}}></div>}
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px' }}>{tech.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TRL {tech.trl} • {tech.patentStatus}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="badge badge-green" style={{background: '#CEEAD6', color: '#0B8043'}}>Active</span>
                      <Link href={`/technologies/${tech.id}`} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', color: 'var(--iit-blue)' }}>Startups</h2>
              <Link href="/dashboard/founder/add-startup" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '13px' }}>+ Add</Link>
            </div>
            {startups.length === 0 ? <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No startups listed.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {startups.map(su => (
                  <div key={su.id} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FA' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {su.logoUrl ? <img src={su.logoUrl} style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}} /> : <div style={{width: '40px', height: '40px', background: '#E8EAED', borderRadius: '4px'}}></div>}
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px' }}>{su.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{su.industry} • {su.currentRaise || 'Bootstrapped'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="badge badge-orange" style={{background: '#FEF7E0', color: '#B06000'}}>Visible</span>
                      <Link href={`/startups/${su.id}`} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Zone B & C: Activity and Actions */}
        <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: '#FFF3CD', border: '1px solid #FFEEBA', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', color: '#856404', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚠️</span> Action Required
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#856404', fontSize: '14px', lineHeight: '1.6' }}>
              <li style={{marginBottom: '8px'}}>Upload missing Pitch Deck for <strong>{startups[0]?.name || 'your startup'}</strong>.</li>
              <li>Respond to NDA request from Tata Steel regarding patent #402.</li>
            </ul>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-primary)' }}>Live Activity Feed</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              <div style={{borderLeft: '2px solid #E8EAED', position: 'absolute', top: '10px', bottom: '10px', left: '5px'}}></div>
              
              <div style={{ position: 'relative', paddingLeft: '20px' }}>
                <div style={{ position: 'absolute', left: 0, top: '4px', width: '12px', height: '12px', background: 'var(--iit-blue)', borderRadius: '50%' }}></div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>10 mins ago</div>
                <div style={{ fontSize: '14px' }}>Sequoia Capital viewed your startup profile.</div>
              </div>

              <div style={{ position: 'relative', paddingLeft: '20px' }}>
                <div style={{ position: 'absolute', left: 0, top: '4px', width: '12px', height: '12px', background: '#34A853', borderRadius: '50%' }}></div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>2 hrs ago</div>
                <div style={{ fontSize: '14px' }}>NDA signed by General Electric for Tech ID: #984.</div>
              </div>

              <div style={{ position: 'relative', paddingLeft: '20px' }}>
                <div style={{ position: 'absolute', left: 0, top: '4px', width: '12px', height: '12px', background: '#FBBC05', borderRadius: '50%' }}></div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Yesterday</div>
                <div style={{ fontSize: '14px' }}>System marked IP patent status as 'Pending'.</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
       <h2 style={{ fontSize: '24px', color: 'var(--iit-blue)', marginBottom: '32px' }}>Venture Telemetry</h2>
       
       <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Aggregate Asset Views (Last 30 Days)</h3>
       <div style={{ height: '240px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-end', padding: '24px', gap: '8px', marginBottom: '40px' }}>
          {[30, 45, 20, 80, 120, 95, 150, 110, 80, 60, 200, 180].map((v, i) => (
             <div key={i} style={{ flex: 1, background: 'var(--iit-blue)', height: `${(v/200)*100}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
          ))}
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
         <div style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
           <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-secondary)' }}>Maturity vs Inquiry Flow</h3>
           <div style={{ height: '180px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><div style={{fontSize: '12px', marginBottom: '4px'}}>Seed Stage (High Interest)</div><div style={{width: '85%', height: '8px', background: '#34A853', borderRadius: '4px'}}></div></div>
              <div><div style={{fontSize: '12px', marginBottom: '4px'}}>Lab Prototype</div><div style={{width: '45%', height: '8px', background: '#FBBC05', borderRadius: '4px'}}></div></div>
              <div><div style={{fontSize: '12px', marginBottom: '4px'}}>Post-Revenue</div><div style={{width: '25%', height: '8px', background: '#EA4335', borderRadius: '4px'}}></div></div>
           </div>
         </div>
         <div style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
           <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-secondary)' }}>Sector View Distribution</h3>
           <div style={{ height: '160px', width: '160px', borderRadius: '50%', background: 'conic-gradient(var(--iit-blue) 0% 40%, #34A853 40% 70%, #FBBC05 70% 90%, #EA4335 90% 100%)', margin: '0 auto' }}></div>
         </div>
       </div>

    </div>
  );

  const renderVault = () => (
    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', color: 'var(--iit-blue)' }}>Secure Documents Vault</h2>
        <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>Upload Document</button>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8F9FA', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontSize: '14px', fontWeight: 'bold' }}>Document Name</th>
              <th style={{ padding: '16px', fontSize: '14px', fontWeight: 'bold' }}>Type</th>
              <th style={{ padding: '16px', fontSize: '14px', fontWeight: 'bold' }}>Associated Asset</th>
              <th style={{ padding: '16px', fontSize: '14px', fontWeight: 'bold' }}>Clearance Level</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px', fontSize: '14px' }}>Q3_PitchDeck_v2.pdf</td>
              <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>Pitch Deck</td>
              <td style={{ padding: '16px', fontSize: '14px' }}>{startups[0]?.name || 'N/A'}</td>
              <td style={{ padding: '16px' }}><span className="badge badge-green" style={{background: '#CEEAD6', color: '#0B8043'}}>Investor-Only</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px', fontSize: '14px' }}>Patent_Filing_Schematic.pdf</td>
              <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>Provisional Patent</td>
              <td style={{ padding: '16px', fontSize: '14px' }}>{technologies[0]?.title || 'N/A'}</td>
              <td style={{ padding: '16px' }}><span className="badge badge-orange" style={{background: '#FEF7E0', color: '#B06000'}}>Internal</span></td>
            </tr>
            <tr>
              <td style={{ padding: '16px', fontSize: '14px' }}>Demo_Video_Compressed.mp4</td>
              <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>Asset</td>
              <td style={{ padding: '16px', fontSize: '14px' }}>{technologies[0]?.title || 'N/A'}</td>
              <td style={{ padding: '16px' }}><span className="badge badge-blue">Public</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{minHeight: '100vh', background: 'var(--off-white)'}}>
      {/* Platform Topbar */}
      <div style={{ height: '60px', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--iit-blue)', letterSpacing: '-0.5px' }}>
          IIT KGP <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>Command Center</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <Link href="/dashboard/founder/add-technology" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>+ New Tech</Link>
           <Link href="/dashboard/founder/add-startup" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>+ New Startup</Link>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'flex-start' }}>
          
          {renderSidebar()}

          <div style={{ flex: 1, minWidth: 0 }}>
            {activeTab === 'Overview' && renderOverview()}
            {activeTab === 'Analytics' && renderAnalytics()}
            {activeTab === 'Documents Vault' && renderVault()}
            {/* Fallback for other tabs */}
            {!['Overview', 'Analytics', 'Documents Vault'].includes(activeTab) && (
              <div style={{ background: 'white', padding: '48px', textAlign: 'center', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
                <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>Module In Development</h2>
                <p style={{ color: 'var(--text-secondary)' }}>The {activeTab} subsystem is currently being connected to the upstream database.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
