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

export default function SequestrationInputGroup({ proj, token }) {
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
      group: 'sequestration',
      label: 'Shrubs Perennials and Grasses',
      subtotal: adaptMath
        .shrubs_subtotal(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      percent: adaptMath
        .shrubs_percentage(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
    {
      id: 2,
      group: 'sequestration',
      label: 'Trees',
      subtotal: adaptMath
        .trees_subtotal(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
      percent: adaptMath
        .trees_percentage(values)
        .toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
  ]

  return (
    <div className={styles.input_wrapper}>
      <ToastContainer />

      <div className={styles.inputs_inner_wrapper}>
        <h2 className={styles.inputs_h2}>Sequestration</h2>
        <p>
          Track the sequestration capabilities of all of your planting areas and
          plant types.
        </p>

        <div id='sequestration_shrubs' className={styles.subcategory_wrapper}>
          <h3>Shrubs Perennials and Grasses</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='woody_plantings'>
                  <Tooltip
                    title='This is measured in the square footage of landsape covered by this type of planting at maturity.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Woody Shrub Plantings</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='woody_plantings'
                  id='woody_plantings'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.woody_plantings}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='woody_plantings_uom'
                  id='woody_plantings_uom'
                  value={values.woody_plantings_uom}
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
                      .woody_plantings_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Shrubs:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.woody_plantings_total_percentage(values)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='grass_plantings'>
                  <Tooltip
                    title='This is measured in the square footage of landsape covered by this type of planting at maturity.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Herbaceous perennials and bunch grass plantings</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='grass_plantings'
                  id='grass_plantings'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.grass_plantings}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='grass_plantings_uom'
                  id='grass_plantings_uom'
                  value={values.grass_plantings_uom}
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
                      .grass_plantings_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Shrubs: </p>
                  <p>
                    {screenNan(
                      adaptMath.grass_plantings_total_percentage(values)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='turf_plantings'>
                  <Tooltip
                    title='This is measured in the square footage of landsape covered by this type of planting at maturity.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Turf</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  variant='outlined'
                  type='number'
                  name='turf_plantings'
                  id='turf_plantings'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.turf_plantings}
                  onChange={handleInputChange}
                  onBlur={handleInputAutosave}
                />
                <select
                  name='turf_plantings_uom'
                  id='turf_plantings_uom'
                  value={values.turf_plantings_uom}
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
                      .turf_plantings_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>
                <div className={styles.carbon_percent_card}>
                  <p>Carbon Percent of Shrubs: </p>
                  <p>
                    {screenNan(
                      adaptMath.turf_plantings_total_percentage(values)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_sequestration}`}
          >
            <h4>Shrubs Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath.shrubs_subtotal(values).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>

              <p>
                {screenNan(adaptMath.shrubs_percentage(values)).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 2 }
                )}{' '}
                %
              </p>
            </div>
          </div>
        </div>

        <div id='sequestration_trees' className={styles.subcategory_wrapper}>
          <h3>Trees</h3>

          <div className={styles.input_sets_wrapper}>
            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='hardwood_trees'>
                  <Tooltip
                    title='Trees are measured as individual specimens and their sequestration is amortized over expected life span. Please see white papers for more details.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Hardwood Trees</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='hardwood_trees'
                  id='hardwood_trees'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.hardwood_trees}
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
                      .hardwood_trees_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Trees:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.hardwood_trees_total_percentage(values)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='conifer_trees'>
                  <Tooltip
                    title='Trees are measured as individual specimens and their sequestration is amortized over expected life span. Please see white papers for more details.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Conifer Trees</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='conifer_trees'
                  id='conifer_trees'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.conifer_trees}
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
                      .conifer_trees_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Trees:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.conifer_trees_total_percentage(values)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='fruit_trees'>
                  <Tooltip
                    title='Trees are measured as individual specimens and their sequestration is amortized over expected life span. Please see white papers for more details.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Fruit Trees</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='fruit_trees'
                  id='fruit_trees'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.fruit_trees}
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
                      .fruit_trees_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Trees:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.fruit_trees_total_percentage(values)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}>
              <div className={styles.input_label_row}>
                <label htmlFor='other_trees'>
                  <Tooltip
                    title='Trees are measured as individual specimens and their sequestration is amortized over expected life span. Please see white papers for more details.'
                    arrow
                    placement='top-start'
                  >
                    <Info></Info>
                  </Tooltip>
                  <span>Other Trees</span>
                </label>
              </div>

              <div className={styles.input_main_row}>
                <TextField
                  type='number'
                  variant='outlined'
                  name='other_trees'
                  id='other_trees'
                  min='0'
                  max='9999999'
                  step='0.1'
                  value={values.other_trees}
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
                      .other_trees_total_value(values)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                </div>

                <div className={styles.carbon_percent_card}>
                  <p className={styles.pounds_label}>
                    Carbon Percent of Trees:{' '}
                  </p>
                  <p>
                    {screenNan(
                      adaptMath.other_trees_total_percentage(values)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.input_set}></div>
          </div>
          <div
            className={`${styles.subcategory_totals_card} ${styles.subcat_tots_sequestration}`}
          >
            <h4>Trees Subtotal</h4>
            <div className={styles.subcat_tot_pounds}>
              <p>Carbon pounds: </p>
              <p>
                {adaptMath.trees_subtotal(values).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className={styles.subcat_tot_percent}>
              <p>Carbon Percent: </p>
              <p>
                {screenNan(adaptMath.trees_percentage(values)).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 2 }
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
              <h2>Sequestration Subcategories</h2>
              <div className={styles.subcat_bars_wrapper}>
                {subcategories.map((sub) => (
                  <SubcatBarElement key={sub.id} subcat={sub} />
                ))}
              </div>
            </div>
            <div className={styles.group_totals_card}>
              <h2>Sequestration Totals</h2>
              <div className={styles.group_totals_wrapper}>
                <div className={styles.group_pounds_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {adaptMath
                      .sequestration_total(values)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                  </p>
                  <div className={styles.group_totals_label}>Carbon Pounds</div>
                </div>
                <div className={styles.group_percent_wrapper}>
                  <p className={styles.group_barchart_value}>
                    {(adaptMath.sequestration_total(values) * 100) /
                      adaptMath.total_carbon(values) <
                    0.1
                      ? screenNan(
                          (adaptMath.sequestration_total(values) * 100) /
                            adaptMath.total_carbon(values)
                        ).toFixed(4)
                      : screenNan(
                          (adaptMath.sequestration_total(values) * 100) /
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
