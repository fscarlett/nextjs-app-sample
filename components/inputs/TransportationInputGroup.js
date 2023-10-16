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

export default function TransportationInputGroup({ proj, token }) {
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

  const handleMileageChange = (e) => {
    const { name, value } = e.target
    if (value >= 1) {
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Transportation</h2>
        <p>
          The footprint isn&rsquo;t accurate without calculating the
          construction vehicles.
        </p>

        <div
          id='transportation_constants'
          className={styles.subcategory_wrapper}
        >
          <h3>PROJECT CONSTANTS</h3>
          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='site_trip'>
                  <Tooltip
                    title='This input will ultimately calculate your custom travel footprint to and from the project site based on all of the inputs in this catagory. Please only enter 1 way travel. Use google maps to help.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Miles from yard to job site (one way)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='site_trip'
                  id='site_trip'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.site_trip}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='project_duration'>
                  <Tooltip
                    title='Length of project in days'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Duration of project</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='project_duration'
                  id='project_duration'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.project_duration}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>
            </div>
            <div className={styles.input_set}></div>
          </div>
        </div>

        <div id='transportation_trucks' className={styles.subcategory_wrapper}>
          <h3>Daily Construction Trucks</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='gas_truck_1'>
                  <Tooltip
                    title='Enter the MPG and Quantity of truck(s) that will be going to the site every day from your company. There are gasoline and diesel options- Choose Accordingly (Deliveries from you and others are handled eslewhere)'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Gas Construction Truck 1</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas_truck_1'
                  id='gas_truck_1'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.gas_truck_1}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                QUANTITY
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas_truck_1_qnt'
                  id='gas_truck_1_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.gas_truck_1_qnt}
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
                      .gas_truck_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Construction Trucks:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.gas_truck_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='gas_truck_2'>
                  <Tooltip
                    title='Enter the MPG and Quantity of truck(s) that will be going to the site every day from your company. There are gasoline and diesel options- Choose Accordingly (Deliveries from you and others are handled eslewhere)'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Gas Construction Truck 2</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas_truck_2'
                  id='gas_truck_2'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.gas_truck_2}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                QUANTITY
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas_truck_2_qnt'
                  id='gas_truck_2_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.gas_truck_2_qnt}
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
                      .gas_truck_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Construction Trucks:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.gas_truck_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='diesel_truck_1'>
                  <Tooltip
                    title='Enter the MPG and Quantity of truck(s) that will be going to the site every day from your company. There are gasoline and diesel options- Choose Accordingly (Deliveries from you and others are handled eslewhere)'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Diesel Construction Truck 1</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel_truck_1'
                  id='diesel_truck_1'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.diesel_truck_1}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                QUANTITY
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel_truck_1_qnt'
                  id='diesel_truck_1_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.diesel_truck_1_qnt}
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
                      .diesel_truck_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Construction Trucks:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.diesel_truck_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='diesel_truck_2'>
                  <Tooltip
                    title='Enter the MPG and Quantity of truck(s) that will be going to the site every day from your company. There are gasoline and diesel options- Choose Accordingly (Deliveries from you and others are handled eslewhere)'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Diesel Construction Truck 2</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel_truck_2'
                  id='diesel_truck_2'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.diesel_truck_2}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                QUANTITY
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel_truck_2_qnt'
                  id='diesel_truck_2_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.diesel_truck_2_qnt}
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
                      .diesel_truck_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Construction Trucks:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.diesel_truck_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_transportation}`}
          >
            <h4>Daily Construction Trucks Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p> {adaptMath.trucks_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.trucks_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>

        {/* =====  subcat ====== === */}

        <div id='transportation_owner' className={styles.subcategory_wrapper}>
          <h3>PM/Owner Miles</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='truck_trip_percentage'>
                  <Tooltip
                    title='This input is for the vehicles that wil be making visits to the site but not every day. Usually this is a PM/Owner but can be any vehicle. Enter the percentage this vehicle will or has traveled in relationship to the vehicles that are going every day (you entered under Daily Consruction Vehicles) We calculate the rest. For example, if they go every day it is 100% , 1 day a week, 20 %.  Please note that there are 3 options- Gasoline, Diesel, and Electric.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span> Trips as % of Construction Truck 1</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                Percent
                <TextField
                  type='number'
                  variant='outlined'
                  name='truck_trip_percentage'
                  id='truck_trip_percentage'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.truck_trip_percentage}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              {/* <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .truck_trip_percentage_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Transportation:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.truck_trip_percentage_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div> */}
            </div>
            <div className={styles.input_set}></div>
            <div className={styles.input_set}></div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='gas'>
                  <Tooltip
                    title='This input is for the vehicles that wil be making visits to the site but not every day. Usually this is a PM/Owner but can be any vehicle. Enter the percentage this vehicle will or has traveled in relationship to the vehicles that are going every day (you entered under Daily Consruction Vehicles) We calculate the rest. For example, if they go every day it is 100% , 1 day a week, 20 %.  Please note that there are 3 options- Gasoline, Diesel, and Electric.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Gas</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas'
                  id='gas'
                  min='2'
                  max='9999999'
                  step='0.1'
                  value={values.gas}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                QUANTITY
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas_qnt'
                  id='gas_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.gas_qnt}
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
                      .gas_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of PM/Owner Miles:{' '}
                  </p>
                  <p>
                    {screenNan(adaptMath.gas_total_percentage(values)).toFixed(
                      2
                    )}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='diesel'>
                  <Tooltip
                    title='This input is for the vehicles that wil be making visits to the site but not every day. Usually this is a PM/Owner but can be any vehicle. Enter the percentage this vehicle will or has traveled in relationship to the vehicles that are going every day (you entered under Daily Consruction Vehicles) We calculate the rest. For example, if they go every day it is 100% , 1 day a week, 20 %.  Please note that there are 3 options- Gasoline, Diesel, and Electric.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Diesel</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel'
                  id='diesel'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.diesel}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                QUANTITY
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel_qnt'
                  id='diesel_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.diesel_qnt}
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
                      .diesel_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of PM/Owner Miles:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.diesel_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='electric_qnt'>
                  <Tooltip
                    title='This input is for the vehicles that wil be making visits to the site but not every day. Usually this is a PM/Owner but can be any vehicle. Enter the percentage this vehicle will or has traveled in relationship to the vehicles that are going every day (you entered under Daily Consruction Vehicles) We calculate the rest. For example, if they go every day it is 100% , 1 day a week, 20 %.  Please note that there are 3 options- Gasoline, Diesel, and Electric.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Electric</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                {/* <TextField
                  type='number'
                  variant='outlined'
                  name='electric_qnt'
                  id='electric_qnt'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.electric_qnt}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                /> */}
                QUANTITY
                <TextField
                  type='number'
                  variant='outlined'
                  name='electric_qnt'
                  id='electric_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.electric_qnt}
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
                      .electric_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of PM/Owner Miles:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.electric_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_transportation}`}
          >
            <h4>PM/Owner Miles Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.owner_miles_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.owner_miles_percentage(values)).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        {/* ======== end of pm miles subcat ======= */}

        {/* =====  subcat ====== === */}

        <div
          id='transportation_material_runs'
          className={styles.subcategory_wrapper}
        >
          <h3>Initial Material Runs</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='material_runs'>
                  <Tooltip
                    title='Enter the number of material runs you expect to make. This input is for capturing your in-house material runs to the jobsite. The best way we have found to determine this is to use google maps to map the route from your yard to each of your suppliers and to your project site. Many miles, pounds of carbon, and money are wasted by being inefficient with material runs. There are diesel and gasoline options.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Material Runs</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                Quantity
                <TextField
                  type='number'
                  variant='outlined'
                  name='material_runs'
                  id='material_runs'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.material_runs}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              {/* <div>
                <div className={styles.carbon_pounds_card}>
                  <p className={styles.pounds_label}>Carbon pounds: </p>

                  <p>
                    {' '}
                    {adaptMath
                      .material_runs_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Transportation:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.material_runs_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div> */}
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='gas_truck'>
                  <Tooltip
                    title='This input is for capturing your in-house material runs to the jobsite. The best way we have found to determine this is to use google maps to map the route from your yard to each of your suppliers and to your project site. Many miles, pounds of carbon, and money are wasted by being inefficient with material runs. There are diesel and gasoline options.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Gas Construction Truck</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas_truck'
                  id='gas_truck'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.gas_truck}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                <TextField
                  type='number'
                  variant='outlined'
                  name='gas_truck_qnt'
                  id='gas_truck_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.gas_truck_qnt}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='gas_truck_qnt_uom'
                  id='gas_truck_qnt_uom'
                  value={values.gas_truck_qnt_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='m'>Meters</option>
                  <option value='km'>Kilometers</option>
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
                      .gas_truck_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Initial Runs:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.gas_truck_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='diesel_truck'>
                  <Tooltip
                    title='This input is for capturing your in-house material runs to the jobsite. The best way we have found to determine this is to use google maps to map the route from your yard to each of your suppliers and to your project site. Many miles, pounds of carbon, and money are wasted by being inefficient with material runs. There are diesel and gasoline options.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Diesel Construction Truck</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                MPG
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel_truck'
                  id='diesel_truck'
                  min='1'
                  max='9999999'
                  step='0.1'
                  value={values.diesel_truck}
                  onChange={handleMileageChange}
                  onBlur={handleInputAutosave}
                />
                <TextField
                  type='number'
                  variant='outlined'
                  name='diesel_truck_qnt'
                  id='diesel_truck_qnt'
                  min='0'
                  max='9999999'
                  step='1'
                  value={values.diesel_truck_qnt}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='diesel_truck_qnt_uom'
                  id='diesel_truck_qnt_uom'
                  value={values.diesel_truck_qnt_uom}
                  onChange={handleUOMChange}
                  onBlur={handleInputAutosave}
                >
                  <option value='m'>Meters</option>
                  <option value='km'>Kilometers</option>
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
                      .diesel_truck_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Initial Runs:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.diesel_truck_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_transportation}`}
          >
            <h4>Initial Material Runs Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.material_runs_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.material_runs_percentage(values)).toFixed(
                  2
                )}{' '}
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
              <h2>Transportation Subcategories</h2>
              <div className={styles.subcat_bars_wrapper}>
                {subcategories.map((sub) => (
                  <SubcatBarElement key={sub.id} subcat={sub} />
                ))}
              </div>
            </div>
            <div className={styles.group_totals_card}>
              <h2>Transportation Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .transportation_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.transportation_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.transportation_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.transportation_total(values) * 100) /
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
