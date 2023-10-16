import { parseCookies } from '@/helpers/index'
import cookie from 'cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

import EditIcon from '@mui/icons-material/Edit'

import Layout from '@/components/Layout'
import ProjectHeader from '@/components/ProjectHeader'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import FooterProject from '@/components/FooterProject'
import { API_URL } from '@/config/index'
import styles from '@/styles/EditDetails.module.css'
import formstyles from '@/styles/Form.module.css'

import { TextField } from '@mui/material'

export default function EditProjectDetailsPage({ proj, user, token, tier }) {
  const [values, setValues] = useState({
    project_name: proj.project_name,
    project_street_address: proj.project_street_address,
    project_street_1: proj.project_street_1,
    project_street_2: proj.project_street_2,
    project_city: proj.project_city,
    project_state: proj.project_state,
    project_postcode: proj.project_postcode,
    project_country: proj.project_country,
    description: proj.description,
    project_client_name: proj.project_client_name,
    project_job_manager: proj.project_job_manager,
    project_start_date: proj.project_start_date,
    project_end_date: proj.project_end_date,
    project_hardscape_sqft: proj.project_hardscape_sqft,
    project_softscape_sqft: proj.project_softscape_sqft,
  })

  const project_payload = {}

  const router = useRouter()
  const { query } = useRouter()
  let fromPlace = 'other'
  if (query.from === 'dash') {
    fromPlace = 'dash'
  }

  const isFreeTier = tier.slug === 'free' ? true : false

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/projects/${proj.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('Unauthorized')
        return
      }
      toast.error('Something went wrong.')
    } else {
      const proj = await res.json()
      router.push(
        `/projects/details/${proj.id}/?edited=edited&from=${fromPlace}`
      )
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleInputNumberChange = (e) => {
    const { name, value } = e.target
    if (value >= 0) {
      setValues({ ...values, [name]: value })
    }
  }

  // saves data on input blur
  const handleInputAutosave = async (e) => {
    e.preventDefault()

    const targetName = e.target.name
    const oldValue = proj[targetName]
    const newValue = values[targetName]

    if (oldValue !== newValue) {
      project_payload[targetName] = values[targetName]

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
      }
    }
    return
  }

  // begin stuff for client logo upload ======================================
  const [showModal, setShowModal] = useState(false)

  const [clientLogo, setClientLogo] = useState(
    proj.project_client_logo
      ? proj.project_client_logo.formats.thumbnail.url
      : null
  )

  let logoWidth, logoHeight

  if (clientLogo) {
    logoWidth = proj.project_client_logo.formats.thumbnail.width / 2
    logoHeight = proj.project_client_logo.formats.thumbnail.height / 2
  } else {
    logoWidth = 80
    logoHeight = 80
  }

  let uploadModalTitle = clientLogo
    ? 'Replace Client Logo'
    : 'Upload Client Logo'

  // begin stuff for PROJECT IMAGE upload ======================================
  const [showProjectImageModal, setShowProjectImageModal] = useState(false)

  const [projectImage, setProjectImage] = useState(
    proj.project_image ? proj.project_image.formats.thumbnail.url : null
  )

  let projectImageWidth, projectImageHeight

  if (projectImage && proj.project_image.formats.thumbnail.width > 199) {
    projectImageWidth = proj.project_image.formats.thumbnail.width
    projectImageHeight = proj.project_image.formats.thumbnail.height
  } else {
    projectImageWidth = 200
    projectImageHeight = 200
  }

  let uploadProjectImageModalTitle = projectImage
    ? 'Replace Project Image'
    : 'Upload Project Image'

  /* ------------------- */

  let editModalTitle = proj.project_notes
    ? 'Edit Project Notes'
    : 'Add Project Notes'

  const imageUploaded = async (e) => {
    router.reload()
  }
  // ===========================================================

  return (
    <Layout title='Edit Project Details'>
      <ProjectHeader proj={proj}></ProjectHeader>

      <div className={styles.details_page_container}>
        <div className={styles.details_page_header}>
          <div className={styles.details_page_header_top_row}>
            <h1>Edit Project Details</h1>
            <Link href={`/projects/details/${proj.id}`}>
              <a className={styles.edit_details_cancel}>Cancel</a>
            </Link>
          </div>

          <p>The information below can be used on project reports.</p>
          {isFreeTier && (
            <p>
              <Link href='/'>
                <a>Upgrade your membership level</a>
              </Link>{' '}
              to use the project details on your reports.
            </p>
          )}
        </div>

        <div className={styles.details_page_body}>
          <ToastContainer />

          <form onSubmit={handleSubmit} className={formstyles.form}>
            <div className={styles.edit_form_columns_wrapper}>
              <div className={styles.edit_form_column}>
                <div className={styles.edit_project_image_wrapper}>
                  <h2 className={styles.edit_image_label}>Project Image</h2>
                  <a
                    href='#'
                    className={formstyles.delete}
                    onClick={() => {
                      setShowProjectImageModal(true)
                    }}
                  >
                    {projectImage ? (
                      <div className={styles.project_image}>
                        <Image
                          src={proj.project_image.formats.thumbnail.url}
                          width={projectImageWidth}
                          height={projectImageHeight}
                        />
                      </div>
                    ) : (
                      <div className={styles.project_image_placeholder_wrapper}>
                        <div className={styles.project_image_placeholder}></div>
                        <EditIcon
                          className={styles.project_image_placeholder_icon}
                          fontSize='large'
                        />
                        <p>Upload project image</p>
                      </div>
                    )}
                  </a>
                </div>
                <div>
                  <label htmlFor='project_name'>Project Name</label>
                  <TextField
                    variant='outlined'
                    fullWidth
                    type='text'
                    id='project_name'
                    name='project_name'
                    value={values.project_name}
                    onChange={handleInputChange}
                    onBlur={handleInputAutosave}
                  />
                </div>

                <div className={styles.edit_form_textarea_wrapper}>
                  <label
                    htmlFor='description'
                    className={formstyles.textarea_label}
                  >
                    Project Description
                  </label>
                  <TextField
                    multiline
                    fullWidth
                    variant='outlined'
                    rows='16'
                    type='text'
                    id='description'
                    name='description'
                    value={values.description}
                    onChange={handleInputChange}
                    onBlur={handleInputAutosave}
                  ></TextField>
                </div>

                <div className={styles.edit_input_set_wrapper}>
                  <div className={styles.edit_input_half_width}>
                    <label htmlFor='project_start_date'>
                      Project Start Date
                    </label>
                    <input
                      type='date'
                      id='project_start_date'
                      name='project_start_date'
                      value={moment(values.project_start_date).format(
                        'yyyy-MM-DD'
                      )}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>

                  <div className={styles.edit_input_half_width}>
                    <label htmlFor='project_end_date'>Project End Date</label>
                    <input
                      type='date'
                      id='project_end_date'
                      name='project_end_date'
                      value={moment(values.project_end_date).format(
                        'yyyy-MM-DD'
                      )}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>
                </div>

                <div className={styles.edit_input_set_wrapper}>
                  <div className={styles.edit_input_half_width}>
                    <label htmlFor='project_hardscape_sqft'>
                      Hardscape Square Feet
                    </label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='number'
                      min='0'
                      max='9999999'
                      id='project_hardscape_sqft'
                      name='project_hardscape_sqft'
                      value={values.project_hardscape_sqft}
                      onChange={handleInputNumberChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>

                  <div className={styles.edit_input_half_width}>
                    <label htmlFor='project_softscape_sqft'>
                      Softscape Square Feet
                    </label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='number'
                      min='0'
                      max='9999999'
                      id='project_softscape_sqft'
                      name='project_softscape_sqft'
                      value={values.project_softscape_sqft}
                      onChange={handleInputNumberChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.edit_form_column}>
                <div className={styles.edit_input_set_wrapper}>
                  <h2 className={styles.edit_image_label}>Project Address</h2>

                  <div className={styles.edit_input_full_width}>
                    <label htmlFor='project_street_1'>Street Address 1</label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_street_1'
                      name='project_street_1'
                      value={values.project_street_1}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>

                  <div className={styles.edit_input_full_width}>
                    <label htmlFor='project_street_2'>Street Address 2</label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_street_2'
                      name='project_street_2'
                      value={values.project_street_2}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>

                  <div className={styles.edit_input_full_width}>
                    <label htmlFor='project_city'>City</label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_city'
                      name='project_city'
                      value={values.project_city}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>

                  <div className={styles.edit_input_half_width}>
                    <label htmlFor='project_state'>State</label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_state'
                      name='project_state'
                      value={values.project_state}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>

                  <div className={styles.edit_input_half_width}>
                    <label htmlFor='project_postcode'>Postal Code</label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_postcode'
                      name='project_postcode'
                      value={values.project_postcode}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>

                  <div className={styles.edit_input_full_width}>
                    <label htmlFor='project_country'>Country</label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_country'
                      name='project_country'
                      value={values.project_country}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>
                </div>

                <div className={styles.edit_project_logo_wrapper}>
                  <h2 className={styles.edit_logo_label}>
                    Project Client Logo
                  </h2>
                  <a
                    href='#'
                    className={formstyles.delete}
                    onClick={() => {
                      setShowModal(true)
                    }}
                  >
                    {clientLogo ? (
                      <div className={formstyles.logo}>
                        <Image
                          src={proj.project_client_logo.formats.thumbnail.url}
                          width={logoWidth}
                          height={logoHeight}
                        />
                      </div>
                    ) : (
                      <div className={styles.project_image_placeholder_wrapper}>
                        <div className={styles.project_image_placeholder}></div>
                        <EditIcon
                          className={styles.project_image_placeholder_icon}
                          fontSize='large'
                        />
                        <p>Upload client logo</p>
                      </div>
                    )}
                  </a>
                </div>

                <div className={styles.edit_input_set_wrapper}>
                  <h2 className={styles.edit_image_label}>Client Info</h2>

                  <div className={styles.edit_input_full_width}>
                    <label htmlFor='project_client_name'>
                      Project Client Name
                    </label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_client_name'
                      name='project_client_name'
                      value={values.project_client_name}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>
                  <div className={styles.edit_input_full_width}>
                    <label htmlFor='project_job_manager'>
                      Project Job Manager
                    </label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      type='text'
                      id='project_job_manager'
                      name='project_job_manager'
                      value={values.project_job_manager}
                      onChange={handleInputChange}
                      onBlur={handleInputAutosave}
                    />
                  </div>
                </div>
              </div>
              <input type='submit' value='Update Project' className='btn' />
            </div>
          </form>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          projId={proj.id}
          imageUploaded={imageUploaded}
          token={token}
          title={uploadModalTitle}
          field='project_client_logo'
        />
      </Modal>

      <Modal
        show={showProjectImageModal}
        onClose={() => setShowProjectImageModal(false)}
      >
        <ImageUpload
          projId={proj.id}
          imageUploaded={imageUploaded}
          token={token}
          title={uploadProjectImageModalTitle}
          field='project_image'
        />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id }, req }) {
  if (!req.headers.cookie || !cookie.parse(req.headers.cookie).token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { token } = parseCookies(req)

  const res = await fetch(`${API_URL}/projects/${id}`)
  const proj = await res.json()

  // user object -------------------------
  const userRes = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const user = await userRes.json()

  // ========  tiers relation ========

  let tier = {}

  if (user.subscription_tier) {
    const tierRes = await fetch(`${API_URL}/tiers/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const tierData = await tierRes.json()
    tier = tierData[0]
  } else {
    tier = {
      slug: 'free',
      tier_name: 'FREE',
      tiers_project_limit: 1,
    }
  }
  // ========================================

  return {
    props: {
      proj,
      user,
      token,
      tier,
    },
  }
}
