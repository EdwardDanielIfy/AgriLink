import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import agentService from '../services/agentService';
import { getUser } from '../../../utils/auth';

const farmerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  location: z.string().min(3, 'Location is required'),
  primaryCrop: z.string().min(2, 'Primary crop is required'),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().length(10, 'Must be 10 digits').optional().or(z.literal('')),
  bankAccountName: z.string().optional(),
  preferredLanguage: z.string().min(1, 'Preferred language is required'),
  farmSize: z.string().optional().or(z.literal('')),
});

const steps = [
  { id: 1, title: 'Identity', icon: '👤' },
  { id: 2, title: 'Farm Details', icon: '🌾' },
  { id: 3, title: 'Confirm', icon: '✅' },
];

export default function RegisterFarmerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getUser();
  const agentId = user?.agentId || 'AGA-ADMIN001';

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
    resolver: zodResolver(farmerSchema),
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: d => agentService.registerFarmer(agentId, d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-farmers', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats', agentId] });
      navigate('/dashboard/agent/farmers');
    },
    onError: err => {
      const msg = err.response?.data?.data || err.response?.data?.message || 'Registration failed.';
      setSubmitError(msg);
    },
  });

  const nextStep = async () => {
    const fields = currentStep === 1 
      ? ['fullName', 'phoneNumber', 'preferredLanguage', 'bankAccountName'] 
      : ['location', 'primaryCrop', 'bankName', 'bankAccountNumber', 'farmSize'];
    
    const isValid = await trigger(fields);
    if (isValid) setCurrentStep(s => s + 1);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black text-white focus:outline-none focus:border-orange-400 transition-all placeholder:text-white/20";
  const labelClass = "inline-block px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-lg ml-1 mb-2";
  const vals = getValues();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 bg-orange-600/20 text-orange-300 font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 border border-orange-600/20">
          Network Expansion
        </span>
        <h2 className="font-display font-black text-4xl text-white tracking-tighter mb-2">Onboard New Farmer</h2>
        <p className="text-white/30 text-xs font-black uppercase tracking-widest">Growth begins with a single connection</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 -z-10"></div>
        {steps.map(step => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-lg ${currentStep >= step.id ? 'bg-orange-600 text-white scale-110 shadow-orange-600/30' : 'bg-white/5 text-white/20 border border-white/10'
              }`}>
              {currentStep > step.id ? '✓' : step.icon}
            </div>
            <span className={`mt-3 text-[9px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-orange-300' : 'text-white/20'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-[#001A0D] rounded-[3rem] p-12 border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-10">

          {currentStep === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Legal Full Name</label>
                  <input {...register('fullName')} className={inputClass} placeholder="Musa Ibrahim" />
                  {errors.fullName && <p className="text-red-400 text-[10px] font-black ml-2 mt-1">! {errors.fullName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input {...register('phoneNumber')} className={inputClass} placeholder="080 0000 0000" />
                  {errors.phoneNumber && <p className="text-red-400 text-[10px] font-black ml-2 mt-1">! {errors.phoneNumber.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Preferred Language</label>
                  <select {...register('preferredLanguage')} className={inputClass}>
                    <option value="" className="bg-[#001A0D]">Select Language</option>
                    <option value="ENGLISH" className="bg-[#001A0D]">English</option>
                    <option value="HAUSA" className="bg-[#001A0D]">Hausa</option>
                    <option value="IGBO" className="bg-[#001A0D]">Igbo</option>
                    <option value="YORUBA" className="bg-[#001A0D]">Yoruba</option>
                  </select>
                  {errors.preferredLanguage && <p className="text-red-400 text-[10px] font-black ml-2 mt-1">! {errors.preferredLanguage.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Bank Account Name (Optional)</label>
                  <input {...register('bankAccountName')} className={inputClass} placeholder="MUSA IBRAHIM" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <label className={labelClass}>Farm Location (LGA / State)</label>
                <input {...register('location')} className={inputClass} placeholder="Ikorodu, Lagos State" />
                {errors.location && <p className="text-red-400 text-[10px] font-black ml-2 mt-1">! {errors.location.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Primary Crop</label>
                  <input {...register('primaryCrop')} className={inputClass} placeholder="White Yam" />
                  {errors.primaryCrop && <p className="text-red-400 text-[10px] font-black ml-2 mt-1">! {errors.primaryCrop.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Bank Name (Optional)</label>
                  <input {...register('bankName')} className={inputClass} placeholder="First Bank" />
                </div>
                <div>
                  <label className={labelClass}>Farm Size (Hectares)</label>
                  <input {...register('farmSize')} className={inputClass} placeholder="5.5" />
                  {errors.farmSize && <p className="text-red-400 text-[10px] font-black ml-2 mt-1">! {errors.farmSize.message}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>Account Number (Optional)</label>
                <input {...register('bankAccountNumber')} className={inputClass} placeholder="0123456789" />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-fade-in text-center">
              <div className="w-20 h-20 bg-orange-600/20 border border-orange-600/30 text-orange-300 rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">📋</div>
              <h3 className="font-display font-black text-2xl text-white">Review Details</h3>
              <div className="bg-white/5 rounded-[2rem] p-8 text-left grid grid-cols-2 gap-6 border border-white/5">
                <div><p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Full Name</p><p className="font-black text-white">{vals.fullName || '—'}</p></div>
                <div><p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Phone</p><p className="font-black text-white">{vals.phoneNumber || '—'}</p></div>
                <div><p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Language</p><p className="font-black text-white">{vals.preferredLanguage || '—'}</p></div>
                <div><p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Location</p><p className="font-black text-white">{vals.location || '—'}</p></div>
                <div><p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Primary Crop</p><p className="font-black text-orange-300">{vals.primaryCrop || '—'}</p></div>
                <div><p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Farm Size</p><p className="font-black text-white">{vals.farmSize || '—'} Hectares</p></div>
              </div>
              {submitError && <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400 text-xs font-black uppercase">⚠️ {submitError}</div>}
            </div>
          )}

          <div className="flex items-center justify-between pt-10 border-t border-white/5">
            {currentStep > 1 && (
              <button type="button" onClick={() => setCurrentStep(s => s - 1)} className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                ← Back
              </button>
            )}
            <div className="ml-auto">
              {currentStep < 3 ? (
                <button type="button" onClick={nextStep} className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-4">
                  Continue <span>→</span>
                </button>
              ) : (
                <button type="submit" disabled={mutation.isPending} className="bg-green-500 text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-50">
                  {mutation.isPending ? 'Registering...' : 'Finalize Onboarding ✓'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
