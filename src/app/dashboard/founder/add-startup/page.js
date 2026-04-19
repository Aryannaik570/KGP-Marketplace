'use client';
import { useState } from 'react';

export default function AddStartupForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', tagline: '', industry: 'Deep Tech', website: '', foundedDate: '', headquarters: '', shortDesc: '',
    problem: '', solution: '', urgencyWhyNow: '', differentiation: '',
    targetCustomer: '', businessModel: '', pricingModel: '', salesMotion: '',
    primaryMetric: '', userCount: '', revenueARR: '', retention: '', growthRate: '',
    currentRaise: '', fundingRequired: '', amountRaised: '', valuationRange: '', burnRate: '', runway: '', useOfFunds: '',
    keyEmployees: '', advisors: '', boardMembers: '',
    targetMarket: '', icp: '', competitorSet: '',
    coreIp: '', technicalMoat: '', universityLinkage: '', labOrigin: '',
    pilots: '', customers: '', lois: '', grants: '',
    incubationStatus: '', b2bClassification: '', commercialReadiness: '', esgClimateTag: '', confidentiality: 'Public'
  });
  
  const [logoFile, setLogoFile] = useState(null);

  const handleNext = (e) => { e.preventDefault(); window.scrollTo(0, 0); setStep(s => s + 1); };
  const handleBack = (e) => { e.preventDefault(); window.scrollTo(0, 0); setStep(s => s - 1); };

  const handleUpload = async (file) => {
    if (!file) return null;
    const uploadData = new FormData();
    uploadData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
    if (!res.ok) throw new Error('Upload failed');
    const rd = await res.json();
    return rd.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await handleUpload(logoFile);
      }
      const payload = { ...formData, logoUrl };
      
      const res = await fetch('/api/founder/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        window.location.href = '/startups';
      } else {
        const err = await res.json();
        alert('Failed to deploy matrix: ' + (err.error || 'Server alignment failure'));
      }
    } catch(err) {
      alert('Local fetch failed');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' };

  return (
    <div style={{minHeight: '100vh', background: 'var(--off-white)', padding: '60px 0'}}>
      <div className="container" style={{maxWidth: '800px'}}>
        <h1 style={{fontSize: '32px', marginBottom: '8px'}}>Originate Startup Dossier</h1>
        <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Ingest founder metrics into the proprietary intelligence ecosystem.</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
           {[1, 2, 3, 4, 5, 6, 7].map(s => (
             <div key={s} style={{ flex: 1, height: '4px', background: s <= step ? 'var(--iit-blue)' : '#E8ECEF', borderRadius: '2px' }}></div>
           ))}
        </div>

        <form onSubmit={step === 7 ? handleSubmit : handleNext} style={{background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)'}}>
          
          {step === 1 && (
            <div>
              <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 1: Identity & Profile</h2>
              
              <label style={labelStyle}>Startup Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="E.g., Quantum Dynamics" />
              
              <label style={labelStyle}>One-line Pitch (Tagline)</label>
              <input name="tagline" value={formData.tagline} onChange={handleChange} style={inputStyle} placeholder="High density super-capacitors for orbit." />

              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Primary Sector</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} style={inputStyle}>
                    <option>Deep Tech</option>
                    <option>Biotech</option>
                    <option>Material Science</option>
                    <option>Aerospace</option>
                    <option>Enterprise AI</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Founded Date</label>
                  <input type="month" name="foundedDate" value={formData.foundedDate} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Website URL</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} style={inputStyle} placeholder="https://" />
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Headquarters</label>
                  <input name="headquarters" value={formData.headquarters} onChange={handleChange} style={inputStyle} placeholder="E.g., Bangalore, India" />
                </div>
              </div>

              <label style={labelStyle}>Short Description (Elevator Pitch)</label>
              <textarea name="shortDesc" value={formData.shortDesc} onChange={handleChange} style={{...inputStyle, height: '80px'}} placeholder="We manufacture the highest yield graphene components for thermal regulation..." />

              <label style={labelStyle}>Company Logo</label>
              <input type="file" onChange={e => setLogoFile(e.target.files[0])} style={inputStyle} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 2: Problem & Solution</h2>
              
              <label style={labelStyle}>The Customer Pain/Problem</label>
              <textarea name="problem" value={formData.problem} onChange={handleChange} style={{...inputStyle, height: '100px'}} />
              
              <label style={labelStyle}>Your Solution</label>
              <textarea name="solution" value={formData.solution} onChange={handleChange} style={{...inputStyle, height: '100px'}} />
              
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Why Now? (Urgency/Market Shift)</label>
                  <textarea name="urgencyWhyNow" value={formData.urgencyWhyNow} onChange={handleChange} style={{...inputStyle, height: '80px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Primary Differentiation</label>
                  <textarea name="differentiation" value={formData.differentiation} onChange={handleChange} style={{...inputStyle, height: '80px'}} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 3: Go-to-Market & Sales</h2>
              
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Business Classification</label>
                  <select name="b2bClassification" value={formData.b2bClassification} onChange={handleChange} style={inputStyle}>
                    <option>Enterprise B2B</option><option>SME B2B</option><option>B2G</option><option>B2B2C</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Target Customer Profile (ICP)</label>
                  <input name="targetCustomer" value={formData.targetCustomer} onChange={handleChange} style={inputStyle} placeholder="Fortune 500 CISOs" />
                </div>
              </div>

              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Pricing Model</label>
                  <select name="pricingModel" value={formData.pricingModel} onChange={handleChange} style={inputStyle}>
                    <option>SaaS (Subscription)</option><option>Per Seat / License</option><option>Usage-Based API</option><option>Hardware CapEx</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Sales Motion</label>
                  <select name="salesMotion" value={formData.salesMotion} onChange={handleChange} style={inputStyle}>
                    <option>Product-Led Growth</option><option>Field Sales (Enterprise)</option><option>Channel Partners</option>
                  </select>
                </div>
              </div>

              <label style={labelStyle}>Current Commercial Readiness</label>
              <select name="commercialReadiness" value={formData.commercialReadiness} onChange={handleChange} style={inputStyle}>
                <option>Pre-revenue</option><option>Pilots / POC</option><option>Early Revenue Generation</option><option>Scaling ARR</option>
              </select>
            </div>
          )}

          {step === 4 && (
            <div>
               <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 4: Key Traction & Growth</h2>
               <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px'}}>These metrics define your core diligence profile for investors.</p>
               
               <div style={{display: 'flex', gap: '16px'}}>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Current Annual Recurring Revenue (ARR)</label>
                    <input name="revenueARR" value={formData.revenueARR} onChange={handleChange} style={inputStyle} placeholder="$ E.g. $12,000" />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Paying Customers / User Count</label>
                    <input name="userCount" value={formData.userCount} onChange={handleChange} style={inputStyle} placeholder="4 Enterprise Logos" />
                  </div>
               </div>

               <div style={{display: 'flex', gap: '16px'}}>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Month/Month Growth Rate</label>
                    <input name="growthRate" value={formData.growthRate} onChange={handleChange} style={inputStyle} placeholder="E.g. 15%" />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Net Revenue Retention (NRR)</label>
                    <input name="retention" value={formData.retention} onChange={handleChange} style={inputStyle} placeholder="110%" />
                  </div>
               </div>

               <label style={labelStyle}>Identify your absolute Primary Metric (North Star)</label>
               <input name="primaryMetric" value={formData.primaryMetric} onChange={handleChange} style={inputStyle} placeholder="Weekly Active Dashboards, or Paid API calls" />
            </div>
          )}

          {step === 5 && (
            <div>
               <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 5: Funding Ask & Financials</h2>
               
               <div style={{display: 'flex', gap: '16px'}}>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Current Raise Stage</label>
                    <select name="currentRaise" value={formData.currentRaise} onChange={handleChange} style={inputStyle}>
                      <option>Pre-Seed</option><option>Seed</option><option>Series A</option><option>Not Fundraising</option>
                    </select>
                  </div>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>New Ask Amount</label>
                    <input name="fundingRequired" value={formData.fundingRequired} onChange={handleChange} style={inputStyle} placeholder="E.g. $2.5M" />
                  </div>
               </div>

               <div style={{display: 'flex', gap: '16px'}}>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Capital Previously Raised</label>
                    <input name="amountRaised" value={formData.amountRaised} onChange={handleChange} style={inputStyle} placeholder="$500k" />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Target Valuation Range</label>
                    <input name="valuationRange" value={formData.valuationRange} onChange={handleChange} style={inputStyle} placeholder="E.g. $10M Post-money" />
                  </div>
               </div>

               <div style={{display: 'flex', gap: '16px'}}>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Monthly Net Burn Rate</label>
                    <input name="burnRate" value={formData.burnRate} onChange={handleChange} style={inputStyle} placeholder="E.g. $45k" />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Current Cash Runway</label>
                    <select name="runway" value={formData.runway} onChange={handleChange} style={inputStyle}>
                      <option>Less than 6 Months</option><option>6 - 12 Months</option><option>12 - 18 Months</option><option>18+ Months</option>
                    </select>
                  </div>
               </div>
               
               <label style={labelStyle}>Use of Funds Summary</label>
               <input name="useOfFunds" value={formData.useOfFunds} onChange={handleChange} style={inputStyle} placeholder="50% R&D Engineers, 30% Outbound Sales, 20% Logistics" />
            </div>
          )}

          {step === 6 && (
            <div>
               <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 6: Team, Moat & Validation</h2>
               
               <label style={labelStyle}>Laboratory Origin / University Linkage</label>
               <input name="labOrigin" value={formData.labOrigin} onChange={handleChange} style={inputStyle} placeholder="Born out of Advanced Computing Lab, IIT KGP" />
               
               <label style={labelStyle}>Technical Moat & Core IP</label>
               <textarea name="technicalMoat" value={formData.technicalMoat} onChange={handleChange} style={{...inputStyle, height: '80px'}} placeholder="Exclusive IP holding over the topological mapping algorithm." />
               
               <label style={labelStyle}>Key Employees & Backgrounds</label>
               <textarea name="keyEmployees" value={formData.keyEmployees} onChange={handleChange} style={{...inputStyle, height: '80px'}} placeholder="CTO was early architect at Intel..." />
               
               <label style={labelStyle}>Social Proof (Pilots, Defense Grants, LOIs)</label>
               <textarea name="pilots" value={formData.pilots} onChange={handleChange} style={{...inputStyle, height: '80px'}} placeholder="$500k LOI from Lockheed Martin..." />
            </div>
          )}

          {step === 7 && (
            <div>
               <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 7: Permissions & Classification</h2>
               <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px'}}>Final platform structuring before global deployment.</p>
               
               <label style={labelStyle}>Platform Visibility</label>
               <select name="confidentiality" value={formData.confidentiality} onChange={handleChange} style={inputStyle}>
                 <option>Public / VCs Enabled</option>
                 <option>Stealth Mode (Restricted Data)</option>
               </select>

               <label style={labelStyle}>Institute Incubation Status</label>
               <select name="incubationStatus" value={formData.incubationStatus} onChange={handleChange} style={inputStyle}>
                 <option>STEP IIT KGP</option><option>Independent</option><option>Other Accelerator</option>
               </select>
               
               <label style={labelStyle}>ESG / Climate Tag</label>
               <select name="esgClimateTag" value={formData.esgClimateTag} onChange={handleChange} style={inputStyle}>
                 <option>None</option><option>Clean Energy</option><option>Carbon Negativity</option><option>Social Impact</option>
               </select>
            </div>
          )}


          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
             {step > 1 ? (
               <button type="button" onClick={handleBack} className="btn btn-outline" disabled={loading}>Back</button>
             ) : (<div></div>)}
             
             {step < 7 ? (
               <button type="submit" className="btn btn-primary" disabled={loading}>Continue &rArr;</button>
             ) : (
               <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Deploying...' : 'Deploy Global Record'}</button>
             )}
          </div>
        </form>
      </div>
    </div>
  );
}
