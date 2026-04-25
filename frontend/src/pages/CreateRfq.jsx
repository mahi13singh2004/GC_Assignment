import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRfqStore } from '../store/rfq.store.js'
import { useAuthStore } from '../store/auth.store.js'

const CreateRfq = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { createRfq, loading, err } = useRfqStore()

    const [form, setForm] = useState({
        title: '',
        bidStartTime: '',
        bidCloseTime: '',
        forcedCloseTime: '',
        pickupServiceDate: '',
        triggerWindow: '',
        extensionDuration: '',
        extensionTriggerType: 'bid_received'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createRfq(form)
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    if (user?.role !== 'buyer') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="bg-[#1a1a1a] border border-red-500/50 rounded-xl p-8 text-center">
                    <p className="text-red-400 text-lg">Only buyers can create RFQs</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <nav className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <img src="/assets/logo.jpg" alt="Logo" className="h-10 w-auto object-contain" />
                            <h1 className="text-xl font-bold text-white">Create RFQ</h1>
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">New Auction</h2>
                    <p className="text-gray-400">Configure your British Auction parameters</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mr-3 text-sm border border-green-500/50">1</span>
                            Basic Information
                        </h3>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            placeholder="Enter auction title"
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mr-3 text-sm border border-green-500/50">2</span>
                            Timeline
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-gray-400">Start Time</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, bidStartTime: new Date().toISOString().slice(0, 16) })}
                                        className="text-xs px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 transition-all"
                                    >
                                        Now
                                    </button>
                                </div>
                                <input
                                    type="datetime-local"
                                    value={form.bidStartTime}
                                    onChange={(e) => setForm({ ...form, bidStartTime: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-gray-400">Close Time</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, bidCloseTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16) })}
                                        className="text-xs px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 transition-all"
                                    >
                                        +1h
                                    </button>
                                </div>
                                <input
                                    type="datetime-local"
                                    value={form.bidCloseTime}
                                    onChange={(e) => setForm({ ...form, bidCloseTime: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-gray-400">Forced Close</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, forcedCloseTime: new Date(Date.now() + 7200000).toISOString().slice(0, 16) })}
                                        className="text-xs px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 transition-all"
                                    >
                                        +2h
                                    </button>
                                </div>
                                <input
                                    type="datetime-local"
                                    value={form.forcedCloseTime}
                                    onChange={(e) => setForm({ ...form, forcedCloseTime: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-gray-400">Service Date</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, pickupServiceDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16) })}
                                        className="text-xs px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 transition-all"
                                    >
                                        +1d
                                    </button>
                                </div>
                                <input
                                    type="datetime-local"
                                    value={form.pickupServiceDate}
                                    onChange={(e) => setForm({ ...form, pickupServiceDate: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mr-3 text-sm border border-green-500/50">3</span>
                            Extension Rules
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Trigger Window</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={form.triggerWindow}
                                        onChange={(e) => setForm({ ...form, triggerWindow: e.target.value })}
                                        required
                                        placeholder="10"
                                        className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">min</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Extension Duration</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={form.extensionDuration}
                                        onChange={(e) => setForm({ ...form, extensionDuration: e.target.value })}
                                        required
                                        placeholder="5"
                                        className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">min</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Trigger Type</label>
                                <select
                                    value={form.extensionTriggerType}
                                    onChange={(e) => setForm({ ...form, extensionTriggerType: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                >
                                    <option value="bid_received">Any Bid</option>
                                    <option value="any_rank_change">Rank Change</option>
                                    <option value="l1_rank_change">L1 Change</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-xs text-blue-400">
                                Auction extends by <span className="font-semibold">{form.extensionDuration || 'X'}</span> minutes when triggered within the last <span className="font-semibold">{form.triggerWindow || 'Y'}</span> minutes
                            </p>
                        </div>
                    </div>

                    {err && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {err}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                        >
                            {loading ? 'Creating...' : 'Create Auction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateRfq
