import { constants } from '@/calc/constants'

import styles from '@/styles/GrowthZoneCard.module.css'

export default function GrowthZoneCard({ bioregion }) {
  return (
    <div className={styles.growth_zone_card}>
      <div className={styles.growth_zone}>
        <h2 className={styles.growth_zone_h2}>Global CO2 Average</h2>
        <p>Current: {constants.today_ppm}</p>
      </div>
      <div className={styles.world_map_wrapper}></div>
    </div>
  )
}
