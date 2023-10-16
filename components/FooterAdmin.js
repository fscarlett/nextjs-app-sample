import Image from 'next/image'
import styles from '@/styles/Footer.module.css'

export default function FooterAdmin() {
  return (
    <footer className={styles.admin_footer}>
      <div className={styles.auth_footer}>
        {/* <p>A Sandbox™ product</p> */}
        <div className={styles.footer_brand_wrapper}>
          <span>a </span>
          <Image
            // src='https://res.cloudinary.com/elder-creek/image/upload/v1659828436/sandboxlogowhitetm_x6znvj.png'
            src='https://res.cloudinary.com/elder-creek/image/upload/v1662184390/Sandbox_Name_TM_Reversed_RGB_CROP_uaeqsq.png'
            height={31}
            width={147}
          />{' '}
          <span>product</span>
        </div>
        <div className={styles.copyright}>
          Copyright ©2020 - 2023 Elder Creek Landscapes, Inc.
        </div>
      </div>
    </footer>
  )
}
