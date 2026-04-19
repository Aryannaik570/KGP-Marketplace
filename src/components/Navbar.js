'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/auth/me')
      .then(async res => {
        if (!res.ok) return null;
        try { return await res.json(); } catch(e) { return null; }
      })
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(e => console.error(e));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/1280px-IIT_Kharagpur_Logo.svg.png" alt="IIT Kharagpur Logo" className={styles.logoMark} />
          <div className={styles.logoText}>
            <strong>IIT KGP</strong> <span className={styles.light}>TechTransfer</span>
          </div>
        </Link>
        <div className={styles.navLinks}>
          <Link href={user ? "/technologies" : "/login?redirect=/technologies"}>Technologies</Link>
          <Link href={user ? "/startups" : "/login?redirect=/startups"}>Startups</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#about">About</Link>
        </div>
        <div className={styles.navActions} style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div 
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', 
                  background: 'var(--iit-blue)', color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 'bold', fontSize: '18px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                title={user.fullName}
              >
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              {user.role === 'INVESTOR' && (
                <Link href="/dashboard/investor" className="btn btn-primary" style={{padding: '6px 12px', fontSize: '12px'}}>Investor Dashboard</Link>
              )}
              {user.role === 'FOUNDER' && (
                <Link href="/dashboard/founder" className="btn btn-primary" style={{padding: '6px 12px', fontSize: '12px'}}>Founder Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline" style={{padding: '6px 12px', fontSize: '12px'}}>Log Out</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline" style={{padding: '8px 16px', fontSize: '14px'}}>Sign In</Link>
              <Link href="/signup" className="btn btn-primary" style={{padding: '8px 16px', fontSize: '14px'}}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
