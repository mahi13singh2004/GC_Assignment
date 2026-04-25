import { create } from "zustand"
import axiosInstance from "../utils/axios.util.js"

export const useRfqStore = create((set, get) => ({
    loading: false,
    err: null,
    rfqs: [],
    currentRfq: null,

    createRfq: async (data) => {
        try {
            set({ loading: true, err: null })
            const res = await axiosInstance.post("/api/rfq/create", data)
            return res.data
        }
        catch (error) {
            set({ err: error.response?.data?.message || "Failed to create RFQ" })
            throw error
        }
        finally {
            set({ loading: false })
        }
    },

    getAllRfqs: async () => {
        try {
            set({ loading: true, err: null })
            const res = await axiosInstance.get("/api/rfq")
            set({ rfqs: res.data.updatedRFQ })
        }
        catch (error) {
            set({ err: error.response?.data?.message || "Failed to fetch RFQs" })
            throw error
        }
        finally {
            set({ loading: false })
        }
    },

    getRfqDetails: async (id) => {
        try {
            set({ loading: true, err: null })
            const res = await axiosInstance.get(`/api/rfq/${id}`)
            set({ currentRfq: res.data })
            return res.data
        }
        catch (error) {
            set({ err: error.response?.data?.message || "Failed to fetch RFQ details" })
            throw error
        }
        finally {
            set({ loading: false })
        }
    },

    placeBid: async (data) => {
        try {
            set({ loading: true, err: null })
            const res = await axiosInstance.post("/api/rfq/bid", data)
            return res.data
        }
        catch (error) {
            set({ err: error.response?.data?.message || "Failed to place bid" })
            throw error
        }
        finally {
            set({ loading: false })
        }
    },
}))
