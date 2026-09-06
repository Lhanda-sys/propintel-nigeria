import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './hooks/useAuth'
import { RequireAuth, RequireAdmin } from './components/auth/guards'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import MapSearch from './pages/MapSearch'
import PropertyDetails from './pages/PropertyDetails'
import Professionals from './pages/Professionals'
import ProfessionalProfile from './pages/ProfessionalProfile'
import Messages from './pages/Messages'
import BuyerDashboard from './pages/BuyerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import ListingWizard from './pages/ListingWizard'
import Compare from './pages/Compare'
import AuthPage from './pages/AuthPage'
import ProfessionalOnboarding from './pages/ProfessionalOnboarding'
import Account from './pages/Account'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const bare = pathname.startsWith('/messages')
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!bare && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/map" element={<MapSearch />} />
            <Route path="/properties/:slug" element={<PropertyDetails />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/professionals/:id" element={<ProfessionalProfile />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/dashboard/listings/new" element={<ListingWizard />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register/professional" element={<RequireAuth><ProfessionalOnboarding /></RequireAuth>} />
            <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  )
}
