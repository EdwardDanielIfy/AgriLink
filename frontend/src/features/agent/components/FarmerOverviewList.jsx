import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../utils/auth';

export default function FarmerOverviewList({ farmers }) {
  const navigate = useNavigate();
  const user     = getUser();
  const agentId  = user?.agentId;

  if (!farmers || farmers.length === 0) {
    return (
      <div className="bg-[#002B18] rounded-[3rem] border border-white/5 p-16 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">👥</div>
        <h4 className="font-display font-black text-2xl text-white tracking-tight mb-2">No Farmers Registered</h4>
        <p className="text-white/30 text-xs font-black uppercase tracking-widest">Start onboarding farmers to build your network.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#001A0D] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="bg-[#002B18] px-10 py-8 flex items-center justify-between text-white border-b border-white/5">
        <div>
          <h3 className="font-display font-black text-2xl tracking-tighter">Farmer Registry</h3>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{farmers.length} registered</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-600/10 px-4 py-2 rounded-xl border border-orange-600/20">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
          <span className="text-[10px] font-black text-orange-300 uppercase tracking-widest">Live Registry</span>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Farmer','Location','Crop','Access','Action'].map(h => (
                <th key={h} className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-white/30">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {farmers.map(farmer => (
              <tr key={farmer.farmerId} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/agent/farmers/${farmer.farmerId}`)}>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-900/30 border border-green-500/20 flex items-center justify-center font-black text-green-400 group-hover:scale-110 transition-transform flex-shrink-0">
                      {farmer.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-white">{farmer.fullName}</p>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{farmer.phoneNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-white/60 font-bold text-sm">{farmer.location}</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-orange-600/10 border border-orange-600/20 rounded-lg text-[10px] font-black text-orange-300 uppercase tracking-widest">
                    {farmer.primaryCrop}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${farmer.hasAppAccess ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      {farmer.hasAppAccess ? 'App' : 'SMS'}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-300 group-hover:tracking-[0.2em] transition-all">
                    View →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
