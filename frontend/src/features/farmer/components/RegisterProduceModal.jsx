import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import farmerService from '../services/farmerService';

export default function RegisterProduceModal({ isOpen, onClose, farmerId, agentId, location: farmerLocation }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    produceType: '',
    quantity: '',
    unit: 'kg',
    grade: 'Grade A',
    referencePrice: '',
    storageId: '', 
    expectedPickupDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  });

  // Fetch available storages for this territory
  const { data: storages, isLoading: storagesLoading } = useQuery({
    queryKey: ['territoryStorages', farmerLocation],
    queryFn: () => farmerService.getStoragesByTerritory(farmerLocation || 'Lagos'),
    enabled: !!farmerLocation && isOpen
  });

  // Set default storage when storages are loaded
  useEffect(() => {
    if (storages && storages.length > 0 && !formData.storageId) {
      setFormData(prev => ({ ...prev, storageId: storages[0].storageId }));
    }
  }, [storages]);

  const mutation = useMutation({
    mutationFn: (data) => farmerService.createListing(farmerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmerListings', farmerId]);
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        navigate('/dashboard/farmer/listings');
      }, 2000);
    },
    onError: (err) => {
      const msg = err.response?.data?.data 
        || err.response?.data?.message 
        || err.message
        || 'Failed to publish listing. Please verify your data.';
      setError(msg);
      console.error('Listing error:', err.response?.data || err);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      storageId: formData.storageId || null,
      agentId: agentId || null,
      quantity: parseFloat(formData.quantity),
      referencePrice: parseFloat(formData.referencePrice),
    };
    // Only include expectedPickupDate if provided
    if (formData.expectedPickupDate) {
      payload.expectedPickupDate = `${formData.expectedPickupDate}T12:00:00`;
    }
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <span className="text-[10rem] font-black leading-none">M</span>
        </div>
        
        <div className="p-10 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="inline-block px-4 py-1 bg-accent text-primary-950 font-black text-[10px] uppercase tracking-widest rounded-full mb-4">
                 Golden Market Integration
              </span>
              <h2 className="font-display font-black text-4xl text-white">List Produce.</h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Publish your harvest to the global exchange.</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold uppercase tracking-widest text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Produce Type</label>
                 <input 
                    type="text"
                    value={formData.produceType}
                    onChange={(e) => setFormData({...formData, produceType: e.target.value})}
                    placeholder="e.g. White Yam, Cocoa"
                    required
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                 />
               </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#CBFF5C]/60 flex justify-between items-center">
                    <span>Select Processing Hub</span>
                    <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-white/40 italic">Optional Assignment</span>
                  </label>
                  
                  {storagesLoading ? (
                     <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 animate-pulse text-white/40 text-[10px] font-black uppercase tracking-widest">
                       Scanning Regional Nodes...
                     </div>
                  ) : storages?.length > 0 ? (
                    <select 
                       value={formData.storageId}
                       onChange={(e) => setFormData({...formData, storageId: e.target.value})}
                       className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-all appearance-none cursor-pointer"
                    >
                       <option value="">Pending Assignment (No specific hub)</option>
                       {storages.map(s => (
                         <option key={s.storageId} value={s.storageId} className="bg-[#121212]">{s.name} ({s.territory})</option>
                       ))}
                    </select>
                  ) : (
                    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4">
                      <p className="text-[10px] font-bold text-accent leading-relaxed">
                        No storage hubs in your area yet. Your produce will be listed and assigned to an available node later by your agent.
                      </p>
                    </div>
                  )}
                </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Quantity ({formData.unit})</label>
                 <input 
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="e.g 1000"
                    required
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Reference Price (₦)</label>
                 <input 
                    type="number"
                    min="1"
                    value={formData.referencePrice}
                    onChange={(e) => setFormData({...formData, referencePrice: e.target.value})}
                    placeholder="e.g 500000"
                    required
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                 />
               </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={mutation.isPending || success}
                className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl
                  ${success 
                    ? 'bg-green-500 text-white' 
                    : 'bg-accent text-primary-950 hover:bg-white active:scale-95'
                  }`}
              >
                {mutation.isPending ? 'Broadcasting...' : success ? '✓ Listed' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
