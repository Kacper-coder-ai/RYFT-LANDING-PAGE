import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import {
  getPostHogOptions,
  isPostHogConfigured,
} from './lib/posthogConfig'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY?.trim() ?? ''

const appTree = (
  <AuthProvider>
    <App />
  </AuthProvider>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPostHogConfigured() ? (
      <PostHogProvider apiKey={posthogKey} options={getPostHogOptions()}>
        {appTree}
      </PostHogProvider>
    ) : (
      appTree
    )}
  </StrictMode>,
)
