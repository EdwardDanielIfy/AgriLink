import apiClient from '../../../lib/apiClient';

const farmerService = {
  register: async (farmerData) => {
    const response = await apiClient.post('/farmers/register', farmerData);
    return response.data;
  },

  getDashboardData: async (farmerId) => {
    const response = await apiClient.get(`/farmers/${farmerId}`);
    return response.data.data;
  },

  getStorageDebt: async (farmerId) => {
    const response = await apiClient.get(`/farmers/${farmerId}/storage-debt`);
    return response.data.data;
  },

  getAgentContact: async (farmerId) => {
    const response = await apiClient.get(`/farmers/${farmerId}/agent-contact`);
    return response.data.data;
  },

  updateProfile: async (farmerId, data) => {
    const response = await apiClient.put(`/farmers/${farmerId}`, data);
    return response.data.data;
  },

  changePassword: async (farmerId, data) => {
    const response = await apiClient.put(`/farmers/${farmerId}/change-password`, data);
    return response.data;
  },

  getListings: async (farmerId) => {
    const response = await apiClient.get(`/produce/farmer/${farmerId}`);
    return response.data.data;
  },

  createListing: async (farmerId, produceData) => {
    const response = await apiClient.post(`/produce/farmer/${farmerId}`, produceData);
    return response.data.data;
  },

  getTransactions: async (farmerId) => {
    const response = await apiClient.get(`/transactions/farmer/${farmerId}`);
    return response.data.data;
  },

  acceptOffer: async (transactionId) => {
    const response = await apiClient.put(`/transactions/${transactionId}/accept`);
    return response.data.data;
  },

  rejectOffer: async (transactionId) => {
    const response = await apiClient.put(`/transactions/${transactionId}/reject`);
    return response.data.data;
  },

  getStoragesByAgent: async (agentId) => {
    const response = await apiClient.get(`/storage/agent/${agentId}`);
    return response.data.data;
  },

  getStoragesByTerritory: async (territory) => {
    const response = await apiClient.get(`/storage/territory/${encodeURIComponent(territory)}`);
    return response.data.data;
  },

  getSmsHistory: async (farmerId) => {
    const response = await apiClient.get(`/sms/farmer/${farmerId}`);
    return response.data.data;
  },
};

export default farmerService;
