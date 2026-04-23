import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import buyerService from '../services/buyerService';
import { getUser } from '../../../utils/auth';

const STATUS_STYLE = {
  OFFER_MADE:'bg-blue-100 text-blue-700 border-blue-200',
  AWAITING_RESPONSE:'bg-amber-100 text-amber-700 border-amber-200',
  ACCEPTED:'bg-green-100 text-green-700 border-green-200',
  REJECTED:'bg-red-100 text-red-700 border-red-200',
  AWAITING_PAYMENT:'bg-purple-100 text-purple-700 border-purple-200',
  PAYMENT_CONFIRMED:'bg-cyan-100 text-cyan-700 border-cyan-200',
  LOGISTICS_ARRANGED:'bg-indigo-100 text-indigo-700 border-indigo-200',
  IN_TRANSIT:'bg-orange-100 text-orange-700 border-orange-200',
  DELIVERED:'bg-teal-100 text-teal-700 border-teal-200',
  COMPLETE:'bg-green-100 text-green-800 border-green-300',
  EXPIRED:'bg-gray-100 text-gray-600 border-gray-200',
};

export default function BuyerOrdersPage() {
  const user    = getUser();
  const buyerId = user?.buyerId;
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['buyer-orders', buyerId],
    queryFn: () => buyerService.getOrders(buyerId),
    enabled: !!buyerId,
  });

  const filtered = filter === 'ALL' ? (orders||[]) : (orders||[]).filter(o => o.status === filter);

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <span className="inline-block px-4 py-1.5 bg-secondary text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 shadow-xl shadow-secondary/20 border border-white/20">Procurement Node</span>
          <h2 className="font-display font-black text-6xl tracking-tighter text-primary-950 leading-[0.85]">Order <br /><span className="text-secondary-600">History.</span></h2>
        </div>
        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['ALL','AWAITING_RESPONSE','ACCEPTED','AWAITING_PAYMENT','IN_TRANSIT','COMPLETE'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter===s ? 'bg-primary-950 text-white shadow-xl' : 'bg-white text-primary-900/40 border-2 border-primary-900/5 hover:border-primary-950/20'}`}>
              {s.replace(/_/g,' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden">
        <div className="bg-primary-950 px-10 py-8 flex items-center justify-between text-white">
          <div>
            <h3 className="font-display font-black text-2xl tracking-tighter">Acquisition Log</h3>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{filtered.length} transaction{filtered.length!==1?'s':''}</p>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-primary-900/30 font-black animate-pulse uppercase tracking-widest">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-[#FFFBF2] rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">📦</div>
              <h4 className="font-display font-black text-xl text-primary-950">No Orders Found</h4>
              <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-widest mt-2">Procure from the marketplace to see orders here.</p>
              <button onClick={() => navigate('/dashboard/buyer')} className="mt-6 bg-secondary text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Browse Market →</button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(order => {
                const canPay     = order.status === 'ACCEPTED';
                const canConfirm = order.status === 'IN_TRANSIT';
                const total      = (order.offeredPrice||0) * (order.quantitySold||1);
                return (
                  <div
                    key={order.transactionId}
                    onClick={() => navigate(`/dashboard/buyer/orders/${order.transactionId}`)}
                    className="group border-2 border-primary-900/5 rounded-[2rem] p-6 hover:border-secondary hover:shadow-xl transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#FFFBF2] rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                        {canPay ? '💳' : canConfirm ? '🚚' : order.status==='COMPLETE' ? '✅' : '🌾'}
                      </div>
                      <div>
                          Ref: {order.transactionId}
                        <h4 className="font-black text-xl text-primary-950">₦{total.toLocaleString()}</h4>
                        <p className="text-xs font-bold text-secondary-600 mt-1">{order.quantitySold||'—'} units • {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[order.status]||'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {order.status?.replace(/_/g,' ')}
                      </span>
                      {(canPay || canConfirm) && (
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${canPay ? 'bg-secondary text-white' : 'bg-primary-950 text-white'}`}>
                          {canPay ? 'Pay Now →' : 'Confirm →'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
