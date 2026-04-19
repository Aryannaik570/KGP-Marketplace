'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InvestorOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    investorType: '', firmName: '', website: '', location: '', aum: '',
    stage: '', ticketMin: '', ticketMax: '', esg: false, geo: '', 
    materials: [], applications: [], timeline: '', inbound: 'Curated only'
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 6));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));
  const submitOnboarding = () => router.push('/dashboard/investor');

  return (
    <div style={{minHeight: '100vh', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--off-white)', display: 'flex', flexDirection: 'column'}}>
      <div style={{background: 'var(--white)', padding: '16px 24px', borderBottom: '1px solid var(--border)'}}>
        <h2 style={{fontSize: '20px', color: 'var(--graphite)'}}>Investor Onboarding</h2>
        <div style={{marginTop: '12px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden'}}>
          <div style={{width: `${(step / 6) * 100}%`, height: '100%', background: 'var(--graphite)', transition: 'all 0.3s'}}></div>
        </div>
        <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px'}}>Step {step} of 6</p>
      </div>

      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px'}}>
        <div style={{background: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px', border: '1px solid var(--border)', overflowY: 'auto', maxHeight: '80vh'}}>
          
          {step === 1 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Identity</h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Investor Type</label>
                <select style={{width:'100%', padding:'12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)'}} value={formData.investorType} onChange={e => setFormData({...formData, investorType: e.target.value})}>
                  <option value="">Select Type</option>
                  <option value="Angel">Angel Investor</option>
                  <option value="VC">Venture Capital</option>
                  <option value="Corporate">Corporate / Strategic</option>
                  <option value="FamilyOffice">Family Office</option>
                  <option value="PSU">Public Sector Undertaking (PSU)</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Organization Context</h3>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Firm Name</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} onChange={e=>setFormData({...formData, firmName: e.target.value})} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Website</label><input type="url" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} onChange={e=>setFormData({...formData, website: e.target.value})} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>AUM / Fund Size</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} onChange={e=>setFormData({...formData, aum: e.target.value})} /></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Investment Thesis</h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Preferred Stage</label>
                <select style={{width:'100%', padding:'12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)'}}>
                  <option>Idea / Prototype</option><option>Seed</option><option>Series A+</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Ticket Min ($)</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)'}} /></div>
                <div style={{flex: 1}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Ticket Max ($)</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)'}} /></div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Strategic Preferences</h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', cursor:'pointer'}}>
                   <input type="checkbox" checked={formData.esg} onChange={e=>setFormData({...formData, esg: e.target.checked})} />
                   Strict ESG Requirements
                </label>
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Geography Preference</label>
                <select style={{width:'100%', padding:'12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)'}}>
                  <option>Global</option><option>India Only</option><option>APAC</option>
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Industry Focus</h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Target Material Types</label>
                <select multiple style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)', height: '120px'}}>
                  <option>Ferrous</option><option>Non-ferrous</option><option>Alloys</option><option>Battery Materials</option><option>Rare Earths</option>
                </select>
                <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>Hold cmd/ctrl to select multiple</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Engagement Settings</h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Inbound Preference</label>
                <select style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}>
                  <option>Curated Only (Platform AI Match)</option><option>Open to Cold Inbound</option>
                </select>
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Decision Timeline</label>
                <select style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}>
                  <option>Fast (2-4 Weeks)</option><option>Standard (1-3 Months)</option><option>Slow (Corporate Validation)</option>
                </select>
              </div>
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px'}}>
            {step > 1 ? (
              <button className="btn" style={{border: '1px solid var(--border)'}} onClick={handlePrev}>Back</button>
            ) : <div></div>}
            
            {step < 6 ? (
              <button className="btn btn-primary" style={{background: 'var(--graphite)'}} onClick={handleNext}>Next Step</button>
            ) : (
              <button className="btn btn-primary" style={{background: '#1E8E3E'}} onClick={submitOnboarding}>Complete Investor Profile</button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
