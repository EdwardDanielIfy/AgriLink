import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import buyerService from '../services/buyerService';
import BuyerOrdersPage from './BuyerOrdersPage';
import BuyerTransactionDetailPage from './BuyerTransactionDetailPage';
import { getUser } from '../../../utils/auth';

const PRODUCE_EMOJI = (name='') => {
  const n = name.toLowerCase();
  if (n.includes('yam'))    return '🍠';
  if (n.includes('pepper')) return '🌶️';
  if (n.includes('bean'))   return '🫘';
  if (n.includes('tomato')) return '🍅';
  if (n.includes('maize') || n.includes('corn')) return '🌽';
  if (n.includes('cassava')) return '🌿';
  if (n.includes('rice'))    return '🌾';
  return '🌱';
};

function MakeOfferModal({ item, onClose, buyerId }) {
  const [qty, setQty]     = useState(1);
  const [price, setPrice] = useState(item.referencePrice || 0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => buyerService.makeOffer(data),
    onSuccess: () => { setSuccess(true); setTimeout(() => { onClose(); navigate('/dashboard/buyer/orders'); }, 2000); },
    onError: (err) => setError(err.response?.data?.message || err.response?.data?.data || 'Failed to make offer.'),
  });

  const handleSubmit = () => {
    if (!buyerId) { setError('Session error — please re-login.'); return; }
    mutation.mutate({
      produceId:     item.produceId,
      farmerId:      item.farmerId || '',
      buyerId,
      offeredPrice:  parseFloat(price),
      quantitySold:  parseFloat(qty),
      logisticsPartner: 'GIG_LOGISTICS',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-primary-950 p-10 text-white">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block mb-2">Make an Offer</span>
              <h2 className="font-display font-black text-3xl tracking-tight">{item.produceType}</h2>
              <p className="text-white/50 text-sm mt-1">{item.territory || item.storageLocation}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">✕</button>
          </div>
        </div>

        <div className="p-10 space-y-6">
          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl text-xs font-black uppercase">{error}</div>}
          {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-5 py-4 rounded-xl text-xs font-black uppercase">✓ Offer submitted! Redirecting...</div>}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-900/40 mb-2">Reference Price</p>
              <p className="font-black text-2xl text-primary-950">₦{(item.referencePrice||0).toLocaleString()} <span className="text-sm text-primary-900/30">/ {item.unit||'unit'}</span></p>
            </div>
            {parseFloat(price) !== item.referencePrice && (
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Offer Status</p>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${parseFloat(price) < item.referencePrice ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                  {parseFloat(price) < item.referencePrice ? 'Below Ref' : 'Above Ref'}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t-2 border-primary-900/5">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-900/40 block mb-3">Your Strategic Offer (₦ / {item.unit||'unit'})</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-900/30 font-black text-lg">₦</span>
              <input 
                type="number" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                className="w-full border-4 border-primary-950 bg-white px-12 py-5 rounded-3xl font-black text-2xl focus:outline-none focus:ring-8 focus:ring-primary-900/5 transition-all text-primary-950" 
              />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-primary-900/30 mt-3 ml-2 italic">
               This is the unit price you are proposing to the farmer.
            </p>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-900/40 block mb-2">Quantity ({item.unit||'units'})</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1" max={item.quantity} className="w-full border-4 border-primary-900/5 bg-surface px-6 py-4 rounded-2xl font-black text-lg focus:outline-none focus:border-primary transition-all" />
            <p className="text-[9px] font-black uppercase tracking-widest text-primary-900/30 mt-1">Available: {item.quantity} {item.unit}</p>
          </div>

          <div className="bg-primary-50 rounded-2xl p-5 border-2 border-primary-900/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-primary-900/40 mb-1">Total Offer Value</p>
            <p className="font-black text-2xl text-primary-950">₦{(price * qty).toLocaleString()}</p>
          </div>

          <button onClick={handleSubmit} disabled={mutation.isPending || success} className="w-full bg-secondary text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50">
            {mutation.isPending ? 'Submitting...' : success ? '✓ Offer Sent' : 'Submit Offer →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MarketCard({ item, onOffer }) {
  return (
    <div className="buyer-card p-1 group cursor-pointer hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
      <div className="w-full aspect-[4/5] bg-gradient-to-br from-white to-[#FFFBF2] flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-700 select-none">
        {PRODUCE_EMOJI(item.produceType)}
      </div>
      
      {/* Decorative Overlays */}
      {item.status === 'OFFER_PENDING' && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500/90 backdrop-blur shadow-sm rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-amber-400 z-20 animate-pulse">
          Offer Pending
        </div>
      )}

      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[8px] font-black uppercase tracking-widest text-amber-600 border border-amber-100">
        Verified Hub
      </div>

      <div className="p-8 pt-0 relative z-10">
        <div className="flex items-center gap-2 mb-4">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
           <span className="text-[9px] font-black uppercase tracking-widest text-primary-950/40">Available Now</span>
        </div>
        
        <h4 className="font-display font-black text-2xl text-primary-950 tracking-tight mb-2 uppercase">{item.produceType}</h4>
        
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[10px] font-bold text-primary-900/30 line-clamp-1">{item.territory} Section</p>
          <div className="h-4 w-px bg-primary-950/10"></div>
          <p className="text-[10px] font-bold text-primary-900/30">{item.quantity} {item.unit}</p>
        </div>

        <div className="flex items-end justify-between pt-6 border-t border-primary-950/5">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-900/30 mb-1">Price Per Unit</p>
            <p className="text-3xl font-black text-primary-950 tracking-tighter italic">₦{(item.referencePrice||0).toLocaleString()}</p>
          </div>
          <button onClick={() => onOffer(item)} className="bg-primary-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95">
            Make Offer →
          </button>
        </div>
      </div>
    </div>
  );
}

function BuyerOverview() {
  const user    = getUser();
  const buyerId = user?.buyerId;
  const navigate = useNavigate();
  const [offerItem, setOfferItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: () => buyerService.getAllListings(),
  });

  const filtered = (listings||[]).filter(item => {
    const matchSearch = !search || item.produceType?.toLowerCase().includes(search.toLowerCase());
    const matchType   = !filterType || item.produceType?.toLowerCase().includes(filterType.toLowerCase());
    return matchSearch && matchType;
  });

  const cropTypes = [...new Set((listings||[]).map(l => l.produceType).filter(Boolean))];

  return (
    <div className="space-y-16 pb-20 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 relative">
        <div className="relative group">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-200/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
          
          <span className="inline-block px-4 py-1.5 bg-amber-500 text-white font-black text-[9px] uppercase tracking-[0.4em] rounded-full mb-6 shadow-xl shadow-amber-500/20">
            Peak Trading Hours
          </span>
          <h2 className="font-display font-black text-7xl tracking-tighter text-primary-950 leading-[0.85] uppercase">
            Market <br /><span className="text-amber-500 italic font-serif normal-case font-black">Abundance.</span>
          </h2>
          <p className="mt-6 text-primary-950/40 font-bold text-[11px] uppercase tracking-[0.3em] max-w-md">
            Direct access to verified national hubs. Verified. Cold-Stored. Fair-Traded.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-fit">
          <div className="relative group">
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search Marketplace..." 
              className="bg-white border border-primary-950/5 shadow-2xl px-10 py-6 rounded-full w-full lg:w-96 font-black text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-primary-950/20" 
            />
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xl pointer-events-none group-hover:scale-125 transition-transform">🏷️</span>
          </div>

          {cropTypes.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setFilterType('')} 
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!filterType ? 'bg-primary-950 text-white' : 'bg-white text-primary-900/40 border-2 border-primary-900/5'}`}
              >
                All
              </button>
              {cropTypes.slice(0,5).map(t => (
                <button 
                  key={t} 
                  onClick={() => setFilterType(t===filterType?'':t)} 
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterType===t ? 'bg-amber-500 text-white' : 'bg-white text-primary-900/40 border-2 border-primary-900/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {isLoading ? (
          <div className="col-span-full h-40 flex items-center justify-center font-black text-primary-900/40 animate-pulse text-lg tracking-widest uppercase italic border-2 border-dashed border-primary-950/5 rounded-[3rem]">
            Scouring Active Hubs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-primary-950/5 rounded-[4rem] border-2 border-dashed border-primary-950/10">
            <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">🌱</div>
            <h4 className="font-display font-black text-2xl text-primary-950">{search ? 'No results found' : 'Market is Quiet'}</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-900/40 mt-2">No active commodities listed in this sector</p>
          </div>
        ) : filtered.map(item => (
          <MarketCard key={item.produceId} item={item} onOffer={setOfferItem} />
        ))}
      </div>

      {/* Seasonal Alert */}
      <div className="bg-primary-950 rounded-[4rem] p-12 text-white relative overflow-hidden group shadow-2xl border border-white/5 flex flex-col lg:flex-row items-center gap-12">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <span className="text-[20rem] font-display font-black leading-none italic">S</span>
        </div>
        <div className="w-40 h-40 bg-amber-500 rounded-[4rem] flex items-center justify-center text-8xl shadow-2xl rotate-6 group-hover:rotate-12 transition-transform duration-700">⚡</div>
        <div className="flex-1 text-center lg:text-left relative z-10">
          <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Seasonal Bulletin</span>
          <h4 className="font-display font-black text-5xl mb-4 tracking-tighter leading-none">Harvest <br />Velocity.</h4>
          <p className="text-white/40 text-sm font-bold leading-relaxed max-w-sm mt-6">
            Peak supply detected. Verified commodities from the North are now entering Southern Hubs.
          </p>
        </div>
        <button onClick={() => navigate('/dashboard/buyer/orders')} className="bg-white text-primary-950 px-16 py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-2xl active:scale-95 whitespace-nowrap">
          Order Portfolio →
        </button>
      </div>

      {offerItem && <MakeOfferModal item={offerItem} onClose={() => setOfferItem(null)} buyerId={buyerId} />}
    </div>
  );
}

export default function BuyerDashboard() {
  return (
    <Routes>
      <Route index element={<BuyerOverview />} />
      <Route path="orders" element={<BuyerOrdersPage />} />
      <Route path="orders/:transactionId" element={<BuyerTransactionDetailPage />} />
    </Routes>
  );
}
