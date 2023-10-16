// Next.js 11
// Main dashboard page for user:  pages/account/dashboard.js
// Strapi 3 backend
// if 30 day free trial is expired redirect to /account/plan-expired
// if no valid cookie redirect to /
// show appropriate sections based on user tier (currently only solo tier is available to users)

import { useRouter } from 'next/router'
import Link from 'next/link'

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import AddIcon from '@mui/icons-material/Add'

import constants from '../../constants/constants.json'
import { parseCookies } from '@/helpers/index'
import cookie from 'cookie'
import { API_URL } from '@/config/index'
import Layout from '@/components/Layout'
import DashboardProject from '@/components/DashboardProject'
import styles from '@/styles/Dashboard.module.css'
import FooterAdmin from '@/components/FooterAdmin'

export default function DashboardPage({ user, projects, token, tier }) {
  const router = useRouter()

  const userEmail = user.email
  const encodedEmail = userEmail
  const stripePortalFullUrl = `https://billing.stripe.com/p/login/14k5kPbJM99d8aAaEE?prefilled_email=${encodedEmail}`
  const stripePortalUrlNoQuery =
    'https://billing.stripe.com/p/login/14k5kPbJM99d8aAaEE'

  const customer_id = user.user_stripe_customer_id

  /* -------------------------------------------------------------------------- */
  /*                        count days left in free trial                       */
  /* -------------------------------------------------------------------------- */

  const freeDays = constants.free_trial_days

  const userCreated = new Date(user.created_at)
  const userMs = userCreated.setDate(userCreated.getDate())

  const current = new Date()
  const todayMs = current.setDate(current.getDate())
  let daysDifference = (todayMs - userMs) / (1000 * 60 * 60 * 24)
  const daysLeft = (freeDays - daysDifference).toFixed(0)

  /* -------------------------------------------------------------------------- */
  /*                          count projects vs allowed                         */
  /* -------------------------------------------------------------------------- */

  let projCount = 0

  if (projects[0]) {
    projects.forEach((cProj) => {
      projCount++
    })

    let remainingProjects = tier.tiers_project_limit - projCount

    projects.sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))
  }

  /* -------------------------------------------------------------------------- */
  /*                               count subusers                               */
  /* -------------------------------------------------------------------------- */

  let totalSubusersAvailable =
    tier.tiers_subusers_baseline + (user.user_addon_subusers_count || 0)

  /* -------------------------------------------------------------------------- */
  /*                       count allowed report downloads                       */
  /* -------------------------------------------------------------------------- */

  let totalDownloadsAvailable =
    tier.tiers_download_limit + user.user_addon_reports_count

  /* =========================================================================== */

  const deleteProject = async (id) => {
    if (confirm('Do you REALLY want to delete this project permanently?')) {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
      } else {
        router.reload()
      }
    }
  }
  return (
    <Layout title='Bond | User Dashboard'>
      <div className={styles.dash}>
        <div className={styles.dashboard_header}>
          <h1>Dashboard</h1>
        </div>

        <div className={styles.dashboard_body_wrapper}>
          <div className={styles.dashboard_projects_wrapper}>
            <div className={styles.dashboard_projects_header}>
              <h2>My Projects</h2>
              {projects[0] && (
                <div className={styles.dashboard_projects_links_wrapper}>
                  <Link href='/projects/add'>
                    <a className={styles.dashboard_create_link}>
                      <AddIcon />
                      Create Project
                    </a>
                  </Link>
                  <Link href='/projects'>
                    <a className={styles.dashboard_view_link}>
                      View All Projects <KeyboardArrowRightIcon />
                    </a>
                  </Link>
                </div>
              )}
            </div>

            <div>
              {projects[0] ? (
                <div>
                  {projects
                    .filter((el, index) => {
                      return index < 3
                    })
                    .map((proj) => (
                      <DashboardProject
                        key={proj.id}
                        proj={proj}
                        handleDelete={deleteProject}
                      />
                    ))}
                </div>
              ) : (
                <div>
                  <p>
                    Looks like you don&apos;t have any projects yet. Click below
                    to get started:
                  </p>

                  <Link href='/projects/add'>
                    <a className={styles.dashboard_button}>
                      Create First Project
                    </a>
                  </Link>

                  {tier.id > 3 && (
                    <div>
                      <h2 className={styles.inner_h2}>Company Profile</h2>

                      <p>
                        Add more information to your reports by filling out your
                        company profile.
                      </p>

                      <Link href='/account/profile'>
                        <a className={styles.dashboard_button}>
                          Fill Out Your Profile
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.dashboard_account_wrapper}>
            <div className={styles.dashboard_membership_header}>
              <div>
                <h2>Membership</h2>
                {tier.id !== 2 && (
                  <div className={styles.dashboard_stripe_portal_wrapper}>
                    <Link href={stripePortalFullUrl}>
                      <a target='_blank'>
                        Manage Billing Portal <KeyboardArrowRightIcon />
                      </a>
                    </Link>
                  </div>
                )}
              </div>
              <div className={styles.dashboard_membership_link}>
                <Link href='/account'>
                  <a>
                    View Account <KeyboardArrowRightIcon />{' '}
                  </a>
                </Link>
              </div>
            </div>

            <div className={styles.membership_box_wrapper}>
              <div className={styles.membership_status_box}>
                <p className={styles.membership_label}>Membership level: </p>
                <p>{tier.tier_name}</p>
                {tier.id === 2 && <p>expires in {daysLeft} days</p>}

                <div className={styles.upgrade}>
                  <span>
                    <Link href='/account/plan-upgrade'>
                      <a className={styles.addon_link}>
                        <ArrowUpwardIcon fontSize='small' />
                        <span>Upgrade Membership</span>
                      </a>
                    </Link>
                  </span>
                </div>
              </div>

              <div className={styles.box}>
                <p className={styles.membership_label}>Add Ons:</p>
                <div className={styles.addon_link_wrapper}>
                  <form action='/api/products/buy-report' method='POST'>
                    <input
                      type='hidden'
                      name='priceId'
                      value='price_1M4EfsD4wZE1WVP1A359SzD1'
                    />
                    <input type='hidden' name='custId' value={customer_id} />
                    <button type='submit' className={styles.addon_button}>
                      <ReceiptIcon fontSize='small' />
                      <span className={styles.additional_reports_link}>
                        Buy Additional Reports
                      </span>
                    </button>
                  </form>
                </div>
                {tier.slug !== 'free-trial' && (
                  <div>
                    <div className={styles.addon_link_wrapper}>
                      {!user.user_white_label_reports ? (
                        <form
                          action='/api/subscription/whitelabel'
                          method='POST'
                        >
                          <input
                            type='hidden'
                            name='priceId'
                            value='price_1LDIJxD4wZE1WVP1DhUyb40u'
                          />
                          <input
                            type='hidden'
                            name='custId'
                            value={customer_id}
                          />
                          <button type='submit' className={styles.addon_button}>
                            <ReceiptIcon fontSize='small' />
                            <span className={styles.additional_reports_link}>
                              White Label Reports
                            </span>
                          </button>
                        </form>
                      ) : (
                        <p>White Labeling is subscribed</p>
                      )}
                    </div>
                  </div>
                )}
                {tier.slug !== 'free-trial' && (
                  <div className={styles.addon_link_wrapper}>
                    {/* <Link href='/account/buy-subuser'> */}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.membership_data_container}>
              <div className={styles.membership_data_box}>
                <h4 className={styles.membership_data_heading}>
                  Active Projects
                </h4>
                <p className={styles.membership_data_number}>{projCount}</p>
                <p className={styles.membership_data_limit}>
                  Out of{' '}
                  {tier.tiers_project_limit < 100
                    ? tier.tiers_project_limit
                    : 'Unlimited'}
                </p>
              </div>
              {!user.is_sub_user && tier.id > 3 && (
                <div className={styles.membership_data_box}>
                  <h4 className={styles.membership_data_heading}>
                    Active Users
                  </h4>
                  <p className={styles.membership_data_number}>
                    {user.user_subusers_created || 1}{' '}
                  </p>
                  <p className={styles.membership_data_limit}>
                    Out of {totalSubusersAvailable + 1}
                  </p>
                </div>
              )}
              <div className={styles.membership_data_box}>
                <h4 className={styles.membership_data_heading}>
                  Exported Reports
                </h4>
                <p className={styles.membership_data_number}>
                  {user.user_reports_downloaded || 0}
                </p>
                <p className={styles.membership_data_limit}>
                  Out of{' '}
                  {totalDownloadsAvailable < 100
                    ? totalDownloadsAvailable
                    : 'Unlimited'}
                </p>
              </div>
            </div>

            {!user.is_sub_user && tier.id > 3 && (
              <div className={styles.users_section_wrapper}>
                <div className={styles.dashboard_projects_header}>
                  <h2>Users</h2>
                  <div className={styles.dashboard_projects_links_wrapper}>
                    <Link href='/account/my-users'>
                      <a className={styles.dashboard_users_link}>
                        Invite & Manage Users <KeyboardArrowRightIcon />
                      </a>
                    </Link>
                  </div>
                </div>

                <div className={styles.box}></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterAdmin></FooterAdmin>
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

  let user = {}

  try {
    const userRes = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setTimeout(function () {
      if (
        userRes.status == 500 ||
        userRes.status == 501 ||
        userRes.status == 502 ||
        userRes.status == 503 ||
        userRes.status == 504
      ) {
        console.log('API error: ', userRes.status)
        return {
          redirect: {
            destination: '/api-down',
            permanent: false,
          },
        }
      }
    }, 1000)

    user = await userRes.json()
  } catch {
    user = {}
  }

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
      tier_name: 'FREE TRIAL',
      tiers_project_limit: 2,
      tiers_report_limit: 1,
    }
  }

  const freeDays = constants.free_trial_days

  const userCreated = new Date(user.created_at)
  const userMs = userCreated.setDate(userCreated.getDate())

  const current = new Date()
  const todayMs = current.setDate(current.getDate())
  const daysDifference = (todayMs - userMs) / (1000 * 60 * 60 * 24)
  const trialExpired = daysDifference > freeDays ? true : false

  console.log(
    'Free trial expired?',
    trialExpired,
    'Days from reg:',
    daysDifference.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )

  if (trialExpired && tier.id === 2) {
    console.log(
      'REDIRECTING USER TO PLAN EXPIRED PAGE:',
      'user:',
      user.id,
      user.username,
      user.email,
      tier.tier_name
    )
    return {
      redirect: {
        destination: '/account/plan-expired',
        permanent: false,
      },
    }
  } else {
    console.log(
      'User plan is valid.',
      'user:',
      user.id,
      user.username,
      user.email,
      tier.tier_name
    )
  }

  // ----------------------------------

  let projects = {}

  try {
    const res = await fetch(`${API_URL}/projects/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.status == 401) {
      console.log('401 unauthorized')
      // logout()
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    if (res.status == 403) {
      console.log('403 forbidden')
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    projects = await res.json()
  } catch {
    projects = {}
  }

  if (!user.id) {
    return {
      redirect: {
        destination: '/api-down',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
      projects,
      token,
      tier,
    },
  }
}
