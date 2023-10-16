import { useState } from 'react'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function UserImageUpload({ user, title, imageUploaded, token }) {
  const [image, setImage] = useState(null)

  const modalTitle = title

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('files', image)
    formData.append('ref', 'users-permissions_user') // strapi collection
    formData.append('refId', user.id) // strapi user id
    formData.append('field', 'user_logo') // strapi field

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (res.ok) {
      imageUploaded()
    }
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  return (
    <div className={styles.form}>
      <h1>{modalTitle}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input
            type='file'
            onChange={handleFileChange}
            accept='.png, .PNG, .jpg, .JPG, .jpeg, .JPEG'
          />
        </div>
        <input type='submit' value='Upload' className='btn' />
      </form>
    </div>
  )
}
