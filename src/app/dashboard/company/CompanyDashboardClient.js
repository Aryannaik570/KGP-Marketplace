'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

// Helper component for SVG icons to save space
const Icon = ({ path, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const icSearch = "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35";
const icSave = "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z";
const icCompare = "M14 5l7 7m0 0l-7 7m7-7H3";
const icMessage = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";

export default function CompanyDashboardClient({ initialTech }) {
  // State
  const [activeTab, setActiveTab] = useState('browse'); // browse, saved, compares
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('All');
  const [activeTRL, setActiveTRL] = useState('All');
  const [activePatent, setActivePatent] = useState('All');
  
  const [selectedTech, setSelectedTech] = useState(null); // Powers the Right Drawer
  const [compareList, setCompareList] = useState([]); // Powers Compare logic
  
  const [savedTechIds, setSavedTechIds] = useState([]);
  
  useEffect(() => {
    // Safely load saved from local storage prototype
    try {
      const saved = JSON.parse(localStorage.getItem('investor_saved_tech')) || [];
      setSavedTechIds(saved);
    } catch(e) {}
  }, []);

  const toggleSave = (id, e) => {
    if(e) e.stopPropagation();
    const newSaved = savedTechIds.includes(id) 
        ? savedTechIds.filter(x => x !== id) 
        : [...savedTechIds, id];
    setSavedTechIds(newSaved);
    localStorage.setItem('investor_saved_tech', JSON.stringify(newSaved));
  };

  const toggleCompare = (tech, e) => {
    if(e) e.stopPropagation();
    if (compareList.find(c => c.id === tech.id)) {
      setCompareList(compareList.filter(c => c.id !== tech.id));
    } else {
      if(compareList.length >= 3) {
        alert("You can only compare up to 3 technologies at once.");
        return;
      }
      setCompareList([...compareList, tech]);
    }
  };

  // Extract distinct values for filters
  const sectors = ['All', ...new Set(initialTech.map(t => t.sector).filter(Boolean))];
  
  // Pipeline Filtering Logic
  const filteredTech = useMemo(() => {
    let result = initialTech;
    
    // Tab filtering
    if (activeTab === 'saved') {
      result = result.filter(t => savedTechIds.includes(t.id));
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || (t.summary && t.summary.toLowerCase().includes(q)));
    }
    if (activeSector !== 'All') {
      result = result.filter(t => t.sector === activeSector);
    }
    if (activeTRL !== 'All') {
      result = result.filter(t => {
        if (activeTRL === 'Low (1-3)') return t.trl >= 1 && t.trl <= 3;
        if (activeTRL === 'Mid (4-6)') return t.trl >= 4 && t.trl <= 6;
        if (activeTRL === 'High (7-9)') return t.trl >= 7 && t.trl <= 9;
        return true;
      });
    }
    if (activePatent !== 'All') {
      result = result.filter(t => activePatent === 'Filed' ? (t.patent === 'Filed' || t.patent === 'Granted' || t.patent === 'Provisional') : true);
    }
    
    return result;
  }, [initialTech, activeTab, searchQuery, activeSector, activeTRL, activePatent, savedTechIds]);

  // Analytics Math
  const totalListed = initialTech.length;
  const countPatented = initialTech.filter(t => t.patent === 'Filed' || t.patent === 'Granted' || t.patent === 'Provisional').length;
  const countHighTRL = initialTech.filter(t => t.trl >= 5).length;
  const countNewlyAdded = initialTech.filter(t => t.sector === 'Newly Added').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#F8F9FA' }}>
      
      {/* 1. App Toolbar */}
      <header style={{ height: '64px', background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--iit-blue)', fontWeight: 'bold' }}>Company Intelligence Hub</h2>
          
          <div style={{ display: 'flex', background: '#F0F2F5', borderRadius: '8px', padding: '6px 12px', alignItems: 'center', width: '300px' }}>
            <Icon path={icSearch} size={16} />
            <input 
              placeholder="Search technologies, patents, or keywords..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '14px' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('browse')} className="btn" style={{ background: activeTab === 'browse' ? 'var(--iit-blue)' : 'transparent', color: activeTab === 'browse' ? 'white' : 'var(--text-secondary)' }}>Browse Options</button>
          <button onClick={() => setActiveTab('saved')} className="btn" style={{ background: activeTab === 'saved' ? 'var(--iit-blue)' : 'transparent', color: activeTab === 'saved' ? 'white' : 'var(--text-secondary)' }}>Workflow & Saved ({savedTechIds.length})</button>
          {compareList.length > 0 && <button onClick={() => setActiveTab('compare')} className="btn btn-outline" style={{ background: '#E8F0FE', borderColor: '#1A73E8', color: '#1A73E8' }}>Compare Selected ({compareList.length})</button>}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* 2. Left Sidebar Filters */}
        <aside style={{ width: '260px', background: 'var(--white)', borderRight: '1px solid var(--border)', padding: '24px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px', marginBottom: '16px' }}>Smart Filters</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Industry / Sector</label>
            {sectors.map(s => (
              <div key={s} style={{ marginBottom: '6px', fontSize: '14px' }}>
                <input type="radio" id={`sec-${s}`} checked={activeSector === s} onChange={() => setActiveSector(s)} style={{ marginRight: '8px' }}/>
                <label htmlFor={`sec-${s}`}>{s}</label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>TRL Stage</label>
            {['All', 'Low (1-3)', 'Mid (4-6)', 'High (7-9)'].map(s => (
              <div key={s} style={{ marginBottom: '6px', fontSize: '14px' }}>
                <input type="radio" id={`trl-${s}`} checked={activeTRL === s} onChange={() => setActiveTRL(s)} style={{ marginRight: '8px' }}/>
                <label htmlFor={`trl-${s}`}>{s}</label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>IP / Patent Status</label>
            {['All', 'Filed'].map(s => (
              <div key={s} style={{ marginBottom: '6px', fontSize: '14px' }}>
                <input type="radio" id={`pat-${s}`} checked={activePatent === s} onChange={() => setActivePatent(s)} style={{ marginRight: '8px' }}/>
                <label htmlFor={`pat-${s}`}>{s === 'Filed' ? 'Has Tracking Patent' : 'All'}</label>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px', marginBottom: '16px' }}>AI Recommended Configs</h3>
            <button className="btn" style={{ width: '100%', textAlign: 'left', display: 'block', padding: '8px 12px', background: '#F0F2F5', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '13px' }} onClick={() => {setActiveTRL('High (7-9)'); setActivePatent('Filed');}}>Ready for Licensing</button>
            <button className="btn" style={{ width: '100%', textAlign: 'left', display: 'block', padding: '8px 12px', background: '#F0F2F5', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '13px' }} onClick={() => {setSearchQuery('material');}}>Material Science High-Impact</button>
          </div>
        </aside>

        {/* 3. Main Data Canvas */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', position: 'relative' }}>
          
          {activeTab === 'compare' ? (
             <CompareView compareList={compareList} onRemove={(id) => setCompareList(compareList.filter(c => c.id !== id))} />
          ) : (
            <>
              {/* Executive KPI ROW */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <KPICard title="Total Portfolio" value={totalListed} sub="Verified algorithms & IP" />
                <KPICard title="Patents Filed/Granted" value={countPatented} sub="Intellectual Property" />
                <KPICard title="High Commercial TRL (5+)" value={countHighTRL} sub="Validation Stage" />
                <KPICard title="Newly Minted Matches" value={countNewlyAdded} sub="Since last visit" highlight />
              </div>

              {/* Analytics Strip Placeholder */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', background: 'var(--white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>TRL Distribution Trend</h4>
                    <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                       {[1,2,3,4,5,6,7,8,9].map(num => {
                          const count = filteredTech.filter(t => t.trl === num).length;
                          const height = count === 0 ? 4 : count * 20;
                          return (
                            <div key={num} style={{ flex: 1, background: 'var(--iit-blue)', height: `${height}px`, borderRadius: '4px 4px 0 0', position: 'relative' }} title={`TRL ${num}: ${count}`}></div>
                          )
                       })}
                    </div>
                 </div>
                 <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Commercialization Readiness Overview</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Early Stage (TRL 1-3)</span> <span>{filteredTech.filter(t => t.trl <= 3).length}</span></div>
                       <div style={{ width: '100%', background: '#F0F2F5', height: '6px', borderRadius: '4px' }}><div style={{ width: '30%', background: '#7A8B99', height: '100%', borderRadius: '4px' }}></div></div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '8px' }}><span>Market Ready (TRL 7-9)</span> <span>{filteredTech.filter(t => t.trl >= 7).length}</span></div>
                       <div style={{ width: '100%', background: '#F0F2F5', height: '6px', borderRadius: '4px' }}><div style={{ width: '70%', background: '#1E8E3E', height: '100%', borderRadius: '4px' }}></div></div>
                    </div>
                 </div>
              </div>

              {/* Deal Grid */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px' }}>{activeTab === 'saved' ? 'My Deal Pipeline' : 'Discovery Feed'} <span style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>({filteredTech.length})</span></h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>
                {filteredTech.map(tech => (
                  <DealTile 
                    key={tech.id} 
                    tech={tech} 
                    isSaved={savedTechIds.includes(tech.id)}
                    isCompared={compareList.some(c => c.id === tech.id)}
                    onSave={(e) => toggleSave(tech.id, e)}
                    onCompare={(e) => toggleCompare(tech, e)}
                    onClick={() => setSelectedTech(tech)}
                  />
                ))}
                {filteredTech.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '60px' }}>No technologies match your smart filters.</p>}
              </div>
            </>
          )}

        </main>

        {/* 4. Sliding Right Detailed Deal Drawer */}
        {selectedTech && (
           <aside style={{ 
              width: '450px', 
              background: 'var(--white)', 
              borderLeft: '1px solid var(--border)', 
              boxShadow: '-4px 0 24px rgba(0,0,0,0.05)', 
              display: 'flex', 
              flexDirection: 'column',
              zIndex: 20
           }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div>
                   <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                     <span className="badge badge-green">TRL {selectedTech.trl}</span>
                     <span className="badge badge-blue">{selectedTech.patent}</span>
                   </div>
                   <h2 style={{ fontSize: '22px', lineHeight: '1.3' }}>{selectedTech.title}</h2>
                 </div>
                 <button onClick={() => setSelectedTech(null)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
              </div>
              
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                 {selectedTech.image && <img src={selectedTech.image} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' }} alt="Cover" />}
                 
                 <div style={{ marginBottom: '24px' }}>
                   <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Executive Summary</h4>
                   <p style={{ fontSize: '15px', lineHeight: '1.6' }}>{selectedTech.summary}</p>
                 </div>

                 <div style={{ marginBottom: '24px' }}>
                   <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>The Bottleneck / Market Gap</h4>
                   <p style={{ fontSize: '15px', lineHeight: '1.6' }}>{selectedTech.bottleneck || "Industrial bottleneck data securely restricted to active NDA participants."}</p>
                 </div>

                 <div style={{ marginBottom: '24px' }}>
                   <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Deep Tech Innovation</h4>
                   <p style={{ fontSize: '15px', lineHeight: '1.6' }}>{selectedTech.innovation || "Proprietary solution architecture protected by IIT KGP IP layers."}</p>
                 </div>

                 <div style={{ padding: '16px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '12px', borderBottom: '1px solid #E8ECEF', paddingBottom: '8px' }}>Commercial Intelligence</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                       <div><span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>Estimated Target ROI</span><span style={{ fontWeight: '600' }}>High (3-5x)</span></div>
                       <div><span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>Adoption Friction</span><span style={{ fontWeight: '600' }}>Moderate</span></div>
                       <div><span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>Lead Researcher</span><span style={{ fontWeight: '600' }}>{selectedTech.inventor}</span></div>
                    </div>
                 </div>

                 <div>
                   <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Action Pipeline</h4>
                   <div style={{ display: 'flex', gap: '16px', fontSize: '13px', alignItems: 'center' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--iit-blue)' }}></div> <span style={{flex: 1, height: '2px', background: 'var(--iit-blue)'}}></span>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--iit-blue)' }}></div> <span style={{flex: 1, height: '2px', background: '#E8ECEF'}}></span>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #E8ECEF' }}></div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', textTransform: 'uppercase' }}>
                      <span>Viewed</span> <span>NDA</span> <span>Deal</span>
                   </div>
                 </div>
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: '#FAFAFA', display: 'flex', gap: '12px', flexDirection: 'column' }}>
                 <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>Deploy NDA Request</button>
                 <button className="btn btn-outline" style={{ width: '100%', padding: '14px' }}>Message Researcher Team</button>
              </div>
           </aside>
        )}

      </div>
    </div>
  );
}

// Subcomponents

const KPICard = ({ title, value, sub, highlight }) => (
  <div style={{ flex: 1, background: highlight ? '#1C1E21' : 'var(--white)', color: highlight ? 'white' : 'inherit', border: highlight ? 'none' : '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
    <h4 style={{ fontSize: '13px', color: highlight ? '#A0AAB3' : 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>{title}</h4>
    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px', fontFamily: 'serif' }}>{value}</div>
    <div style={{ fontSize: '13px', color: highlight ? '#A0AAB3' : 'var(--text-secondary)' }}>{sub}</div>
  </div>
);

const DealTile = ({ tech, isSaved, isCompared, onSave, onCompare, onClick }) => {
  const commScore = Math.min(99, ((tech.trl || 1) * 10) + 15);
  return (
    <div onClick={onClick} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', cursor: 'pointer', transition: 'var(--transition)', overflow: 'hidden' }}>
      <div style={{ width: '8px', background: (tech.trl >= 6) ? '#1E8E3E' : '#1A73E8' }}></div>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
         <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <span className="badge badge-orange" style={{fontSize: '11px', padding: '3px 8px'}}>{tech.sector || 'Deep Tech'}</span>
            <span className="badge badge-green" style={{background: '#E8ECEF', color: '#3C4043', fontSize: '11px', padding: '3px 8px'}}>{tech.stageOfDev || 'Prototype'}</span>
         </div>
         <h3 style={{ fontSize: '18px', color: 'var(--iit-blue)', marginBottom: '8px', lineHeight: '1.2' }}>{tech.title}</h3>
         <p style={{ fontSize: '14px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tech.abstract || tech.summary || "Proprietary execution plan."}</p>
      </div>

      <div style={{ padding: '24px', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', width: '250px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>IP Status</span> <span style={{ fontWeight: '600' }}>{tech.patent}</span>
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Readiness Score</span> <span style={{ fontWeight: '600', color: commScore > 75 ? '#1E8E3E' : 'inherit' }}>{commScore}/100</span>
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Target ROI</span> <span style={{ fontWeight: '600' }}>{tech.roiBand || 'Moderate'}</span>
         </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', gap: '8px', alignItems: 'center', background: '#FAFAFA', borderLeft: '1px solid var(--border)' }}>
         <button onClick={onSave} className="btn" style={{ padding: '8px', background: isSaved ? '#FEF7E0' : 'white', border: '1px solid var(--border)', color: isSaved ? '#F29900' : 'var(--text-secondary)' }}>Save</button>
         <button onClick={onCompare} className="btn" style={{ padding: '8px', background: isCompared ? '#E8F0FE' : 'white', border: '1px solid var(--border)', color: isCompared ? '#1A73E8' : 'var(--text-secondary)' }}>Compare</button>
         <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Details</button>
      </div>
    </div>
  );
}

const CompareView = ({ compareList, onRemove }) => (
  // Omitted complex compare matrix identical structurally
  <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px' }}>
    <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Comparison Matrix</h2>
    {compareList.length === 0 ? (
      <p style={{ color: 'var(--text-secondary)' }}>You haven't selected any technologies to compare.</p>
    ) : (
      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto' }}>
         <div style={{ width: '150px', display: 'flex', flexDirection: 'column', paddingTop: '110px' }}>
            <div style={{ height: '40px', fontWeight: 'bold', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Score (1-100)</div>
            <div style={{ height: '40px', fontWeight: 'bold', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>TRL</div>
            <div style={{ height: '40px', fontWeight: 'bold', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>IP Security</div>
            <div style={{ height: '40px', fontWeight: 'bold', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Scaling Friction</div>
            <div style={{ height: '40px', fontWeight: 'bold', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>ROI Estimate</div>
         </div>
         {compareList.map(tech => (
           <div key={tech.id} style={{ minWidth: '220px', flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', position: 'relative' }}>
              <button onClick={() => onRemove(tech.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: '#F8F9FA', border: 'none', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '4px' }}>&times;</button>
              <div style={{ height: '90px', marginBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                 <h3 style={{ fontSize: '15px', lineHeight: '1.3', color: 'var(--iit-blue)' }}>{tech.title}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '40px', marginBottom: '16px', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: 'bold' }}>{Math.min(99, ((tech.trl||1)*10)+15)}</div>
                <div style={{ height: '40px', marginBottom: '16px', display: 'flex', alignItems: 'center' }}><span className="badge badge-green">TRL {tech.trl}</span></div>
                <div style={{ height: '40px', marginBottom: '16px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>{tech.patent}</div>
                <div style={{ height: '40px', marginBottom: '16px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>{tech.adoptionFriction || 'Moderate'}</div>
                <div style={{ height: '40px', marginBottom: '16px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>{tech.roiBand || 'High (3-5x)'}</div>
              </div>
           </div>
         ))}
      </div>
    )}
  </div>
);
