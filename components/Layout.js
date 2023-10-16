import Head from 'next/head'

import Header from './Header'
import { Container } from '@mui/material'

export default function Layout({ title, keywords, description, children }) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin />
        <link
          href='https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap'
          rel='stylesheet'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
        />
      </Head>

      <Header />

      <Container maxWidth='xl'>{children}</Container>
    </div>
  )
}

Layout.defaultProps = {
  title: 'Bond - CO2 Calculations by SandBox',
  description: "Calculate and control your project's carbon impact",
  keywords: 'climate, carbon, sequestration, landscaping',
}
