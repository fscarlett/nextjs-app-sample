import { useRouter } from 'next/router'

import { parseCookies } from '@/helpers/index'
import cookie from 'cookie'
import Layout from '@/components/Layout'
import DashboardProject from '@/components/DashboardProject'
import { API_URL } from '@/config/index'
import styles from '@/styles/Dashboard.module.css'

export default function ProjectsPage({ projects, token, tier }) {
  // console.log('projects: ', projects)

  const router = useRouter()

  let projCount = 0

  if (projects) {
    projects.map((cProj) => {
      projCount++
    })
  }

  let remainingProjects = tier.tiers_project_limit - projCount

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

  const sortedProjects = projects.sort((a, b) =>
    b.updated_at > a.updated_at ? 1 : -1
  )

  console.log('sortedProjects: ', sortedProjects)

  return (
    <Layout title='My Projects'>
      <div className={styles.dash}>
        <h1>My Projects</h1>
        <div className={styles.projects_list_wrapper}>
          {projects.length === 0 && <h3>No projects found</h3>}

          {sortedProjects.map((proj) => (
            <div key={proj.id} className={styles.allprojects_project}>
              <DashboardProject proj={proj} handleDelete={deleteProject} />
            </div>
          ))}
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

  //  get the user ==========================

  const { token } = parseCookies(req)

  let user = {}

  try {
    const userRes = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    user = await userRes.json()
  } catch {
    user = {}
    if (!user.id) {
      return {
        redirect: {
          destination: '/api-down',
          permanent: false,
        },
      }
    }
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
      slug: 'none',
      tier_name: 'NONE',
      tiers_project_limit: 1,
    }
  }

  // get user's projects
  const res = await fetch(`${API_URL}/projects/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const projects = await res.json()

  return {
    props: { user, tier, token, projects },
    // revalidate: 1,
  }
}
