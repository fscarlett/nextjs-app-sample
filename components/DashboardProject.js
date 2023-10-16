import Link from 'next/link'

import LaunchIcon from '@mui/icons-material/Launch'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'

import styles from '@/styles/DashboardProject.module.css'

export default function DashboardProject({ proj, handleDelete }) {
  let shortDesc =
    proj.description.length < 200
      ? proj.description
      : proj.description.slice(0, 200) + '...'

  return (
    <div className={styles.project}>
      <div className={styles.project_top_row}>
        <h4>
          <Link href={`/projects/${proj.id}`}>
            <a>{proj.project_name}</a>
          </Link>
        </h4>
        <div className={styles.project_dates_wrapper}>
          <div>
            Created
            <span className={styles.date}>
              {new Date(proj.created_at).toLocaleDateString('en-US')}
            </span>
          </div>
          <div>
            Last Edited
            <span className={styles.date}>
              {new Date(proj.updated_at).toLocaleDateString('en-US')}
            </span>
          </div>
        </div>
        <div className={styles.project_info_wrapper}>
          <p className={styles.project_info_item}>
            Client: {proj.project_client_name}
          </p>
        </div>
        <div className={styles.project_description}>
          Description: {shortDesc}
        </div>

        <div className={styles.project_actions_wrapper}>
          <Link href={`/projects/${proj.id}`}>
            <a className={styles.project_actions}>
              <LaunchIcon fontSize='small' /> <span>Open</span>
            </a>
          </Link>

          <Link href={`/projects/details/${proj.id}/?from=dash`}>
            <a className={styles.project_actions}>
              <SearchIcon fontSize='small' /> <span>View Details</span>
            </a>
          </Link>
          <Link href={`/projects/clone/${proj.id}`}>
            <a className={styles.project_actions}>
              <AddToPhotosIcon fontSize='small' /> <span>Clone</span>
            </a>
          </Link>
          <a
            href='#'
            className={styles.project_actions}
            onClick={() => handleDelete(proj.id)}
          >
            {' '}
            <DeleteIcon fontSize='small' /> <span>Delete</span>
          </a>
        </div>
      </div>
    </div>
  )
}
