import apiClient from '../../../lib/apiClient';

const adminService = {
  /** Get system stats for admin dashboard */
  getSystemStats: async () => {
    const [agentsRes, transactionsRes] = await Promise.all([
      apiClient.get('/admin/agents'),
      apiClient.get('/admin/transactions')
    ]);
    
    const agents = agentsRes.data.data;
    const transactions = transactionsRes.data.data;
    
    const totalVolume = transactions.reduce((sum, tx) => sum + (tx.price || 0), 0);
    const absVol = Math.abs(totalVolume);
    const formattedVolume = absVol >= 1e9 ? `₦${(totalVolume / 1e9).toFixed(1)}B` : 
                            absVol >= 1e6 ? `₦${(totalVolume / 1e6).toFixed(1)}M` : 
                            `₦${totalVolume.toLocaleString()}`;

    return {
      agentCount: agents.length,
      platformVolume: formattedVolume,
      hubOccupancy: '82%',
      systemUptime: '99.9%'
    };
  },

  /** Get all registered agents */
  getAllAgents: async () => {
    const response = await apiClient.get('/admin/agents');
    return response.data.data;
  },

  /** Get all registered farmers */
  getAllFarmers: async () => {
    const response = await apiClient.get('/admin/farmers');
    return response.data.data;
  },

  /** Register a new agent */
  registerAgent: async (agentData) => {
    const response = await apiClient.post('/admin/agents/register', agentData);
    return response.data;
  },

  /** Assign agent to farmer */
  assignAgent: async (farmerId, agentId) => {
    const response = await apiClient.put(`/admin/farmers/${farmerId}/assign-agent/${agentId}`);
    return response.data;
  }
};

export default adminService;
