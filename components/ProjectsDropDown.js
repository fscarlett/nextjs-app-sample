import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

import styles from '@/styles/ProjectsDropDown.module.css'

export default function ProjectsDropDown({ proj, allProjects }) {
  const projId = proj.id

  const router = useRouter()

  const [show, setShow] = useState(false)

  let temp = false

  const handleButton = () => {
    temp = !show
    setShow(temp)
  }

  const handleNavigate = (dest) => {
    router.push(`/projects/${dest}`)
    setShow(false)
    setTimeout(() => {
      router.reload()
    }, 2000)
  }

  return (
    <div className={styles.dropdown_wrapper}>
      <button onClick={handleButton} className={styles.dropdown_button}>
        {proj.project_name}{' '}
        {!show ? (
          <span>
            <KeyboardArrowDownIcon fontSize='medium' />
          </span>
        ) : (
          <span>
            <KeyboardArrowUpIcon fontSize='medium' />
          </span>
        )}
      </button>
      {show && (
        <div className={styles.dropdown_list}>
          {allProjects
            .filter((el, index) => {
              return index < 8
            })
            .map((project) => (
              <div
                onClick={() => handleNavigate(project.id)}
                key={project.id}
                className={styles.dropdown_item}
              >
                {project.project_name}
              </div>
            ))}
          <div>
            <Link href={`/projects/edit/${projId}`}>
              <a className={styles.dropdown_item}>
                <EditIcon /> Project Details
              </a>
            </Link>
          </div>
          <div>
            <Link href='/projects/add'>
              <a className={styles.dropdown_item}>
                <AddIcon /> New Project
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
