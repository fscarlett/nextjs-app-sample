import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import Link from 'next/link'

import { API_URL } from '@/config/index'
import SubcatBarElement from './SubcatBarElement'
import styles from '@/styles/GroupBarChart.module.css'

export default function GroupBarChart({ ig, proj }) {
  const project_data = proj.inputs_data

  const [values, setValues] = useState({
    ...project_data,
  })

  const subcats = ig.subcategories
  const iconUrl = `/images/${ig.group}.png`

  return (
    <div className={styles.group_barchart_card}>
      <Link href={`/projects/charts/group/${proj.id}?group=${ig.group}`}>
        <div className={styles.group_detail_link}>
          <div className={styles.group_barchart_logo_wrapper}>
            <Image
              className={styles.barchart_icon}
              src={iconUrl}
              height={50}
              width={50}
              name='hardscape'
            />
          </div>
          <div className={styles.group_barchart_info_wrapper}>
            <h2 className={styles.group_barchart_h2}>{ig.group}</h2>
            <p className={styles.group_barchart_total}>
              {ig.totalCarbon} pounds
            </p>
            <p></p>

            <div className={styles.subcat_bars_wrapper}>
              {subcats.map((sub) => (
                <SubcatBarElement key={sub.id} subcat={sub} />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
