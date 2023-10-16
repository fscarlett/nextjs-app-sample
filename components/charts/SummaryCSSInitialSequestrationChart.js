import { adaptMath } from '@/calc/formulas'
import { precalcConstants } from '@/calc/precalcConstants'

// import { constants } from '@/calc/constants'
// import { screenNan } from '@/helpers/index'
import styles from '@/styles/CssCharts.module.css'

export default function InitialSequestrationChart({ values }) {
  let precalcMulchCarbon =
    values.precalc_planter_3ft_groundcover *
      precalcConstants.planter_bed_3_initial_woodchips +
    values.precalc_planter_mixed_perennial_1000sqft *
      precalcConstants.planter_bed_perennial_initial_woodchips

  let precalcCompostCarbon =
    values.precalc_planter_3ft_groundcover *
      precalcConstants.planter_bed_3_initial_compost +
    values.precalc_planter_mixed_perennial_1000sqft *
      precalcConstants.planter_bed_perennial_initial_compost

  let mulchCarbon =
    adaptMath.wood_chip_mulch_total_value(values) * 619 + precalcMulchCarbon
  let compostCarbon =
    adaptMath.compost_total_value(values) * 466 + precalcCompostCarbon

  let initialTotal = mulchCarbon + compostCarbon
  let mulchFraction = (mulchCarbon / initialTotal).toFixed(9)
  let compostFraction = (compostCarbon / initialTotal).toFixed(9)

  return (
    <div className={styles.amchart_wrapper}>
      <div className={styles.big_summary_chart_wrapper}>
        <div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
      #initial_donut { background: conic-gradient(
        #645a4d 0deg ${mulchFraction * 360}deg,
        #d1b79b ${mulchFraction * 360}deg 360deg
      );}
    `,
            }}
          />
          <div className={styles.big_donut} id='initial_donut'>
            <div className={styles.big_hole}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
