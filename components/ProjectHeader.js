import DataUsageIcon from '@mui/icons-material/DataUsage'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'

import Link from 'next/link'

import styles from '@/styles/ProjectHeader.module.css'
import { useRouter } from 'next/router'

export default function ProjectHeader({ proj, otherProjects }) {
  const projId = proj.id
  const router = useRouter()

  const isReportPage =
    router.pathname === '/projects/report/[id]' ||
    router.pathname === '/projects/report2/[id]' ||
    router.pathname === '/projects/report3/[id]' ||
    router.pathname === '/projects/report4/[id]' ||
    router.pathname === '/projects/report5/[id]'

  const whitelabel = proj.user.user_white_label_reports

  const reportIconLink = whitelabel ? 'report' : 'report2'

  return (
    <header className={styles.project_header}>
      <div className={styles.project_header_wrapper}>
        <div className={styles.project_header_name}>
          {/* <span>{proj.project_name}</span> */}
        </div>

        <div className={styles.project_header_nav}>
          <Link href={`/projects/${projId}`}>
            <a className={styles.project_header_link} id='calculator_link'>
              {router.pathname === '/projects/[id]' && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
      #calculator_link { font-size: 1.0rem; color: #3bacb0;}
      #calculator_icon {  color: #3bacb0;}
    `,
                  }}
                />
              )}
              <ViewQuiltIcon id='calculator_icon' />
              <span>Calculator</span>
            </a>
          </Link>
          <Link href={`/projects/summary/${projId}`}>
            <a className={styles.project_header_link} id='summary_link'>
              {router.pathname === '/projects/summary/[id]' && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
      #summary_link { font-size: 1.0rem; color: #3bacb0;}
      #summary_icon {  color: #3bacb0;}
    `,
                  }}
                />
              )}
              <DataUsageIcon id='summary_icon' />
              <span>Summary</span>
            </a>
          </Link>

          <Link href={`/projects/${reportIconLink}/${projId}`}>
            <a className={styles.project_header_link} id='report_link'>
              {isReportPage && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
      #report_link { font-size: 1.0rem; color: #3bacb0;}
      #report_icon {  color: #3bacb0;}
    `,
                  }}
                />
              )}
              <SignalCellularAltIcon id='report_icon' />
              <span>Report</span>
            </a>
          </Link>
          <Link href={`/projects/notes/${projId}`}>
            <a className={styles.project_header_link} id='notes_link'>
              {router.pathname === '/projects/notes/[id]' && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
      #notes_link { font-size: 1.0rem; color: #3bacb0;}
      #notes_icon {  color: #3bacb0;}
    `,
                  }}
                />
              )}
              <AssignmentIcon id='notes_icon' />
              <span>Notes</span>
            </a>
          </Link>
        </div>
      </div>
    </header>
  )
}
