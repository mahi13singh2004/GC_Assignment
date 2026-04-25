import { useAuthStore } from "../store/auth.store.js"
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthStore()

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (user) {
        return children
    }

    return <Navigate to="/login" />
}

export default ProtectedRoute