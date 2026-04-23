import { Routes, Route, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AgentStatGrid from '../components/AgentStatGrid';
import FarmerOverviewList from '../components/FarmerOverviewList';
import RegisterFarmerPage from './RegisterFarmerPage';
import FarmerDetailPage from './FarmerDetailPage';
import AgentProfilePage from './AgentProfilePage';
import AgentTransactionsPage from './AgentTransactionsPage';
import agentService from '../services/agentService';
import { getUser } from '../../../utils/auth';

function AgentOverview() {
  const navigate = useNavigate();
  const user    = getUser();
  const agentId = user?.agentId;

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['agent-stats', agentId],
    queryFn: () => agentService.getStats(agentId),
    enabled: !!agentId,
  });

  const { data: farmers, isLoading: farmersLoading } = useQuery({
    queryKey: ['agent-farmers', agentId],
    queryFn: () => agentService.getFarmers(agentId),
    enabled: !!agentId,
  });

  return (
    <div className="space-y-12 pb-20 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 relative">
        <div className="relative group">
          <div className="absolute -top-12 -left-12 w-48 h-48 border border-orange-500/10 rounded-full -z-10 animate-pulse-slow"></div>
          
          <div className="flex items-center gap-3 mb-6 bg-orange-600/10 w-fit px-3 py-1 rounded border border-orange-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-400">Node :: Territorial Uplink Active</span>
          </div>

          <h2 className="font-display font-black text-6xl tracking-tighter text-white leading-[0.85] uppercase">
            Field Ops/ <br /><span className="text-orange-500">Registry.</span>
          </h2>
          
          <div className="mt-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/30">
            <span>[ Territory ]</span>
            <span className="text-white px-2 py-1 bg-white/5 border border-white/10 rounded">
              {user?.territory || 'Unassigned_Sector'}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('farmers/register')}
          className="bg-orange-600 text-black px-12 py-7 font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_50px_rgba(249,115,22,0.2)] border-2 border-orange-700 active:scale-95"
        >
          onboard farmer
        </button>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="h-40 flex items-center justify-center font-black text-white/20 animate-pulse text-sm tracking-widest uppercase">Loading...</div>
      ) : (
        <AgentStatGrid stats={stats} />
      )}

      {/* Farmers */}
      <div className="agent-card p-12 bg-black/40">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-orange-600/10">
          <div>
            <h3 className="text-white font-black uppercase text-xl tracking-[0.2em]">Regional Managed Identity Registry</h3>
            <p className="text-orange-500/50 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Status :: Live Synchronized Data</p>
          </div>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black text-white/40 italic">Sorted_By: Recent</span>
          </div>
        </div>
        {farmersLoading ? (
          <div className="h-40 flex items-center justify-center font-black text-white/20 animate-pulse text-sm tracking-widest uppercase">Fetching_Data_Packets...</div>
        ) : (
          <FarmerOverviewList farmers={farmers} />
        )}
      </div>
    </div>
  );
}

export default function AgentDashboard() {
  return (
    <Routes>
      <Route index element={<AgentOverview />} />
      <Route path="farmers" element={<AgentOverview />} />
      <Route path="farmers/register" element={<RegisterFarmerPage />} />
      <Route path="farmers/:farmerId" element={<FarmerDetailPage />} />
      <Route path="profile" element={<AgentProfilePage />} />
      <Route path="transactions" element={<AgentTransactionsPage />} />
    </Routes>
  );
}
