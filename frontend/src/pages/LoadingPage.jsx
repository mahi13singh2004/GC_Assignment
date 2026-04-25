import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios.util.js'

const LoadingPage = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState('Waking up server...')
    const [dots, setDots] = useState('')

    useEffect(() => {
        const checkBackend = async () => {
            try {
                await axiosInstance.get('/api/auth/checkAuth')
                setStatus('Server is ready!')
                setTimeout(() => {
                    navigate('/login')
                }, 500)
            } catch (error) {
                if (error.response) {
                    setStatus('Server is ready!')
                    setTimeout(() => {
                        navigate('/login')
                    }, 500)
                } else {
                    setStatus('Connecting to server...')
                    setTimeout(checkBackend, 2000)
                }
            }
        }

        checkBackend()
    }, [navigate])

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.')
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
                <div className="mb-8">
                    <img src="/assets/logo.jpg" alt="Logo" className="h-32 w-auto mx-auto object-contain" />
                </div>
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-lg min-w-50">
                        {status}{dots}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoadingPage
