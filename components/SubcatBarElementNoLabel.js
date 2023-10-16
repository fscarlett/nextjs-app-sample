import React from 'react'

import styles from '@/styles/SubcatBarElement.module.css'

export default function SubcatBarElementNoLabel({ subcat }) {
  let percentValue = subcat.percent
  let subcatGroup = subcat.group
  const subcatClass = `${subcat.group}subcatbar`
  let subcatId = `${subcatGroup}${subcat.id}`

  return (
    <div>
      <div className={subcatClass} id={subcatId}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
      #${subcatId} { width: ${percentValue}%; }
    `,
          }}
        />
      </div>
      <div>{/* <span> {subcat.percent} %</span> */}</div>
      <div className={styles.element_label}>
        {/* {subcat.label}
        <span> {subcat.subtotal}</span>{' '} */}
      </div>
    </div>
  )
}
