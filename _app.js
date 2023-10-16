import { useEffect } from 'react'
import { hotjar } from 'react-hotjar'

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@mui/material/styles'
import '@/styles/globals.css'
import theme from '../src/theme'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    hotjar.initialize(3111549, 6)
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default MyApp
