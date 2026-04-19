'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

// --- Utility Components ---
const Icon = ({ path, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const icSearch = "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35";
const icActivity = "M22 12h-4l-3 9L9 3l-3 9H2";
const icGrid = "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z";
const icFilter = "M22 3H2l8 9.46V19l4 2v-8.54L22 3z";
const icSave = "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z";
const icBar = "M18 20V10 M12 20V4 M6 20v-6";
const icBriefcase = "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16";
const icBell = "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0";

export default function InvestorDashboardClient({ initialEntries = [], initialTech = [] }) {
  const data = initialEntries.length > 0 ? initialEntries : initialTech;
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [dealStatuses, setDealStatuses] = useState({}); // id -> {status, notes}
  const [savedIds, setSavedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Compare modal state
  const [compareSource, setCompareSource] = useState(null); // The item user clicked Compare on
  const [showComparePicker, setShowComparePicker] = useState(false); // Show the picker modal
  const [compareTarget, setCompareTarget] = useState(null); // The second item chosen
  const [pickerSearch, setPickerSearch] = useState('');
  
  // Filters
  const [filterSector, setFilterSector] = useState('All');
  const [filterStage, setFilterStage] = useState('All');

  // Load state from local storage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('investor_watchlist')) || [];
      const statuses = JSON.parse(localStorage.getItem('investor_crm')) || {};
      setSavedIds(saved);
      setDealStatuses(statuses);
    } catch(e) {}
  }, []);

  const updateStatus = (id, status) => {
    const newStatuses = { ...dealStatuses, [id]: { ...dealStatuses[id], status } };
    setDealStatuses(newStatuses);
    localStorage.setItem('investor_crm', JSON.stringify(newStatuses));
  };

  const toggleSave = (id, e) => {
    if(e) e.stopPropagation();
    const newSaved = savedIds.includes(id) ? savedIds.filter(x => x !== id) : [...savedIds, id];
    setSavedIds(newSaved);
    localStorage.setItem('investor_watchlist', JSON.stringify(newSaved));
  };

  const handleCompareClick = (entry, e) => {
    if(e) e.stopPropagation();
    setCompareSource(entry);
    setShowComparePicker(true);
    setPickerSearch('');
  };

  const handlePickTarget = (target) => {
    setCompareTarget(target);
    setShowComparePicker(false);
  };

  const closeCompare = () => {
    setCompareSource(null);
    setCompareTarget(null);
    setShowComparePicker(false);
  };

  // --- Derived Data ---
  const filteredEntries = useMemo(() => {
    let list = data;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || (e.summary && e.summary.toLowerCase().includes(q)));
    }
    if (filterSector !== 'All') list = list.filter(e => e.sector === filterSector);
    return list;
  }, [data, searchQuery, filterSector]);

  const kpis = [
    { label: 'Startups Discovered', value: data.filter(e => e.type === 'startup').length },
    { label: 'IPs Available', value: data.filter(e => e.type === 'technology').length },
    { label: 'Shortlisted', value: savedIds.length },
    { label: 'Conversations', value: '12', trend: '+3 This week' },
    { label: 'Due Diligence', value: '4' },
    { label: 'Upside Weighted', value: '$42M', premium: true },
  ];

  const sidebarLinks = [
    { name: 'Overview', icon: icActivity },
    { name: 'Startups', icon: icGrid },
    { name: 'Technologies', icon: icGrid },
    { name: 'Deal Flow', icon: icBriefcase },
    { name: 'Analytics', icon: icBar },
    { name: 'Watchlist', icon: icSave },
  ];

  // --- Render Sections ---

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: kpi.premium ? 'var(--iit-blue)' : 'white', color: kpi.premium ? 'white' : 'inherit', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '8px' }}>{kpi.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{kpi.value}</div>
            {kpi.trend && <div style={{ fontSize: '11px', marginTop: '4px', color: '#1E8E3E' }}>{kpi.trend}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '32px', alignItems: 'flex-start' }}>
        {/* Zone A: Priority Opportunities */}
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--iit-blue)' }}>Priority Matches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {filteredEntries.slice(0, 5).map(e => (
               <OpportunityCard key={e.id} entry={e} onSave={(ev) => toggleSave(e.id, ev)} isSaved={savedIds.includes(e.id)} onClick={() => setSelectedEntry(e)} />
             ))}
          </div>
        </div>

        {/* Zone B: Pipeline Tracker */}
        <div>
           <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--iit-blue)' }}>Pipeline Velocity</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Discovered', 'Reviewed', 'Shortlisted', 'Discussion', 'Diligence', 'Term Sheet', 'Closed'].map((stage, i) => {
                const count = Object.values(dealStatuses).filter(s => s.status === stage).length;
                const width = 100 - (i * 10);
                return (
                  <div key={stage} style={{ width: `${width}%`, background: '#F0F2F5', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600 }}>{stage}</span>
                    <span style={{ color: 'var(--iit-blue)' }}>{count} deals</span>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Zone C: Alerts Panel */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icon path={icBell} /> Intelligence Hub</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AlertItem label="Founder Updated Deck" desc="Titanium Forge AI uploaded a new Series A memo." time="34m ago" />
            <AlertItem label="NDA Approved" desc="SRIC approved your access to 'Eco-Extraction' technical brief." time="2h ago" />
            <AlertItem label="Milestone Reached" desc="NanoKote industries signed a Tier-1 Indian Port pilot." time="Yesterday" />
            <AlertItem label="TRL Movement" desc="Solid-State Battery IP moved from TRL 4 to 6." time="2 days ago" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGrid = (type) => {
    const items = type === 'watchlist'
      ? filteredEntries.filter(e => savedIds.includes(e.id))
      : filteredEntries.filter(e => e.type === type);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {items.length === 0 && <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>{type === 'watchlist' ? 'No items saved to your watchlist yet.' : 'No items found.'}</p>}
        {items.map(e => (
          <DiscoveryCard key={e.id} entry={e} onSave={(ev) => toggleSave(e.id, ev)} isSaved={savedIds.includes(e.id)} onCompare={(ev) => handleCompareClick(e, ev)} onClick={() => setSelectedEntry(e)} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#F8F9FA' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'white', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
         <div style={{ padding: '0 24px', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--iit-blue)' }}>INVESTOR COMMAND</h1>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Venture Operating System</p>
         </div>
         <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {sidebarLinks.map(link => (
              <button key={link.name} onClick={() => setActiveTab(link.name)} style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', border: 'none', background: activeTab === link.name ? '#F0F4FF' : 'transparent',
                color: activeTab === link.name ? 'var(--iit-blue)' : 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === link.name ? '600' : '400',
                borderRight: activeTab === link.name ? '4px solid var(--iit-blue)' : 'none'
              }}>
                <Icon path={link.icon} /> {link.name}
              </button>
            ))}
         </nav>
      </aside>

      {/* Main Canvas */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
         {/* Top Header */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{activeTab} Workspace</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Monitoring 437 Deep Tech data points across IIT KGP ecosystem.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)', width: '300px' }}>
               <Icon path={icSearch} size={16} />
               <input placeholder="Semantic search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', flex: 1, fontSize: '13px' }} />
            </div>
         </div>

         {activeTab === 'Overview' && renderOverview()}
         {activeTab === 'Startups' && renderGrid('startup')}
         {activeTab === 'Technologies' && renderGrid('technology')}
         {activeTab === 'Watchlist' && renderGrid('watchlist')}
         
         {activeTab === 'Analytics' && (
           <div style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
             <h3 style={{ marginBottom: '32px' }}>Venture Physics & Maturity Dispersion</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }}>
               <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '12px', borderBottom: '2px solid var(--border)' }}>
                  {[10, 30, 65, 80, 140, 90, 160, 200, 120].map((v, i) => (
                    <div key={i} style={{ flex: 1, background: 'var(--iit-blue)', height: `${(v/200)*100}%`, borderRadius: '6px 6px 0 0', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px' }}>TRL {i+1}</div>
                    </div>
                  ))}
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <MetricProgressBar label="IP Defensibility Score" val={78} />
                  <MetricProgressBar label="Lab-to-Market Momentum" val={64} />
                  <MetricProgressBar label="Investment Readiness" val={82} />
               </div>
             </div>
           </div>
         )}

         {/* Placeholders for other tabs */}
         {!['Overview', 'Startups', 'Technologies', 'Analytics', 'Watchlist', 'Compare'].includes(activeTab) && (
            <div style={{ background: 'white', padding: '60px', textAlign: 'center', borderRadius: '12px', border: '1px solid var(--border)' }}>
               <div style={{ fontSize: '48px', marginBottom: '24px' }}>📁</div>
               <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{activeTab} Management Workspace</h3>
               <p style={{ color: 'var(--text-secondary)' }}>This secure environment is currently being provisioned for your node cluster.</p>
            </div>
         )}
      </main>

      {/* --- Overlay Components --- */}

      {/* Compare Picker Modal */}
      {showComparePicker && compareSource && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowComparePicker(false)}>
          <div style={{ background: 'white', borderRadius: '16px', width: '560px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Compare <span style={{ color: 'var(--iit-blue)' }}>{compareSource.title || compareSource.name}</span> with…</h3>
                <button onClick={() => setShowComparePicker(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>&times;</button>
              </div>
              <div style={{ display: 'flex', background: '#F0F2F5', borderRadius: '8px', padding: '8px 12px', alignItems: 'center' }}>
                <Icon path={icSearch} size={16} />
                <input placeholder="Search to compare…" value={pickerSearch} onChange={e => setPickerSearch(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: '8px', width: '100%', fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px' }}>
              {data.filter(item => item.id !== compareSource.id && (item.title || item.name || '').toLowerCase().includes(pickerSearch.toLowerCase())).map(item => (
                <div key={item.id} onClick={() => handlePickTarget(item)} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F0F4FF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: item.type === 'startup' ? '#E8F0FE' : '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: 'var(--iit-blue)' }}>{(item.title || item.name || '?').charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.title || item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.sector} · {item.type}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--iit-blue)' }}>{item.matchScore}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareSource && compareTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={closeCompare}>
          <div style={{ background: 'white', borderRadius: '20px', width: '900px', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--iit-blue)' }}>Side-by-Side Comparison</h2>
              <button onClick={closeCompare} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {[compareSource, compareTarget].map((item, idx) => (
                <div key={item.id || idx} style={{ padding: '32px', borderRight: idx === 0 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: item.type === 'startup' ? '#E8F0FE' : '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: 'var(--iit-blue)' }}>{(item.title || item.name || '?').charAt(0)}</div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.title || item.name}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.type === 'startup' ? 'Venture' : 'Technology'}</span>
                    </div>
                  </div>
                  <CompareMetricRow label="Match Score" value={<span style={{ fontWeight: 'bold', color: 'var(--iit-blue)', fontSize: '20px' }}>{item.matchScore}%</span>} />
                  <CompareMetricRow label="Sector" value={item.sector || '—'} />
                  <CompareMetricRow label="Stage / TRL" value={item.type === 'startup' ? (item.stage || 'Seed') : `TRL ${item.trl || '—'}`} />
                  <CompareMetricRow label="Capital Ask" value={item.ask || 'N/A'} />
                  <CompareMetricRow label="Summary" value={<span style={{ fontSize: '13px', lineHeight: '1.5' }}>{item.summary || '—'}</span>} />
                  {item.type === 'startup' && <CompareMetricRow label="Key People" value={item.inventor || '—'} />}
                  {item.type === 'technology' && <CompareMetricRow label="IP Status" value={item.patent || '—'} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedEntry && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '500px', height: '100vh', background: 'white', boxShadow: '-8px 0 32px rgba(0,0,0,0.1)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Deal Analysis</h2>
             <button onClick={() => setSelectedEntry(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
           </div>
           
           <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                {selectedEntry.image ? <img src={selectedEntry.image} style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--border)' }} /> : <div style={{ width: '64px', height: '64px', background: '#F0F2F5', borderRadius: '12px' }}></div>}
                <div>
                  <h3 style={{ fontSize: '18px' }}>{selectedEntry.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{selectedEntry.type === 'startup' ? 'Venture' : 'Technology Transfer'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                 <div style={{ padding: '12px', background: '#F8F9FA', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Match Score</label>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--iit-blue)' }}>{selectedEntry.matchScore}%</div>
                 </div>
                 <div style={{ padding: '12px', background: '#F8F9FA', borderRadius: '8px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Sector Growth</label>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1E8E3E' }}>+24% YoY</div>
                 </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Deal State Management</h4>
                <select 
                  value={dealStatuses[selectedEntry.id]?.status || 'Discovered'} 
                  onChange={(e) => updateStatus(selectedEntry.id, e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                >
                  {['Discovered', 'Reviewed', 'Shortlisted', 'Discussion', 'Diligence', 'Term Sheet', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Core Thesis Fit</h4>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{selectedEntry.summary}</p>
              </div>

              {/* CRM Notes */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Private Diligence Notes</h4>
                <textarea 
                  placeholder="Capture deal notes here..." 
                  style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', resize: 'none' }}
                />
              </div>
           </div>

           <div style={{ padding: '32px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>Request Intro</button>
              <button className="btn btn-outline" style={{ flex: 1, padding: '14px' }}>Download Deck</button>
           </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function OpportunityCard({ entry, onSave, isSaved, onClick }) {
  return (
    <div onClick={onClick} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.2s' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: entry.type === 'startup' ? '#E8F0FE' : '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--iit-blue)' }}>{(entry.title || entry.name || '?').charAt(0)}</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{entry.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{entry.sector} • {entry.type === 'startup' ? entry.stage : `TRL ${entry.trl}`}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--iit-blue)' }}>{entry.matchScore}%</div>
        <button onClick={onSave} style={{ border: 'none', background: 'none', color: isSaved ? '#F29900' : '#BDC1C6', cursor: 'pointer' }}><Icon path={icSave} size={22} /></button>
      </div>
    </div>
  );
}

function DiscoveryCard({ entry, onSave, isSaved, onCompare, onClick }) {
  return (
    <div onClick={onClick} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', cursor: 'pointer', overflow: 'hidden', transition: '0.15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ padding: '24px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
           <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>{entry.sector}</span>
           <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge" style={{ background: entry.type === 'startup' ? '#E8F0FE' : '#F8F9FA' }}>{entry.type}</span>
              {entry.trl && <span className="badge badge-green">TRL {entry.trl}</span>}
           </div>
        </div>
        <h3 style={{ fontSize: '18px', marginBottom: '12px', lineHeight: '1.4' }}>{entry.title || entry.name}</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{entry.summary}</p>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: '#FDFDFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
           <button onClick={onSave} style={{ border: 'none', background: 'none', color: isSaved ? '#F29900' : '#BDC1C6', cursor: 'pointer', padding: '4px' }}><Icon path={icSave} /></button>
           <button onClick={onCompare} style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '11px', background: 'white', cursor: 'pointer' }}>Compare</button>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--iit-blue)' }}>{entry.matchScore}% Fit</div>
      </div>
    </div>
  );
}

function AlertItem({ label, desc, time }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
       <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--iit-blue)', marginTop: '6px' }}></div>
       <div>
         <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{label}</div>
         <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0' }}>{desc}</p>
         <span style={{ fontSize: '11px', color: '#BDC1C6' }}>{time}</span>
       </div>
    </div>
  );
}

function MetricProgressBar({ label, val }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{val}%</span>
      </div>
      <div style={{ height: '8px', background: '#F0F2F5', borderRadius: '4px' }}>
        <div style={{ width: `${val}%`, height: '100%', background: 'var(--iit-blue)', borderRadius: '4px' }}></div>
      </div>
    </div>
  );
}

function CompareMetricRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #F0F2F5' }}>
      <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', fontWeight: '600', minWidth: '100px' }}>{label}</span>
      <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>{value}</div>
    </div>
  );
}
