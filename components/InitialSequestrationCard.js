import Link from 'next/link'

import { adaptMath } from '@/calc/formulas'
// import { adaptConvert } from '../helpers'

import InitialSequestrationCSSChart from './charts/InitialSequestrationCSSChart'
import ZeroPlaceholderDonutChart from './charts/ZeroPlaceholderDonutChart'

import styles from '@/styles/InitialSequestrationCard.module.css'

export default function InitialSequestrationCard({ values, proj }) {
  let zeroSeq = adaptMath.initialSequestration(values) == 0 ? true : false

  return (
    <div className={styles.initial_sequestration_card}>
      <div className={styles.mini_summary_info_wrapper}>
        <h2>Initial Sequestration</h2>
        <p className={styles.mini_summary_value}>
          {adaptMath
            .initialSequestration(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
        </p>
        <div className={styles.carbon_pounds_label}>Carbon Pounds</div>
      </div>
      <div className={styles.mini_summary_chart_wrapper}>
        <Link href={`/projects/charts/initial/${proj.id}`}>
          <div className={styles.mini_emissions_chart_container}>
            {zeroSeq && <ZeroPlaceholderDonutChart />}
            {!zeroSeq && (
              <InitialSequestrationCSSChart
                values={values}
              ></InitialSequestrationCSSChart>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
