import Link from 'next/link'
import styles from '@/styles/Footer.module.css'

export default function FooterProject({ proj }) {
  const projId = proj.id

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_nav}>
        <Link href={`/projects/summary/${projId}`}>
          <a className={styles.footer_link}>Summary</a>
        </Link>
        <Link href={`/projects/notes/${projId}`}>
          <a className={styles.footer_link}>Notes</a>
        </Link>
        <Link href={`/projects/report/${projId}`}>
          <a className={styles.footer_link}>Report</a>
        </Link>
        <Link href={`/projects/${projId}`}>
          <a className={styles.footer_link}>Calculator</a>
        </Link>
        <Link href='/projects/add'>
          <a className={styles.footer_link}>Create</a>
        </Link>
      </div>
    </footer>
  )
}
