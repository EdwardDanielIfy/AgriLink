import { Routes, Route, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/adminService';
import UserManagementPage from './UserManagementPage';
import RegisterAgentPage from './RegisterAgentPage';

const mockStats = [
  { label: 'Platform Volume',  sub: 'Total Trade Value',        icon: '📊', key: 'platformVolume' },
  { label: 'Network Nodes',    sub: 'Verified Agents',          icon: '👥', key: 'agentCount'     },
  { label: 'Hub Occupancy',    sub: 'Avg Preservation Capacity',icon: '🏢', key: 'hubOccupancy'   },
  { label: 'System Uptime',    sub: 'Infrastructure Status',    icon: '📡', key: 'systemUptime'   },
];

function AdminStatCard({ stat, value }) {
  return (
    <div className="admin-card p-10 relative overflow-hidden group hover:border-green-500 transition-all duration-300">
      <div className="admin-scanline absolute inset-0 opacity-10"></div>
      <div className="relative z-10">
        <div className="w-14 h-14 bg-green-500/10 text-green-500 flex items-center justify-center text-2xl mb-8 border border-green-500/20">
          {stat.icon}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-3">{stat.label}</p>
        <h4 className="font-display font-medium text-5xl text-white tracking-widest mb-4 tabular-nums">{value || '00.0'}</h4>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
          <p className="text-[10px] font-black uppercase tracking-widest text-green-500/80">{stat.sub}</p>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getSystemStats,
  });

  return (
    <div className="space-y-16 pb-20 p-4 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 border-b border-white/5 pb-10">
        <div className="relative group">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-500/5 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
          
          <div className="flex items-center gap-4 mb-8">
             <div className="px-3 py-1 border border-green-500/50 text-green-500 text-[9px] font-black uppercase tracking-[0.4em] bg-green-500/5">
               Terminal :: Auth_Level_Admin
             </div>
             <div className="h-px w-24 bg-white/10"></div>
          </div>

          <h2 className="font-display font-black text-7xl tracking-tighter text-white leading-[0.85] uppercase">
            Command <br /><span className="text-white/20 italic font-serif">Infrastructure.</span>
          </h2>
          <p className="mt-8 text-green-500/40 font-bold text-[10px] uppercase tracking-[0.5em]">
            Status: <span className="text-green-500 animate-pulse">[ Optimal_System_Load ]</span>
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard/admin/users')}
            className="border border-white/20 hover:bg-white hover:text-black px-10 py-6 font-black text-[10px] uppercase tracking-[0.3em] transition-all text-white"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate('/dashboard/admin/agents/register')}
            className="bg-green-500 text-black px-12 py-6 font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(34,197,94,0.3)] hover:scale-105 transition-all"
          >
            log new agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mockStats.map((s) => (
          <AdminStatCard key={s.key} stat={s} value={stats?.[s.key]} />
        ))}
      </div>

      {/* Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 admin-card p-12 relative overflow-hidden">
          <div className="admin-scanline absolute inset-0 opacity-5"></div>
          <div className="flex items-center gap-6 mb-16">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 flex items-center justify-center text-4xl border border-green-500/20">
              ⚡
            </div>
            <div>
              <h3 className="font-display font-black text-4xl tracking-tight text-white uppercase italic">Infrastructure_Health</h3>
              <p className="text-green-500/30 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Active_Datalink_Status</p>
            </div>
          </div>
          <div className="space-y-8 relative z-10">
            {[
              { name: 'Kano North Preservation Hub',   status: 'Optimal',      health: 98 },
              { name: 'Ikorodu Digital Link Pipeline',  status: 'Heavy Traffic',health: 74 },
              { name: 'Benue Regional Grain Silos',     status: 'Optimal',      health: 94 },
            ].map((node, i) => (
              <div key={i} className="bg-white/5 p-8 border border-white/5 group hover:border-green-500/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-black text-sm tracking-[0.2em] text-white uppercase">{node.name}</span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${node.health > 80 ? 'text-green-500' : 'text-amber-500'}`}>
                    :: {node.status}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${node.health > 80 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`}
                    style={{ width: `${node.health}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="admin-card p-10 flex flex-col relative overflow-hidden">
          <div className="admin-scanline absolute inset-0 opacity-5"></div>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-white/5 flex items-center justify-center text-2xl border border-white/10 text-green-500">🔐</div>
            <div>
              <h3 className="font-display font-black text-xl tracking-tight text-white uppercase">Security_Center</h3>
              <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Integrity_Audit</p>
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <div className="p-8 bg-red-500/5 border border-red-500/40 relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-2 h-2 bg-red-500 animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Critical :: Anomalous_Pattern</span>
              </div>
              <p className="text-xs font-bold text-white/50 mb-10 leading-relaxed">Detected unauthorized relay attempt from IP 192.162.0.1. Immediate audit required.</p>
              <button className="w-full bg-red-600 text-white py-4 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                Force_Audit_Entity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Routes>
      <Route index element={<AdminOverview />} />
      <Route path="users" element={<UserManagementPage />} />
      <Route path="agents/register" element={<RegisterAgentPage />} />
    </Routes>
  );
}
