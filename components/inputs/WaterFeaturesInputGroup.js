import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Info } from '@mui/icons-material'
import TimerIcon from '@mui/icons-material/Timer'

import { useRouter } from 'next/router'

import { formatPercentage, screenNan } from '@/helpers/index'
import { adaptMath } from '@/calc/formulas'
import { API_URL } from '@/config/index'
import styles from '@/styles/Inputs.module.css'
import { Button, TextField, Tooltip, Box, MenuItem } from '@mui/material'
import SubcatBarElement from '../SubcatBarElement'
import SETCard from '../SETCard'
import InputGroupRightColumn from '../InputGroupRightColumn'

export default function WaterFeaturesInputGroup({ proj, token }) {
  const router = useRouter()
  const project_data = proj.inputs_data

  // precalcs null set to 0 - vewy impawtant
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

  const project_payload = {}
  // const bioregion = proj.bioregion

  const [values, setValues] = useState({
    ...project_data,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (value >= 0) {
      setValues({ ...values, [name]: value })
    }
  }

  const handleUOMChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  // saves data on input blur
  const handleInputAutosave = async (e) => {
    e.preventDefault()

    const targetName = e.target.name
    const oldValue = project_data[targetName]
    const newValue = values[targetName]

    if (oldValue !== newValue) {
      project_payload.inputs_data = values

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
        // console.log('saved to DB')
      }
    }
    return
  }

  // create objects of all the subcategory labels, pounds, and percentages
  const subcategories = [
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Water Features</h2>
        <p>Plants, pumps, plastic and stone, it all adds up.</p>

        <div id='water_feature_precalc' className={styles.subcategory_wrapper}>
          <div>
            <h3>
              <span className={styles.timer_icon}>
                <TimerIcon fontSize='large'></TimerIcon>
              </span>
              <span className={styles.time_saver}>Time Saver </span>{' '}
              Precalculated Pond System
            </h3>
          </div>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_pond'>
                  <Tooltip
                    title='4 ft. deep, 10 ft. long, 8 ft. wide, (500 sq. ft.) EPDM liner 45 mil. (20 ft.) 1 in. PVC Sch. 40 pipe, (100 ft.) 2 in. PVC Sch. 40 pipe, (4) 1 in. PVC ball valve, (4) 2 in. PVC ball valve, (1) 2 inch check valve, (1) pump sm. 300 GPH, (1) plastic prefab spillway, (1) plastic prefab pondless chamber system, (1) plastic skimmer, (2 US Tons) local stone, (1.5 US Tons) 3/4 inch clean gravel, (5) mortar 80 lb bags, (20) 1 gal. potted plants, (5) 5 gal. potted plants.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    10ft Diameter Pond
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='precalc_pond'
                  id='precalc_pond'
                  min='0'
                  max='9999'
                  step='0.1'
                  value={values.precalc_pond}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>One Complete System</div>
            </div>

            {/* end of precalc inputs */}

            <div className={styles.input_set}></div>
          </div>

          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_water} ${styles.precalc_color_bar}`}
          ></div>
        </div>

        <div
          id='water_features_infrastructure'
          className={styles.subcategory_wrapper}
        >
          <h3>Infrastructure</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pvc_liner_20'>
                  <Tooltip
                    title='Choose your liner type and enter the square footage here.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>PVC Liner 20 mil</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='pvc_liner_20'
                  id='pvc_liner_20'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pvc_liner_20}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pvc_liner_20_uom'
                  id='pvc_liner_20_uom'
                  value={values.pvc_liner_20_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='m2'>Square Meters</option>
                  <option value='hectare'>Hectares</option>
                  <option value='km2'>Square Kilometers</option>
                  <option value='sqin'>Square Inches</option>
                  <option value='sqyd'>Square Yards</option>
                  <option value='sqft'>Square Feet</option>
                  <option value='acre'>Acres</option>
                  <option value='sqmi'>Square Miles</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .pvc_liner_20_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.pvc_liner_20_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='epdm_liner_45'>
                  <Tooltip
                    title='Choose your liner type and enter the square footage here.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>EPDM Liner 45 mil</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='epdm_liner_45'
                  id='epdm_liner_45'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.epdm_liner_45}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='epdm_liner_45_uom'
                  id='epdm_liner_45_uom'
                  value={values.epdm_liner_45_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='m2'>Square Meters</option>
                  <option value='hectare'>Hectares</option>
                  <option value='km2'>Square Kilometers</option>
                  <option value='sqin'>Square Inches</option>
                  <option value='sqyd'>Square Yards</option>
                  <option value='sqft'>Square Feet</option>
                  <option value='acre'>Acres</option>
                  <option value='sqmi'>Square Miles</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .epdm_liner_45_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.epdm_liner_45_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pvc_sch_pipe_1'>
                  <Tooltip
                    title='Simply enter the quantity of pipe and metric choice here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='pvc_sch_pipe_1'
                  id='pvc_sch_pipe_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pvc_sch_pipe_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pvc_sch_pipe_1_uom'
                  id='pvc_sch_pipe_1_uom'
                  value={values.pvc_sch_pipe_1_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='cm'>Centimeters</option>
                  <option value='m'>Meters</option>
                  <option value='km'>Kilometers</option>
                  <option value='in'>Inches</option>
                  <option value='yd'>Yards</option>
                  <option value='ft'>Feet</option>
                  <option value='mi'>Miles</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .pvc_sch_pipe_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.pvc_sch_pipe_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pvc_sch_pipe_2'>
                  <Tooltip
                    title='Simply enter the quantity of pipe and metric choice here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>2 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pvc_sch_pipe_2'
                  id='pvc_sch_pipe_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pvc_sch_pipe_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pvc_sch_pipe_2_uom'
                  id='pvc_sch_pipe_2_uom'
                  value={values.pvc_sch_pipe_2_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='cm'>Centimeters</option>
                  <option value='m'>Meters</option>
                  <option value='km'>Kilometers</option>
                  <option value='in'>Inches</option>
                  <option value='yd'>Yards</option>
                  <option value='ft'>Feet</option>
                  <option value='mi'>Miles</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .pvc_sch_pipe_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.pvc_sch_pipe_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pvc_ball_valve_1'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 inch PVC ball valve</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pvc_ball_valve_1'
                  id='pvc_ball_valve_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pvc_ball_valve_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .pvc_ball_valve_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.pvc_ball_valve_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pvc_ball_valve_2'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>2 inch PVC ball valve</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pvc_ball_valve_2'
                  id='pvc_ball_valve_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pvc_ball_valve_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .pvc_ball_valve_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.pvc_ball_valve_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='check_valve_2'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>2 inch check valve</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='check_valve_2'
                  id='check_valve_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.check_valve_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .check_valve_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.check_valve_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pump_sm_300'>
                  <Tooltip
                    title='Please pick the horespower that is closest to what you are using. If it is even larger than our options, you can combine until you get to the horsepower you need.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Pump Sm. 300 GPH</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pump_sm_300'
                  id='pump_sm_300'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pump_sm_300}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .pump_sm_300_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.pump_sm_300_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pump_md_7300'>
                  <Tooltip
                    title='Please pick the horespower that is closest to what you are using. If it is even larger than our options, you can combine until you get to the horsepower you need.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Pump Md. 7300 GPH</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pump_md_7300'
                  id='pump_md_7300'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pump_md_7300}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .pump_md_7300_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.pump_md_7300_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pump_lg_10000'>
                  <Tooltip
                    title='Please pick the horespower that is closest to what you are using. If it is even larger than our options, you can combine until you get to the horsepower you need.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Pump Lg. 10,000 GPH</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pump_lg_10000'
                  id='pump_lg_10000'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pump_lg_10000}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .pump_lg_10000_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.pump_lg_10000_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='prefab_spill'>
                  <Tooltip
                    title='Enter the quantity you used or plan to use'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Plastic Prefab spill way</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='prefab_spill'
                  id='prefab_spill'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.prefab_spill}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .prefab_spill_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.prefab_spill_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='prefab_pondless'>
                  <Tooltip
                    title='Enter the quantity you used or plan to use'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Plastic Prefab pondless chamber system</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='prefab_pondless'
                  id='prefab_pondless'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.prefab_pondless}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .prefab_pondless_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.prefab_pondless_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='plastic_skimmer'>
                  <Tooltip
                    title='Enter the quantity you used or plan to use'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Plastic Skimmer</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='plastic_skimmer'
                  id='plastic_skimmer'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.plastic_skimmer}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .plastic_skimmer_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.plastic_skimmer_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_water}`}
          >
            <h4>Infrastructure Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.wf_infrastructure_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(
                  adaptMath.wf_infrastructure_percentage(values)
                ).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        <div id='water_features_stone' className={styles.subcategory_wrapper}>
          <h3>Stone</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='wf_local_stone'>
                  <Tooltip
                    title='Local stone refers to stone mined within 100 miles of your project. The delivery to your project site is in addition to this number and still needs to be calulated in the Deliveries Input Catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Local Stone</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='wf_local_stone'
                  id='wf_local_stone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.wf_local_stone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='wf_local_stone_uom'
                  id='wf_local_stone_uom'
                  value={values.wf_local_stone_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='kg'>Kilograms</option>
                  <option value='tonne'>Metric Tonnes</option>
                  <option value='oz'>Ounces</option>
                  <option value='lb'>Pounds</option>
                  <option value='ton'>US Tons</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .wf_local_stone_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Stone:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.wf_local_stone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='wf_imported_stone'>
                  <Tooltip
                    title='Imported stone refers to stone mined within 1000 miles of your project. The delivery to your project site is in addition to this number and still needs to be calulated in the Deliveries Input Catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Imported Stone</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='wf_imported_stone'
                  id='wf_imported_stone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.wf_imported_stone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='wf_imported_stone_uom'
                  id='wf_imported_stone_uom'
                  value={values.wf_imported_stone_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='kg'>Kilograms</option>
                  <option value='tonne'>Metric Tonnes</option>
                  <option value='oz'>Ounces</option>
                  <option value='lb'>Pounds</option>
                  <option value='ton'>US Tons</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .wf_imported_stone_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Stone:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.wf_imported_stone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='clean_gravel_3_4'>
                  <Tooltip
                    title='Enter the quantity you used or plan to use'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3/4 inch clean Gravel </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='clean_gravel_3_4'
                  id='clean_gravel_3_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.clean_gravel_3_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='clean_gravel_3_4_uom'
                  id='clean_gravel_3_4_uom'
                  value={values.clean_gravel_3_4_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='kg'>Kilograms</option>
                  <option value='tonne'>Metric Tonnes</option>
                  <option value='oz'>Ounces</option>
                  <option value='lb'>Pounds</option>
                  <option value='ton'>US Tons</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .clean_gravel_3_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Stone:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.clean_gravel_3_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='mortar_80'>
                  <Tooltip
                    title='Enter the quantity you used or plan to use'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Mortar 80 pound bags</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='mortar_80'
                  id='mortar_80'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.mortar_80}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .mortar_80_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Stone: </p>
                  <p>
                    {screenNan(
                      adaptMath.mortar_80_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_water}`}
          >
            <h4>Stone Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.plumbing_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.plumbing_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>

        <div id='water_features_plants' className={styles.subcategory_wrapper}>
          <h3>Plants</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='plants_1'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Plants 1 gal potted plants</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='plants_1'
                  id='plants_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.plants_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .plants_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plants:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.plants_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='plants_5'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Plants 5 gal potted plants</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='plants_5'
                  id='plants_5'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.plants_5}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .plants_5_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plants:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.plants_5_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_water}`}
          >
            <h4>Plants Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.plants_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.plants_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.summary_wrapper}>
        <div className={styles.summary}>
          <div className={styles.summary_column_1}>
            <div className={styles.set_card}>
              <SETCard values={values}></SETCard>
            </div>
            <div className={styles.group_bar_card}>
              <h2>Water Features Subcategories</h2>

              <div className={styles.subcat_bars_wrapper}>
                {subcategories.map((sub) => (
                  <SubcatBarElement key={sub.id} subcat={sub} />
                ))}
              </div>
              <div className={styles.group_bar_precalc_note}>
                Note: Precalcs are not included in bar chart
              </div>
            </div>
            <div className={styles.group_totals_card}>
              <h2>Water Features Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .water_features_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>

                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.water_features_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.water_features_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.water_features_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(1)}
                    {'%'}
                  </p>
                  <div className={styles.group_totals_label}>
                    % of Emissions
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.summary_column_2}>
            <InputGroupRightColumn
              proj={proj}
              values={values}
            ></InputGroupRightColumn>
          </div>
        </div>
      </div>
    </div>
  )
}
