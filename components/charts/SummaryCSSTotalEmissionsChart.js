import { adaptMath } from '@/calc/formulas'
// import { constants } from '@/calc/constants'
import { screenNan } from '@/helpers/index'
import styles from '@/styles/CssCharts.module.css'

export default function TotalEmissionsCSSChart({ values }) {
  const emissionsCalc = {
    total_carbon_emissions: adaptMath
      .total_carbon(values)
      .toLocaleString(undefined, { maximumFractionDigits: 0 }),

    hardscape: {
      subtotal: adaptMath.hardscape_total(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.hardscape_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },

    grading: {
      subtotal: adaptMath
        .land_clearing_total(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.land_clearing_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    drainage: {
      subtotal: adaptMath.drainage_total(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.drainage_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    irrigation: {
      subtotal: adaptMath.irrigation_total(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.irrigation_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    rain: {
      subtotal: adaptMath.rainwater_total(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.rainwater_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    lighting: {
      subtotal: adaptMath.lighting_total(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.lighting_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    water: {
      subtotal: adaptMath
        .water_features_total(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.water_features_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    plants: {
      subtotal: adaptMath
        .plant_material_total(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.plant_material_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    soils: {
      subtotal: adaptMath
        .soils_mulching_total(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.soils_mulching_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    transportation: {
      subtotal: adaptMath
        .transportation_total(values)
        .toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      percent: screenNan(
        (adaptMath.transportation_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    deliveries: {
      subtotal: adaptMath.deliveries_total(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.deliveries_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
    equipment: {
      subtotal: adaptMath.equipment_total(values).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      percent: screenNan(
        (adaptMath.equipment_total(values) * 100) /
          adaptMath.total_carbon(values)
      ).toFixed(1),
    },
  }

  const emissionsDonutDegrees = {
    hardscape: {
      start: 0,
      end: (emissionsCalc.hardscape.percent / 100) * 360,
    },
    grading: {
      start: (emissionsCalc.hardscape.percent / 100) * 360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1) /
          100) *
        360,
    },
    drainage: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1) /
          100) *
        360,
    },
    irrigation: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1) /
          100) *
        360,
    },
    rain: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1) /
          100) *
        360,
    },
    lighting: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1) /
          100) *
        360,
    },
    water: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1) /
          100) *
        360,
    },
    plants: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1) /
          100) *
        360,
    },
    soils: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1 +
          emissionsCalc.soils.percent * 1) /
          100) *
        360,
    },
    transportation: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1 +
          emissionsCalc.soils.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1 +
          emissionsCalc.soils.percent * 1 +
          emissionsCalc.transportation.percent * 1) /
          100) *
        360,
    },
    deliveries: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1 +
          emissionsCalc.soils.percent * 1 +
          emissionsCalc.transportation.percent * 1) /
          100) *
        360,
      end:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1 +
          emissionsCalc.soils.percent * 1 +
          emissionsCalc.transportation.percent * 1 +
          emissionsCalc.deliveries.percent * 1) /
          100) *
        360,
    },
    equipment: {
      start:
        ((emissionsCalc.hardscape.percent * 1 +
          emissionsCalc.grading.percent * 1 +
          emissionsCalc.drainage.percent * 1 +
          emissionsCalc.irrigation.percent * 1 +
          emissionsCalc.rain.percent * 1 +
          emissionsCalc.lighting.percent * 1 +
          emissionsCalc.water.percent * 1 +
          emissionsCalc.plants.percent * 1 +
          emissionsCalc.soils.percent * 1 +
          emissionsCalc.transportation.percent * 1 +
          emissionsCalc.deliveries.percent * 1) /
          100) *
        360,
      end: emissionsCalc.total_carbon_emissions ? 360 : 0,
    },
  }

  return (
    <div className={styles.amchart_wrapper}>
      <div className={styles.big_summary_chart_wrapper}>
        <div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
      #emissions_donut { background: conic-gradient(
        #a9a8ab 0deg ${emissionsDonutDegrees.hardscape.end}deg,
        #ee7c43 ${emissionsDonutDegrees.grading.start}deg ${emissionsDonutDegrees.grading.end}deg,
        #205582 ${emissionsDonutDegrees.drainage.start}deg ${emissionsDonutDegrees.drainage.end}deg,
        #2f3dd6 ${emissionsDonutDegrees.irrigation.start}deg ${emissionsDonutDegrees.irrigation.end}deg,
        #5b92f6 ${emissionsDonutDegrees.rain.start}deg ${emissionsDonutDegrees.rain.end}deg,
        #eea842 ${emissionsDonutDegrees.lighting.start}deg ${emissionsDonutDegrees.lighting.end}deg,
        #0485a7 ${emissionsDonutDegrees.water.start}deg ${emissionsDonutDegrees.water.end}deg,
        #6f9844 ${emissionsDonutDegrees.plants.start}deg ${emissionsDonutDegrees.plants.end}deg,
        #5a3304 ${emissionsDonutDegrees.soils.start}deg ${emissionsDonutDegrees.soils.end}deg,
        #6d649a ${emissionsDonutDegrees.transportation.start}deg ${emissionsDonutDegrees.transportation.end}deg,
        #e26352 ${emissionsDonutDegrees.deliveries.start}deg ${emissionsDonutDegrees.deliveries.end}deg,
        #ac2548 ${emissionsDonutDegrees.equipment.start}deg ${emissionsDonutDegrees.equipment.end}deg 
      );}
    `,
            }}
          />
          <div className={styles.big_donut} id='emissions_donut'>
            <div className={styles.big_hole}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
