import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import GroupDetailSubcatBarElement from './GroupDetailSubcatBarElement'
import styles from '@/styles/GroupDetailBarChart.module.css'

export default function GroupDetailBarChart({ ig, proj }) {
  const project_data = proj.inputs_data

  const [values, setValues] = useState({
    ...project_data,
  })

  const subcats = ig.subcategories

  return (
    <div className={styles.group_barchart_card}>
      <div className={styles.group_detail_link}>
        <div className={styles.group_barchart_info_wrapper}>
          <p></p>

          <div className={styles.subcat_bars_wrapper}>
            {subcats.map((sub) => (
              <GroupDetailSubcatBarElement key={sub.id} subcat={sub} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
