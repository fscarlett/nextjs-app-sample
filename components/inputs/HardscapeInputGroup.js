import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Info } from '@mui/icons-material'
import TimerIcon from '@mui/icons-material/Timer'

import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { formatPercentage, screenNan } from '@/helpers/index'
import { adaptMath } from '@/calc/formulas'
import { API_URL } from '@/config/index'
import styles from '@/styles/Inputs.module.css'
import { Button, TextField, Box, MenuItem } from '@mui/material'
import SubcatBarElement from '../SubcatBarElement'
import SETCard from '../SETCard'
import InputGroupRightColumn from '../InputGroupRightColumn'

export default function HardscapeInputGroup({ proj, token }) {
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
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />
      {/* <ul className={styles.subcat_ul}>
        <li
          id='hardscape_walls_control'
          className={styles.subcat_nav_button}
          // onClick={handleSubcatChange}
        >
          <Button href='#hardscape_walls' size='small' variant='contained'>
            Walls
          </Button>
        </li>

        <li
          id='hardscape_wall_veneers_control'
          className={styles.subcat_nav_button}
          // onClick={handleSubcatChange}
        >
          <Button
            href='#hardscape_wall_veneers'
            size='small'
            variant='contained'
          >
            Wall Veneers / Stone Type
          </Button>
        </li>

        <li
          id='hardscape_mortared_control'
          className={styles.subcat_nav_button}
          // onClick={handleSubcatChange}
        >
          <Button href='#hardscape_mortared' size='small' variant='contained'>
            Mortared Flat Work
          </Button>
        </li>

        <li
          id='hardscape_drylay_control'
          className={styles.subcat_nav_button}
          // onClick={handleSubcatChange}
        >
          <Button href='#hardscape_drylay' size='small' variant='contained'>
            Sand Set/Drylay Flat Work
          </Button>
        </li>

        <li
          id='hardscape_dry_stack_control'
          className={styles.subcat_nav_button}
          // onClick={handleSubcatChange}
        >
          <Button href='#hardscape_dry_stack' size='small' variant='contained'>
            Walls - Dry Stack
          </Button>
        </li>

        <li
          id='hardscape_edging_control'
          className={styles.subcat_nav_button}
          // onClick={handleSubcatChange}
        >
          <Button href='#hardscape_edging' size='small' variant='contained'>
            Edging
          </Button>
        </li>

        <li
          id='hardscape_additional_control'
          className={styles.subcat_nav_button}
          // onClick={handleSubcatChange}
        >
          <Button href='#hardscape_additional' size='small' variant='contained'>
            Additional Hardscape Materials
          </Button>
        </li>
      </ul> */}

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Hardscape</h2>
        <p>Calculate the materials for walls, edging, flatwork, and more.</p>

        <div id='hardscape_walls' className={styles.subcategory_wrapper}>
          <h3>
            <span className={styles.timer_icon}>
              <TimerIcon fontSize='large'></TimerIcon>
            </span>
            <span className={styles.time_saver}>Time Saver </span> Walls
          </h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='cmu_face'>
                  <Tooltip
                    title='This wall calculation assumes a 3ft tall x 8in wide wall and includes, 1/2in rebar 24in on center, 8in X 16in cmu block, mortar for joints, and concrete infill. Foundation is a separate input'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>CMU (face)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='cmu_face'
                  id='cmu_face'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.cmu_face}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='cmu_face_uom'
                  id='cmu_face_uom'
                  value={values.cmu_face_uom}
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
                      .cmu_face_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Walls:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.cmu_face_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='concrete_face'>
                  <Tooltip
                    title='This wall calculation assumes a 3ft tall x 8in wide wall and includes, 1/2in rebar 24in on center. Foundation is a separate input. If your wall is thicker or you would like to add more rebar, please see Additional Hardscape Materials for more input options.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Concrete (face)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='concrete_face'
                  id='concrete_face'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.concrete_face}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='concrete_face_uom'
                  id='concrete_face_uom'
                  value={values.concrete_face_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .concrete_face_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Walls: </p>
                  <p>
                    {screenNan(
                      adaptMath.concrete_face_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='footing'>
                  <Tooltip
                    title='This footing calculation assumes a 22in wide by 12in thick footing with 1/2in rebar 18in on center. Please calculate emissions of your footing excavation in the Equipment Operation Input category'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Footing</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='footing'
                  id='footing'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.footing}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='footing_uom'
                  id='footing_uom'
                  value={values.footing_uom}
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
                      .footing_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Walls: </p>
                  <p>
                    {screenNan(
                      adaptMath.footing_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_hardscape}`}
          >
            <h4>Walls Portion of Hardscape</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath.walls_subtotal(values).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.walls_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>

        <div id='hardscape_wall_veneers' className={styles.subcategory_wrapper}>
          <h3>
            <span className={styles.timer_icon}>
              <TimerIcon fontSize='large'></TimerIcon>
            </span>
            <span className={styles.time_saver}>Time Saver </span> Wall Veneers
            / Stone Type
          </h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='brick'>
                  <Tooltip
                    title='This calculation includes veneer material and the mortar for a 1/2in mortar bed. If you need additional mortar, please use the concrete input under Additional Hardscape Materials'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Brick</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='brick'
                  id='brick'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.brick}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='brick_uom'
                  id='brick_uom'
                  value={values.brick_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .brick_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Wall Veneers: </p>
                  <p>
                    {screenNan(
                      adaptMath.brick_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='local_stone'>
                  <Tooltip
                    title='Local stone refers to stone mined within 100 miles of your project. This input needs to have both square footage and the tonnage. The tonnage will give you the carbon impact of your stone and the square footage will give you the impact of your mortar. The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Local Stone (by area)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='local_stone'
                  id='local_stone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.local_stone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='local_stone_uom'
                  id='local_stone_uom'
                  value={values.local_stone_uom}
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
              <div className={styles.input_label_row}>
                <label htmlFor='local_stone_weight'>
                  <Tooltip
                    title='Local stone refers to stone mined within 100 miles of your project. This input needs to have both square footage and the tonnage. The tonnage will give you the carbon impact of your stone and the square footage will give you the impact of your mortar. The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Local Stone (by weight)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='local_stone_weight'
                  id='local_stone_weight'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.local_stone_weight}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='local_stone_weight_uom'
                  id='local_stone_weight_uom'
                  value={values.local_stone_weight_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .local_stone_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Wall Veneers: </p>
                  <p>
                    {screenNan(
                      adaptMath.local_stone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='imported_stone'>
                  <Tooltip
                    title='Imported stone refers to stone mined within 1000 miles of your project. This input needs to have both  square footage and the tonnage. The tonnage will give you the carbon impact of your stone and the square footage will give you the impact of your mortar. The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Imported Stone (by area)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='imported_stone'
                  id='imported_stone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.imported_stone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='imported_stone_uom'
                  id='imported_stone_uom'
                  value={values.imported_stone_uom}
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
              <div className={styles.input_label_row}>
                <label htmlFor='imported_stone_weight'>
                  <Tooltip
                    title='Imported stone refers to stone mined within 1000 miles of your project. This input needs to have both  square footage and the tonnage. The tonnage will give you the carbon impact of your stone and the square footage will give you the impact of your mortar.  The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Imported Stone (by weight)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='imported_stone_weight'
                  id='imported_stone_weight'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.imported_stone_weight}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='imported_stone_weight_uom'
                  id='imported_stone_weight_uom'
                  value={values.imported_stone_weight_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .imported_stone_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Wall Veneers: </p>
                  <p>
                    {screenNan(
                      adaptMath.imported_stone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_hardscape}`}
          >
            <h4>Wall Veneers Portion of Hardscape</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath
                  .wall_stone_subtotal(values)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.wall_stone_percentage(values)).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        <div id='hardscape_mortared' className={styles.subcategory_wrapper}>
          <h3>
            <span className={styles.timer_icon}>
              <TimerIcon fontSize='large'></TimerIcon>
            </span>
            <span className={styles.time_saver}>Time Saver </span>Mortared Flat
            Work
          </h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='concrete_slab'>
                  <Tooltip
                    title='This calculation assumes a 4in slab with 1/2in rebar 16in on center with 3in edge relief'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Concrete Slab</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='concrete_slab'
                  id='concrete_slab'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.concrete_slab}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='concrete_slab_uom'
                  id='concrete_slab_uom'
                  value={values.concrete_slab_uom}
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
                      .concrete_slab_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Mortared Flatwork:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.concrete_slab_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='brick_veneer'>
                  <Tooltip
                    title='This calculation includes veneer material and the mortar for a 1/2in mortar bed. If you need additional mortar, please use the concrete input under Additional Hardscape Materials'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Brick Veneer</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='brick_veneer'
                  id='brick_veneer'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.brick_veneer}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='brick_veneer_uom'
                  id='brick_veneer_uom'
                  value={values.brick_veneer_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .brick_veneer_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Mortared Flatwork: </p>
                  <p>
                    {screenNan(
                      adaptMath.brick_veneer_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='flagstone_veneer'>
                  <Tooltip
                    title='This calculation includes for veneer material and the mortar for a 1/2in mortar bed. If you need additional mortar, please use the concrete input under Additional Hardscape Materials. The most comonly used flagstones in the US are mined in two general regions. We have included 1000 miles of travel from point of origin to your local stone supplier. The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category.  We are developing more transporation inputs that will allow for even more granular accuracy for transportation of specific products.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Flagstone Veneer</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='flagstone_veneer'
                  id='flagstone_veneer'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.flagstone_veneer}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='flagstone_veneer_uom'
                  id='flagstone_veneer_uom'
                  value={values.flagstone_veneer_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .flagstone_veneer_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Mortared Flatwork: </p>
                  <p>
                    {screenNan(
                      adaptMath.flagstone_veneer_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_hardscape}`}
          >
            <h4>Mortared Flatwork Portion of Hardscape</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath
                  .mortared_flat_work_subtotal(values)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(
                  adaptMath.mortared_flat_work_percentage(values)
                ).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
        </div>
        <div id='hardscape_drylay' className={styles.subcategory_wrapper}>
          <h3>
            <span className={styles.timer_icon}>
              <TimerIcon fontSize='large'></TimerIcon>
            </span>
            <span className={styles.time_saver}>Time Saver </span>Sand
            Set/Drylay Flat Work
          </h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='concrete_pavers'>
                  <Tooltip
                    title='This calculation includes your paver, 4in of base material, and 1in of sand'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Concrete Pavers</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='concrete_pavers'
                  id='concrete_pavers'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.concrete_pavers}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='concrete_pavers_uom'
                  id='concrete_pavers_uom'
                  value={values.concrete_pavers_uom}
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
                      .concrete_pavers_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Drylay Flatwork:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.concrete_pavers_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drylay_brick'>
                  <Tooltip
                    title='This calculation includes your paver, 4in of base material, and 1in of sand'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Brick</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='drylay_brick'
                  id='drylay_brick'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drylay_brick}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='drylay_brick_uom'
                  id='drylay_brick_uom'
                  value={values.drylay_brick_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .drylay_brick_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Drylay Flatwork: </p>
                  <p>
                    {screenNan(
                      adaptMath.drylay_brick_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='crushed_stone'>
                  <Tooltip
                    title='This calculation include 4in of base and 1in of crushed stone.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Crushed Stone</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='crushed_stone'
                  id='crushed_stone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.crushed_stone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='crushed_stone_uom'
                  id='crushed_stone_uom'
                  value={values.crushed_stone_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .crushed_stone_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Drylay Flatwork: </p>
                  <p>
                    {screenNan(
                      adaptMath.crushed_stone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drylay_flagstone'>
                  <Tooltip
                    title='This calculation includes your paver, 4in of base material, and 1in of sand. The most commonly used flagstones in the US are mined in two general regions. We have included 1000 miles of travel from point of origin to your local stone supplier. The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category. We are developing more transportation inputs that will allow for even more granular accuracy for transportation of specific products.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Flagstone</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='drylay_flagstone'
                  id='drylay_flagstone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drylay_flagstone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='drylay_flagstone_uom'
                  id='drylay_flagstone_uom'
                  value={values.drylay_flagstone_uom}
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
                  <p>Carbon pounds: </p>
                  <p>
                    {adaptMath
                      .drylay_flagstone_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Drylay Flatwork: </p>
                  <p>
                    {screenNan(
                      adaptMath.drylay_flagstone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_hardscape}`}
          >
            <h4>Drylay Flatwork Portion of Hardscape</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath
                  .drylay_flat_work_subtotal(values)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(
                  adaptMath.drylay_flat_work_percentage(values)
                ).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
        </div>
        <div id='hardscape_dry_stack' className={styles.subcategory_wrapper}>
          <h3>
            <span className={styles.timer_icon}>
              <TimerIcon fontSize='large'></TimerIcon>
            </span>
            <span className={styles.time_saver}>Time Saver </span> Walls - Dry
            Stack
          </h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drystack_local_stone'>
                  <Tooltip
                    title='Local stone refers to stone mined within 100 miles of your project. The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category'
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
                  name='drystack_local_stone'
                  id='drystack_local_stone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drystack_local_stone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='drystack_local_stone_uom'
                  id='drystack_local_stone_uom'
                  value={values.drystack_local_stone_uom}
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
                      .drystack_local_stone_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Dry Stack:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.drystack_local_stone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='drystack_imported_stone'>
                  <Tooltip
                    title='Imported stone refers to stone mined within 1000 miles of your project. The delivery to your project site is in addition to this number and still needs to be calculated in the Deliveries Input Category.'
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
                  name='drystack_imported_stone'
                  id='drystack_imported_stone'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.drystack_imported_stone}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='drystack_imported_stone_uom'
                  id='drystack_imported_stone_uom'
                  value={values.drystack_imported_stone_uom}
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
                      .drystack_imported_stone_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Dry Stack:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.drystack_imported_stone_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_hardscape}`}
          >
            <h4>Dry Stack Portion of Hardscape</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath
                  .dry_stack_subtotal(values)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.dry_stack_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>

        <div id='hardscape_edging' className={styles.subcategory_wrapper}>
          <h3>
            <span className={styles.timer_icon}>
              <TimerIcon fontSize='large'></TimerIcon>
            </span>
            <span className={styles.time_saver}>Time Saver </span>Edging
          </h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='steel_3_16'>
                  <Tooltip
                    title='Includes steel staking 10ft on center'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3/16&quot; Steel</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='steel_3_16'
                  id='steel_3_16'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.steel_3_16}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='steel_3_16_uom'
                  id='steel_3_16_uom'
                  value={values.steel_3_16_uom}
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
                      .steel_3_16_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Edging: </p>
                  <p>
                    {screenNan(
                      adaptMath.steel_3_16_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='steel_1_4'>
                  <Tooltip
                    title='Includes steel staking 10ft on center'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1/4&quot; Steel</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='steel_1_4'
                  id='steel_1_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.steel_1_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='steel_1_4_uom'
                  id='steel_1_4_uom'
                  value={values.steel_1_4_uom}
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
                      .steel_1_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Edging: </p>
                  <p>
                    {screenNan(
                      adaptMath.steel_1_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='plastic_2_4'>
                  <Tooltip
                    title='Includes plastic stake 24in on center'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>2x4 Plastic</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='plastic_2_4'
                  id='plastic_2_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.plastic_2_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='plastic_2_4_uom'
                  id='plastic_2_4_uom'
                  value={values.plastic_2_4_uom}
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
                      .plastic_2_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Edging: </p>
                  <p>
                    {screenNan(
                      adaptMath.plastic_2_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='aluminum_edging'>
                  <Tooltip
                    title='Includes steel staking 18in on center'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Aluminum Edging</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='aluminum_edging'
                  id='aluminum_edging'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.aluminum_edging}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='aluminum_edging_uom'
                  id='aluminum_edging_uom'
                  value={values.aluminum_edging_uom}
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
                      .aluminum_edging_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Edging: </p>
                  <p>
                    {screenNan(
                      adaptMath.aluminum_edging_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='plastic_paver_restraint'>
                  <Tooltip
                    title='Includes steel staking 18in on center'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>
                    Plastic Paver Restraint (includes steel stake 18&quot; on
                    center)
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='plastic_paver_restraint'
                  id='plastic_paver_restraint'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.plastic_paver_restraint}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='plastic_paver_restraint_uom'
                  id='plastic_paver_restraint_uom'
                  value={values.plastic_paver_restraint_uom}
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
                      .plastic_paver_restraint_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Edging: </p>
                  <p>
                    {screenNan(
                      adaptMath.plastic_paver_restraint_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_hardscape}`}
          >
            <h4>Edging Portion of Hardscape</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath.edging_subtotal(values).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.edging_percentage(values)).toFixed(2)} %
              </p>
            </div>
          </div>
        </div>

        <div id='hardscape_additional' className={styles.subcategory_wrapper}>
          <h3>Additional Hardscape Materials</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='sand'>
                  <Tooltip
                    title='All types of natural sand products without polymers'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Sand</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='sand'
                  id='sand'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.sand}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='sand_uom'
                  id='sand_uom'
                  value={values.sand_uom}
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
                      .sand_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Additional:{' '}
                  </p>
                  <p>
                    {screenNan(adaptMath.sand_total_percentage(values)).toFixed(
                      2
                    )}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='base_rock_3_4'>
                  <Tooltip
                    title='If you need more of this material than incuded in the calculations, please add it here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3/4 inch minus Base Rock (includes fines)</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='base_rock_3_4'
                  id='base_rock_3_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.base_rock_3_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='base_rock_3_4_uom'
                  id='base_rock_3_4_uom'
                  value={values.base_rock_3_4_uom}
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
                      .base_rock_3_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Additional:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.base_rock_3_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rebar_1_2'>
                  <Tooltip
                    title='If you need more of this material than incuded in the calculations, please add it here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>1/2 inch Rebar</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='rebar_1_2'
                  id='rebar_1_2'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rebar_1_2}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='rebar_1_2_uom'
                  id='rebar_1_2_uom'
                  value={values.rebar_1_2_uom}
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
                      .rebar_1_2_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Additional: </p>
                  <p>
                    {screenNan(
                      adaptMath.rebar_1_2_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rebar_5_8'>
                  <Tooltip
                    title='If you need more of this material than incuded in the calculations, please add it here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>5/8 inch Rebar</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='rebar_5_8'
                  id='rebar_5_8'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rebar_5_8}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='rebar_5_8_uom'
                  id='rebar_5_8_uom'
                  value={values.rebar_5_8_uom}
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
                      .rebar_5_8_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Additional: </p>
                  <p>
                    {screenNan(
                      adaptMath.rebar_5_8_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='rebar_3_4'>
                  <Tooltip
                    title='If you need more of this material than incuded in the calculations, please add it here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>3/4 inch Rebar</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='rebar_3_4'
                  id='rebar_3_4'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.rebar_3_4}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='rebar_3_4_uom'
                  id='rebar_3_4_uom'
                  value={values.rebar_3_4_uom}
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
                      .rebar_3_4_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Additional: </p>
                  <p>
                    {screenNan(
                      adaptMath.rebar_3_4_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='concrete_materials'>
                  <Tooltip
                    title='If you need more of this material than incuded in the calculations, please add it here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Concrete</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='concrete_materials'
                  id='concrete_materials'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.concrete_materials}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='concrete_materials_uom'
                  id='concrete_materials_uom'
                  value={values.concrete_materials_uom}
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
                      .concrete_materials_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Additional:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.concrete_materials_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='crushed_stone_materials'>
                  <Tooltip
                    title='If you need more of this material than included in the calculations, please add it here'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Crushed Stone</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='crushed_stone_materials'
                  id='crushed_stone_materials'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.crushed_stone_materials}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='crushed_stone_materials_uom'
                  id='crushed_stone_materials_uom'
                  value={values.crushed_stone_materials_uom}
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
                      .crushed_stone_materials_total_value(values)
                      .toFixed(2)}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Additional:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.crushed_stone_materials_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_hardscape}`}
          >
            <h4>Additional Materials Portion of Hardscape</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath
                  .additional_hardscape_materials_subtotal(values)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(
                  adaptMath.additional_hardscape_materials_percentage(values)
                ).toFixed(2)}{' '}
                %
              </p>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
      <div className={styles.summary_wrapper}>
        <div className={styles.summary}>
          <div className={styles.summary_column_1}>
            <div className={styles.set_card}>
              <SETCard values={values}></SETCard>
            </div>
            <div className={styles.group_bar_card}>
              <h2>Hardscape Subcategories</h2>

              <div className={styles.subcat_bars_wrapper}>
                {subcategories.map((sub) => (
                  <SubcatBarElement key={sub.id} subcat={sub} />
                ))}
              </div>
            </div>
            <div className={styles.group_totals_card}>
              <h2>Hardscape Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .hardscape_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.hardscape_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.hardscape_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.hardscape_total(values) * 100) /
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
            {/* <div className={styles.growth_zone_wrapper}>
              <GrowthZoneCard bioregion={bioregion}></GrowthZoneCard>
            </div>

            <div className={styles.total_emissions_wrapper}>
              <TotalEmissionsCard
                values={values}
                proj={proj}
              ></TotalEmissionsCard>
            </div>
            <div className={styles.initial_sequestration_wrapper}>
              <InitialSequestrationCard
                values={values}
                proj={proj}
              ></InitialSequestrationCard>
            </div>
            <div className={styles.annual_sequestration_wrapper}>
              <AnnualSequestrationCard
                values={values}
                proj={proj}
              ></AnnualSequestrationCard>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
