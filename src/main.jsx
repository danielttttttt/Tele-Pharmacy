import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeModeScript } from "flowbite-react";
import App from './App'
import './index.css'

// Initialize mock service worker in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Initializing mock service worker...')
  const { worker } = await import('./mocks/browser')
  worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false
  }).then(() => {
    console.log('Mock service worker started successfully')
    
    // Test the API
    setTimeout(() => {
      console.log('Making test fetch request to /api/medications')
      fetch('/api/medications')
        .then(response => {
          console.log('Test fetch response status:', response.status)
          console.log('Test fetch response headers:', [...response.headers.entries()])
          return response.json()
        })
        .then(data => {
          console.log('Test fetch data received:', data)
        })
        .catch(error => {
          console.error('Test fetch error:', error)
        })
    }, 2000)
  }).catch((error) => {
    console.error('Failed to start mock service worker:', error)
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeScript />
    <App />
  </React.StrictMode>,
)