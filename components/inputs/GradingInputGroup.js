import { useState } from 'react'
// import ReactDOM from 'react-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Info } from '@mui/icons-material'
import TimerIcon from '@mui/icons-material/Timer'

import { Tooltip } from '@mui/material'
import { useRouter } from 'next/router'

import { formatPercentage, screenNan } from '@/helpers/index'
import { adaptMath } from '@/calc/formulas'
import { API_URL } from '@/config/index'
import styles from '@/styles/Inputs.module.css'
import { Button, TextField, Box, MenuItem } from '@mui/material'
import SubcatBarElement from '../SubcatBarElement'
import SETCard from '../SETCard'
import InputGroupRightColumn from '../InputGroupRightColumn'
// import GrowthZoneCard from '../GrowthZoneCard'
// import TotalEmissionsCard from '../TotalEmissionsCard'
// import InitialSequestrationCard from '../InitialSequestrationCard'
// import AnnualSequestrationCard from '../AnnualSequestrationCard'

export default function GradingInputGroup({ proj, token }) {
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
      group: 'grading',
      label: 'Grasses / Forbes',
      subtotal: adaptMath
        .area_total_value(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      percent: adaptMath
        .area_total_percentage(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
    {
      id: 2,
      group: 'grading',
      label: 'Wooded',
      subtotal: adaptMath
        .grading_wooded_total_value(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      percent: adaptMath
        .grading_wooded_total_percentage(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
    {
      id: 3,
      group: 'grading',
      label: 'Shrubs',
      subtotal: adaptMath
        .grading_shrubs_total_value(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      percent: adaptMath
        .grading_shrubs_total_percentage(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Grading, Tilling and Land Clearing</h2>
        <p>
          CO2 is released from soil and plant material during these activities.
        </p>

        <div id='lighting_precalc' className={styles.subcategory_wrapper}>
          <div>
            <h3>
              <span className={styles.timer_icon}>
                <TimerIcon fontSize='large'></TimerIcon>
              </span>
              <span className={styles.time_saver}>Time Saver </span>{' '}
              Precalculated Grading Areas
            </h3>
          </div>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_grading_1_acre'>
                  <Tooltip
                    title='Equipment use 3 hrs skid steer HP equivalent (Includes soil emissions). Delivery mileage is kept at 5 miles to allow for the usage of multiple pre-calcs while minimizing the distortion of transportation emissions.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>Grading 1 Acre</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='precalc_grading_1_acre'
                  id='precalc_grading_1_acre'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_grading_1_acre}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>1 = One Acre</div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_grading_10k_sqft'>
                  <Tooltip
                    title='Equipment use 3 hrs skid steer HP equivalent (Includes soil emissions). Delivery mileage is kept at 5 miles to allow for the usage of multiple pre-calcs while minimizing the distortion of transportation emissions.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    Grading 10,000 Square Feet
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='precalc_grading_10k_sqft'
                  id='precalc_grading_10k_sqft'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_grading_10k_sqft}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>
                1 = 10,000 square feet
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.precalc_input_label_row}>
                <label htmlFor='precalc_grading_1k_sqft'>
                  <Tooltip
                    title='Equipment use 3 hrs skid steer HP equivalent (Includes soil emissions). Delivery mileage is kept at 5 miles to allow for the usage of multiple pre-calcs while minimizing the distortion of transportation emissions.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span className={styles.precalc_label}>
                    Grading 1,000 Square Feet
                  </span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='precalc_grading_1k_sqft'
                  id='precalc_grading_1k_sqft'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.precalc_grading_1k_sqft}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
              </div>

              <div className={styles.precalc_explain}>
                1 = 1,000 square feet
              </div>
            </div>

            {/* end of precalc inputs */}

            <div className={styles.input_set}></div>
          </div>

          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_grading} ${styles.precalc_color_bar}`}
          ></div>
        </div>

        <div id='grading_all' className={styles.subcategory_wrapper}>
          <h3></h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='area'>
                  <Tooltip
                    title='Use this input for grading and tilling.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Grasses / Forbes</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='area'
                  id='area'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.area}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />

                <select
                  name='area_uom'
                  id='area_uom'
                  value={values.area_uom}
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
                      .area_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Land Clearing:{' '}
                  </p>
                  <p>
                    {screenNan(adaptMath.area_total_percentage(values)).toFixed(
                      2
                    )}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='grading_wooded'>
                  <Tooltip
                    title='Use this input for deforestation.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Wooded</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='grading_wooded'
                  id='grading_wooded'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.grading_wooded}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='grading_wooded_uom'
                  id='grading_wooded_uom'
                  value={values.grading_wooded_uom}
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
                      .grading_wooded_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Land Clearing: </p>
                  <p>
                    {screenNan(
                      adaptMath.grading_wooded_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='grading_shrubs'>
                  <Tooltip
                    title='Use this input for shrubs.'
                    arrow
                    placement='top-start'
                  >
                    <Info>info</Info>
                  </Tooltip>
                  <span>Shrubs</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='grading_shrubs'
                  id='grading_shrubs'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.grading_shrubs}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='grading_shrubs_uom'
                  id='grading_shrubs_uom'
                  value={values.grading_shrubs_uom}
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
                      .grading_shrubs_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Land Clearing: </p>
                  <p>
                    {screenNan(
                      adaptMath.grading_shrubs_total_percentage(values)
                    ).toFixed(2)}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_grading}`}
          >
            <h4>Land Clearing Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath
                  .land_clearing_subtotal(values)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.land_clearing_percentage(values)).toFixed(
                  2
                )}{' '}
                %
              </p>
            </div>
          </div>
          {/* </div> */}

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
              <h2>Land Clearing Subcategories</h2>
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
              <h2>Land Clearing Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .land_clearing_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.land_clearing_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.land_clearing_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.land_clearing_total(values) * 100) /
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
