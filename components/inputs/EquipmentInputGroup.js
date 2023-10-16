import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Info } from '@mui/icons-material'
import { useRouter } from 'next/router'

import { formatPercentage, screenNan } from '@/helpers/index'
import { adaptMath } from '@/calc/formulas'
import { API_URL } from '@/config/index'
import styles from '@/styles/Inputs.module.css'
import { Button, TextField, Tooltip, Box, MenuItem } from '@mui/material'
import SubcatBarElement from '../SubcatBarElement'
import SETCard from '../SETCard'
import InputGroupRightColumn from '../InputGroupRightColumn'

export default function EquipmentInputGroup({ proj, token }) {
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Equipment</h2>
        <p>
          We can track everything from a battery-powered trimmer to diesel heavy
          equipment.
        </p>

        <div id='equipment_large' className={styles.subcategory_wrapper}>
          <h3>Large Equipment</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='skid_steer'>
                  <Tooltip
                    title='If the machine you use is not represented here, please selcet the machine with the closest horsepower.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Skid Steer (CAT259D with 73.2 HP)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='skid_steer'
                  id='skid_steer'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.skid_steer}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='skid_steer_uom'
                  id='skid_steer_uom'
                  value={values.skid_steer_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .skid_steer_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Large Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.skid_steer_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='mini_ex'>
                  <Tooltip
                    title='If the machine you use is not represented here, please selcet the machine with the closest horsepower.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Mini Ex (CAT 303 E CR with 23.5 HP)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='mini_ex'
                  id='mini_ex'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.mini_ex}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='mini_ex_uom'
                  id='mini_ex_uom'
                  value={values.mini_ex_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .mini_ex_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Large Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.mini_ex_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='grade_all'>
                  <Tooltip
                    title='If the machine you use is not represented here, please selcet the machine with the closest horsepower.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Grade All (CAT TL1055D with 142.1 HP)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='grade_all'
                  id='grade_all'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.grade_all}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='grade_all_uom'
                  id='grade_all_uom'
                  value={values.grade_all_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .grade_all_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Large Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.grade_all_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_equipment}`}
          >
            <h4>Large Equipment Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.large_equipment_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(
                  adaptMath.large_equipment_percentage(values)
                ).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        {/* ========= HEReS THE SMALL EQP ====================================================== */}

        <div id='equipment_small' className={styles.subcategory_wrapper}>
          <h3>Small Equipment</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='blower_2_cycle'>
                  <Tooltip
                    title='Yup 2 cycles really are that bad. Please see citations for more information. These should be eliminated immediately.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Blower - 2 Cycle</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='blower_2_cycle'
                  id='blower_2_cycle'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.blower_2_cycle}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='blower_2_cycle_uom'
                  id='blower_2_cycle_uom'
                  value={values.blower_2_cycle_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .blower_2_cycle_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.blower_2_cycle_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='blower_battery'>
                  <Tooltip
                    title='Given that we cannot know how this is being charged, we use coal-fired power plant emission ratings.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Blower - Battery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='blower_battery'
                  id='blower_battery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.blower_battery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='blower_battery_uom'
                  id='blower_battery_uom'
                  value={values.blower_battery_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .blower_battery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.blower_battery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='chainsaw_battery'>
                  <Tooltip
                    title='Given that we cannot know how this is being charged, we use coal-fired power plant emission ratings.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span> Chainsaw - Battery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='chainsaw_battery'
                  id='chainsaw_battery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.chainsaw_battery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='chainsaw_battery_uom'
                  id='chainsaw_battery_uom'
                  value={values.chainsaw_battery_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .chainsaw_battery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.chainsaw_battery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='chainsaw_2_cycle'>
                  <Tooltip
                    title='Yup 2 cycles really are that bad. Please see white paper for more information. These should be eliminated immediately.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Chainsaw - 2 Cycle</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='chainsaw_2_cycle'
                  id='chainsaw_2_cycle'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.chainsaw_2_cycle}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='chainsaw_2_cycle_uom'
                  id='chainsaw_2_cycle_uom'
                  value={values.chainsaw_2_cycle_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .chainsaw_2_cycle_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.chainsaw_2_cycle_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='hedge_trimmer_2_cycle'>
                  <Tooltip
                    title='Yup 2 cycles really are that bad. Please see white paper for more information. These should be eliminated immediately.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Hedge Trimmer - 2 Cycle </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='hedge_trimmer_2_cycle'
                  id='hedge_trimmer_2_cycle'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.hedge_trimmer_2_cycle}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='hedge_trimmer_2_cycle_uom'
                  id='hedge_trimmer_2_cycle_uom'
                  value={values.hedge_trimmer_2_cycle_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .hedge_trimmer_2_cycle_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.hedge_trimmer_2_cycle_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='hedge_trimmer_battery'>
                  <Tooltip
                    title='Given that we cannot know how this is being charged, we use coal-fired power plant emission ratings'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Hedge Trimmer - Battery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='hedge_trimmer_battery'
                  id='hedge_trimmer_battery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.hedge_trimmer_battery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='hedge_trimmer_battery_uom'
                  id='hedge_trimmer_battery_uom'
                  value={values.hedge_trimmer_battery_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .hedge_trimmer_battery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.hedge_trimmer_battery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='mower_battery'>
                  <Tooltip
                    title='Given that we cannot know how this is being charged, we use coal-fired power plant emission ratings.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Mower - Battery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='mower_battery'
                  id='mower_battery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.mower_battery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='mower_battery_uom'
                  id='mower_battery_uom'
                  value={values.mower_battery_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .mower_battery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.mower_battery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='trimmer_2_cycle'>
                  <Tooltip
                    title='Yup 2 cycles really are that bad. Please see white paper for more information. These should be eliminated immediately.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Trimmer - 2 Cycle</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='trimmer_2_cycle'
                  id='trimmer_2_cycle'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.trimmer_2_cycle}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='trimmer_2_cycle_uom'
                  id='trimmer_2_cycle_uom'
                  value={values.trimmer_2_cycle_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .trimmer_2_cycle_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.trimmer_2_cycle_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='trimmer_battery'>
                  <Tooltip
                    title='Given that we cannot know how this is being charged, we use coal-fired power plant emission ratings.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Trimmer - Battery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='trimmer_battery'
                  id='trimmer_battery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.trimmer_battery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='trimmer_battery_uom'
                  id='trimmer_battery_uom'
                  value={values.trimmer_battery_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .trimmer_battery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.trimmer_battery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='generator_diesel'>
                  <Tooltip
                    title='Given these machines have vastly different model sizes. Please enter the amount of fuel you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Generator - Diesel</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='generator_diesel'
                  id='generator_diesel'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.generator_diesel}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='generator_diesel_uom'
                  id='generator_diesel_uom'
                  value={values.generator_diesel_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='cl'>Centilitres</option>
                  <option value='dl'>Decilitres</option>
                  <option value='l'>Litres</option>
                  <option value='kl'>Kilolitres</option>
                  <option value='m3'>Cubic Meters</option>
                  <option value='cuin'>Cubic Inches</option>
                  <option value='floz'>Fluid Ounces</option>
                  <option value='gal'>Gallons</option>
                  <option value='cuft'>Cubic Feet</option>
                  <option value='cuyd'>Cubic Yards</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .generator_diesel_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.generator_diesel_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='generator_gas'>
                  <Tooltip
                    title='Given these machines have vastly different model sizes. Please enter the amount of fuel you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Generator - Gas</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='generator_gas'
                  id='generator_gas'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.generator_gas}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='generator_gas_uom'
                  id='generator_gas_uom'
                  value={values.generator_gas_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='cl'>Centilitres</option>
                  <option value='dl'>Decilitres</option>
                  <option value='l'>Litres</option>
                  <option value='kl'>Kilolitres</option>
                  <option value='m3'>Cubic Meters</option>
                  <option value='cuin'>Cubic Inches</option>
                  <option value='floz'>Fluid Ounces</option>
                  <option value='gal'>Gallons</option>
                  <option value='cuft'>Cubic Feet</option>
                  <option value='cuyd'>Cubic Yards</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .generator_gas_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.generator_gas_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='vibratory_plate_compactor_gas'>
                  <Tooltip
                    title='Given these machines have vastly different model sizes. Please enter the amount of fuel you used or plan to use.If you have other small gasoline equipment not listed, plese use line item.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Vibratory Plate Compactor - Gas</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='vibratory_plate_compactor_gas'
                  id='vibratory_plate_compactor_gas'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.vibratory_plate_compactor_gas}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='vibratory_plate_compactor_gas_uom'
                  id='vibratory_plate_compactor_gas_uom'
                  value={values.vibratory_plate_compactor_gas_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='cl'>Centilitres</option>
                  <option value='dl'>Decilitres</option>
                  <option value='l'>Litres</option>
                  <option value='kl'>Kilolitres</option>
                  <option value='m3'>Cubic Meters</option>
                  <option value='cuin'>Cubic Inches</option>
                  <option value='floz'>Fluid Ounces</option>
                  <option value='gal'>Gallons</option>
                  <option value='cuft'>Cubic Feet</option>
                  <option value='cuyd'>Cubic Yards</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .vibratory_plate_compactor_gas_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.vibratory_plate_compactor_gas_total_percentage(
                        values
                      )
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='other_2_cycle'>
                  <Tooltip
                    title='Yup 2 cycles really are that bad. Please see white paper for more information. These should be eliminated immediately.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other - 2 Cycle</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='other_2_cycle'
                  id='other_2_cycle'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.other_2_cycle}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='other_2_cycle_uom'
                  id='other_2_cycle_uom'
                  value={values.other_2_cycle_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .other_2_cycle_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.other_2_cycle_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='other_battery'>
                  <Tooltip title='' arrow placement='top-start'>
                    <Info></Info>
                  </Tooltip>
                  <span>Other - Battery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='other_battery'
                  id='other_battery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.other_battery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='other_battery_uom'
                  id='other_battery_uom'
                  value={values.other_battery_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='mins'>Minutes</option>
                  <option value='hrs'>Hours</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .other_battery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.other_battery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='other_diesel'>
                  <Tooltip
                    title='If you have other small Diesel equipment not listed, plesae use line item.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other - Diesel</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='other_diesel'
                  id='other_diesel'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.other_diesel}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='other_diesel_uom'
                  id='other_diesel_uom'
                  value={values.other_diesel_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='cl'>Centilitres</option>
                  <option value='dl'>Decilitres</option>
                  <option value='l'>Litres</option>
                  <option value='kl'>Kilolitres</option>
                  <option value='m3'>Cubic Meters</option>
                  <option value='cuin'>Cubic Inches</option>
                  <option value='floz'>Fluid Ounces</option>
                  <option value='gal'>Gallons</option>
                  <option value='cuft'>Cubic Feet</option>
                  <option value='cuyd'>Cubic Yards</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .other_diesel_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.other_diesel_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='other_gas'>
                  <Tooltip
                    title='If you have other small gasoline equipment not listed, plesae use line item.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other - Gas</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='other_gas'
                  id='other_gas'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.other_gas}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='other_gas_uom'
                  id='other_gas_uom'
                  value={values.other_gas_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='cl'>Centilitres</option>
                  <option value='dl'>Decilitres</option>
                  <option value='l'>Litres</option>
                  <option value='kl'>Kilolitres</option>
                  <option value='m3'>Cubic Meters</option>
                  <option value='cuin'>Cubic Inches</option>
                  <option value='floz'>Fluid Ounces</option>
                  <option value='gal'>Gallons</option>
                  <option value='cuft'>Cubic Feet</option>
                  <option value='cuyd'>Cubic Yards</option>
                </select>
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .other_gas_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Equipment:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.other_gas_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_equipment}`}
          >
            <h4>Small Equipment Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.small_equipment_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(
                  adaptMath.small_equipment_percentage(values)
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
              <h2>Equipment Subcategories</h2>
              <div className={styles.subcat_bars_wrapper}>
                {subcategories.map((sub) => (
                  <SubcatBarElement key={sub.id} subcat={sub} />
                ))}
              </div>
            </div>
            <div className={styles.group_totals_card}>
              <h2>Equipment Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .equipment_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.equipment_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.equipment_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.equipment_total(values) * 100) /
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
