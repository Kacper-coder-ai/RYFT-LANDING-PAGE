import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { consumeLandingScrollRestore } from './lib/landingScrollRestore'
import { LandingPage } from './pages/LandingPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { RefundPolicyPage } from './pages/RefundPolicyPage'
import { TermsPage } from './pages/TermsPage'

function ScrollToTopOnRoute() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (
      pathname === '/privacy' ||
      pathname === '/terms' ||
      pathname === '/refunds'
    ) {
      window.scrollTo(0, 0)
      return
    }
    if (pathname === '/') {
      const y = consumeLandingScrollRestore()
      if (y != null) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, y)
          })
        })
      }
    }
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRoute />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refunds" element={<RefundPolicyPage />} />
      </Routes>
    </BrowserRouter>
  )
}
