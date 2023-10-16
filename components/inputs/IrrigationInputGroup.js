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

export default function IrrigationInputGroup({ proj, token }) {
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Irrigation and Greywater</h2>
        <p>Track piping, infrastructure, and drip materials.</p>

        <div id='irrigation_precalc' className={styles.subcategory_wrapper}>
          <div>
            <h3>
              <span className={styles.timer_icon}>
                <TimerIcon fontSize='large'></TimerIcon>
              </span>
              <span className={styles.time_saver}>Time Saver </span>{' '}
              Precalculated Irrigation Systems
            </h3>
          </div>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_single_valve_drip_manifold'>
                  <Tooltip
                    title='(10 ft) 1in. PVC Sch 40 pipe, (1) 1 in. PVC globe valve, (3) 10 in. round inground valve box, (7) 1 in. PVC fittings, (1) 1 in. filter, (100 ft.) 14 gauge wire, (1) 30 PSI plastic pressure regulator'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    Single Valve Drip Manifold System
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='precalc_single_valve_drip_manifold'
                  id='precalc_single_valve_drip_manifold'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_single_valve_drip_manifold}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>One Complete System</div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_three_valve_drip_manifold'>
                  <Tooltip
                    title='(10 ft.) 1 in. PVC Sch 40 pipe, (3) 1 in. PVC Globe valve, (1) 14 x19 in. rectangular in-ground valve box, (2) 10 in. round in-ground valve box, (1) 1in. PVC ball valve, (17) 1 in. PVC fittings, (1) 1in. filter, (100 ft.) 14 gauge wire, (3) 30PSI plastic pressure regulator
'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    Three Valve Drip Manifold System{' '}
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='precalc_three_valve_drip_manifold'
                  id='precalc_three_valve_drip_manifold'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_three_valve_drip_manifold}
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
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_irrigation} ${styles.precalc_color_bar}`}
          ></div>
        </div>

        <div id='irrigation_pipe' className={styles.subcategory_wrapper}>
          <h3>Irrigation Piping</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_3_4'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3/4 inch PVC Sch. 40 Pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='pipe_3_4'
                  id='pipe_3_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_3_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='pipe_3_4_uom'
                  id='pipe_3_4_uom'
                  value={values.pipe_3_4_uom}
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
                      .pipe_3_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Piping:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_3_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_1'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 inch PVC Sch 40 pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pipe_1'
                  id='pipe_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pipe_1_uom'
                  id='pipe_1_uom'
                  value={values.pipe_1_uom}
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
                    {adaptMath
                      .pipe_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Piping:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_1_1_4'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 1/4 inch PVC Sch 40 pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pipe_1_1_4'
                  id='pipe_1_1_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_1_1_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pipe_1_1_4_uom'
                  id='pipe_1_1_4_uom'
                  value={values.pipe_1_1_4_uom}
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
                      .pipe_1_1_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Piping: </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_1_1_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_1_1_2'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 1/2 inch PVC Sch 40 pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pipe_1_1_2'
                  id='pipe_1_1_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_1_1_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pipe_1_1_2_uom'
                  id='pipe_1_1_2_uom'
                  value={values.pipe_1_1_2_uom}
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
                      .pipe_1_1_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Piping: </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_1_1_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_2'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>2 inch PVC Sch 40 pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pipe_2'
                  id='pipe_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pipe_2_uom'
                  id='pipe_2_uom'
                  value={values.pipe_2_uom}
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
                      .pipe_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Piping: </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_3'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3 inch PVC Sch 40 pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pipe_3'
                  id='pipe_3'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_3}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pipe_3_uom'
                  id='pipe_3_uom'
                  value={values.pipe_3_uom}
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
                      .pipe_3_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Piping: </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_3_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_4'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>4 inch PVC Sch 40 pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pipe_4'
                  id='pipe_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pipe_4_uom'
                  id='pipe_4_uom'
                  value={values.pipe_4_uom}
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
                      .pipe_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation: </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pipe_6'>
                  <Tooltip
                    title='Simply enter the quantity and metric of the type of pipe you are using. Drip line is found under "Drip".'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>6 inch PVC Sch 40 pipe</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pipe_6'
                  id='pipe_6'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pipe_6}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='pipe_6_uom'
                  id='pipe_6_uom'
                  value={values.pipe_6_uom}
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
                      .pipe_6_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation: </p>
                  <p>
                    {screenNan(
                      adaptMath.pipe_6_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_irrigation}`}
          >
            <h4>Irrigation Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.pipping_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.pipping_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>

        <div id='irrigation_components' className={styles.subcategory_wrapper}>
          <h3>Irrigation Infrastructure Components</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pvc_globe'>
                  <Tooltip
                    title='The current footprint is based on a 1in irritrol 2400 TF Valve'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 inch PVC Globe Valve</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='pvc_globe'
                  id='pvc_globe'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pvc_globe}
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
                      .pvc_globe_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.pvc_globe_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='ground_valve_14_19'>
                  <Tooltip title='Plastic Boxes' arrow placement='top-start'>
                    <Info></Info>
                  </Tooltip>
                  <span>14x19 inch Rectangular In Ground Valve Box </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='ground_valve_14_19'
                  id='ground_valve_14_19'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.ground_valve_14_19}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .ground_valve_14_19_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.ground_valve_14_19_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='ground_valve_10'>
                  <Tooltip title='Plastic Boxes' arrow placement='top-start'>
                    <Info></Info>
                  </Tooltip>
                  <span>10 inch Round In-Ground Valve Box</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='ground_valve_10'
                  id='ground_valve_10'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.ground_valve_10}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .ground_valve_10_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.ground_valve_10_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='ground_valve_6'>
                  <Tooltip title='Plastic Boxes' arrow placement='top-start'>
                    <Info></Info>
                  </Tooltip>
                  <span>6 inch Round In-Ground Valve Box</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='ground_valve_6'
                  id='ground_valve_6'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.ground_valve_6}
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
                      .ground_valve_6_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.ground_valve_6_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='ball_1'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 inch PVC Ball Valve</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='ball_1'
                  id='ball_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.ball_1}
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
                      .ball_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.ball_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='fitting_1'>
                  <Tooltip
                    title='Fittings have a minor impact at this size of pipe. Use this line for all fittings'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Fittings (1 inch PVC fittings )</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='fitting_1'
                  id='fitting_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.fitting_1}
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
                      .fitting_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.fitting_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='amiad_1'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 inch Filter</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='amiad_1'
                  id='amiad_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.amiad_1}
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
                      .amiad_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.amiad_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='gauge_18_7'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>18 gauge 7 strand copper Control wire</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='gauge_18_7'
                  id='gauge_18_7'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.gauge_18_7}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='gauge_18_7_uom'
                  id='gauge_18_7_uom'
                  value={values.gauge_18_7_uom}
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
                      .gauge_18_7_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.gauge_18_7_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='gauge_14'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>14 Gauge wire</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='gauge_14'
                  id='gauge_14'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.gauge_14}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='gauge_14_uom'
                  id='gauge_14_uom'
                  value={values.gauge_14_uom}
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
                      .gauge_14_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.gauge_14_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='timer_residential'>
                  <Tooltip
                    title='Yup, it really is that high! There are many different specialized resources in a computer that are mined and shipped all over the world multiple times before it reaches us inside of the final product.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Timer - Residential 9 stations</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='timer_residential'
                  id='timer_residential'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.timer_residential}
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
                      .timer_residential_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.timer_residential_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='timer_commercial'>
                  <Tooltip
                    title='Yup, it really is that high! There are many different specialized resources in a computer that are mined and shipped all over the world multiple times before it reaches us inside of the final product.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Timer - Commercial 99 stations</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='timer_commercial'
                  id='timer_commercial'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.timer_commercial}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .timer_commercial_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.timer_commercial_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='diverter_valve'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1.5-2.5 inch 3 way diverter valve for greywater</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='diverter_valve'
                  id='diverter_valve'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.diverter_valve}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .diverter_valve_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Infrastructure: </p>
                  <p>
                    {screenNan(
                      adaptMath.diverter_valve_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pressure_regulator_30'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>30 PSI plastic pressure regulator</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='pressure_regulator_30'
                  id='pressure_regulator_30'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pressure_regulator_30}
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
                      .pressure_regulator_30_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.pressure_regulator_30_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='double_check_valve_1'>
                  <Tooltip
                    title='Similar Product- 1in  Zern 975XL2'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span> 1 inch RP Double Check Valve </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='double_check_valve_1'
                  id='double_check_valve_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.double_check_valve_1}
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
                      .double_check_valve_1_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.double_check_valve_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='spray_head'>
                  <Tooltip
                    title='Similar Product- Hunter 10/A 0-360'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Pop up spray head</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='spray_head'
                  id='spray_head'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.spray_head}
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
                      .spray_head_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.spray_head_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rotor'>
                  <Tooltip
                    title='Similar product- Hunter Pro Ultra'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Pop up rotor</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='rotor'
                  id='rotor'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rotor}
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
                      .rotor_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Infrastructure:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.rotor_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_irrigation}`}
          >
            <h4>Irrigation Components Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.infrastructure_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.infrastructure_percentage(values)).toFixed(
                  2
                )}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        <div id='irrigation_drip' className={styles.subcategory_wrapper}>
          <h3>Drip</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drip_1_2'>
                  <Tooltip
                    title='Simply enter the quantitiy and metric'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1/2 inch Drip Line</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='drip_1_2'
                  id='drip_1_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drip_1_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='drip_1_2_uom'
                  id='drip_1_2_uom'
                  value={values.drip_1_2_uom}
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
                      .drip_1_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Drip:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.drip_1_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drip_1_4'>
                  <Tooltip
                    title='Simply enter the quantitiy and metric'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1/4 inch Drip Line</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='drip_1_4'
                  id='drip_1_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drip_1_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='drip_1_4_uom'
                  id='drip_1_4_uom'
                  value={values.drip_1_4_uom}
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
                      .drip_1_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Drip: </p>
                  <p>
                    {screenNan(
                      adaptMath.drip_1_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drip_elbow_90'>
                  <Tooltip
                    title='Simply enter the quantitiy'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>90 Drip Elbow</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='drip_elbow_90'
                  id='drip_elbow_90'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drip_elbow_90}
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
                      .drip_elbow_90_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Drip:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.drip_elbow_90_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drip_tee'>
                  <Tooltip
                    title='Simply enter the quantitiy'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Drip Tee</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='drip_tee'
                  id='drip_tee'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drip_tee}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .drip_tee_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Drip: </p>
                  <p>
                    {screenNan(
                      adaptMath.drip_tee_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drip_coupler'>
                  <Tooltip
                    title='Simply enter the quantitiy'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Drip Coupler</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='drip_coupler'
                  id='drip_coupler'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drip_coupler}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .drip_coupler_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Irrigation Drip: </p>
                  <p>
                    {screenNan(
                      adaptMath.drip_coupler_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='steel_staple_6'>
                  <Tooltip
                    title='Simply enter the quantitiy'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>6 inch Steel Staple</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='steel_staple_6'
                  id='steel_staple_6'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.steel_staple_6}
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
                      .steel_staple_6_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Drip:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.steel_staple_6_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='button_emitter'>
                  <Tooltip
                    title='Simply enter the quantitiy'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Button Emitter</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='button_emitter'
                  id='button_emitter'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.button_emitter}
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
                      .button_emitter_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Irrigation Drip:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.button_emitter_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_irrigation}`}
          >
            <h4>Drip Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.drip_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>{screenNan(adaptMath.drip_percentage(values)).toFixed(2)} %</p>
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
              <h2>Irrigation Subcategories</h2>

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
              <h2>Irrigation Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .irrigation_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.irrigation_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.irrigation_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.irrigation_total(values) * 100) /
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
