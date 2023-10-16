import Link from 'next/link'

import { adaptMath } from '@/calc/formulas'

import AnnualSequestrationCSSChart from './charts/AnnualSequestrationCSSChart'
import ZeroPlaceholderDonutChart from './charts/ZeroPlaceholderDonutChart'

import styles from '@/styles/AnnualSequestrationCard.module.css'

export default function AnnualSequestrationCard({ values, proj }) {
  let zeroAnnualSeq =
    adaptMath.annual_sequestration_rate(values) == 0 ? true : false

  return (
    <div className={styles.annual_sequestration_card}>
      <div className={styles.mini_summary_info_wrapper}>
        <h2>Annual Sequestration</h2>
        <p className={styles.mini_summary_value}>
          {adaptMath
            .annual_sequestration_rate(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
        </p>
        <div className={styles.carbon_pounds_label}>Carbon Pounds</div>
      </div>
      <div className={styles.mini_summary_chart_wrapper}>
        <Link href={`/projects/charts/annual/${proj.id}`}>
          <div className={styles.mini_emissions_chart_container}>
            {zeroAnnualSeq && <ZeroPlaceholderDonutChart />}

            {!zeroAnnualSeq && (
              <AnnualSequestrationCSSChart
                values={values}
              ></AnnualSequestrationCSSChart>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
