import { useState, useEffect, useRef } from 'react'
// import dynamic from 'next/dynamic'

import { adaptMath } from '@/calc/formulas'
// import { constants } from '@/calc/constants'
import styles from '@/styles/SummaryCharts.module.css'

export default function TotalEmissionsChart({ values, proj, totalCarbon }) {
  const chart_data = proj.inputs_data

  const [chartValues, setChartValues] = useState({
    ...chart_data,
  })

  const chartRef = useRef()

  // AM Charts
  useEffect(() => {
    ;(async () => {
      const am5 = await import('@amcharts/amcharts5')
      am5.addLicense('AM5C340827854')
      const am5percent = await import('@amcharts/amcharts5/percent')
      const root = await am5.Root.new('emissionsChartDiv')
      const emissionsChart = await root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalHorizontal,
          // radius: am5.percent(97),
          innerRadius: am5.percent(65),
          labels: 'none',
        })
      )

      let emissionsdata = [
        {
          source: 'Hardscape',
          carbon: adaptMath.hardscape_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xa8a9ab),
          },
        },
        {
          source: 'Grading',
          carbon: adaptMath.land_clearing_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xee7c43),
          },
        },
        {
          source: 'Drainage',
          carbon: adaptMath.drainage_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x205582),
          },
        },
        {
          source: 'Irrigation',
          carbon: adaptMath.irrigation_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x2f3dd6),
          },
        },
        {
          source: 'Rain',
          carbon: adaptMath.rainwater_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x5b92f6),
          },
        },
        {
          source: 'Lighting',
          carbon: adaptMath.lighting_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xeea842),
          },
        },
        {
          source: 'Water Features',
          carbon: adaptMath.water_features_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x0485a7),
          },
        },
        {
          source: 'Plant Material',
          carbon: adaptMath.plant_material_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x6f9844),
          },
        },
        {
          source: 'Soils',
          carbon: adaptMath.soils_mulching_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x5a3304),
          },
        },
        {
          source: 'Transportation',
          carbon: adaptMath.transportation_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0x6d649a),
          },
        },
        {
          source: 'Deliveries',
          carbon: adaptMath.deliveries_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xe26352),
          },
        },
        {
          source: 'Equipment',
          carbon: adaptMath.equipment_total(chartValues).toFixed(0),
          sliceSettings: {
            fill: am5.color(0xac2548),
          },
        },
      ]

      let series = emissionsChart.series.push(
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

      series.data.setAll(emissionsdata)

      chartRef.current = emissionsChart

      return () => {
        root.dispose()
      }
    })()
  }, [chartValues])

  // useEffect(() => {
  //   chartRef.current.set('totalCarbon', totalCarbon)
  // }, [totalCarbon])

  return (
    <div className={styles.amchart_wrapper}>
      <div id='emissionsChartDiv' className={styles.amchart_root}></div>
    </div>
  )
}
