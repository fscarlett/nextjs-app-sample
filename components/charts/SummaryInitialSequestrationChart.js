import { useEffect } from 'react'
// import dynamic from 'next/dynamic'

import { adaptMath } from '@/calc/formulas'
// import { constants } from '@/calc/constants'
import styles from '@/styles/SummaryCharts.module.css'

export default function SummaryInitialSequestrationChart({ values }) {
  // AM Charts
  useEffect(() => {
    ;(async () => {
      const am5 = await import('@amcharts/amcharts5')
      am5.addLicense('AM5C340827854')
      const am5percent = await import('@amcharts/amcharts5/percent')
      const root = await am5.Root.new('initialChartDiv')
      const initialChart = await root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalHorizontal,
          // radius: am5.percent(97),
          innerRadius: am5.percent(65),
        })
      )

      let initialdata = [
        {
          source: 'Mulch',
          carbon: (adaptMath.wood_chip_mulch_total_value(values) * 619).toFixed(
            0
          ),
          sliceSettings: {
            fill: am5.color(0x645a4d),
          },
        },
        {
          source: 'Compost',
          carbon: (adaptMath.compost_total_value(values) * 466).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xd1b79b),
          },
        },
      ]

      let series = initialChart.series.push(
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

      series.data.setAll(initialdata)
    })()
  }, [])

  return (
    <div className={styles.summary_amchart_wrapper}>
      <div id='initialChartDiv' className={styles.summary_amchart_root}></div>
    </div>
  )
}
