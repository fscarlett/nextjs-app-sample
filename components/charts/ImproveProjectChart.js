import { useEffect } from 'react'
// import dynamic from 'next/dynamic'

// import { adaptMath } from '@/calc/formulas'
// import { constants } from '@/calc/constants'
import styles from '@/styles/SummaryCharts.module.css'

export default function ImproveProjectChart({ values, seq }) {
  console.log('seq: ', seq)
  // AM Charts
  useEffect(() => {
    ;(async () => {
      const am5 = await import('@amcharts/amcharts5')
      am5.addLicense('AM5C340827854')
      const am5percent = await import('@amcharts/amcharts5/percent')
      const am5xy = await import('@amcharts/amcharts5/xy')
      const am5radar = await import('@amcharts/amcharts5/radar')

      const root = await am5.Root.new('improveChartDiv')
      const improveChart = await root.container.children.push(
        am5radar.RadarChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'panX',
          wheelY: 'zoomX',
          innerRadius: am5.percent(60),
          startAngle: -90,
          endAngle: 180,
        })
      )
      // bar thickness = innerRadius, MORE is THINNER

      const color1 = '#D36E3B'
      const color2 = '#239C93'

      var data = [
        {
          category: 'Emissions',
          value: 100,
          full: 100,
          columnSettings: {
            fill: am5.color(color1),
          },
        },
        {
          category: 'Sequestration',
          value: seq,
          full: 100,
          columnSettings: {
            fill: am5.color(color2),
          },
        },
      ]

      // Create axes and their renderers
      // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
      var xRenderer = am5radar.AxisRendererCircular.new(root, {
        //minGridDistance: 50
      })

      xRenderer.labels.template.setAll({
        radius: 50,
      })

      xRenderer.grid.template.setAll({
        forceHidden: true,
      })

      var xAxis = improveChart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: xRenderer,
          min: 0,
          max: 100,
          strictMinMax: true,
          numberFormat: "#'%'",
          tooltip: am5.Tooltip.new(root, {}),
        })
      )

      var yRenderer = am5radar.AxisRendererRadial.new(root, {
        minGridDistance: 20,
      })

      yRenderer.labels.template.setAll({
        centerX: am5.p100,
        fontWeight: '500',
        fontSize: 18,
        templateField: 'columnSettings',
      })

      yRenderer.grid.template.setAll({
        forceHidden: true,
      })

      var yAxis = improveChart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'category',
          renderer: yRenderer,
        })
      )

      yAxis.data.setAll(data)

      // Create series
      // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
      var series1 = improveChart.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          clustered: false,
          valueXField: 'full',
          categoryYField: 'category',
          fill: root.interfaceColors.get('alternativeBackground'),
        })
      )

      series1.columns.template.setAll({
        width: am5.p100,
        fillOpacity: 0.08,
        strokeOpacity: 0,
        cornerRadius: 50,
      })

      series1.data.setAll(data)

      var series2 = improveChart.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          clustered: false,
          valueXField: 'value',
          categoryYField: 'category',
        })
      )

      series2.columns.template.setAll({
        width: am5.p100,
        strokeOpacity: 0,
        tooltipText: '{category}: {valueX}%',
        cornerRadius: 50,
        templateField: 'columnSettings',
      })

      series2.data.setAll(data)

      // Animate chart and series in
      // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
      // series1.appear(1000);
      // series2.appear(1000);
      // chart.appear(1000, 100);
    })()
  }, [])

  return (
    <div>
      <div id='improveChartDiv' className={styles.improve_amchart_root}></div>
    </div>
  )
}
