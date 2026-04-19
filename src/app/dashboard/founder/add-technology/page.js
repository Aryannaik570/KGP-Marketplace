'use client';
import { useState } from 'react';

export default function AddTechnologyForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', sector: 'Deep Tech', inventorName: '', coInventors: '', department: '', trl: 1, patentStatus: 'Not Filed',
    abstract: '', problemSolved: '', mechanism: '', novelty: '', stageOfDev: '', testEnvironment: '',
    targetIndustries: '', adoptionFriction: '', capexEst: '', roiBand: '', regulatoryBurden: '', marketInterest: '',
    publicDisclosureRisk: '', competitorLandscape: '', fundingSource: '', sponsorObligations: '', visibility: 'Public', ndaRequired: false
  });
  
  const [thumbFile, setThumbFile] = useState(null);

  const handleNext = (e) => { e.preventDefault(); setStep(s => s + 1); };
  const handleBack = (e) => { e.preventDefault(); setStep(s => s - 1); };

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
      let thumbnailUrl = null;
      if (thumbFile) {
        thumbnailUrl = await handleUpload(thumbFile);
      }
      const payload = { ...formData, thumbnailUrl, trl: parseInt(formData.trl) };
      
      const res = await fetch('/api/founder/technologies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        window.location.href = '/technologies';
      } else {
        const err = await res.json();
        alert('Failed: ' + (err.error || 'Server error'));
      }
    } catch(err) {
      alert('Error saving technology');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' };

  return (
    <div style={{minHeight: '100vh', background: 'var(--off-white)', padding: '60px 0'}}>
      <div className="container" style={{maxWidth: '800px'}}>
        <h1 style={{fontSize: '32px', marginBottom: '8px'}}>Disclose a Technology</h1>
        <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Submit your deep-tech IP for commercialization. Securely tracked.</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
           {[1, 2, 3, 4].map(s => (
             <div key={s} style={{ flex: 1, height: '4px', background: s <= step ? 'var(--iit-blue)' : '#E8ECEF', borderRadius: '2px' }}></div>
           ))}
        </div>

        <form onSubmit={step === 4 ? handleSubmit : handleNext} style={{background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)'}}>
          
          {step === 1 && (
            <div>
              <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 1: Basic Identity</h2>
              
              <label style={labelStyle}>Technology Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="E.g., Flow Battery Optimization" />
              
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Category / Sector</label>
                  <select name="sector" value={formData.sector} onChange={handleChange} style={inputStyle}>
                    <option>Deep Tech</option>
                    <option>Biotech</option>
                    <option>Material Science</option>
                    <option>AI / Machine Learning</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>TRL (Readiness Level)</label>
                  <select name="trl" value={formData.trl} onChange={handleChange} style={inputStyle}>
                    {[1,2,3,4,5,6,7,8,9].map(t => <option key={t} value={t}>TRL {t}</option>)}
                  </select>
                </div>
              </div>

              <label style={labelStyle}>Lead Inventor</label>
              <input name="inventorName" value={formData.inventorName} onChange={handleChange} style={inputStyle} placeholder="Dr. XYZ" />
              
              <label style={labelStyle}>Executive Summary (1-line value proposition)</label>
              <textarea name="abstract" value={formData.abstract} onChange={handleChange} style={{...inputStyle, height: '80px'}} placeholder="Non-flammable electrolyte achieving 10^−3 S/cm..." />

              <label style={labelStyle}>Patent Status</label>
              <select name="patentStatus" value={formData.patentStatus} onChange={handleChange} style={inputStyle}>
                <option>Not Filed</option>
                <option>Provisional</option>
                <option>Filed</option>
                <option>Granted</option>
              </select>

              <label style={labelStyle}>Cover Image / Schematic</label>
              <input type="file" onChange={e => setThumbFile(e.target.files[0])} style={inputStyle} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 2: Technical Depth</h2>
              
              <label style={labelStyle}>The Bottleneck / Problem Solved</label>
              <textarea name="problemSolved" value={formData.problemSolved} onChange={handleChange} style={{...inputStyle, height: '100px'}} />
              
              <label style={labelStyle}>How it works (Mechanism)</label>
              <textarea name="mechanism" value={formData.mechanism} onChange={handleChange} style={{...inputStyle, height: '100px'}} />
              
              <label style={labelStyle}>Specific Novelty / Advantage</label>
              <textarea name="novelty" value={formData.novelty} onChange={handleChange} style={{...inputStyle, height: '100px'}} />
              
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Stage of Development</label>
                  <input name="stageOfDev" value={formData.stageOfDev} onChange={handleChange} style={inputStyle} placeholder="E.g., Lab verified" />
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Test Environment</label>
                  <input name="testEnvironment" value={formData.testEnvironment} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 3: Commercial & Feasibility</h2>
              
              <label style={labelStyle}>Target Industries / Use Cases</label>
              <input name="targetIndustries" value={formData.targetIndustries} onChange={handleChange} style={inputStyle} placeholder="E.g., Aerospace, Grid Storage" />
              
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Estimated Adoption Friction</label>
                  <select name="adoptionFriction" value={formData.adoptionFriction} onChange={handleChange} style={inputStyle}>
                    <option>Low</option><option>Moderate</option><option>High</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Expected ROI Band</label>
                  <select name="roiBand" value={formData.roiBand} onChange={handleChange} style={inputStyle}>
                    <option>Moderate (1-3x)</option><option>High (3-5x)</option><option>Venture Scale (10x+)</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>CapEx Estimate to Deploy</label>
                  <input name="capexEst" value={formData.capexEst} onChange={handleChange} style={inputStyle} placeholder="$500k - $1M" />
                </div>
                <div style={{flex: 1}}>
                  <label style={labelStyle}>Regulatory Burden</label>
                  <input name="regulatoryBurden" value={formData.regulatoryBurden} onChange={handleChange} style={inputStyle} placeholder="FDA approval required" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{fontSize: '20px', marginBottom: '24px'}}>Step 4: IP & Administration</h2>
              
              <label style={labelStyle}>Prior Public Disclosure Flag (Conferences/Papers)</label>
              <input name="publicDisclosureRisk" value={formData.publicDisclosureRisk} onChange={handleChange} style={inputStyle} placeholder="None" />
              
              <label style={labelStyle}>Funding Source (Internal Only)</label>
              <input name="fundingSource" value={formData.fundingSource} onChange={handleChange} style={inputStyle} placeholder="Govt Grant XYZ" />
              
              <label style={labelStyle}>Sponsor Obligations / Royalties (Internal Only)</label>
              <textarea name="sponsorObligations" value={formData.sponsorObligations} onChange={handleChange} style={{...inputStyle, height: '80px'}} />
              
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="nda" name="ndaRequired" checked={formData.ndaRequired} onChange={handleChange} />
                <label htmlFor="nda" style={{fontSize: '14px', fontWeight: 'bold'}}>Require Active NDA for Detailed Views</label>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
             {step > 1 ? (
               <button type="button" onClick={handleBack} className="btn btn-outline" disabled={loading}>Back</button>
             ) : (<div></div>)}
             
             {step < 4 ? (
               <button type="submit" className="btn btn-primary" disabled={loading}>Continue</button>
             ) : (
               <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting Pipeline...' : 'Deploy Technology Matrix'}</button>
             )}
          </div>
        </form>
      </div>
    </div>
  );
}
