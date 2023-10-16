import Link from 'next/link'

import styles from '@/styles/ProjectItem.module.css'

export default function ProjectItem({ proj }) {
  return (
    <div className={styles.card}>
      <Link href={`/projects/${proj.id}`} passHref>
        <h3>{proj.project_name}</h3>
      </Link>
    </div>
  )
}
