import { parseCookies } from '@/helpers/index'
import cookie from 'cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Box, Button, Typography, Modal, TextField } from '@mui/material'

import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import formstyles from '@/styles/Form.module.css'
import styles from '@/styles/Add.module.css'

import default_inputs from '../../constants/inputs_default.json'
import default_report_settings from '../../constants/default_report_settings.json'
import { StyleSharp } from '@mui/icons-material'

export default function AddProjectPage({ user, projects, tier, token }) {
  const [values, setValues] = useState({
    project_name: '',
    project_street_address: '',
    description: '',
    inputs_data: default_inputs,
    report_settings: default_report_settings,
  })

  const router = useRouter()

  const goBack = (e) => {
    e.preventDefault()
    router.back()
  }

  let projCount = 0
  projects.map((cProj) => {
    projCount++
  })

  let remainingProjects = tier.tiers_project_limit - projCount

  if (remainingProjects === 0) {
    return (
      <Layout title='Ugrade Plan'>
        <div>
          <div className={styles.add_page_container}>
            <div className={styles.add_page_header}>
              <Link href='/account/dashboard'>Cancel</Link>

              <h1>No Projects Left On Your Plan</h1>

              <h2>To get more projects: </h2>
              <h2>
                <Link href='/account/plan-upgrade'>
                  <a className={styles.dashboard_link}>
                    {/* <ArrowUpwardIcon fontSize='small' /> */}
                    <span> Upgrade Membership</span>
                  </a>
                </Link>
              </h2>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // validation TODO: improve
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )

    const projectNameIsEmpty = values.project_name === ''

    if (projectNameIsEmpty) {
      toast.error('Project title cannot be blank')
      return
    }

    // if (hasEmptyFields) {
    //   toast.error('Please fill in all fields')
    //   return
    // }

    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
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
      toast.error('Something went wrong!')
    } else {
      const proj = await res.json()
      router.push(`/projects/initdetails/${proj.id}`)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  return (
    <Layout title='Create New Project'>
      <div className={styles.add_page_container}>
        <div className={styles.add_page_header}>
          {/* <a onClick={goBack} href='#'>
            {'<'} Cancel
          </a> */}

          <h1>Create New Project</h1>

          <ToastContainer />

          <p>
            Fill out the fields below and save to create a new project. Info
            that you include here can be used on your reports.
          </p>
        </div>

        <div className={styles.add_page_body}>
          <div className={styles.create_form_wrapper}>
            <form onSubmit={handleSubmit} className={formstyles.form}>
              <div className={formstyles.grid}>
                <div className={styles.input_wrapper}>
                  <label htmlFor='project_name'>Project Name</label>
                  <TextField
                    variant='outlined'
                    fullWidth
                    type='text'
                    id='project_name'
                    name='project_name'
                    value={values.project_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.textarea_wrapper}>
                  <label htmlFor='description'>Project Description</label>
                  <TextField
                    variant='outlined'
                    fullWidth
                    multiline
                    rows={8}
                    type='text'
                    id='description'
                    name='description'
                    value={values.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <input
                type='submit'
                value='Save New Project'
                className={styles.addproject_submit_button}
              />
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  if (!req.headers.cookie || !cookie.parse(req.headers.cookie).token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { token } = parseCookies(req)

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
      slug: 'none',
      tier_name: 'NONE',
      tiers_project_limit: 1,
    }
  }
  // ----------------------------------

  const res = await fetch(`${API_URL}/projects/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const projects = await res.json()

  return {
    props: {
      user,
      projects,
      tier,
      token,
    },
  }
}
