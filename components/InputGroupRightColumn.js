// import { adaptMath } from '@/calc/formulas'
// import { constants } from '@/calc/constants'

import GrowthZoneCard from './GrowthZoneCard'
import TotalEmissionsCard from './TotalEmissionsCard'
import InitialSequestrationCard from './InitialSequestrationCard'
import AnnualSequestrationCard from './AnnualSequestrationCard'

import styles from '@/styles/Inputs.module.css'

export default function InputGroupRightColumn({ values, proj }) {
  return (
    <div className={styles.input_group_right_column_wrapper}>
      <div className={styles.growth_zone_wrapper}>
        <GrowthZoneCard bioregion={proj.bioregion}></GrowthZoneCard>
      </div>

      <div className={styles.total_emissions_wrapper}>
        <TotalEmissionsCard values={values} proj={proj}></TotalEmissionsCard>
      </div>
      <div className={styles.initial_sequestration_wrapper}>
        <InitialSequestrationCard
          values={values}
          proj={proj}
        ></InitialSequestrationCard>
      </div>
      <div className={styles.annual_sequestration_wrapper}>
        <AnnualSequestrationCard
          values={values}
          proj={proj}
        ></AnnualSequestrationCard>
      </div>
    </div>
  )
}
