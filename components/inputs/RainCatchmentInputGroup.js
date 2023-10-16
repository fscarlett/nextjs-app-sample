import { useState } from 'react'
// import ReactDOM from 'react-dom'
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

export default function RainCatchmentInputGroup({ proj, token }) {
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Rain Catchment</h2>
        <p>Validate tank, plumbing, and pump materials.</p>

        <div id='rain_catchment_precalc' className={styles.subcategory_wrapper}>
          <div>
            <h3>
              <span className={styles.timer_icon}>
                <TimerIcon fontSize='large'></TimerIcon>
              </span>
              <span className={styles.time_saver}>Time Saver </span>{' '}
              Precalculated Rain Catchment Systems
            </h3>
          </div>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_bluebarrel'>
                  <Tooltip
                    title='(1) HDPE recycled blue barrel 25 lbs, (1) leaf catcher, (1) first flush device (6ft.) PVC Sch. 40 w/ ball valves, floats & slow drip release, (1) bulkhead 1-2 in, (10 ft.) 2 inch. PVC Sch. 40, (10 ft.) 3 inch PVC Sch. 40, No credit for using recycled content
'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    Blue Barrel System
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='precalc_bluebarrel'
                  id='precalc_bluebarrel'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_bluebarrel}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>One Complete System</div>

              <div>
                {/* <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .precalc_bluebarrel_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div> */}

                {/* <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Tank:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.precalc_bluebarrel_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div> */}
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_5k_rcsys'>
                  <Tooltip
                    title='(1) 5000 gal polytank - pad not included, (2) leaf catchers, (1) first flush device, (60 ft.) PVC. Sch 40 w/ ball valves, floats, and slow drip release, (2) Bulkheads 1-2 in, (10 ft). 1 in. PVC Sch. 40 Pipe, (20 ft.) 2 in. PVC Sch. 40 pipe, (20 ft.) 3 in. PVC Sch. 40 pipe, (1) 1hp Pump - external ground mount steel cased pump, (12 ft. x 12 ft. x 16 in.) base rock pad'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    5000 Gal Catchment System{' '}
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='precalc_5k_rcsys'
                  id='precalc_5k_rcsys'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_5k_rcsys}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>One Complete System</div>

              <div>
                {/* <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .precalc_5k_rcsys_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div> */}
                {/* <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Tank: </p>
                  <p>
                    {screenNan(
                      adaptMath.precalc_5k_rcsys_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div> */}
              </div>
            </div>

            {/* end of precalc inputs */}

            <div className={styles.input_set}></div>
          </div>

          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_rain} ${styles.precalc_color_bar}`}
          ></div>

          {/* <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_rain}`}
          >
            <h4>Precalc Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.tank_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>{screenNan(adaptMath.tank_percentage(values)).toFixed(2)} %</p>
            </div>
          </div> */}
        </div>

        <div id='rain_catchment_tank' className={styles.subcategory_wrapper}>
          <h3>Tank</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='tank_5000'>
                  <Tooltip
                    title='Standard green poly tanks found in the U.S.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>5000 gal poly tank - pad not incl</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='tank_5000'
                  id='tank_5000'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.tank_5000}
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
                      .tank_5000_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Tank:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.tank_5000_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='tank_50000'>
                  <Tooltip
                    title='Larger steel tanks requiring assembly. Includes  12in  thick concrete pad, 2- 2in bulk heads, 6in drain, mosquito screen, padding, liner'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>
                    50,000 gal steel with liner and 12 inch concrete pad{' '}
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='tank_50000'
                  id='tank_50000'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.tank_50000}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .tank_50000_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Tank: </p>
                  <p>
                    {screenNan(
                      adaptMath.tank_50000_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* end of tankkkkkkk */}

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_rain}`}
          >
            <h4>Tank Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.tank_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>{screenNan(adaptMath.tank_percentage(values)).toFixed(2)} %</p>
            </div>
          </div>
        </div>

        <div id='irrigation_components' className={styles.subcategory_wrapper}>
          <h3>Plumbing</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='leaf_catcher'>
                  <Tooltip
                    title='Off the shelf leaf catcher'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Leaf Catcher</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='leaf_catcher'
                  id='leaf_catcher'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.leaf_catcher}
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
                      .leaf_catcher_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.leaf_catcher_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='first_flush_device'>
                  <Tooltip
                    title='Includes 6ft of PVC Sch. 40 with ball valves, floats and slow drip release.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>
                    First flush Device - 6 ft PVC Sch. 40 with ball valves,
                    floats and slow drip release
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='first_flush_device'
                  id='first_flush_device'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.first_flush_device}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .first_flush_device_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plumbing: </p>
                  <p>
                    {screenNan(
                      adaptMath.first_flush_device_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='bulkheads'>
                  <Tooltip
                    title='This is for 1in or 2in bulkheads'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Bulkheads 1 inch to 2 inch </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='bulkheads'
                  id='bulkheads'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.bulkheads}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .bulkheads_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plumbing: </p>
                  <p>
                    {screenNan(
                      adaptMath.bulkheads_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_3_4'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3/4 inch PVC Sch. 40 Pipe </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='rw_pvc_sch_3_4'
                  id='rw_pvc_sch_3_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_3_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='rw_pvc_sch_3_4_uom'
                  id='rw_pvc_sch_3_4_uom'
                  value={values.rw_pvc_sch_3_4_uom}
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
                      .rw_pvc_sch_3_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_3_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_1'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 inch PVC Sch. 40 Pipe </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='rw_pvc_sch_1'
                  id='rw_pvc_sch_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='rw_pvc_sch_1_uom'
                  id='rw_pvc_sch_1_uom'
                  value={values.rw_pvc_sch_1_uom}
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
                      .rw_pvc_sch_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_1_1_4'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 and 1/4 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='rw_pvc_sch_1_1_4'
                  id='rw_pvc_sch_1_1_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_1_1_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='rw_pvc_sch_1_1_4_uom'
                  id='rw_pvc_sch_1_1_4_uom'
                  value={values.rw_pvc_sch_1_1_4_uom}
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
                      .rw_pvc_sch_1_1_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_1_1_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_1_1_2'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span> 1 and 1/2 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='rw_pvc_sch_1_1_2'
                  id='rw_pvc_sch_1_1_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_1_1_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='rw_pvc_sch_1_1_2_uom'
                  id='rw_pvc_sch_1_1_2_uom'
                  value={values.rw_pvc_sch_1_1_2_uom}
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
                      .rw_pvc_sch_1_1_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_1_1_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_2'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
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
                  type='number'
                  variant='outlined'
                  name='rw_pvc_sch_2'
                  id='rw_pvc_sch_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='rw_pvc_sch_2_uom'
                  id='rw_pvc_sch_2_uom'
                  value={values.rw_pvc_sch_2_uom}
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
                      .rw_pvc_sch_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_3'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='rw_pvc_sch_3'
                  id='rw_pvc_sch_3'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_3}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='rw_pvc_sch_3_uom'
                  id='rw_pvc_sch_3_uom'
                  value={values.rw_pvc_sch_3_uom}
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
                      .rw_pvc_sch_3_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_3_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_4'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>4 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='rw_pvc_sch_4'
                  id='rw_pvc_sch_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='rw_pvc_sch_4_uom'
                  id='rw_pvc_sch_4_uom'
                  value={values.rw_pvc_sch_4_uom}
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
                      .rw_pvc_sch_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Plumbing:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rw_pvc_sch_6'>
                  <Tooltip
                    title='Simply enter the quantity and metric of pipe of the correct size needed.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>6 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='rw_pvc_sch_6'
                  id='rw_pvc_sch_6'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rw_pvc_sch_6}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='rw_pvc_sch_6_uom'
                  id='rw_pvc_sch_6_uom'
                  value={values.rw_pvc_sch_6_uom}
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
                      .rw_pvc_sch_6_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plumbing: </p>
                  <p>
                    {screenNan(
                      adaptMath.rw_pvc_sch_6_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_rain}`}
          >
            <h4>Plumbing Subtotal</h4>
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

        <div id='rain_catchment_pump' className={styles.subcategory_wrapper}>
          <h3>Pump</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pump_1hp'>
                  <Tooltip
                    title='This is for a steel, ground mounted, exterior pump. If yours is even larger than our options, you can add additional pumps until you get to the horsepower you need. If it is a smaller submersible, You can use 1 or more of the pumps listed in the water features section.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>
                    1hp Pump - External ground mount steel cased pump{' '}
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='pump_1hp'
                  id='pump_1hp'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pump_1hp}
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
                      .pump_1hp_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Pump:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.pump_1hp_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_rain}`}
          >
            <h4>Pump Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.pump_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>{screenNan(adaptMath.pump_percentage(values)).toFixed(2)} %</p>
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
              <h2>Rain Catchment</h2>

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
              <h2>Rain Catchment Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .rainwater_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.rainwater_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.rainwater_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.rainwater_total(values) * 100) /
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
