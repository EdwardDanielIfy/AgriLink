import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../services/adminService';
import { useNavigate } from 'react-router-dom';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState('agents');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ['admin-agents'],
    queryFn: adminService.getAllAgents,
  });

  const { data: farmers, isLoading: farmersLoading } = useQuery({
    queryKey: ['admin-farmers'],
    queryFn: adminService.getAllFarmers,
  });

  const assignMutation = useMutation({
    mutationFn: ({ farmerId, agentId }) => adminService.assignAgent(farmerId, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-farmers']);
      setAssignModal(null);
      setSelectedAgent('');
    },
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <span className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 font-black text-[10px] uppercase tracking-[0.4em] rounded-full mb-4 border border-green-500/20">
            Registry Control
          </span>
          <h2 className="font-display font-black text-6xl tracking-tighter text-white leading-[0.85]">
            User <br /><span className="text-white/30 italic">Management.</span>
          </h2>
        </div>
        <button
          onClick={() => navigate('/dashboard/admin/agents/register')}
          className="bg-green-500 text-black px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:scale-105 transition-all"
        >
          Add New Agent
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#1A1A1A] p-2 rounded-[2rem] border border-white/5 w-fit">
        {['agents','farmers'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-green-500 text-black' : 'text-white/40 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] rounded-[3rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Identity</th>
                <th className="text-left p-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{activeTab === 'agents' ? 'Territory' : 'Location'}</th>
                <th className="text-left p-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Status</th>
                <th className="text-right p-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeTab === 'agents' ? (
                agentsLoading ? (
                  <tr><td colSpan="4" className="p-20 text-center text-white/20 font-black animate-pulse uppercase tracking-widest">Scanning Agent Nodes...</td></tr>
                ) : (agents || []).map(agent => (
                  <tr key={agent.agentId} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center font-black text-green-400 text-sm group-hover:scale-110 transition-transform">
                          {agent.fullName?.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-black text-white text-lg tracking-tight">{agent.fullName}</span>
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{agent.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-10">
                      <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-green-400 uppercase tracking-widest">
                        {agent.territory || 'Unassigned'}
                      </span>
                    </td>
                    <td className="p-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active</span>
                      </div>
                    </td>
                    <td className="p-10 text-right">
                      <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Agent</span>
                    </td>
                  </tr>
                ))
              ) : (
                farmersLoading ? (
                  <tr><td colSpan="4" className="p-20 text-center text-white/20 font-black animate-pulse uppercase tracking-widest">Accessing Crop Registry...</td></tr>
                ) : (farmers || []).map(farmer => (
                  <tr key={farmer.farmerId} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white text-sm group-hover:scale-110 transition-transform">
                          {farmer.fullName?.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-black text-white text-lg tracking-tight">{farmer.fullName}</span>
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{farmer.primaryCrop}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-10 text-sm font-bold text-white/60">{farmer.location}</td>
                    <td className="p-10">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${farmer.hasAppAccess ? 'bg-green-400' : 'bg-red-500'}`}></span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                          {farmer.hasAppAccess ? 'Smartphone' : 'SMS Only'}
                        </span>
                      </div>
                    </td>
                    <td className="p-10 text-right">
                      <button
                        onClick={() => setAssignModal(farmer)}
                        className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-green-400 transition-all underline underline-offset-4"
                      >
                        Assign Agent
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Agent Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-[3rem] w-full max-w-md p-10 shadow-2xl">
            <h3 className="font-display font-black text-2xl text-white mb-2">Assign Agent</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
              Farmer: {assignModal.fullName}
            </p>
            <div className="space-y-4 mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Agent</label>
              <select
                value={selectedAgent}
                onChange={e => setSelectedAgent(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white font-bold focus:outline-none focus:border-green-500 transition-all"
              >
                <option value="">-- Choose Agent --</option>
                {(agents || []).map(a => (
                  <option key={a.agentId} value={a.agentId} className="bg-[#1A1A1A]">
                    {a.fullName} — {a.territory || 'No territory'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setAssignModal(null)} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10">
                Cancel
              </button>
              <button
                onClick={() => assignMutation.mutate({ farmerId: assignModal.farmerId, agentId: selectedAgent })}
                disabled={!selectedAgent || assignMutation.isPending}
                className="flex-1 bg-green-500 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
              >
                {assignMutation.isPending ? 'Assigning...' : 'Confirm ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
