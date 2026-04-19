import Link from 'next/link';
import styles from './TechCard.module.css';
import DeleteTechButton from './DeleteTechButton';

export default function TechCard({ tech }) {
  return (
    <div className={styles.card}>
      {tech.image && (
        <div className={styles.imageContainer} style={{backgroundImage: `url(${tech.image})`}}>
          <div className={styles.trlBadge}>TRL {tech.trl}</div>
        </div>
      )}
      <div className={styles.content}>
        {!tech.image && <div className={styles.trlBadgeInline}>TRL {tech.trl}</div>}
        <div className={styles.meta}>
          <span className="badge badge-blue">{tech.sector}</span>
          <span className="badge badge-green">{tech.patent}</span>
        </div>
        <h3 className={styles.title}>{tech.title}</h3>
        <p className={styles.summary}>{tech.summary}</p>
        <div className={styles.footer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={styles.inventor}>{tech.inventor}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <DeleteTechButton id={tech.id} />
            <Link href={`/technologies/${tech.id}`} className={styles.link}>
              View Details &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
