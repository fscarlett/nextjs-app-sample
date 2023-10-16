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

export default function DeliveriesInputGroup({ proj, token }) {
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
      label: 'Category 2 Lg Diesel (10 wheeler or larger)',
      subtotal: adaptMath
        .cat_3_truck_subtotal(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      percent: adaptMath
        .cat_3_truck_percentage(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Deliveries</h2>
        <p>
          Let&rsquo;s include the gas and diesel-powered vehicles used by your
          suppliers.
        </p>

        <div id='deliveries_small_truck' className={styles.subcategory_wrapper}>
          <h3>Category 1 Small Truck</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_1_heavy_equipment_drop_off'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Heavy Equipment Drop Off</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_heavy_equipment_drop_off'
                  id='cat_1_heavy_equipment_drop_off'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_heavy_equipment_drop_off}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_heavy_equipment_drop_off_uom'
                  id='cat_1_heavy_equipment_drop_off_uom'
                  value={values.cat_1_heavy_equipment_drop_off_uom}
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
                <label htmlFor='cat_1_heavy_equipment_drop_off_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_heavy_equipment_drop_off_trips'
                  id='cat_1_heavy_equipment_drop_off_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_heavy_equipment_drop_off_trips}
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
                      .cat_1_heavy_equipment_drop_off_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_heavy_equipment_drop_off_total_percentage(
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
                <label htmlFor='cat_1_heavy_equipment_pick_up'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Heavy Equipment Pick Up</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_heavy_equipment_pick_up'
                  id='cat_1_heavy_equipment_pick_up'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_heavy_equipment_pick_up}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_heavy_equipment_pick_up_uom'
                  id='cat_1_heavy_equipment_pick_up_uom'
                  value={values.cat_1_heavy_equipment_pick_up_uom}
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
                <label htmlFor='cat_1_heavy_equipment_pick_up_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_heavy_equipment_pick_up_trips'
                  id='cat_1_heavy_equipment_pick_up_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_heavy_equipment_pick_up_trips}
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
                      .cat_1_heavy_equipment_pick_up_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_heavy_equipment_pick_up_total_percentage(
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
                <label htmlFor='cat_1_mulch_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Mulch Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_mulch_delivery'
                  id='cat_1_mulch_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_mulch_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_mulch_delivery_uom'
                  id='cat_1_mulch_delivery_uom'
                  value={values.cat_1_mulch_delivery_uom}
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
                <label htmlFor='cat_1_mulch_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_mulch_delivery_trips'
                  id='cat_1_mulch_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_mulch_delivery_trips}
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
                      .cat_1_mulch_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_mulch_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_1_concrete_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span> Concrete Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_concrete_delivery'
                  id='cat_1_concrete_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_concrete_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_concrete_delivery_uom'
                  id='cat_1_concrete_delivery_uom'
                  value={values.cat_1_concrete_delivery_uom}
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
                <label htmlFor='cat_1_concrete_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_concrete_delivery_trips'
                  id='cat_1_concrete_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_concrete_delivery_trips}
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
                      .cat_1_concrete_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_concrete_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_1_plant_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Plant Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_plant_delivery'
                  id='cat_1_plant_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_plant_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_plant_delivery_uom'
                  id='cat_1_plant_delivery_uom'
                  value={values.cat_1_plant_delivery_uom}
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
                <label htmlFor='cat_1_plant_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_plant_delivery_trips'
                  id='cat_1_plant_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_plant_delivery_trips}
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
                      .cat_1_plant_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_plant_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_1_stone_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Stone Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_stone_delivery'
                  id='cat_1_stone_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_stone_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_stone_delivery_uom'
                  id='cat_1_stone_delivery_uom'
                  value={values.cat_1_stone_delivery_uom}
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
                <label htmlFor='cat_1_stone_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_stone_delivery_trips'
                  id='cat_1_stone_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_stone_delivery_trips}
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
                      .cat_1_stone_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_stone_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_1_other_delivery_1'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other Delivery 1</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_other_delivery_1'
                  id='cat_1_other_delivery_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_other_delivery_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_other_delivery_1_uom'
                  id='cat_1_other_delivery_1_uom'
                  value={values.cat_1_other_delivery_1_uom}
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
                <label htmlFor='cat_1_other_delivery_1_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_other_delivery_1_trips'
                  id='cat_1_other_delivery_1_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_other_delivery_1_trips}
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
                      .cat_1_other_delivery_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_other_delivery_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_1_other_delivery_2'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other Delivery 2</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_other_delivery_2'
                  id='cat_1_other_delivery_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_other_delivery_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_1_other_delivery_2_uom'
                  id='cat_1_other_delivery_2_uom'
                  value={values.cat_1_other_delivery_2_uom}
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
                <label htmlFor='cat_1_other_delivery_2_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_1_other_delivery_2_trips'
                  id='cat_1_other_delivery_2_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_1_other_delivery_2_trips}
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
                      .cat_1_other_delivery_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_1_other_delivery_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_deliveries}`}
          >
            <h4>Truck Deliveries Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.cat_1_truck_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.cat_1_truck_percentage(values)).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        {/* ========= HEReS THE LARGE TRUCK ====================================================== */}

        <div
          id='deliveries_large_diesel'
          className={styles.subcategory_wrapper}
        >
          <h3>Category 2 Lg Diesel (10 wheeler or larger)</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_3_heavy_equipment_drop_off'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Heavy Equipment Drop Off</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_heavy_equipment_drop_off'
                  id='cat_3_heavy_equipment_drop_off'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_heavy_equipment_drop_off}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_heavy_equipment_drop_off_uom'
                  id='cat_3_heavy_equipment_drop_off_uom'
                  value={values.cat_3_heavy_equipment_drop_off_uom}
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
                <label htmlFor='cat_3_heavy_equipment_drop_off_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_heavy_equipment_drop_off_trips'
                  id='cat_3_heavy_equipment_drop_off_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_heavy_equipment_drop_off_trips}
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
                      .cat_3_heavy_equipment_drop_off_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_heavy_equipment_drop_off_total_percentage(
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
                <label htmlFor='cat_3_heavy_equipment_pick_up'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Heavy Equipment Pick Up</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_heavy_equipment_pick_up'
                  id='cat_3_heavy_equipment_pick_up'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_heavy_equipment_pick_up}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_heavy_equipment_pick_up_uom'
                  id='cat_3_heavy_equipment_pick_up_uom'
                  value={values.cat_3_heavy_equipment_pick_up_uom}
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
                <label htmlFor='cat_3_heavy_equipment_pick_up_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_heavy_equipment_pick_up_trips'
                  id='cat_3_heavy_equipment_pick_up_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_heavy_equipment_pick_up_trips}
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
                      .cat_3_heavy_equipment_pick_up_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_heavy_equipment_pick_up_total_percentage(
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
                <label htmlFor='cat_3_mulch_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Mulch Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_mulch_delivery'
                  id='cat_3_mulch_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_mulch_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_mulch_delivery_uom'
                  id='cat_3_mulch_delivery_uom'
                  value={values.cat_3_mulch_delivery_uom}
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
                <label htmlFor='cat_3_mulch_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_mulch_delivery_trips'
                  id='cat_3_mulch_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_mulch_delivery_trips}
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
                      .cat_3_mulch_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_mulch_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_3_concrete_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span> Concrete Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_concrete_delivery'
                  id='cat_3_concrete_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_concrete_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_concrete_delivery_uom'
                  id='cat_3_concrete_delivery_uom'
                  value={values.cat_3_concrete_delivery_uom}
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
                <label htmlFor='cat_3_concrete_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_concrete_delivery_trips'
                  id='cat_3_concrete_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_concrete_delivery_trips}
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
                      .cat_3_concrete_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_concrete_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_3_plant_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Plant Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_plant_delivery'
                  id='cat_3_plant_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_plant_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_plant_delivery_uom'
                  id='cat_3_plant_delivery_uom'
                  value={values.cat_3_plant_delivery_uom}
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
                <label htmlFor='cat_3_plant_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_plant_delivery_trips'
                  id='cat_3_plant_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_plant_delivery_trips}
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
                      .cat_3_plant_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_plant_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_3_stone_delivery'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Stone Delivery</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_stone_delivery'
                  id='cat_3_stone_delivery'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_stone_delivery}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_stone_delivery_uom'
                  id='cat_3_stone_delivery_uom'
                  value={values.cat_3_stone_delivery_uom}
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
                <label htmlFor='cat_3_stone_delivery_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_stone_delivery_trips'
                  id='cat_3_stone_delivery_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_stone_delivery_trips}
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
                      .cat_3_stone_delivery_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_stone_delivery_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_3_other_delivery_1'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other Delivery 1</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_other_delivery_1'
                  id='cat_3_other_delivery_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_other_delivery_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_other_delivery_1_uom'
                  id='cat_3_other_delivery_1_uom'
                  value={values.cat_3_other_delivery_1_uom}
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
                <label htmlFor='cat_3_other_delivery_1_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_other_delivery_1_trips'
                  id='cat_3_other_delivery_1_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_other_delivery_1_trips}
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
                      .cat_3_other_delivery_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_other_delivery_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cat_3_other_delivery_2'>
                  <Tooltip
                    title='This is for deliveries to the jobsite by a smaller diesel such as a Ford F350 or higher or an Izuzu Cab over.  Enter the 1-way miles and quantity of trips. Use google maps to help determine miles.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other Delivery 2</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_other_delivery_2'
                  id='cat_3_other_delivery_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_other_delivery_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='cat_3_other_delivery_2_uom'
                  id='cat_3_other_delivery_2_uom'
                  value={values.cat_3_other_delivery_2_uom}
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
                <label htmlFor='cat_3_other_delivery_2_trips'>
                  {' '}
                  Number of Trips
                </label>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cat_3_other_delivery_2_trips'
                  id='cat_3_other_delivery_2_trips'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cat_3_other_delivery_2_trips}
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
                      .cat_3_other_delivery_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Small Truck:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cat_3_other_delivery_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_deliveries}`}
          >
            <h4>Large Truck Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.cat_3_truck_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.cat_3_truck_percentage(values)).toFixed(2)}{' '}
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
              <h2>Deliveries Subcategories</h2>
              <div className={styles.subcat_bars_wrapper}>
                {subcategories.map((sub) => (
                  <SubcatBarElement key={sub.id} subcat={sub} />
                ))}
              </div>
            </div>
            <div className={styles.group_totals_card}>
              <h2>Deliveries Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .deliveries_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.deliveries_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.deliveries_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.deliveries_total(values) * 100) /
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
