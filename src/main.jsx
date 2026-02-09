import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ClientAssessment from './ClientAssessment.jsx'
import PractitionerReview from './PractitionerReview.jsx'
import CreateSession from './CreateSession.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Practitioner creates new assessment */}
        <Route path="/" element={<CreateSession />} />
        
        {/* Client completes assessment */}
        <Route path="/client/:token" element={<ClientAssessment />} />
        
        {/* Practitioner reviews and completes */}
        <Route path="/practitioner/:token" element={<PractitionerReview />} />
        
        {/* Direct access to tool (original flow - for testing/demo) */}
        <Route path="/demo" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
