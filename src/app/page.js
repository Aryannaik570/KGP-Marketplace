import Link from 'next/link';
import TechCard from '../components/TechCard';
import { technologies, startups } from '../data/mock';
import styles from './page.module.css';

export default function Home() {
  const featuredTech = technologies.slice(0, 3);
  const featuredStartups = startups.slice(0, 3);

  return (
    <div className={styles.wrapper}>
      {/* HERO SECTION */}
      <section className={styles.hero} style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(15,58,112,0.95), rgba(0,0,0,0.8)), url(/hero.png)' }}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>From Research to Revenue.<br/>From Innovation to Investment.</h1>
          <p className={styles.heroSubtitle}>
            Access India's most powerful deep-tech pipeline from IIT Kharagpur — patents, technologies, and startups ready for commercialization and scale.
          </p>
          <div className={styles.heroActions}>
            <Link href="/login?redirect=/technologies" className="btn btn-primary" style={{backgroundColor: '#FFC107', color: '#1C1E21', transition: 'all 0.2s', padding: '16px 24px', fontSize: '16px'}}>Explore Technologies</Link>
            <Link href="/login?redirect=/startups" className="btn btn-outline" style={{borderColor: 'white', color: 'white', borderWidth: '2px', padding: '16px 24px', fontSize: '16px'}}>Discover Startups</Link>
            <Link href="/signup?role=investor" className="btn btn-primary" style={{backgroundColor: 'var(--iit-blue-light)', padding: '16px 24px', fontSize: '16px'}}>Investor Access</Link>
          </div>
          <div className={styles.trustMetrics}>
            <div className={styles.metric}><strong>450+</strong><span>Patents Filed</span></div>
            <div className={styles.metric}><strong>120+</strong><span>Patents Granted</span></div>
            <div className={styles.metric}><strong>60+</strong><span>Tech Transfers</span></div>
            <div className={styles.metric}><strong>2000+</strong><span>Startups Supported</span></div>
            <div className={styles.metric}><strong>115+</strong><span>Active Incubations</span></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: VALUE PROPOSITION */}
      <section className={styles.valueProps}>
        <div className="container">
          <div className={styles.splitGrid}>
            <div className={styles.valueCard} style={{borderTop: '4px solid var(--iit-blue)'}}>
              <div className={styles.iconBox}>🧪</div>
              <h2 className={styles.valueTitle}>Acquire Breakthrough Technologies</h2>
              <p className={styles.valueSubtitle}>FOR COMPANIES / INDUSTRY</p>
              <ul className={styles.valueList}>
                <li>Access TRL-validated research</li>
                <li>License patents from IIT ecosystem</li>
                <li>Reduce R&D cost and time-to-market</li>
                <li>Direct collaboration with researchers</li>
              </ul>
              <Link href="/login?redirect=/technologies" className="btn btn-outline">Browse Technologies</Link>
            </div>
            
            <div className={styles.valueCard} style={{borderTop: '4px solid var(--accent)', background: 'var(--graphite)', color: 'white'}}>
              <div className={styles.iconBox}>🚀</div>
              <h2 className={styles.valueTitle} style={{color: 'white'}}>Invest in High-Potential Startups</h2>
              <p className={styles.valueSubtitle} style={{color: 'var(--steel)'}}>FOR INVESTORS / VCs</p>
              <ul className={styles.valueList}>
                <li>Curated deal flow from IIT Kharagpur</li>
                <li>Deep-tech, SaaS, climate, materials, AI</li>
                <li>Founder + research-backed ventures</li>
                <li>Early access to innovation pipeline</li>
              </ul>
              <Link href="/login?redirect=/startups" className="btn btn-primary" style={{backgroundColor: 'var(--accent)', color: 'var(--graphite)'}}>Explore Startups</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className={styles.howItWorks} id="process">
        <div className="container">
          <h2 className={styles.sectionTitle} style={{textAlign: 'center'}}>How It Works</h2>
          <div className={styles.stepGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Discover</h3>
              <p>Browse technologies or startups by sector, TRL, stage</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Evaluate</h3>
              <p>Access technical briefs, validation data, founders</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Engage</h3>
              <p>Connect, invest, license, or collaborate</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TECHNOLOGY SHOWCASE */}
      <section className={styles.showcaseVariant}>
        <div className="container">
          <div className={styles.sectionHeader}>
             <h2 className={styles.sectionTitle}>Technology Showcase</h2>
             <Link href="/login" className={styles.sectionLink}>View Full Technology Directory &rarr;</Link>
          </div>
          <div className={styles.gatedGrid}>
            {featuredTech.map((tech, i) => (
              <div key={tech.id} className={i === 0 ? '' : styles.blurredCardWrapper}>
                <TechCard tech={tech} />
                {i > 0 && (
                  <div className={styles.blurredOverlay}>
                    <div className={styles.lockIcon}>🔒</div>
                    <span>Sign in to unlock<br/>technology details</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: STARTUP SHOWCASE */}
      <section className={styles.showcaseVariant} style={{background: 'var(--off-white)'}}>
        <div className="container">
          <div className={styles.sectionHeader}>
             <h2 className={styles.sectionTitle}>Startup Showcase</h2>
             <Link href="/login" className={styles.sectionLink}>Explore All Startups &rarr;</Link>
          </div>
          <div className={styles.gatedGrid}>
            {featuredStartups.map((startup, i) => (
              <div key={startup.id} className={i === 0 ? styles.startupCard : `${styles.startupCard} ${styles.blurredCardWrapper}`}>
                 <div>
                   <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span className="badge badge-orange">Pre-Seed</span>
                      <span className="badge badge-blue">Materials</span>
                   </div>
                   <h3 style={{ fontSize: '20px', color: 'var(--iit-blue)', marginBottom: '12px' }}>{startup.name}</h3>
                   <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{startup.problem}</p>
                   <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                     <span style={{ fontWeight: 600 }}>Traction:</span> {startup.traction}
                   </div>
                   <div style={{ fontSize: '14px', marginBottom: '24px' }}>
                     <span style={{ fontWeight: 600 }}>Ask:</span> {startup.ask}
                   </div>
                   <button className="btn btn-outline" style={{ width: '100%' }}>View Startup</button>
                 </div>
                 {i > 0 && (
                   <div className={styles.blurredOverlay}>
                     <div className={styles.lockIcon}>🔒</div>
                     <span>Sign in to unlock<br/>startup metrics</span>
                   </div>
                 )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY IIT KHARAGPUR */}
      <section className={styles.whyIit} id="about">
        <div className="container">
           <div className={styles.splitGridAlt}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>India&#39;s Deep-Tech Powerhouse</h2>
                <ul className={styles.featureList}>
                   <li><strong>Strong pipeline:</strong> Seamless research-to-commercialization channel.</li>
                   <li><strong>Ecosystem:</strong> Industry collaborations & research park frameworks.</li>
                   <li><strong>Success rate:</strong> Proven startup success & alumni-led unicorns.</li>
                   <li><strong>Resources:</strong> Access to top-tier faculty, labs, and modern infrastructure.</li>
                </ul>
              </div>
              <div className={styles.imageContent} style={{backgroundImage: 'url(/lab.png)'}}></div>
           </div>
        </div>
      </section>

      {/* SECTION 7: LOGIN / SIGNUP FLOW ENTRY */}
      <section className={styles.gateway}>
        <div className="container">
           <h2 className={styles.sectionTitle} style={{textAlign: 'center', color: 'white'}}>Join the Innovation Ecosystem</h2>
           <div className={styles.splitGrid} style={{maxWidth: '800px', margin: '0 auto'}}>
              <div className={styles.gatewayCard}>
                 <h3>Founder / Researcher</h3>
                 <p>List your technology or startup</p>
                 <p>Access industry & funding opportunities</p>
                 <Link href="/signup?role=founder" className="btn btn-primary" style={{marginTop: '24px', width: '100%'}}>Continue as Founder</Link>
              </div>
              <div className={styles.gatewayCard}>
                 <h3>Company / Investor</h3>
                 <p>Discover technologies</p>
                 <p>Invest in startups</p>
                 <Link href="/signup?role=investor" className="btn btn-outline" style={{marginTop: '24px', width: '100%'}}>Continue as Investor</Link>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className={styles.finalCta}>
         <div className="container" style={{textAlign: 'center'}}>
            <h2 className={styles.heroTitle} style={{color: 'var(--iit-blue)'}}>Where Innovation Meets Capital</h2>
            <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px'}}>
               <Link href="/signup?role=founder" className="btn btn-primary" style={{padding: '16px 32px', fontSize: '18px'}}>Get Started</Link>
               <button className="btn btn-outline" style={{padding: '16px 32px', fontSize: '18px'}}>Schedule a Demo</button>
            </div>
         </div>
      </section>
    </div>
  );
}
