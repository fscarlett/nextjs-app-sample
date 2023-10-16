// the main project UI.
// pages/projects/[id].js
// user selects the active input group component from the vertical nav. On load Hardscape is selected.
//

import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import cookie from 'cookie'
import { parseCookies } from '@/helpers/index'

import Image from 'next/image'
import { useRouter } from 'next/router'

import Layout from '@/components/Layout'
import ProjectHeader from '@/components/ProjectHeader'
import { API_URL } from '@/config/index'
import styles from '@/styles/Project.module.css'
import Hardscape from '@/components/inputs/HardscapeInputGroup'
import Grading from '@/components/inputs/GradingInputGroup'
import Drainage from '@/components/inputs/DrainageInputGroup'
import Irrigation from '@/components/inputs/IrrigationInputGroup'
import RainCatchment from '@/components/inputs/RainCatchmentInputGroup'
import Lighting from '@/components/inputs/LightingInputGroup'
import WaterFeatures from '@/components/inputs/WaterFeaturesInputGroup'
import PlantMaterial from '@/components/inputs/PlantMaterialInputGroup'
import Soils from '@/components/inputs/SoilsMulchingInputGroup'
import Transportation from '@/components/inputs/TransportationInputGroup'
import Sequestration from '@/components/inputs/SequestrationInputGroup'
import Deliveries from '@/components/inputs/DeliveriesInputGroup'
import Equipment from '@/components/inputs/EquipmentInputGroup'
import ProjectsDropDown from '@/components/ProjectsDropDown'

export default function ProjectPage({ proj, token, id, user, allProjects }) {
  const router = useRouter()

  allProjects.sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))

  let otherProjects = allProjects.filter(
    (p) => p.project_name != proj.project_name
  )

  const [activeGroup, setActiveGroup] = useState('hardscape')

  const [updatedProject, setUpdatedProject] = useState({
    ...proj,
  })

  const handleGroupChange = async (e) => {
    const res = await fetch(`${API_URL}/projects?id=${id}`)
    const fetchedProject = await res.json()
    const shinyProj = fetchedProject[0]
    setUpdatedProject({
      ...shinyProj,
    })

    const groupId = e.target.id
    const groupName = e.target.name
    const group = groupId || groupName
    setActiveGroup(group)
  }

  const project_data = proj.inputs_data

  return (
    <Layout>
      <ProjectsDropDown
        proj={proj}
        allProjects={otherProjects}
      ></ProjectsDropDown>
      <ProjectHeader proj={proj} otherProjects={otherProjects}></ProjectHeader>

      <div className={styles.project}>
        <div className={styles.project_navbar}>
          <ul className={styles.input_group_nav}>
            <li
              onClick={handleGroupChange}
              id='hardscape'
              className={styles.input_group_button}
            >
              {activeGroup === 'hardscape' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/hardscape-active-dark.png'
                  height={70}
                  width={70}
                  name='hardscape'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/hardscape.png'
                  height={70}
                  width={70}
                  name='hardscape'
                />
              )}
              Hardscape
            </li>
            <li
              onClick={handleGroupChange}
              id='grading'
              className={styles.input_group_button}
            >
              {activeGroup === 'grading' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/grading-active-dark.png'
                  height={70}
                  width={70}
                  name='grading'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/grading.png'
                  height={70}
                  width={70}
                  name='grading'
                />
              )}
              Grading
            </li>
            <li
              onClick={handleGroupChange}
              id='drainage'
              className={styles.input_group_button}
            >
              {activeGroup === 'drainage' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/drainage-active-dark.png'
                  height={70}
                  width={70}
                  name='drainage'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/drainage.png'
                  height={70}
                  width={70}
                  name='drainage'
                />
              )}
              Drainage
            </li>
            <li
              onClick={handleGroupChange}
              id='irrigation'
              className={styles.input_group_button}
            >
              {activeGroup === 'irrigation' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/irrigation-active-dark.png'
                  height={70}
                  width={70}
                  name='irrigation'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/irrigation.png'
                  height={70}
                  width={70}
                  name='irrigation'
                />
              )}
              Irrigation
            </li>
            <li
              onClick={handleGroupChange}
              id='rain_catchment'
              className={styles.input_group_button}
            >
              {activeGroup === 'rain_catchment' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/rain-active-dark.png'
                  height={70}
                  width={70}
                  name='rain_catchment'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/rain.png'
                  height={70}
                  width={70}
                  name='rain_catchment'
                />
              )}
              Rain Catchment
            </li>
            <li
              onClick={handleGroupChange}
              id='lighting'
              className={styles.input_group_button}
            >
              {activeGroup === 'lighting' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/lighting-active-dark.png'
                  height={70}
                  width={70}
                  name='lighting'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/lighting.png'
                  height={70}
                  width={70}
                  name='lighting'
                />
              )}
              Lighting
            </li>

            <li
              onClick={handleGroupChange}
              id='water_features'
              className={styles.input_group_button}
            >
              {activeGroup === 'water_features' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/water-active-dark.png'
                  height={70}
                  width={70}
                  name='water_features'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/water.png'
                  height={70}
                  width={70}
                  name='water_features'
                />
              )}
              Water Features
            </li>

            <li
              onClick={handleGroupChange}
              id='plants'
              className={styles.input_group_button}
            >
              {activeGroup === 'plants' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/plants-active-dark.png'
                  height={70}
                  width={70}
                  name='plants'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/plants.png'
                  height={70}
                  width={70}
                  name='plants'
                />
              )}
              Plant Material
              {activeGroup === 'plants' && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
      #plants { font-weight: bold;  box-shadow: 0px 0 10px #030d3b }
    `,
                  }}
                />
              )}
            </li>

            <li
              onClick={handleGroupChange}
              id='soils'
              className={styles.input_group_button}
            >
              {activeGroup === 'soils' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/soils-active-dark.png'
                  height={70}
                  width={70}
                  name='soils'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/soils.png'
                  height={70}
                  width={70}
                  name='soils'
                />
              )}
              Soils and Mulching
            </li>

            <li
              onClick={handleGroupChange}
              id='transportation'
              className={styles.input_group_button}
            >
              {activeGroup === 'transportation' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/transportation-active-dark.png'
                  height={70}
                  width={70}
                  name='transportation'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/transportation.png'
                  height={70}
                  width={70}
                  name='transportation'
                />
              )}
              Transportation
            </li>

            <li
              onClick={handleGroupChange}
              id='deliveries'
              className={styles.input_group_button}
            >
              {activeGroup === 'deliveries' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/deliveries-active-dark.png'
                  height={70}
                  width={70}
                  name='deliveries'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/deliveries.png'
                  height={70}
                  width={70}
                  name='deliveries'
                />
              )}
              Deliveries
            </li>

            <li
              onClick={handleGroupChange}
              id='equipment'
              className={styles.input_group_button}
            >
              {activeGroup === 'equipment' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/equipment-active-dark.png'
                  height={70}
                  width={70}
                  name='equipment'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/equipment.png'
                  height={70}
                  width={70}
                  name='equipment'
                />
              )}
              Equipment
            </li>

            <li
              onClick={handleGroupChange}
              id='sequestration'
              className={styles.input_group_button}
            >
              {activeGroup === 'sequestration' ? (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/sequestration-active-dark.png'
                  height={70}
                  width={70}
                  name='sequestration'
                />
              ) : (
                <Image
                  className={styles.input_group_nav_icon}
                  src='/images/sequestration.png'
                  height={70}
                  width={70}
                  name='sequestration'
                />
              )}
              {activeGroup === 'sequestration' && (
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
      #sequestration { font-weight: bold;  box-shadow: 0px 0 10px #030d3b }
    `,
                  }}
                />
              )}
              Sequestration
            </li>
          </ul>
        </div>

        <div className={styles.project_inputs}>
          <ToastContainer />

          <p className={styles.project_user_fullname}>{user.user_full_name}</p>

          {activeGroup === 'hardscape' && (
            <Hardscape proj={updatedProject} token={token}></Hardscape>
          )}

          {activeGroup === 'grading' && (
            <Grading proj={updatedProject} token={token}></Grading>
          )}

          {activeGroup === 'drainage' && (
            <Drainage proj={updatedProject} token={token}></Drainage>
          )}

          {activeGroup === 'irrigation' && (
            <Irrigation proj={updatedProject} token={token}></Irrigation>
          )}

          {activeGroup === 'rain_catchment' && (
            <RainCatchment proj={updatedProject} token={token}></RainCatchment>
          )}

          {activeGroup === 'lighting' && (
            <Lighting proj={updatedProject} token={token}></Lighting>
          )}

          {activeGroup === 'water_features' && (
            <WaterFeatures proj={updatedProject} token={token}></WaterFeatures>
          )}

          {activeGroup === 'plants' && (
            <PlantMaterial proj={updatedProject} token={token}></PlantMaterial>
          )}

          {activeGroup === 'soils' && (
            <Soils proj={updatedProject} token={token}></Soils>
          )}

          {activeGroup === 'transportation' && (
            <Transportation
              proj={updatedProject}
              token={token}
            ></Transportation>
          )}

          {activeGroup === 'deliveries' && (
            <Deliveries proj={updatedProject} token={token}></Deliveries>
          )}

          {activeGroup === 'equipment' && (
            <Equipment proj={updatedProject} token={token}></Equipment>
          )}

          {activeGroup === 'sequestration' && (
            <Sequestration proj={updatedProject} token={token}></Sequestration>
          )}
        </div>
      </div>
    </Layout>
  )
}

/* -------------------------------------------------------------------------- */
/*                            GET SERVER SIDE PROPS                           */
/* -------------------------------------------------------------------------- */
export async function getServerSideProps({ req, query: { id } }) {
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

  const res = await fetch(`${API_URL}/projects?id=${id}`)

  if (res.status == 403) {
    console.log('403 forbidden')
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    }
  }

  const projects = await res.json()
  const project = projects[0]
  if (!project || !project.user) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  // kick them out if not their project
  if (project.user.id != user.id) {
    console.log('user does not own this project.')
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  // ----- get all the users projects to put in nav dropdown  -----------------------------

  const allProjectsRes = await fetch(`${API_URL}/projects/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (allProjectsRes.status == 401) {
    console.log('401 unauthorized')
    // logout()
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (allProjectsRes.status == 403) {
    console.log('403 forbidden')
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const fullProjects = await allProjectsRes.json()
  const projectsInfo = []

  fullProjects.map((p) => {
    let pro = {
      id: p.id,
      project_name: p.project_name,
      updated_at: p.updated_at,
    }

    projectsInfo.push(pro)
  })

  return {
    props: {
      proj: project,
      token,
      id,
      user,
      allProjects: projectsInfo,
    },
  }
}
