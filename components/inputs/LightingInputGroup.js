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
import InputGroupRightColumn from '../InputGroupRightColumn'
import SETCard from '../SETCard'

export default function LightingInputGroup({ proj, token }) {
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Lighting</h2>
        <p>Add up your fixtures, wires and other materials.</p>

        <div id='lighting_precalc' className={styles.subcategory_wrapper}>
          <div>
            <h3>
              <span className={styles.timer_icon}>
                <TimerIcon fontSize='large'></TimerIcon>
              </span>
              <span className={styles.time_saver}>Time Saver </span>{' '}
              Precalculated Lighting Systems
            </h3>
          </div>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_150_watt'>
                  <Tooltip
                    title='(500) 6-inch steel staples, (10) copper path lights (includes spike and 2 wire nuts) 6 watts, (3) copper up lights (includes spike and 2 wire nuts) 10 watts, (10) copper step lights (includes 2 wire nuts) 6 watts, (1) transformer (600 Watt stainless steel 23 lbs total weight), (1000 ft.) 10/2 wire, (20) additional wire nuts (2 per fixture), (10) 10 in. round ground valve box.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    150 Watt Lighting System
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='precalc_150_watt'
                  id='precalc_150_watt'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_150_watt}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>One Complete System</div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_600_watt'>
                  <Tooltip
                    title='(1000) 6-inch staples, (40) copper path lights (includes spike and 2 wire nuts) 6 watts, (12) copper up lights (includes spike and 2 wire nuts) 10 watts, (40) copper step lights (includes 2 wire nuts) 6 watts, (1) transformer (600 Watt stainless steel 23 lbs total weight), (2000 ft.) 12/2 wire, (50) additional wire nuts (2 per fixture), (20) 10 in. round in ground valve box.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    600 Watt Lighting System{' '}
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='precalc_600_watt'
                  id='precalc_600_watt'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_600_watt}
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
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_lighting} ${styles.precalc_color_bar}`}
          ></div>
        </div>

        <div id='lighting_fixtures' className={styles.subcategory_wrapper}>
          <h3>Fixtures</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='copper_path'>
                  <Tooltip
                    title='Includes high quality copper fixture, PVC ground stake, and 3M 2-part waterproof wire connectors.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>
                    Copper Path Lights, includes spike and 2 wire nuts
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='copper_path'
                  id='copper_path'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.copper_path}
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
                      .copper_path_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Fixtures:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.copper_path_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='copper_up'>
                  <Tooltip
                    title='Includes high quality copper fixture, PVC ground stake, and 3M 2-part waterproof wire connectors.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Copper Up Lights, includes spike and 2 wire nuts</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='copper_up'
                  id='copper_up'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.copper_up}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .copper_up_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Fixtures: </p>
                  <p>
                    {screenNan(
                      adaptMath.copper_up_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='copper_step'>
                  <Tooltip
                    title='Includes high quality copper fixture and 3M 2-part waterproof wire connectors.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Copper Step Lights, includes 2 wire nuts</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='copper_step'
                  id='copper_step'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.copper_step}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .copper_step_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Fixtures: </p>
                  <p>
                    {screenNan(
                      adaptMath.copper_step_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_lighting}`}
          >
            <h4>Fixtures Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.fixtures_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.fixtures_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>

        <div
          id='lighting_infrastructure'
          className={styles.subcategory_wrapper}
        >
          <h3>Infrastructure</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='transformer'>
                  <Tooltip
                    title='Simply enter the quantity of transformers you have here.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>
                    Transformer, 600 W stainless steel or 23 lb total weight
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='transformer'
                  id='transformer'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.transformer}
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
                      .transformer_total_value(values)
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
                      adaptMath.transformer_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='wire_18_2'>
                  <Tooltip
                    title='Enter the quantity and the metric of the wire here. Remember to choose the right size.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>18/2 wire</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='wire_18_2'
                  id='wire_18_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.wire_18_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='wire_18_2_uom'
                  id='wire_18_2_uom'
                  value={values.wire_18_2_uom}
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
                      .wire_18_2_total_value(values)
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
                      adaptMath.wire_18_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='wire_10_2'>
                  <Tooltip
                    title='Enter the quantity and the metric of the wire here. Remember to choose the right size.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>10/2 Wire</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='wire_10_2'
                  id='wire_10_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.wire_10_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='wire_10_2_uom'
                  id='wire_10_2_uom'
                  value={values.wire_10_2_uom}
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
                      .wire_10_2_total_value(values)
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
                      adaptMath.wire_10_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='wire_12_2'>
                  <Tooltip
                    title='Enter the quantity and the metric of the wire here. Remember to choose the right size.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>12/2 wire</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='wire_12_2'
                  id='wire_12_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.wire_12_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='wire_12_2_uom'
                  id='wire_12_2_uom'
                  value={values.wire_12_2_uom}
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
                      .wire_12_2_total_value(values)
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
                      adaptMath.wire_12_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='wire_14_2'>
                  <Tooltip
                    title='Enter the quantity and the metric of the wire here. Remember to choose the right size.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>14/2 wire</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='wire_14_2'
                  id='wire_14_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.wire_14_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='wire_14_2_uom'
                  id='wire_14_2_uom'
                  value={values.wire_14_2_uom}
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
                      .wire_14_2_total_value(values)
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
                      adaptMath.wire_14_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='wire_nuts'>
                  <Tooltip
                    title='Similar Product- 3M DBR Y/6'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Additional Wire Nuts - 2 incl per fixture</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='wire_nuts'
                  id='wire_nuts'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.wire_nuts}
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
                      .wire_nuts_total_value(values)
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
                      adaptMath.wire_nuts_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='round_box_10'>
                  <Tooltip
                    title='Simply enter the quantity'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>10 inch Round In Ground Valve Box</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='round_box_10'
                  id='round_box_10'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.round_box_10}
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
                      .round_box_10_total_value(values)
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
                      adaptMath.round_box_10_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_lighting}`}
          >
            <h4>Infrastructure Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath.lighting_infrastructure_subtotal(values).toFixed(2)}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(
                  adaptMath.lighting_infrastructure_percentage(values)
                ).toFixed(2)}{' '}
                %
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
              <h2>Lighting Subcategories</h2>
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
              <h2>Lighting Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .lighting_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.lighting_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.lighting_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.lighting_total(values) * 100) /
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
