import { useState, useContext } from 'react'
import Link from 'next/link'
import AuthContext from '@/context/AuthContext'
import styles from '@/styles/MainNavFlyout.module.css'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// import MenuIcon from '@mui/icons-material/Menu'
import SortIcon from '@mui/icons-material/SortRounded'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode'
// import PaymentIcon from '@mui/icons-material/Payment'
// import SettingsIcon from '@mui/icons-material/Settings'
import HelpIcon from '@mui/icons-material/Help'
import EmailIcon from '@mui/icons-material/Email'
import PolicyIcon from '@mui/icons-material/Policy'
import DescriptionIcon from '@mui/icons-material/Description'
import MenuBookIcon from '@mui/icons-material/MenuBook'

export default function MainNavFlyout({ proj }) {
  const { user, logout } = useContext(AuthContext)

  let freeUser = false

  if (user) {
    freeUser =
      user.subscription_tier.id == 2 || user.subscription_tier == 2
        ? true
        : false
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }
  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <div className={styles.flyout_nav}>
      <Button onClick={openDrawer}>
        <SortIcon fontSize='large' className={styles.menu_icon} />
      </Button>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Box
          sx={{
            width: 300,
            height: 1000,
            backgroundColor: '#192138',
            color: '#fff',
          }}
          role='presentation'
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
        >
          <Button onClick={closeDrawer}>
            <CloseIcon />
          </Button>

          <h2 className={styles.username}>Bond</h2>
          <ul className={styles.ul}>
            <li>
              <Link href='/account/dashboard'>
                <a className={styles.flyout_nav_link}>
                  <DashboardIcon />
                  <span>Dashboard</span>
                </a>
              </Link>
            </li>
            {!freeUser && (
              <li>
                <Link href='/account/profile'>
                  <a className={styles.flyout_nav_link}>
                    <AccountCircleIcon />
                    <span>Company Profile</span>
                  </a>
                </Link>
              </li>
            )}
            <li>
              <Link href='/account'>
                <a className={styles.flyout_nav_link}>
                  <ChromeReaderModeIcon />
                  <span>Account</span>
                </a>
              </Link>
            </li>
            {/* <li>
              <Link href='/account/billing'>
                <a className={styles.flyout_nav_link}>
                  <PaymentIcon />
                  <span>Billing</span>
                </a>
              </Link>
            </li> */}
            {/* <li>
              <Link href='/account/settings'>
                <a className={styles.flyout_nav_link}>
                  <SettingsIcon />
                  <span>Settings</span>
                </a>
              </Link>
            </li> */}
          </ul>

          <Divider />

          <ul className={styles.ul}>
            <li>
              <Link href='https://intercom.help/sandboxc6/en' passHref>
                <a
                  className={styles.flyout_nav_link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <HelpIcon />
                  <span>Help Center</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href='https://sandboxc6.com/white-papers/' passHref>
                <a
                  className={styles.flyout_nav_link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <MenuBookIcon />
                  <span>Citations</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href='https://www.sandboxc6.com/contact-us'>
                <a
                  className={styles.flyout_nav_link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <EmailIcon />
                  <span>Contact Us</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href='/privacy-policy'>
                <a className={styles.flyout_nav_link}>
                  <PolicyIcon />
                  <span>Privacy Policy</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href='/terms-of-service'>
                <a className={styles.flyout_nav_link}>
                  <DescriptionIcon />
                  <span>Terms of Service</span>
                </a>
              </Link>
            </li>
          </ul>

          <Divider />
          <ul className={styles.ul}>
            <li>
              <button
                onClick={() => logout()}
                className={styles.flyout_nav_logout_button}
              >
                <LogoutIcon /> <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </Box>
      </Drawer>
    </div>
  )
}
