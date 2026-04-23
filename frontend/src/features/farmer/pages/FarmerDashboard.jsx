import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import farmerService from '../services/farmerService';
import { getUser } from '../../../utils/auth';
import FarmerStatGrid from '../components/FarmerStatGrid';
import StorageDebtWidget from '../components/StorageDebtWidget';
import AgentContactCard from '../components/AgentContactCard';
import RegisterProduceModal from '../components/RegisterProduceModal';
import FarmerTransactionsPage from './FarmerTransactionsPage';
import FarmerProfilePage from './FarmerProfilePage';

function FarmerOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user     = getUser();
  const farmerId = user?.farmerId;
  const location = useLocation();
  const path     = location.pathname;

  const { data: profile,     isLoading } = useQuery({ queryKey: ['farmerProfile', farmerId], queryFn: () => farmerService.getDashboardData(farmerId), enabled: !!farmerId });
  const { data: storageDebt }            = useQuery({ queryKey: ['storageDebt', farmerId],   queryFn: () => farmerService.getStorageDebt(farmerId),   enabled: !!farmerId });
  const { data: agent }                  = useQuery({ queryKey: ['agentContact', farmerId],  queryFn: () => farmerService.getAgentContact(farmerId),  enabled: !!farmerId });
  const { data: recentListings = [] }    = useQuery({ queryKey: ['farmerListings', farmerId],queryFn: () => farmerService.getListings(farmerId),      enabled: !!farmerId });

  const stats = {
    activeListings:   recentListings.filter(l => l.status === 'AVAILABLE').length,
    totalSales:       recentListings.filter(l => l.status === 'SOLD').reduce((s,l) => s + (l.referencePrice||0), 0),
    storageDebt:      storageDebt || 0,
    marketConnections: agent ? 1 : 0,
  };

  const formattedAgent = agent ? {
    name:   agent.fullName,
    region: agent.territory || 'Unassigned Region',
    phone:  agent.phoneNumber,
    avatar: '👨🏽‍💼',
  } : { name: 'Assigning Agent...', region: 'Pending...', phone: '---', avatar: '⏳' };

  if (isLoading) return <div className="text-center py-20 text-white/50 text-xs font-black uppercase tracking-widest animate-pulse">Loading...</div>;

  const header = (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 relative">
      <div className="relative group">
        {/* Morning Glow Visual */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px] -z-10 group-hover:bg-orange-600/20 transition-all duration-1000"></div>
        <div className="absolute top-0 -left-4 w-1 h-24 bg-gradient-to-bottom from-accent/0 via-accent/50 to-accent/0 rounded-full -z-10"></div>
        
        <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 border border-accent/20 backdrop-blur-md">
          Morning Harvest Region
        </span>
        <h2 className="font-display font-black text-6xl tracking-tighter text-white leading-none">
          Before Dawn, <br />
          <span className="text-accent italic font-serif opacity-90">{profile?.fullName.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Farmer'}.</span>
        </h2>
        <p className="mt-4 text-white/40 font-bold text-sm uppercase tracking-[0.2em] max-w-sm">
          {profile?.location || 'Preserved Registry Hub'} • {new Date().toLocaleDateString('en-NG', { weekday: 'long' })}
        </p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="farmer-btn px-16 py-8 font-black text-xs uppercase tracking-[0.2em] transform hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform">🌾</span>
        List New Yield
      </button>
    </div>
  );

  if (path.includes('/listings')) return (
    <div className="space-y-12 pb-20">
      {header}
      <ProduceTable listings={recentListings} />
      <RegisterProduceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} farmerId={farmerId} agentId={agent?.agentId} location={profile?.location} />
    </div>
  );

  if (path.includes('/debt')) return (
    <div className="space-y-12 pb-20">{header}<div className="max-w-md mx-auto"><StorageDebtWidget debt={stats.storageDebt} /></div></div>
  );

  if (path.includes('/agent')) return (
    <div className="space-y-12 pb-20">{header}<div className="max-w-md mx-auto"><AgentContactCard agent={formattedAgent} /></div></div>
  );

  return (
    <div className="space-y-12 pb-20">
      {header}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        <div className="xl:col-span-2"><FarmerStatGrid stats={stats} /></div>
        <div className="sticky top-28"><StorageDebtWidget debt={stats.storageDebt} /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ProduceTable listings={recentListings.slice(0,5)} />
        </div>
        <div className="space-y-10">
          <AgentContactCard agent={formattedAgent} className="farmer-card" />
          <div className="farmer-card p-12 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-accent rounded-full opacity-10 group-hover:scale-150 transition-transform duration-1000 blur-3xl"></div>
            <h4 className="font-display font-black text-2xl mb-4 tracking-tight">Market Pulse</h4>
            <p className="text-white/50 text-sm font-bold leading-relaxed mb-10 italic">
              "The dew is rising. Demand for {profile?.primaryCrop || 'your yield'} in Lagos Hubs is at its peak this morning."
            </p>
            <button onClick={() => setIsModalOpen(true)} className="farmer-btn w-full py-5 text-[10px]">
              Ready for Harvest →
            </button>
          </div>
        </div>
      </div>
      <RegisterProduceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} farmerId={farmerId} agentId={agent?.agentId} location={profile?.location} />
    </div>
  );
}

function ProduceTable({ listings }) {
  return (
    <div className="farmer-card overflow-hidden">
      <div className="bg-white/5 p-10 flex items-center justify-between text-white border-b border-white/10">
        <div>
          <h3 className="font-display font-black text-2xl tracking-tight">Active Inventory</h3>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Current listings in trade</p>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-white/10">
              {['Crop / Yield','Quantity','Storage','Status','Est. Value'].map(h => (
                <th key={h} className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {listings.length === 0 && (
              <tr><td colSpan="5" className="p-6 text-center text-white/40 text-[10px] font-black uppercase tracking-widest">No listings yet</td></tr>
            )}
            {listings.map(l => (
              <tr key={l.produceId} className="hover:bg-white/5 transition-colors">
                <td className="p-6 font-bold text-white">{l.produceType}</td>
                <td className="p-6 font-bold text-white/60">{l.quantity} {l.unit}</td>
                <td className="p-6">
                  {l.storageId ? (
                    <span className="text-[9px] font-black text-white/50">{l.storageId.split('-').slice(1,3).join(' ')}</span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[9px] font-black uppercase tracking-widest">Pending</span>
                  )}
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    l.status==='AVAILABLE'    ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    l.status==='SOLD'         ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    l.status==='OFFER_PENDING'? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-white/10 text-white/60 border border-white/20'
                  }`}>{l.status?.replace(/_/g,' ')}</span>
                </td>
                <td className="p-6 text-right font-black text-white">₦{(l.referencePrice||0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <Routes>
      <Route path="/*" element={<FarmerOverview />} />
      <Route path="transactions" element={<FarmerTransactionsPage />} />
      <Route path="profile" element={<FarmerProfilePage />} />
    </Routes>
  );
}
