import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/auth.store.js'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateRfq from './pages/CreateRfq.jsx'
import RfqDetails from './pages/RfqDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RedirectRoute from './components/RedirectRoute.jsx'

const App = () => {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
      <Routes>
        <Route path="/login" element={<RedirectRoute><Login /></RedirectRoute>} />
        <Route path="/signup" element={<RedirectRoute><Signup /></RedirectRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-rfq" element={<ProtectedRoute><CreateRfq /></ProtectedRoute>} />
        <Route path="/rfq/:id" element={<ProtectedRoute><RfqDetails /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  )
}

export default App