import apiClient from '../../../lib/apiClient';

const agentService = {
  // No /stats endpoint on backend — compute from available data
  getStats: async (agentId) => {
    const [farmersRes, txRes] = await Promise.all([
      apiClient.get(`/agents/${agentId}/farmers`),
      apiClient.get(`/transactions/agent/${agentId}`),
    ]);
    const farmers = farmersRes.data.data || [];
    const transactions = txRes.data.data || [];
    const completed = transactions.filter(t => t.status === 'COMPLETE').length;
    const pending   = transactions.filter(t => ['OFFER_MADE','AWAITING_RESPONSE','ACCEPTED','AWAITING_PAYMENT','PAYMENT_CONFIRMED','LOGISTICS_ARRANGED','IN_TRANSIT'].includes(t.status)).length;
    return {
      totalFarmers:   farmers.length,
      pendingFarmers: farmers.filter(f => !f.hasAppAccess).length,
      assignedHubs:   0,
      totalCommission: completed * 1500,
      farmersTrend:   `${farmers.length} registered`,
      completedTransactions: completed,
      pendingTransactions:   pending,
    };
  },

  getProfile: async (agentId) => {
    const response = await apiClient.get(`/agents/${agentId}`);
    return response.data.data;
  },

  updateProfile: async (agentId, data) => {
    const response = await apiClient.put(`/agents/${agentId}`, data);
    return response.data.data;
  },

  changePassword: async (agentId, data) => {
    const response = await apiClient.put(`/agents/${agentId}/change-password`, data);
    return response.data;
  },

  getTransactions: async (agentId) => {
    const response = await apiClient.get(`/transactions/agent/${agentId}`);
    return response.data.data;
  },

  getFarmers: async (agentId) => {
    const response = await apiClient.get(`/agents/${agentId}/farmers`);
    return response.data.data;
  },

  getFarmerById: async (agentId, farmerId) => {
    const response = await apiClient.get(`/agents/${agentId}/farmers/${farmerId}`);
    return response.data.data;
  },

  registerFarmer: async (agentId, farmerData) => {
    const response = await apiClient.post(`/agents/${agentId}/farmers`, farmerData);
    return response.data;
  },

  updateFarmer: async (agentId, farmerId, data) => {
    const response = await apiClient.put(`/agents/${agentId}/farmers/${farmerId}`, data);
    return response.data.data;
  },

  getStorage: async (agentId) => {
    const response = await apiClient.get(`/storage/agent/${agentId}`);
    return response.data.data;
  },

  registerStorage: async (data) => {
    const response = await apiClient.post('/storage/register', data);
    return response.data;
  },

  logProduceForFarmer: async (agentId, farmerId, data) => {
    const response = await apiClient.post(`/produce/agent/${agentId}/farmer/${farmerId}`, data);
    return response.data.data;
  },

  arrangeLogistics: async (transactionId, logisticsPartner, trackingNumber) => {
    const response = await apiClient.put(
      `/transactions/${transactionId}/arrange-logistics`,
      null,
      { params: { logisticsPartner, trackingNumber } }
    );
    return response.data.data;
  },

  markInTransit: async (transactionId) => {
    const response = await apiClient.put(`/transactions/${transactionId}/mark-in-transit`);
    return response.data.data;
  },

  processWithdrawal: async (data) => {
    const response = await apiClient.post('/withdrawals', data);
    return response.data.data;
  },

  getWithdrawals: async (agentId) => {
    const response = await apiClient.get(`/withdrawals/agent/${agentId}`);
    return response.data.data;
  },
};

export default agentService;
