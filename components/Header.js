import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import styles from '@/styles/Header.module.css'
import MainNavFlyout from './MainNavFlyout'

export default function Header() {
  const router = useRouter()

  const isHome =
    router.pathname === '/' || router.pathname === '/account/dashboard'

  const isLogin = router.pathname === '/account/register'

  const isCalculator = router.pathname === '/projects/[id]'

  const chartUrls = [
    '/projects/charts/emissions/[id]',
    '/projects/charts/annual/[id]',
    '/projects/charts/initial/[id]',
    '/projects/charts/group/[id]',
  ]
  const isChart = chartUrls.includes(router.pathname)

  const projectUrls = [
    '/projects/summary/[id]',
    '/projects/edit/[id]',
    '/projects/details/[id]',
    '/projects/notes/[id]',
    '/projects/report-show/[id]',
    '/projects/report-wait/[id]',
    '/projects/report-export-wait/[id]',
    '/projects/report-export-show/[id]',
  ]
  const isProject = projectUrls.includes(router.pathname)

  const stripeUrls = [
    '/account/thank-you',
    '/account/plan-thank-you',
    '/account/forgot-thank-you',
  ]
  const isStripe = stripeUrls.includes(router.pathname)

  const goBack = (e) => {
    e.preventDefault()
    router.back()
  }

  return (
    <header className={styles.header}>
      <MainNavFlyout />

      <div className={styles.logo}>
        <Link href='/'>
          <a>
            <Image
              className={styles.input_group_nav_icon}
              src='/images/lcclogolight.png'
              height={34}
              width={34}
              name='logo'
            ></Image>
          </a>
        </Link>{' '}
      </div>

      <div className={styles.backlink}>
        {!isHome &&
          !isLogin &&
          !isCalculator &&
          !isProject &&
          !isChart &&
          !isStripe && (
            <a onClick={goBack} href='#'>
              <ArrowBackIosRoundedIcon />
              <span>Back</span>
            </a>
          )}
      </div>
    </header>
  )
}
