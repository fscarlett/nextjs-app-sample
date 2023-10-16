import { useState } from 'react'
import { API_URL } from '@/config/index'
import styles from '@/styles/Modal.module.css'

export default function ImageUploadProfile({
  user,
  title,
  imageUploaded,
  token,
}) {
  const [image, setImage] = useState(null)

  const modalTitle = title

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('files', image)
    formData.append('ref', 'user') // strapi collection
    formData.append('refId', user.id) // strapi user id
    formData.append('field', 'user_logo') // strapi field
    formData.append('source', 'users-permissions') // plugin name

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
    <div className={styles.modal_form}>
      <h1>{modalTitle}</h1>
      <p className={styles.image_upload_text}>
        Upload an image file. <br></br>Only png or jpeg formats are accepted.
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input
            type='file'
            name='files'
            accept='.png, .jpg, .JPEG, .jpeg, .JPG, .PNG'
            onChange={handleFileChange}
          />
        </div>
        <input type='submit' value='Upload' className='btn' />
      </form>
    </div>
  )
}
