import { useState } from 'react'
import { useRfqStore } from '../store/rfq.store.js'

const PlaceBidModal = ({ rfqId, currentLowestBid, onClose, onSuccess }) => {
    const { placeBid, loading, err } = useRfqStore()
    const [form, setForm] = useState({
        amount: '',
        quoteValidity: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await placeBid({
                rfqId,
                amount: parseFloat(form.amount),
                quoteValidity: form.quoteValidity
            })
            onSuccess()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold text-white mb-4">Place Bid</h3>

                {currentLowestBid && (
                    <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg mb-4 text-sm">
                        Current Lowest Bid: ${currentLowestBid}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Bid Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                            placeholder="Enter your bid amount"
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Quote Validity</label>
                        <input
                            type="date"
                            value={form.quoteValidity}
                            onChange={(e) => setForm({ ...form, quoteValidity: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {err && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {err}
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                        >
                            {loading ? 'Placing...' : 'Place Bid'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PlaceBidModal
