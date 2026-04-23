import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import farmerService from '../services/farmerService';
import { getUser } from '../../../utils/auth';

const STATUS_STYLE = {
  OFFER_MADE:         'bg-blue-500/20 text-blue-400 border-blue-500/30',
  AWAITING_RESPONSE:  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ACCEPTED:           'bg-green-500/20 text-green-400 border-green-500/30',
  REJECTED:           'bg-red-500/20 text-red-400 border-red-500/30',
  AWAITING_PAYMENT:   'bg-purple-500/20 text-purple-400 border-purple-500/30',
  PAYMENT_CONFIRMED:  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  LOGISTICS_ARRANGED: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  IN_TRANSIT:         'bg-orange-500/20 text-orange-400 border-orange-500/30',
  DELIVERED:          'bg-teal-500/20 text-teal-400 border-teal-500/30',
  COMPLETE:           'bg-green-600/20 text-green-300 border-green-600/30',
  EXPIRED:            'bg-gray-500/20 text-gray-400 border-gray-500/30',
  DISPUTED:           'bg-red-600/20 text-red-300 border-red-600/30',
};

const TIMELINE = [
  'OFFER_MADE','AWAITING_RESPONSE','ACCEPTED','AWAITING_PAYMENT',
  'PAYMENT_CONFIRMED','LOGISTICS_ARRANGED','IN_TRANSIT','DELIVERED','COMPLETE'
];

function TransactionDetail({ tx, onClose, farmerId }) {
  const queryClient = useQueryClient();
  const [smsOpen, setSmsOpen] = useState(false);

  const { data: smsHistory } = useQuery({
    queryKey: ['farmer-sms', farmerId],
    queryFn: () => farmerService.getSmsHistory(farmerId),
    enabled: smsOpen,
  });

  const acceptMutation = useMutation({
    mutationFn: () => farmerService.acceptOffer(tx.transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-transactions', farmerId] });
      onClose();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => farmerService.rejectOffer(tx.transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-transactions', farmerId] });
      onClose();
    },
  });

  const currentStep = TIMELINE.indexOf(tx.status);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0D0A] border border-white/10 rounded-[3rem] w-full max-w-3xl shadow-2xl my-8">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="inline-block px-4 py-1 bg-primary/20 text-primary-400 font-black text-[10px] uppercase tracking-widest rounded-full mb-3 border border-primary/20">
                Transaction Detail
              </span>
              <h2 className="font-display font-black text-3xl text-white">
                {tx.transactionId}
              </h2>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">✕</button>
          </div>

          {/* Status Timeline */}
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Transaction Progress</p>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {TIMELINE.map((step, i) => (
                <div key={step} className="flex items-center gap-1 flex-shrink-0">
                  <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all ${
                    i < currentStep  ? 'bg-primary text-primary-950' :
                    i === currentStep ? 'bg-white text-black ring-2 ring-primary' :
                    'bg-white/5 text-white/20'
                  }`}>
                    {step.replace(/_/g,' ')}
                  </div>
                  {i < TIMELINE.length - 1 && <div className={`w-3 h-0.5 flex-shrink-0 ${i < currentStep ? 'bg-primary' : 'bg-white/10'}`}></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Offered Price', value: `₦${(tx.offeredPrice || 0).toLocaleString()}` },
              { label: 'Quantity', value: `${tx.quantitySold || '—'} units` },
              { label: 'Commission', value: tx.commissionAmount ? `₦${tx.commissionAmount.toLocaleString()}` : '—' },
              { label: 'Storage Deducted', value: tx.storageCostDeducted ? `₦${tx.storageCostDeducted.toLocaleString()}` : '—' },
              { label: 'Net Payout', value: tx.farmerNetPayout ? `₦${tx.farmerNetPayout.toLocaleString()}` : '—' },
              { label: 'Logistics', value: tx.logisticsPartner || '—' },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">{item.label}</p>
                <p className="font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Accept / Reject actions */}
          {tx.status === 'AWAITING_RESPONSE' && (
            <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p className="text-amber-400 font-black text-sm mb-2">⚡ Action Required</p>
              <p className="text-white/60 text-xs mb-6">A buyer has made an offer. Accept or reject below.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => acceptMutation.mutate()}
                  disabled={acceptMutation.isPending}
                  className="flex-1 bg-primary text-primary-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                >
                  {acceptMutation.isPending ? 'Accepting...' : '✓ Accept Offer'}
                </button>
                <button
                  onClick={() => rejectMutation.mutate()}
                  disabled={rejectMutation.isPending}
                  className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {rejectMutation.isPending ? 'Rejecting...' : '✕ Reject Offer'}
                </button>
              </div>
            </div>
          )}

          {/* SMS History Toggle */}
          <div>
            <button
              onClick={() => setSmsOpen(!smsOpen)}
              className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/20 transition-all"
            >
              {smsOpen ? '▲ Hide' : '▼ View'} SMS Notification History
            </button>
            {smsOpen && smsHistory && (
              <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                {smsHistory.length === 0 ? (
                  <p className="text-center text-white/30 text-xs font-black uppercase tracking-widest py-4">No SMS sent yet</p>
                ) : smsHistory.map(sms => (
                  <div key={sms.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${sms.delivered ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {sms.delivered ? '✓ Delivered' : '✗ Failed'}
                      </span>
                      <span className="text-[9px] text-white/30 font-bold">{new Date(sms.sentAt).toLocaleString()}</span>
                    </div>
                    <p className="text-white/70 text-xs font-bold">{sms.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FarmerTransactionsPage() {
  const user     = getUser();
  const farmerId = user?.farmerId;
  const [selected, setSelected] = useState(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['farmer-transactions', farmerId],
    queryFn: () => farmerService.getTransactions(farmerId),
    enabled: !!farmerId,
  });

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      <div>
        <span className="inline-block px-4 py-1.5 bg-primary-950 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 shadow-2xl border border-white/10">
          Trade History
        </span>
        <h2 className="font-display font-black text-6xl tracking-tighter text-white leading-none">
          My <br /><span className="text-primary-400">Transactions.</span>
        </h2>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-[3rem] border-4 border-white/10 overflow-hidden shadow-2xl">
        <div className="bg-primary-950 p-10 text-white">
          <h3 className="font-display font-black text-2xl tracking-tight">Transaction Ledger</h3>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">All trade activity</p>
        </div>

        <div className="p-4 overflow-x-auto">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-white/30 font-black uppercase tracking-widest animate-pulse">Loading...</div>
          ) : (!transactions || transactions.length === 0) ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-white/30 font-black uppercase tracking-widest text-xs">No transactions yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-white/10">
                  {['Reference','Offered Price','Quantity','Status','Date','Action'].map(h => (
                    <th key={h} className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-white/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map(tx => (
                  <tr key={tx.transactionId} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white/60 text-xs">{tx.transactionId}</td>
                    <td className="p-6 font-black text-white">₦{(tx.offeredPrice||0).toLocaleString()}</td>
                    <td className="p-6 font-bold text-white/60">{tx.quantitySold||'—'}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_STYLE[tx.status] || 'bg-white/10 text-white/60 border-white/20'}`}>
                        {tx.status?.replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="p-6 text-white/40 text-xs font-bold">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="p-6">
                      <button onClick={() => setSelected(tx)} className="text-[9px] font-black uppercase tracking-widest text-primary-400 hover:text-white transition-colors">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && <TransactionDetail tx={selected} onClose={() => setSelected(null)} farmerId={farmerId} />}
    </div>
  );
}
