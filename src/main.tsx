import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Analytics } from "@vercel/analytics/react"
import './index.css'
import App from './App.tsx'
import { getTranslated } from './translations'

// The inline script in index.html already set <html lang> and <html dir> before
// first paint; the title needs the translations, so it lands here.
document.title = getTranslated('app.title')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </StrictMode>,
)
