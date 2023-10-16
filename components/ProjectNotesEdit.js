import { useState } from 'react'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function ProjectNotesEdit({
  projId,
  title,
  editComplete,
  token,
}) {
  const [projectNotes, setProjectNotes] = useState('')

  const modalTitle = title

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('data', projectNotes)
    formData.append('ref', 'projects') // strapi collection
    formData.append('refId', projId) // strapi project id
    formData.append('field', 'project_notes') // strapi field

    const res = await fetch(`${API_URL}/projects/${projId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (res.ok) {
      editComplete()
    }
  }

  const handleInputChange = (e) => {
    setProjectNotes(e.target.value)
  }

  return (
    <div className={styles.form}>
      <h1>{modalTitle}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input
            type='textarea'
            name='projectnotes'
            id='projectnotes'
            value={projectNotes}
            onChange={handleInputChange}
          />
        </div>
        <input type='submit' value='Update' className='btn' />
      </form>
    </div>
  )
}
