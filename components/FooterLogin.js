import Image from 'next/image'
import styles from '@/styles/Footer.module.css'

export default function FooterLogin() {
  return (
    <footer className={styles.admin_footer}>
      <div className={styles.auth_footer}>
        {/* <p>A SandBox™ product</p> */}
        <div className={styles.footer_brand_wrapper}>
          <a
            href='https://www.sandboxc6.com'
            target='_blank'
            rel='noreferrer'
            className={styles.footer_sandbox_link}
          >
            <span>a </span>
            <Image
              src='https://res.cloudinary.com/elder-creek/image/upload/v1662184390/Sandbox_Name_TM_Reversed_RGB_CROP_uaeqsq.png'
              height={31}
              width={147}
            />{' '}
            <span>product</span>
          </a>
        </div>
        <div className={styles.copyright}>
          Copyright ©2020 - 2023 Elder Creek Landscapes, Inc.
        </div>
      </div>
    </footer>
  )
}
