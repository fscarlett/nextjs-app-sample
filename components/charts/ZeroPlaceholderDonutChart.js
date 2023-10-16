// import Image from 'next/image'

import styles from '@/styles/CssCharts.module.css'

export default function ZeroPlaceholderDonutChart() {
  return (
    <div className={styles.placeholder_donut_wrapper}>
      <div className={styles.placeholder_donut_circle}>
        <div className={styles.placeholder_hole}></div>

        {/* <Image
        className={styles.zero_placeholder_donut_image}
        src='/images/empty-donut.png'
        height={140}
        width={200}
        name='zero'
      /> */}
      </div>
    </div>
  )
}
