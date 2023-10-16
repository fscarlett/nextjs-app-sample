import Link from 'next/link'

import { adaptMath } from '@/calc/formulas'

import TotalEmissionsCSSChart from './charts/TotalEmissionsCSSChart'
import styles from '@/styles/TotalEmissionsCard.module.css'
import ZeroPlaceholderDonutChart from './charts/ZeroPlaceholderDonutChart'

export default function TotalEmissionsCard({ values, proj }) {
  let zeroEmissions = adaptMath.total_carbon(values) == 0 ? true : false

  return (
    <div className={styles.total_emissions_card}>
      <div className={styles.mini_summary_info_wrapper}>
        <h2>Total Carbon Emissions</h2>
        <p className={styles.mini_summary_value}>
          {adaptMath
            .total_carbon(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <div className={styles.carbon_pounds_label}>Carbon Pounds</div>
      </div>
      <div className={styles.mini_summary_chart_wrapper}>
        <Link href={`/projects/charts/emissions/${proj.id}`}>
          <div className={styles.mini_emissions_chart_container}>
            {zeroEmissions && <ZeroPlaceholderDonutChart />}

            {!zeroEmissions && (
              <TotalEmissionsCSSChart values={values}></TotalEmissionsCSSChart>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
