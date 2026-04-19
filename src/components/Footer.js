import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{background: 'var(--graphite)', color: 'white', padding: '60px 0 30px 0'}}>
      <div className="container" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '40px'}}>
        <div>
           <h3 style={{fontSize: '18px', marginBottom: '20px'}}>IIT KGP TechTransfer</h3>
           <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>Connecting Research, Startups, and Capital.</p>
        </div>
        <div>
           <h4 style={{fontSize: '16px', marginBottom: '16px'}}>Ecosystem</h4>
           <ul style={{listStyle:'none', padding:0, fontSize: '14px', color:'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <li><Link href="/">About IIT Kharagpur</Link></li>
              <li><Link href="/">Research Park</Link></li>
              <li><Link href="/">SRIC Office</Link></li>
           </ul>
        </div>
        <div>
           <h4 style={{fontSize: '16px', marginBottom: '16px'}}>Legal</h4>
           <ul style={{listStyle:'none', padding:0, fontSize: '14px', color:'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <li><Link href="/">Privacy Policy</Link></li>
              <li><Link href="/">Terms of Service</Link></li>
              <li><Link href="/">NDA Templates</Link></li>
           </ul>
        </div>
        <div>
           <h4 style={{fontSize: '16px', marginBottom: '16px'}}>Contact</h4>
           <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>techtransfer@iitkgp.ac.in</p>
        </div>
      </div>
      <div className="container" style={{borderTop: '1px solid #333', paddingTop: '30px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)'}}>
        &copy; {new Date().getFullYear()} IIT Kharagpur. All rights reserved.
      </div>
    </footer>
  );
}
