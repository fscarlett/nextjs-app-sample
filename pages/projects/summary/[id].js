import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import cookie from 'cookie'
import { parseCookies, screenNan } from '@/helpers/index'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

import { TextField, Tooltip } from '@mui/material'
import { Info } from '@mui/icons-material'

import Layout from '@/components/Layout'
import ProjectHeader from '@/components/ProjectHeader'
import ProjectsDropDown from '@/components/ProjectsDropDown'
import SETCardSummary from '@/components/SETCardSummary'
import SETCardImprove from '@/components/SETCardImprove'
import GroupBarChartSummary from '@/components/GroupBarChartSummary'

import ImproveProjectCSSChart from '@/components/charts/ImproveProjectCSSChart'

import { API_URL } from '@/config/index'
import { adaptMath } from '@/calc/formulas'
import { adaptConvert } from '@/helpers/index'
import { constants } from '@/calc/constants'
import { precalcConstants } from '@/calc/precalcConstants'
import styles from '@/styles/Summary.module.css'

import SummaryCSSTotalEmissionsChart from '@/components/charts/SummaryCSSTotalEmissionsChart'
import SummaryCSSInitialSequestrationChart from '@/components/charts/SummaryCSSInitialSequestrationChart'
import SummaryCSSAnnualSequestrationChart from '@/components/charts/SummaryCSSAnnualSequestrationChart'
// import ZeroPlaceholderDonutChart from '@/components/charts/ZeroPlaceholderDonutChart'

export default function ProjectSummaryPage({ proj, token, user, allProjects }) {
  const router = useRouter()

  allProjects.sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))

  let otherProjects = allProjects.filter(
    (p) => p.project_name != proj.project_name
  )

  const project_data = proj.inputs_data

  // precalcs null set to 0 for old projects
  if (!project_data.precalc_5k_rcsys) {
    project_data.precalc_5k_rcsys = 0
  }
  if (!project_data.precalc_bluebarrel) {
    project_data.precalc_bluebarrel = 0
  }
  if (!project_data.precalc_pond) {
    project_data.precalc_pond = 0
  }
  if (!project_data.precalc_150_watt) {
    project_data.precalc_150_watt = 0
  }
  if (!project_data.precalc_600_watt) {
    project_data.precalc_600_watt = 0
  }

  if (!project_data.precalc_single_valve_drip_manifold) {
    project_data.precalc_single_valve_drip_manifold = 0
  }
  if (!project_data.precalc_three_valve_drip_manifold) {
    project_data.precalc_three_valve_drip_manifold = 0
  }

  if (!project_data.precalc_grading_1_acre) {
    project_data.precalc_grading_1_acre = 0
  }
  if (!project_data.precalc_grading_10k_sqft) {
    project_data.precalc_grading_10k_sqft = 0
  }
  if (!project_data.precalc_grading_1k_sqft) {
    project_data.precalc_grading_1k_sqft = 0
  }
  // planter beds
  if (!project_data.precalc_planter_3ft_groundcover) {
    project_data.precalc_planter_3ft_groundcover = 0
  }
  if (!project_data.precalc_planter_mixed_perennial_1000sqft) {
    project_data.precalc_planter_mixed_perennial_1000sqft = 0
  }

  const project_seq_years = proj.desired_years_sequestration
  const project_payload = {}

  const [values, setValues] = useState({
    ...project_data,
  })

  const [years, setYears] = useState(project_seq_years)

  let zeroEmissions = adaptMath.total_carbon(values) == 0 ? true : false
  let zeroSeq = adaptMath.initialSequestration(values) == 0 ? true : false
  let zeroAnnualSeq =
    adaptMath.annual_sequestration_rate(values) == 0 ? true : false

  const handleSeqInputChange = (e) => {
    const yearsValue = e.target.value
    if (yearsValue > 0) {
      setYears(yearsValue)
    }
  }

  const handleInputAutosave = async (e) => {
    e.preventDefault()

    project_payload.desired_years_sequestration = years

    const res = await fetch(`${API_URL}/projects/${proj.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project_payload),
    })

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('This action is not authorized')
        return
      }
      toast.error('Data could not be saved.')
    } else {
      const proj = await res.json()
    }
  }

  // improve your project ============================================================================

  const increase_sequestration_total = function (values, targetYears) {
    let totalCarbon = adaptMath.total_carbon(values)

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

    let initialSequestration =
      adaptConvert(values.compost, values.compost_uom, 'yd') * 466 +
      precalcCompostCarbon +
      adaptConvert(values.wood_chip_mulch, values.wood_chip_mulch_uom, 'yd') *
        619 +
      precalcMulchCarbon

    let annualSequestrationRate = adaptMath.annual_sequestration_rate(values)

    let netCarbonEmission = totalCarbon - initialSequestration

    let yearsToDrawDown = netCarbonEmission / annualSequestrationRate

    if (targetYears > 0 && targetYears < yearsToDrawDown) {
      return netCarbonEmission / targetYears - annualSequestrationRate
    } else {
      return '0'
    }
  }

  const reduce_emissions_total = function (values, targetYears) {
    var totalCarbon = adaptMath.total_carbon(values)

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

    var initialSequestration =
      adaptConvert(values.compost, values.compost_uom, 'yd') * 466 +
      precalcCompostCarbon +
      adaptConvert(values.wood_chip_mulch, values.wood_chip_mulch_uom, 'yd') *
        619 +
      precalcMulchCarbon

    var netCarbonEmission = totalCarbon - initialSequestration

    var annualSequestrationRate = adaptMath.annual_sequestration_rate(values)

    var yearsToDrawDown = netCarbonEmission / annualSequestrationRate

    if (targetYears > 0 && targetYears < yearsToDrawDown) {
      return -annualSequestrationRate * targetYears + netCarbonEmission
    } else {
      return '0'
    }
  }

  let seqTotal = increase_sequestration_total(values, years)
  let emissionsTotal = reduce_emissions_total(values, years)

  let incr_seq_percent =
    (increase_sequestration_total(values, years) * 100) /
    reduce_emissions_total(values, years)

  // =================================== end imporove your project

  // array of all input groups
  const inputGroups = [
    {
      group: 'hardscape',
      totalCarbon: adaptMath
        .hardscape_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'hardscape',
          label: 'Walls',
          subtotal: adaptMath
            .walls_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .walls_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'hardscape',
          label: 'Wall Veneers',
          subtotal: adaptMath
            .wall_stone_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .wall_stone_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'hardscape',
          label: 'Mortared Flat Work',
          subtotal: adaptMath
            .mortared_flat_work_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .mortared_flat_work_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 4,
          group: 'hardscape',
          label: 'Drylay Flat Work',
          subtotal: adaptMath
            .drylay_flat_work_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .drylay_flat_work_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 5,
          group: 'hardscape',
          label: 'Dry Stack',
          subtotal: adaptMath
            .dry_stack_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .dry_stack_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 6,
          group: 'hardscape',
          label: 'Edging',
          subtotal: adaptMath
            .edging_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .edging_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 7,
          group: 'hardscape',
          label: 'Additional',
          subtotal: adaptMath
            .additional_hardscape_materials_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .additional_hardscape_materials_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'grading',
      totalCarbon: adaptMath
        .land_clearing_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'grading',
          label: 'Grasses / Forbes',
          subtotal: adaptMath
            .area_total_value(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: screenNan(
            adaptMath.area_total_percentage(values)
          ).toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'grading',
          label: 'Wooded',
          subtotal: adaptMath
            .grading_wooded_total_value(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: screenNan(
            adaptMath.grading_wooded_total_percentage(values)
          ).toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'grading',
          label: 'Shrubs',
          subtotal: adaptMath
            .grading_shrubs_total_value(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: screenNan(
            adaptMath.grading_shrubs_total_percentage(values)
          ).toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'drainage',
      totalCarbon: adaptMath
        .drainage_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'drainage',
          label: 'Drainage Components',
          subtotal: adaptMath
            .di_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .di_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'drainage',
          label: 'Drainage Pipe',
          subtotal: adaptMath
            .dp_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .dp_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'drainage',
          label: 'Aggregates',
          subtotal: adaptMath
            .aggregates_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .aggregates_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'irrigation',
      totalCarbon: adaptMath
        .irrigation_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'irrigation',
          label: 'Irrigation Piping',
          subtotal: adaptMath
            .pipping_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .pipping_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'irrigation',
          label: 'Irrigation Infrastructure Components',
          subtotal: adaptMath
            .infrastructure_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .infrastructure_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'irrigation',
          label: 'Drip',
          subtotal: adaptMath
            .drip_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .drip_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'rain',
      totalCarbon: adaptMath
        .rainwater_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'rain',
          label: 'Tank',
          subtotal: adaptMath
            .tank_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .tank_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'rain',
          label: 'Plumbing Components',
          subtotal: adaptMath
            .plumbing_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .plumbing_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'rain',
          label: 'Pump',
          subtotal: adaptMath
            .pump_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .pump_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'lighting',
      totalCarbon: adaptMath
        .lighting_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'lighting',
          label: 'Fixtures',
          subtotal: adaptMath
            .fixtures_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .fixtures_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'lighting',
          label: 'Infrastructure',
          subtotal: adaptMath
            .lighting_infrastructure_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .lighting_infrastructure_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'water',
      totalCarbon: adaptMath
        .water_features_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'water',
          label: 'Infrastructure',
          subtotal: adaptMath
            .wf_infrastructure_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .wf_infrastructure_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'water',
          label: 'Stone',
          subtotal: adaptMath
            .stone_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .stone_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'water',
          label: 'Plants',
          subtotal: adaptMath
            .plants_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .plants_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'plants',
      totalCarbon: adaptMath
        .plant_material_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'plant',
          label: 'Plant Material',
          subtotal: adaptMath
            .plant_material_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .plant_material_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'plant',
          label: 'Gopher Baskets',
          subtotal: adaptMath
            .gopher_baskets_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .gopher_baskets_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'soils',
      totalCarbon: adaptMath
        .soils_mulching_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'soils',
          label: 'Wood Chip Mulch',
          subtotal: adaptMath
            .wood_chip_mulch_total_value(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .wood_chip_mulch_total_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'soils',
          label: 'Soil Imports',
          subtotal: adaptMath
            .soil_imports_total_value(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .soil_imports_total_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'soils',
          label: 'Compost',
          subtotal: adaptMath
            .compost_total_value(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .compost_total_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 4,
          group: 'soils',
          label: 'Paper Mulch',
          subtotal: adaptMath
            .paper_mulch_total_value(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .paper_mulch_total_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'transportation',
      totalCarbon: adaptMath
        .transportation_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'transportation',
          label: 'Daily Construction Trucks',
          subtotal: adaptMath
            .trucks_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .trucks_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'transportation',
          label: 'PM/Owner Miles',
          subtotal: adaptMath
            .owner_miles_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .owner_miles_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 3,
          group: 'transportation',
          label: 'Initial Material Runs',
          subtotal: adaptMath
            .material_runs_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .material_runs_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'deliveries',
      totalCarbon: adaptMath
        .deliveries_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'deliveries',
          label: 'Category 1 Small Truck',
          subtotal: adaptMath
            .cat_1_truck_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .cat_1_truck_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'deliveries',
          label: 'Category 2 Large Diesel',
          subtotal: adaptMath
            .cat_3_truck_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .cat_3_truck_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'equipment',
      totalCarbon: adaptMath
        .equipment_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'equipment',
          label: 'Large Equipment',
          subtotal: adaptMath
            .large_equipment_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .large_equipment_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'equipment',
          label: 'Small Equipment',
          subtotal: adaptMath
            .small_equipment_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .small_equipment_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
    {
      group: 'sequestration',
      totalCarbon: adaptMath
        .sequestration_total(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      subcategories: [
        {
          id: 1,
          group: 'sequestration',
          label: 'Shrubs Perennials and Grasses',
          subtotal: adaptMath
            .shrubs_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .shrubs_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
        {
          id: 2,
          group: 'sequestration',
          label: 'Trees',
          subtotal: adaptMath
            .trees_subtotal(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
          percent: adaptMath
            .trees_percentage(values)
            .toLocaleString(undefined, { maximumFractionDigits: 0 }),
        },
      ],
    },
  ]

  return (
    <Layout>
      <ProjectsDropDown
        proj={proj}
        allProjects={otherProjects}
      ></ProjectsDropDown>
      <ProjectHeader proj={proj}></ProjectHeader>

      <div className={styles.summary_page_container}>
        <div className={styles.summary_header}>
          <ToastContainer />

          <h1>Project Summary</h1>
          <p>
            Select charts below to learn more about the carbon footprint and how
            you can improve your project.
          </p>
        </div>

        <div className={styles.summary_global_section}>
          <div className={styles.global_column1__wrapper}>
            <div className={styles.set_wrapper}>
              <div className={styles.set_card_summary}>
                <SETCardSummary values={values}></SETCardSummary>
              </div>
            </div>
          </div>
          <div className={styles.global_column2__wrapper}>
            <div className={styles.growth_zone_card}>
              <div className={styles.global_co2}>
                <h2>Global CO2 Average</h2>
                <p>{constants.today_ppm}</p>
              </div>
              <div className={styles.world_map_wrapper}></div>
            </div>
          </div>
        </div>
        <div className={styles.summary_donuts_section}>
          <div className={styles.summary_donut_card}>
            <h2>Total Carbon Emissions</h2>
            <p className={styles.summary_total_values}>
              {adaptMath
                .total_carbon(values)
                .toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              pounds
            </p>
            <div className={styles.summary_chart_wrapper}>
              <Link href={`/projects/charts/emissions/${proj.id}`}>
                <div className={styles.mini_emissions_chart_container}>
                  {/* {zeroEmissions && <ZeroPlaceholderDonutChart />} */}

                  {!zeroEmissions && (
                    <SummaryCSSTotalEmissionsChart
                      values={values}
                    ></SummaryCSSTotalEmissionsChart>
                  )}
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.summary_donut_card}>
            <h2>Annual Sequestration</h2>
            <p className={styles.summary_total_values}>
              {adaptMath
                .annual_sequestration_rate(values)
                .toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              pounds
            </p>
            <div className={styles.summary_chart_wrapper}>
              <Link href={`/projects/charts/annual/${proj.id}`}>
                <div>
                  {/* {zeroAnnualSeq && <ZeroPlaceholderDonutChart />} */}

                  {!zeroAnnualSeq && (
                    <SummaryCSSAnnualSequestrationChart
                      values={values}
                    ></SummaryCSSAnnualSequestrationChart>
                  )}
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.summary_donut_card}>
            <h2>Initial Sequestration</h2>
            <p className={styles.summary_total_values}>
              {adaptMath
                .initialSequestration(values)
                .toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              pounds
            </p>
            <div className={styles.summary_chart_wrapper}>
              <Link href={`/projects/charts/initial/${proj.id}`}>
                <div>
                  <div className={styles.mini_emissions_chart_container}>
                    {/* {zeroSeq && <ZeroPlaceholderDonutChart />} */}
                    {!zeroSeq && (
                      <SummaryCSSInitialSequestrationChart
                        values={values}
                      ></SummaryCSSInitialSequestrationChart>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.summary_barcharts_section}>
          <div className={styles.summary_barcharts_wrapper}>
            {inputGroups.map((ig) => (
              <GroupBarChartSummary
                key={ig.group}
                ig={ig}
                proj={proj}
              ></GroupBarChartSummary>
            ))}
          </div>
        </div>
        <div className={styles.summary_improveyourproject_section}>
          <div className={styles.improve_section_header_wrapper}>
            <div className={styles.improve_section_header}>
              <h2>Improve Your Project</h2>
              <p>
                There are two ways to reach sequestration equilibrium, increase
                annual sequestration or reduce emissions. See what your project
                suggestions are by entering desired years below.
              </p>
            </div>
          </div>

          <div className={styles.improve_column_wrapper}>
            <div className={styles.set_card_summary}>
              <SETCardImprove values={values}></SETCardImprove>
            </div>
          </div>

          <div className={styles.improve_column_wrapper}>
            <div className={styles.improve_chart_wrapper}>
              <ImproveProjectCSSChart
                values={values}
                seq={incr_seq_percent}
                seqTotal={seqTotal}
                emissionsTotal={emissionsTotal}
              ></ImproveProjectCSSChart>
            </div>
          </div>

          <div className={styles.improve_column_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='desired_sequester_years'>
                  <Tooltip
                    title='The number of years you want your project to reach sequestration equilibrium.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>When Do You Want To Reach Equilibrium?</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='desired_sequester_years'
                  id='desired_sequester_years'
                  min='0'
                  max='999999'
                  step='0.01'
                  value={years}
                  onChange={handleSeqInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>
            </div>

            <div className={styles.improve_text_wrapper}>
              <p className={styles.improve_result_text}>
                To achieve this goal:{' '}
              </p>

              <div className={styles.iyp_heading_wrapper}>
                <div className={styles.iyp_heading_1_dealie}></div>

                <h3 className={styles.iyp_option_1_heading}>Option 1</h3>
              </div>
              <p className={styles.improve_result_labels}>
                Increase Annual Sequestration by{' '}
                {increase_sequestration_total(values, years).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )}{' '}
                pounds
              </p>
              <div className={styles.iyp_heading_wrapper}>
                <div className={styles.iyp_heading_2_dealie}></div>
                <h3 className={styles.iyp_option_2_heading}>Option 2</h3>
              </div>
              <p className={styles.improve_result_labels}>
                Reduce Emissions by{' '}
                {reduce_emissions_total(values, years).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )}{' '}
                pounds
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

/* -------------------------------------------------------------------------- */
/*                            GET SERVER SIDE PROPS                           */
/* -------------------------------------------------------------------------- */

export async function getServerSideProps({ req, query: { id } }) {
  if (!req.headers.cookie || !cookie.parse(req.headers.cookie).token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { token } = parseCookies(req)

  const userRes = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const user = await userRes.json()

  const res = await fetch(`${API_URL}/projects?id=${id}`)

  if (res.status == 403) {
    console.log('403 forbidden')
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    }
  }

  const projects = await res.json()

  const project = projects[0]
  if (!project || !project.user) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  // ----- get all the users projects to put in nav dropdown  -----------------------------

  const allProjectsRes = await fetch(`${API_URL}/projects/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (allProjectsRes.status == 401) {
    console.log('401 unauthorized')
    // logout()
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (allProjectsRes.status == 403) {
    console.log('403 forbidden')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const fullProjects = await allProjectsRes.json()
  const projectsInfo = []

  fullProjects.map((p) => {
    let pro = {
      id: p.id,
      project_name: p.project_name,
      updated_at: p.updated_at,
    }

    projectsInfo.push(pro)
  })

  return {
    props: {
      proj: project,
      token,
      user,
      allProjects: projectsInfo,
    },
  }
}
