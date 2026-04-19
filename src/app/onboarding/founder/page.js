'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FounderOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '', affiliation: '', department: 'Metallurgical & Materials Engineering',
    photo: '', linkedin: '', academic: '', degree: '', year: '', lab: '',
    internships: '', publications: '', patents: '', previousStartups: '', skills: [],
    startupName: '', tagline: '', industry: '', problem: '', solution: '',
    isKgpResearch: 'No', associatedProf: '', patentStatus: 'None', trl: 1, prototype: 'Concept',
    costReduction: '', efficiency: '', useCases: '', targetCustomers: '', revenueModel: '', fundingRequired: '',
    pitchDeck: null, techDoc: null, demoVideo: null,
    visibility: 'Public', ndaRequired: false
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 8));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));
  const submitOnboarding = () => router.push('/dashboard/founder');

  return (
    <div style={{minHeight: '100vh', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--off-white)', display: 'flex', flexDirection: 'column'}}>
      <div style={{background: 'var(--white)', padding: '16px 24px', borderBottom: '1px solid var(--border)'}}>
        <h2 style={{fontSize: '20px', color: 'var(--iit-blue)'}}>Founder Onboarding</h2>
        <div style={{marginTop: '12px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden'}}>
          <div style={{width: `${(step / 8) * 100}%`, height: '100%', background: 'var(--iit-blue)', transition: 'all 0.3s'}}></div>
        </div>
        <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px'}}>Step {step} of 8</p>
      </div>

      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px'}}>
        <div style={{background: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px', border: '1px solid var(--border)', overflowY: 'auto', maxHeight: '80vh'}}>
          
          {step === 1 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Basic Identity</h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Role</label>
                <select style={{width:'100%', padding:'12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)'}} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="">Select Role</option>
                  <option value="Founder">Founder</option>
                  <option value="Co-founder">Co-founder</option>
                  <option value="Faculty">Faculty-backed startup</option>
                  <option value="Student">Student project</option>
                </select>
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Affiliation</label>
                <select style={{width:'100%', padding:'12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)'}} value={formData.affiliation} onChange={e => setFormData({...formData, affiliation: e.target.value})}>
                  <option value="">Select Affiliation</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Alumni">Alumni</option>
                  <option value="External">External</option>
                </select>
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Department</label>
                <input type="text" readOnly value={formData.department} style={{width:'100%', padding:'12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', background:'var(--off-white)', color:'var(--text-secondary)'}} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Personal Profile</h3>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>LinkedIn URL</label><input type="url" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} onChange={e=>setFormData({...formData, linkedin: e.target.value})} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Academic Background / Degree</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} onChange={e=>setFormData({...formData, academic: e.target.value})} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Research Lab / Group</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} onChange={e=>setFormData({...formData, lab: e.target.value})} /></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Experience & Skill</h3>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Patents (Comma separated)</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} onChange={e=>setFormData({...formData, patents: e.target.value})} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Publications</label><textarea style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} rows="3"></textarea></div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Startup Details <span style={{color:'red'}}>*</span></h3>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Startup Name</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} /></div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Industry</label>
                <select style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}>
                  <option>Battery Materials</option>
                  <option>Steel & Ferrous Metallurgy</option>
                  <option>Corrosion & Surfaces</option>
                  <option>Additive Manufacturing</option>
                </select>
              </div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Structured Problem Statement</label><textarea style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} rows="4"></textarea></div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Technology & IP Details <span style={{color:'red'}}>*</span></h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Patent Status</label>
                <select style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}>
                  <option>Filed</option><option>Published</option><option>Granted</option><option>None</option>
                </select>
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>TRL Level: {formData.trl}</label>
                <input type="range" min="1" max="9" value={formData.trl} onChange={e=>setFormData({...formData, trl: e.target.value})} style={{width:'100%'}} />
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Prototype Status</label>
                <select style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}>
                  <option>Concept</option><option>Lab</option><option>Pilot</option><option>Industry</option>
                </select>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Commercial Layer</h3>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Cost Reduction Estimation (%)</label><input type="number" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Revenue Model</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Goal Funding Required</label><input type="text" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} /></div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Documents & Proofs</h3>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Pitch Deck (PDF)</label><input type="file" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} /></div>
              <div style={{marginBottom: '16px'}}><label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Demo Video (MP4)</label><input type="file" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} /></div>
            </div>
          )}

          {step === 8 && (
            <div>
              <h3 style={{marginBottom: '24px', fontSize: '24px'}}>Visibility & Privacy</h3>
              <div style={{marginBottom: '16px'}}>
                <label style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', cursor:'pointer'}}>
                   <input type="radio" value="Public" checked={formData.visibility==='Public'} onChange={()=>setFormData({...formData, visibility: 'Public'})} />
                   Public (Viewable by all logged-in investors)
                </label>
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', cursor:'pointer'}}>
                   <input type="checkbox" checked={formData.ndaRequired} onChange={e=>setFormData({...formData, ndaRequired: e.target.checked})} />
                   Require NDA before viewing Technical Docs
                </label>
              </div>
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px'}}>
            {step > 1 ? (
              <button className="btn btn-outline" onClick={handlePrev}>Back</button>
            ) : <div></div>}
            
            {step < 8 ? (
              <button className="btn btn-primary" onClick={handleNext}>Next Step</button>
            ) : (
              <button className="btn btn-primary" style={{background: '#1E8E3E'}} onClick={submitOnboarding}>Complete Onboarding</button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
