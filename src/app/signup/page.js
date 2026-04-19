'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupFlow() {
  const [roleSelection, setRoleSelection] = useState(null); 
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 10000); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match. Please re-enter carefully.');
      return;
    }
    
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: roleSelection })
      });
      const data = await res.json();
      if (res.ok) {
        setUserId(data.userId);
        setOtpSent(true);
        alert(`For testing purposes, your OTP is: ${data.mockOtp}`);
      } else {
        showError(data.error || 'Registration failed');
      }
    } catch (err) {
        showError('Registration failed due to network error.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp })
    });
    if (res.ok) {
      if (roleSelection === 'FOUNDER') {
        window.location.href = '/onboarding/founder';
      } else if (roleSelection === 'COMPANY') {
        window.location.href = '/dashboard/company';
      } else {
        window.location.href = '/onboarding/investor';
      }
    } else {
      showError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative'}}>
      
      {errorMsg && (
        <div style={{position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', background: '#D93025', color: 'white', padding: '16px 32px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: '500'}}>
          {errorMsg}
        </div>
      )}

      <div style={{background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', border: '1px solid var(--border)'}}>
        
        {!roleSelection ? (
          <div>
            <h2 style={{fontSize: '28px', color: 'var(--iit-blue)', marginBottom: '12px', textAlign: 'center'}}>Join IIT KGP TechTransfer</h2>
            <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px'}}>Select your persona to configure your platform experience.</p>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
              <div onClick={() => setRoleSelection('FOUNDER')} style={{padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', background: 'white', transition: '0.2s'}}>
                <h3 style={{fontSize: '18px'}}>Founder / Inventor</h3>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4'}}>List IP descriptions, track funding rounds, and interact with the ecosystem.</p>
              </div>
              <div onClick={() => setRoleSelection('COMPANY')} style={{padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', background: 'white', transition: '0.2s'}}>
                <h3 style={{fontSize: '18px'}}>Enterprise / Corp</h3>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4'}}>Discover deep-tech IP for licensing, pilot deployments, and R&D synergy.</p>
              </div>
              <div onClick={() => setRoleSelection('INVESTOR')} style={{padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', background: 'white', transition: '0.2s'}}>
                <h3 style={{fontSize: '18px'}}>Investor / VC</h3>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4'}}>Explore student-led spin-outs and fund commercial-ready Deep Tech.</p>
              </div>
            </div>
            <p style={{textAlign: 'center', marginTop: '32px', fontSize: '14px'}}>
              Already have an account? <Link href="/login" style={{color: 'var(--iit-blue)'}}>Sign In</Link>
            </p>
          </div>
        ) : !otpSent ? (
          <div>
            <h2 style={{fontSize: '28px', color: 'var(--iit-blue)', marginBottom: '12px'}}>Create Profile</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Signing up as {roleSelection}. <button type="button" onClick={() => setRoleSelection(null)} style={{background:'none', border:'none', color:'var(--iit-blue)', cursor:'pointer', textDecoration:'underline'}}>Change</button></p>
            
            <form onSubmit={handleRegister}>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px'}}>Full Name</label>
                <input required type="text" style={{width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px'}}>Email Address</label>
                <input required type="email" style={{width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px'}}>Password</label>
                <input required type="password" style={{width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div style={{marginBottom: '32px'}}>
                <label style={{display: 'block', marginBottom: '8px'}}>Re-enter Password</label>
                <input required type="password" style={{width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Continue & Send OTP</button>
            </form>
          </div>
        ) : (
          <div>
            <h2 style={{fontSize: '28px', color: 'var(--iit-blue)', marginBottom: '12px'}}>Verify Email</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>We sent a 6-digit OTP to {formData.email}</p>
            
            <form onSubmit={handleVerifyOtp}>
              <div style={{marginBottom: '32px'}}>
                <label style={{display: 'block', marginBottom: '8px'}}>Enter OTP</label>
                <input required type="text" placeholder="123456" maxLength={6} style={{width: '100%', padding: '16px', fontSize: '24px', letterSpacing: '4px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}} value={otp} onChange={e => setOtp(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', backgroundColor: '#1E8E3E'}}>Verify & Complete Setup</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
