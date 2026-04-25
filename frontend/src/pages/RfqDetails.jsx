import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRfqStore } from '../store/rfq.store.js'
import { useAuthStore } from '../store/auth.store.js'
import PlaceBidModal from '../components/PlaceBidModal.jsx'

const RfqDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { currentRfq, getRfqDetails, loading } = useRfqStore()
    const [showBidModal, setShowBidModal] = useState(false)

    useEffect(() => {
        getRfqDetails(id)
    }, [id])

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

    const getActivityIcon = (type) => {
        switch (type) {
            case 'bid_placed':
                return '💰'
            case 'time_extended':
                return '⏰'
            case 'auction_started':
                return '🚀'
            case 'auction_closed':
                return '🏁'
            default:
                return '📌'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!currentRfq) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 text-center">
                    <p className="text-gray-400 text-lg">RFQ not found</p>
                </div>
            </div>
        )
    }

    const rfq = currentRfq.rfq
    const bids = currentRfq.bids || []
    const activityLog = currentRfq.activityLog || []

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <nav className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <img src="/assets/logo.jpg" alt="Logo" className="h-10 w-auto object-contain" />
                            <h1 className="text-xl font-bold text-white">RFQ Details</h1>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{rfq.title}</h2>
                            <p className="text-gray-400">Buyer: {rfq.buyer?.name}</p>
                        </div>
                        <span className={`px-4 py-2 text-sm rounded-full border ${getStatusColor(rfq.status)}`}>
                            {rfq.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-500 text-sm mb-1">Bid Start Time</p>
                            <p className="text-white font-medium">{new Date(rfq.bidStartTime).toLocaleString()}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-500 text-sm mb-1">Current Close Time</p>
                            <p className="text-white font-medium">{new Date(rfq.currentCloseTime).toLocaleString()}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-500 text-sm mb-1">Forced Close Time</p>
                            <p className="text-white font-medium">{new Date(rfq.forcedCloseTime).toLocaleString()}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-500 text-sm mb-1">Trigger Window</p>
                            <p className="text-white font-medium">{rfq.triggerWindow} minutes</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-500 text-sm mb-1">Extension Duration</p>
                            <p className="text-white font-medium">{rfq.extensionDuration} minutes</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-500 text-sm mb-1">Extension Trigger</p>
                            <p className="text-white font-medium">{rfq.extensionTriggerType?.replace(/_/g, ' ')}</p>
                        </div>
                    </div>

                    {user?.role === 'supplier' && rfq.status === 'active' && (
                        <button
                            onClick={() => setShowBidModal(true)}
                            className="w-full py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all shadow-lg shadow-green-500/20"
                        >
                            Place Bid
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Bids ({currentRfq.totalsBids})</h3>
                        {bids.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No bids yet</p>
                        ) : (
                            <div className="space-y-3">
                                {bids.map((bid) => (
                                    <div key={bid._id} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-white font-medium">{bid.supplier?.name}</p>
                                                <p className="text-gray-500 text-sm">{bid.supplier?.email}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/50">
                                                {bid.rank}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-500 text-sm">Bid Amount</p>
                                                <p className="text-green-400 font-semibold text-lg">${bid.amount}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-500 text-sm">Quote Validity</p>
                                                <p className="text-gray-300 text-sm">{new Date(bid.quoteValidity).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Activity Log</h3>
                        {activityLog.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No activity yet</p>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {activityLog.map((activity) => (
                                    <div key={activity._id} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <span className="text-2xl">{getActivityIcon(activity.activityType)}</span>
                                            <div className="flex-1">
                                                <p className="text-white font-medium capitalize">{activity.activityType.replace(/_/g, ' ')}</p>
                                                <p className="text-gray-500 text-sm">{activity.performedBy?.name}</p>
                                                {activity.details && (
                                                    <div className="mt-2 text-sm text-gray-400">
                                                        {activity.activityType === 'bid_placed' && (
                                                            <p>Bid Amount: ${activity.details.bidAmount}</p>
                                                        )}
                                                        {activity.activityType === 'time_extended' && (
                                                            <p>Reason: {activity.details.extensionReason}</p>
                                                        )}
                                                    </div>
                                                )}
                                                <p className="text-gray-600 text-xs mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showBidModal && (
                <PlaceBidModal
                    rfqId={id}
                    currentLowestBid={currentRfq.lowestBid?.amount}
                    onClose={() => setShowBidModal(false)}
                    onSuccess={() => {
                        setShowBidModal(false)
                        getRfqDetails(id)
                    }}
                />
            )}
        </div>
    )
}

export default RfqDetails
