import apiClient from '../../../lib/apiClient';

const buyerService = {
  register: async (buyerData) => {
    const response = await apiClient.post('/buyers/register', buyerData);
    return response.data;
  },

  getProfile: async (buyerId) => {
    const response = await apiClient.get(`/buyers/${buyerId}`);
    return response.data.data;
  },

  updateProfile: async (buyerId, data) => {
    const response = await apiClient.put(`/buyers/${buyerId}`, data);
    return response.data;
  },

  changePassword: async (buyerId, data) => {
    const response = await apiClient.put(`/buyers/${buyerId}/change-password`, data);
    return response.data;
  },

  getAllListings: async () => {
    const response = await apiClient.get('/marketplace/listings');
    return response.data.data;
  },

  getListingsByType: async (type) => {
    const response = await apiClient.get(`/marketplace/listings/type/${type}`);
    return response.data.data;
  },

  getListingsByTerritory: async (territory) => {
    const response = await apiClient.get(`/marketplace/listings/territory/${territory}`);
    return response.data.data;
  },

  getListingsByPrice: async (minPrice, maxPrice) => {
    const response = await apiClient.get('/marketplace/listings/price', { params: { minPrice, maxPrice } });
    return response.data.data;
  },

  makeOffer: async (data) => {
    const response = await apiClient.post('/transactions/offer', data);
    return response.data.data;
  },

  getOrders: async (buyerId) => {
    const response = await apiClient.get(`/transactions/buyer/${buyerId}`);
    return response.data.data;
  },

  getTransactionById: async (transactionId) => {
    const response = await apiClient.get(`/transactions/${transactionId}`);
    return response.data.data;
  },

  confirmDelivery: async (transactionId) => {
    const response = await apiClient.put(`/transactions/${transactionId}/confirm-delivery`);
    return response.data.data;
  },

  initializePayment: async (transactionId) => {
    const response = await apiClient.post(`/payments/initialize/${transactionId}`);
    return response.data.data;
  },

  getBanks: async () => {
    const response = await apiClient.get('/payments/banks');
    return response.data.data;
  },

  getSmsHistory: async (transactionId) => {
    const response = await apiClient.get(`/sms/transaction/${transactionId}`);
    return response.data.data;
  },
};

export default buyerService;
