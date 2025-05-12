import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@radix-ui/themes/styles.css'
import App from './App.jsx'

import { Theme as RadixTheme } from '@radix-ui/themes'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

// Google Fonts: Instrument Sans - add in index.html instead
const muiTheme = createTheme({
  typography: {
    fontFamily: '"Rethink Sans", sans-serif',
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RadixTheme accentColor="red" radius="large" scaling="105%">
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </RadixTheme>
  </StrictMode>
)
