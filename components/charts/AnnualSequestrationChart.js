import { useEffect } from 'react'
// import dynamic from 'next/dynamic'

import { adaptMath } from '@/calc/formulas'
// import { constants } from '@/calc/constants'
import styles from '@/styles/SummaryCharts.module.css'

export default function AnnualSequestrationChart({ values }) {
  // AM Charts
  useEffect(() => {
    ;(async () => {
      const am5 = await import('@amcharts/amcharts5')
      am5.addLicense('AM5C340827854')
      const am5percent = await import('@amcharts/amcharts5/percent')
      const root = await am5.Root.new('annualChartDiv')
      const annualChart = await root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalHorizontal,
          // radius: am5.percent(97),
          innerRadius: am5.percent(65),
        })
      )

      let annualdata = [
        {
          source: 'Shrubs',
          carbon: adaptMath.woody_plantings_total_value(values).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xccd7bc),
          },
        },
        {
          source: 'Grasses',
          carbon: adaptMath.grass_plantings_total_value(values).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x69964d),
          },
        },
        {
          source: 'Turf',
          carbon: adaptMath.turf_plantings_total_value(values).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xc9e99c),
          },
        },
        {
          source: 'Trees',
          carbon: adaptMath.trees_subtotal(values).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x5a703b),
          },
        },
      ]

      let series = annualChart.series.push(
        am5percent.PieSeries.new(root, {
          name: 'Series',
          valueField: 'carbon',
          categoryField: 'source',
        })
      )

      series.slices.template.setAll({
        // fillOpacity: 0.9,
        stroke: am5.color(0xffffff),
        strokeWidth: 0.1,
        templateField: 'sliceSettings',
      })

      series.labels.template.set('forceHidden', true)

      series.data.setAll(annualdata)
    })()
  }, [])

  return (
    <div className={styles.amchart_wrapper}>
      <div id='annualChartDiv' className={styles.amchart_root}></div>
    </div>
  )
}
