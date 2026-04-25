import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store.js'
import { useRfqStore } from '../store/rfq.store.js'

const Dashboard = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const { rfqs, getAllRfqs, loading } = useRfqStore()

    useEffect(() => {
        getAllRfqs()
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error(error)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-400 border-green-500/50'
            case 'upcoming':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/50'
            case 'closed':
                return 'bg-gray-500/10 text-gray-400 border-gray-500/50'
            case 'force_closed':
                return 'bg-red-500/10 text-red-400 border-red-500/50'
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/50'
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <nav className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <img src="/assets/logo.jpg" alt="Logo" className="h-10 w-auto object-contain" />
                            <h1 className="text-xl font-bold text-white">BidFlow</h1>
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/50">
                                {user?.role}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400 text-sm">{user?.name}</span>
                            {user?.role === 'buyer' && (
                                <button
                                    onClick={() => navigate('/create-rfq')}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-all"
                                >
                                    Create RFQ
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-all border border-red-500/50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">British Auctions</h2>
                    <p className="text-gray-400">View and manage all RFQ auctions</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : rfqs.length === 0 ? (
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
                        <p className="text-gray-400 text-lg">No RFQs available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rfqs.map((rfq) => (
                            <div
                                key={rfq._id}
                                onClick={() => navigate(`/rfq/${rfq._id}`)}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-white">{rfq.title}</h3>
                                    <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(rfq.status)}`}>
                                        {rfq.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-500 text-sm">Buyer</p>
                                        <p className="text-gray-300">{rfq.buyer?.name}</p>
                                    </div>

                                    {rfq.currentLowestBid && (
                                        <div>
                                            <p className="text-gray-500 text-sm">Current Lowest Bid</p>
                                            <p className="text-green-400 font-semibold text-lg">${rfq.currentLowestBid}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-gray-500 text-sm">Bid Close Time</p>
                                        <p className="text-gray-300">{new Date(rfq.currentCloseTime).toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Forced Close Time</p>
                                        <p className="text-gray-300">{new Date(rfq.forcedCloseTime).toLocaleString()}</p>
                                    </div>
                                </div>

                                <button className="w-full mt-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-medium rounded-lg transition-all border border-green-500/50">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
