import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import VoiceFast from './VoiceFast.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <VoiceFast /> */}
    <App />
  </StrictMode>,
)
