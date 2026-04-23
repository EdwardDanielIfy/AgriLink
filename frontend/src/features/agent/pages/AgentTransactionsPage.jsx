import { useQuery } from '@tanstack/react-query';
import agentService from '../services/agentService';
import { getUser } from '../../../utils/auth';

const STATUS_COLOR = {
  OFFER_MADE:'text-blue-400 bg-blue-500/10 border-blue-500/20',
  AWAITING_RESPONSE:'text-amber-400 bg-amber-500/10 border-amber-500/20',
  ACCEPTED:'text-green-400 bg-green-500/10 border-green-500/20',
  REJECTED:'text-red-400 bg-red-500/10 border-red-500/20',
  AWAITING_PAYMENT:'text-purple-400 bg-purple-500/10 border-purple-500/20',
  PAYMENT_CONFIRMED:'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  LOGISTICS_ARRANGED:'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  IN_TRANSIT:'text-orange-400 bg-orange-500/10 border-orange-500/20',
  DELIVERED:'text-teal-400 bg-teal-500/10 border-teal-500/20',
  COMPLETE:'text-green-300 bg-green-600/10 border-green-600/20',
  EXPIRED:'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

export default function AgentTransactionsPage() {
  const user    = getUser();
  const agentId = user?.agentId;

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['agent-transactions', agentId],
    queryFn: () => agentService.getTransactions(agentId),
    enabled: !!agentId,
  });

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <span className="inline-block px-4 py-1.5 bg-orange-600/20 text-orange-300 font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 border border-orange-600/20">
            Financial Telemetry
          </span>
          <h2 className="font-display font-black text-6xl tracking-tighter text-white leading-[0.85]">
            Network <br /><span className="text-orange-300">Ledger.</span>
          </h2>
          <p className="mt-4 text-white/30 font-bold text-xs uppercase tracking-[0.2em] max-w-md">
            All verified trade activity in your territory
          </p>
        </div>
      </div>

      <div className="bg-[#001A0D] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="bg-[#002B18] px-10 py-8 border-b border-white/5 text-white">
          <h3 className="font-display font-black text-2xl tracking-tighter">Territory Trade Log</h3>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Immutable Transaction Records</p>
        </div>

        <div className="p-6 overflow-x-auto">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-white/20 font-black animate-pulse uppercase tracking-widest">Loading...</div>
          ) : (!transactions || transactions.length === 0) ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📉</div>
              <p className="text-white/30 font-black uppercase tracking-widest text-xs">No transactions yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Reference','Farmer → Buyer','Amount','Status','Date'].map(h => (
                    <th key={h} className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map(tx => (
                  <tr key={tx.transactionId} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                        {tx.transactionId}
                    </td>
                    <td className="p-6">
                      <p className="font-black text-white text-sm">{tx.farmerId}</p>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-0.5">→ {tx.buyerId}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-lg text-white tracking-tighter">₦{(tx.offeredPrice||0).toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-white/40">{tx.quantitySold} units</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLOR[tx.status] || 'text-white/40 bg-white/5 border-white/10'}`}>
                        {tx.status?.replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="p-6 text-white/30 text-xs font-bold">
                      {new Date(tx.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
