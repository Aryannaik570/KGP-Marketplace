'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState(null);

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 10000); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        // If there's a redirect parameter, go there; otherwise go to role dashboard
        if (redirectTo) {
          window.location.href = redirectTo;
        } else if (data.role === 'FOUNDER') {
          window.location.href = '/dashboard/founder';
        } else if (data.role === 'COMPANY') {
          window.location.href = '/dashboard/company';
        } else {
          window.location.href = '/dashboard/investor';
        }
      } else {
        showError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      showError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
      
      {errorMsg && (
        <div style={{position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', background: '#D93025', color: 'white', padding: '16px 32px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: '500'}}>
          {errorMsg}
        </div>
      )}

      <div style={{background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', border: '1px solid var(--border)'}}>
        <h2 style={{fontSize: '24px', color: 'var(--iit-blue)', marginBottom: '24px', textAlign: 'center'}}>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px'}}>Email</label>
            <input required type="email" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)'}} value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
          </div>
          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px'}}>Password</label>
            <input required type="password" style={{width:'100%', padding:'12px', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)'}} value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default function LoginFlow() {
  return (
    <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
