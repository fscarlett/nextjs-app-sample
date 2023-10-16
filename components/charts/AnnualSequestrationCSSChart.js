import { adaptMath } from '@/calc/formulas'
import { screenNan } from '@/helpers/index'
import styles from '@/styles/CssCharts.module.css'

export default function AnnualSequestrationCSSChart({ values }) {
  // let mulchCarbon = adaptMath.wood_chip_mulch_total_value(values) * 619
  // let compostCarbon = adaptMath.compost_total_value(values) * 466

  // let initialTotal = mulchCarbon + compostCarbon

  const annualCalc = {
    shrubs: {
      subtotal: adaptMath
        .woody_plantings_total_value(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.woody_plantings_total_value(values) * 100) /
          adaptMath.annual_sequestration_rate(values)
      ).toFixed(1),
    },

    grasses: {
      subtotal: adaptMath
        .grass_plantings_total_value(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.grass_plantings_total_value(values) * 100) /
          adaptMath.annual_sequestration_rate(values)
      ).toFixed(1),
    },

    turf: {
      subtotal: adaptMath
        .turf_plantings_total_value(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.turf_plantings_total_value(values) * 100) /
          adaptMath.annual_sequestration_rate(values)
      ).toFixed(1),
    },

    trees: {
      subtotal: adaptMath.trees_subtotal(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.trees_subtotal(values) * 100) /
          adaptMath.annual_sequestration_rate(values)
      ).toFixed(1),
    },
  }

  const annualDonutDegrees = {
    shrubs: {
      start: 0,
      end: (annualCalc.shrubs.percent / 100) * 360,
    },
    grasses: {
      start: (annualCalc.shrubs.percent / 100) * 360,
      end:
        ((annualCalc.shrubs.percent * 1 + annualCalc.grasses.percent * 1) /
          100) *
        360,
    },
    turf: {
      start:
        ((annualCalc.shrubs.percent * 1 + annualCalc.grasses.percent * 1) /
          100) *
        360,
      end:
        ((annualCalc.shrubs.percent * 1 +
          annualCalc.grasses.percent * 1 +
          annualCalc.turf.percent * 1) /
          100) *
        360,
    },
    trees: {
      start:
        ((annualCalc.shrubs.percent * 1 +
          annualCalc.grasses.percent * 1 +
          annualCalc.turf.percent * 1) /
          100) *
        360,
      end:
        ((annualCalc.shrubs.percent * 1 +
          annualCalc.grasses.percent * 1 +
          annualCalc.turf.percent * 1 +
          annualCalc.trees.percent * 1) /
          100) *
        360,
    },
  }

  return (
    <div className={styles.amchart_wrapper}>
      <div className={styles.summary_chart_wrapper}>
        <div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
      #annual_donut { background: conic-gradient(
        #ccd7bc 0deg ${annualDonutDegrees.shrubs.end}deg,
        #69964d ${annualDonutDegrees.grasses.start}deg ${annualDonutDegrees.grasses.end}deg,
        #c9e99c ${annualDonutDegrees.turf.start}deg ${annualDonutDegrees.turf.end}deg,
        #5a703b ${annualDonutDegrees.trees.start}deg ${annualDonutDegrees.trees.end}deg
      ); }
    `,
            }}
          />
          <div className={styles.donut} id='annual_donut'>
            <div className={styles.hole}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
