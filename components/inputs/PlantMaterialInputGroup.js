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

export default function PlantMaterialInputGroup({ proj, token }) {
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Plant Material</h2>
        <p>We love plants as much as you do. Where is the CO2 here?</p>

        <div id='plants_precalc' className={styles.subcategory_wrapper}>
          <div>
            <h3>
              <span className={styles.timer_icon}>
                <TimerIcon fontSize='large'></TimerIcon>
              </span>
              <span className={styles.time_saver}>Time Saver </span>{' '}
              Precalculated Planter Beds
            </h3>
          </div>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_planter_3ft_groundcover'>
                  <Tooltip
                    title='Drip line, Hunter HDL-09-18-XX-CV, 1000 total feet at 12ft spacing, Soil: Sandy loam was chosen as it will require some of the closest spacing and, therefore, more material- most landscape. Compost and Mulches: Compost is assumed at 1in tilled, Mulch is assumed at 3in course wood chip. Equipment: assumes 1 gallon of gasoline consumed to till/scrub soil. Plantings: 3ft on center, Triangular spacing, Assumes woody groundcover, Perennial Bunch Grasses will have lower sequestration, Plants assumed  installed 1 gallon container size. Calculation Viability Range: Once the square feet area drops below 500 square feet, we start to see unrealistically low quantities in the number of drip fittings. This number is relatively insignificant and will not cause noticeable changes in the precalculation final data output.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    Planter Bed 3ft on center groundcover
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='precalc_planter_3ft_groundcover'
                  id='precalc_planter_3ft_groundcover'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_planter_3ft_groundcover}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>One Complete System</div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_planter_mixed_perennial_1000sqft'>
                  <Tooltip
                    title='Drip line (Hunter HDL-09-18-XX-CV, 1000 total feet at 12ft spacing, Drip materials spacing tallied using hunter industries calculation tools). Soil: Sandy loam was chosen as it will require some of the closest spacing and, therefore, more material- most landscape. Soils and Mulches: No soil imports are included. Compost is assumed at 1in  and lightly tilled into the top layer of soil. Mulch is assumed at 3in course wood chip. Equipment: Equipment assumes 1 gallon of gasoline consumed to till/scrub soil. Plantings: Planting assumes that 25% of the space is planted with shrubs totalling 3x3ft each (9 square feet). Planting assumes that 75% of the space is planted with a mix of herbaceous perennials divided into 33% groups of: 1.5 x 1.5 ft = 2.25sqft; 2x2 =4 sqft; 3x3 = 9sqft. Approx. 9.5 square feet of planter left exposed. Shrubs assumed @ 5 gallon container size. All other plants assumed @ 1 gallon container size. Calculation Viability Range: Once the square feet area drops below 500 square feet, we start to see unrealistically low quantities in the number of drip fittings.  This number is relatively insignificant and will not cause noticeable changes in the precalculation final data output.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    Mixed Perennial Planter Bed (Dense) 1000 sqft
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='precalc_planter_mixed_perennial_1000sqft'
                  id='precalc_planter_mixed_perennial_1000sqft'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_planter_mixed_perennial_1000sqft}
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
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_plant} ${styles.precalc_color_bar}`}
          ></div>
        </div>

        <div
          id='water_features_infrastructure'
          className={styles.subcategory_wrapper}
        >
          <h3>Plant Material</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='pot_4'>
                  <Tooltip
                    title='On the emissions side of the calulator, we enter plants based on the container size and qty purchased. There are specific calulations based on plant size that are calculated based on standardized practices throguhout the nursery industry. You will still need to calculate your delivery emissions from the nursery to your project site in the Deliveries input catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>4 inch Pot</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='pot_4'
                  id='pot_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.pot_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .pot_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plant Material: </p>
                  <p>
                    {screenNan(
                      adaptMath.pot_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='potted_plant_1'>
                  <Tooltip
                    title='On the emissions side of the calulator, we enter plants based on the container size and qty purchased. There are specific calulations based on plant size that are calculated based on standardized practices throguhout the nursery industry. You will still need to calculate your delivery emissions from the nursery to your project site in the Deliveries input catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1 Gallon Potted Plant</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='potted_plant_1'
                  id='potted_plant_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.potted_plant_1}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .potted_plant_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plant Material: </p>
                  <p>
                    {screenNan(
                      adaptMath.potted_plant_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='potted_plant_3'>
                  <Tooltip
                    title='On the emissions side of the calulator, we enter plants based on the container size and qty purchased. There are specific calulations based on plant size that are calculated based on standardized practices throguhout the nursery industry. You will still need to calculate your delivery emissions from the nursery to your project site in the Deliveries input catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3 Gallon Potted Plant</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='potted_plant_3'
                  id='potted_plant_3'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.potted_plant_3}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .potted_plant_3_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plant Material: </p>
                  <p>
                    {screenNan(
                      adaptMath.potted_plant_3_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='potted_plant_5'>
                  <Tooltip
                    title='On the emissions side of the calulator, we enter plants based on the container size and qty purchased. There are specific calulations based on plant size that are calculated based on standardized practices throguhout the nursery industry. You will still need to calculate your delivery emissions from the nursery to your project site in the Deliveries input catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>5 Gallon potted plant</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='potted_plant_5'
                  id='potted_plant_5'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.potted_plant_5}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .potted_plant_5_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plant Material: </p>
                  <p>
                    {screenNan(
                      adaptMath.potted_plant_5_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='potted_plant_15'>
                  <Tooltip
                    title='On the emissions side of the calulator, we enter plants based on the container size and qty purchased. There are specific calulations based on plant size that are calculated based on standardized practices throguhout the nursery industry. You will still need to calculate your delivery emissions from the nursery to your project site in the Deliveries input catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>15 Gallon Potted plant</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='potted_plant_15'
                  id='potted_plant_15'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.potted_plant_15}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .potted_plant_15_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plant Material: </p>
                  <p>
                    {screenNan(
                      adaptMath.potted_plant_15_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='box_plant_24'>
                  <Tooltip
                    title='On the emissions side of the calulator, we enter plants based on the container size and qty purchased. There are specific calulations based on plant size that are calculated based on standardized practices throguhout the nursery industry. You will still need to calculate your delivery emissions from the nursery to your project site in the Deliveries input catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>24 inch box plant</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='box_plant_24'
                  id='box_plant_24'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.box_plant_24}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .box_plant_24_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plant Material: </p>
                  <p>
                    {screenNan(
                      adaptMath.box_plant_24_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='box_plant_36'>
                  <Tooltip
                    title='On the emissions side of the calulator, we enter plants based on the container size and qty purchased. There are specific calulations based on plant size that are calculated based on standardized practices throguhout the nursery industry. You will still need to calculate your delivery emissions from the nursery to your project site in the Deliveries input catagory.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>36 inch box Plant</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='box_plant_36'
                  id='box_plant_36'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.box_plant_36}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div>
                <div className={styles.carbon_pounds_card}>
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .box_plant_36_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Plant Material: </p>
                  <p>
                    {screenNan(
                      adaptMath.box_plant_36_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_plant}`}
          >
            <h4>PLant Material Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>{adaptMath.plant_material_subtotal(values).toFixed(2)}</p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.plant_material_percentage(values)).toFixed(
                  2
                )}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        <div id='plant_gopher' className={styles.subcategory_wrapper}>
          <h3>Gopher Baskets</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='chicken_wire_1'>
                  <Tooltip
                    title='This is the rigid gopher basket type typically made from galvanized steel. Simply input the quantity of each size you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Chicken wire 1 gallon</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='chicken_wire_1'
                  id='chicken_wire_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.chicken_wire_1}
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
                      .chicken_wire_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Gopher Baskets:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.chicken_wire_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='chicken_wire_5'>
                  <Tooltip
                    title='This is the rigid gopher basket type typically made from galvanized steel. Simply input the quantity of each size you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Chicken wire 5 gallon</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='chicken_wire_5'
                  id='chicken_wire_5'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.chicken_wire_5}
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
                      .chicken_wire_5_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Gopher Baskets:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.chicken_wire_5_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='chicken_wire_15'>
                  <Tooltip
                    title='This is the rigid gopher basket type typically made from galvanized steel. Simply input the quantity of each size you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Chicken wire 15 gallon</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='chicken_wire_15'
                  id='chicken_wire_15'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.chicken_wire_15}
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
                      .chicken_wire_15_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Gopher Baskets:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.chicken_wire_15_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='stainless_steel_1'>
                  <Tooltip
                    title='This is the soft, sock-like gopher basket made from stainless steel. Simply input the quantity of each size you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Stainless steel sock 1 gallon</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='stainless_steel_1'
                  id='stainless_steel_1'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.stainless_steel_1}
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
                      .stainless_steel_1_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Gopher Baskets:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.stainless_steel_1_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='stainless_steel_sock_5'>
                  <Tooltip
                    title='This is the soft, sock-like gopher basket made from stainless steel. Simply input the quantity of each size you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Stainless steel sock 5 gallon</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='stainless_steel_sock_5'
                  id='stainless_steel_sock_5'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.stainless_steel_sock_5}
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
                      .stainless_steel_sock_5_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Gopher Baskets:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.stainless_steel_sock_5_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='stainless_steel_15'>
                  <Tooltip
                    title='This is the soft, sock-like gopher basket made from stainless steel. Simply input the quantity of each size you used or plan to use.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Stainless steel sock 15 gallon</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='stainless_steel_15'
                  id='stainless_steel_15'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.stainless_steel_15}
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
                      .stainless_steel_15_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Gopher Baskets:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.stainless_steel_15_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_plant}`}
          >
            <h4>Gopher Baskets Subtotal</h4>
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
              <h2>Plant Material Subcategories</h2>
              <div className={styles.subcat_bars_wrapper}>
                {subcategories.map((sub) => (
                  <SubcatBarElement key={sub.id} subcat={sub} />
                ))}
              </div>
            </div>
            <div className={styles.group_totals_card}>
              <h2>Plant Material Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .plant_material_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.plant_material_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.plant_material_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.plant_material_total(values) * 100) /
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
