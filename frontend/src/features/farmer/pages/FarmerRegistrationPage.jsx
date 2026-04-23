import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import farmerService from '../services/farmerService';
import apiClient from '../../../lib/apiClient';
import { saveSession } from '../../../utils/auth';

const farmerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  location: z.string().min(3, 'Location is required'),
  primaryCrop: z.string().min(2, 'Primary crop is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().length(10, 'Account number must be 10 digits').optional().or(z.literal('')),
  bankAccountName: z.string().optional(),
  preferredLanguage: z.string().min(1, 'Preferred language is required'),
});

export default function FarmerRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
    resolver: zodResolver(farmerSchema),
    mode: 'onChange'
  });

  const mutation = useMutation({
    mutationFn: farmerService.register,
    onSuccess: (res) => {
      if (res.success) {
        saveSession(res.data);
        navigate('/dashboard/farmer');
      }
    },
    onError: (err) => {
      console.error('Registration Error Details:', err);
      const msg = err.response?.data?.message || err.message || 'Connection to infrastructure failed. Please check your network.';
      setSubmitError(msg);
    }
  });

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ['fullName', 'phoneNumber', 'location', 'preferredLanguage'];
    if (step === 2) fields = ['primaryCrop', 'password'];
    
    const isValid = await trigger(fields);
    if (isValid) setStep(prev => prev + 1);
  };

  const onSubmit = (data) => {
    if (step < 3) {
      nextStep();
      return;
    }
    mutation.mutate(data);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 3) {
        nextStep();
      }
    }
  };

  const values = getValues();

  return (
    <div className="min-h-screen bg-[#0A0D0A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Immersive Organic Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-emerald-900/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-primary-900/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-10">
           <Link to="/login" className="inline-block mb-6">
              <div className="w-16 h-16 bg-primary-700 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-2xl">
                 <span className="text-white font-display font-black text-3xl">A</span>
              </div>
           </Link>
           <h1 className="font-display text-5xl font-black text-white tracking-tighter leading-none mb-4">
              Join The <br />
              <span className="text-primary-400 italic">Global Harvest.</span>
           </h1>
           <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Farmer Digital Identity Protocol</p>
        </div>

        <div className="bg-[#121612] rounded-[3.5rem] p-12 border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown} className="space-y-10">
            
            {/* Steps Visualizer */}
            <div className="flex items-center gap-4 mb-12">
               {[1, 2, 3].map(i => (
                 <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-white/5'}`}></div>
               ))}
            </div>

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Full Name</label>
                  <input {...register('fullName')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all transition-all" placeholder="Legal Full Name" />
                  {errors.fullName && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.fullName.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Mobile Number</label>
                    <input {...register('phoneNumber')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all" placeholder="080 0000 0000" />
                    {errors.phoneNumber && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.phoneNumber.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Production Location</label>
                    <input {...register('location')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all" placeholder="LGA / State" />
                    {errors.location && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.location.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Communication Language</label>
                    <select {...register('preferredLanguage')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                      <option value="" className="bg-[#121612]">Select Language</option>
                      <option value="ENGLISH" className="bg-[#121612]">English</option>
                      <option value="HAUSA" className="bg-[#121612]">Hausa</option>
                      <option value="IGBO" className="bg-[#121612]">Igbo</option>
                      <option value="YORUBA" className="bg-[#121612]">Yoruba</option>
                    </select>
                    {errors.preferredLanguage && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.preferredLanguage.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Primary Commodity (Crop)</label>
                  <input {...register('primaryCrop')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all" placeholder="e.g. Maize, Yam, Cassava" />
                  {errors.primaryCrop && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.primaryCrop.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Security Access Password</label>
                  <input type="password" {...register('password')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all" placeholder="••••••••" />
                  {errors.password && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.password.message}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                 <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-primary/20">🏛️</div>
                    <h3 className="font-display font-black text-2xl text-white">Financial Registry</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Optional for immediate trade access</p>
                 </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Bank Name</label>
                  <input {...register('bankName')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all" placeholder="First Bank, GTB, etc." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Account Number</label>
                    <input {...register('bankAccountNumber')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all" placeholder="10 Digits" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Account Name</label>
                    <input {...register('bankAccountName')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-primary transition-all" placeholder="Holder Name" />
                  </div>
                </div>
                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 text-xs font-black uppercase tracking-widest">
                     🚨 Registration Error: {submitError}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
               {step > 1 && (
                 <button type="button" onClick={() => setStep(s => s - 1)} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    ← Back
                 </button>
               )}
               <div className="ml-auto">
                 {step < 3 ? (
                   <button type="button" onClick={nextStep} className="bg-white text-black px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                      Continue Harvest →
                   </button>
                 ) : (
                   <button type="button" onClick={handleSubmit(onSubmit)} disabled={mutation.isLoading} className="bg-primary text-primary-950 px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 transition-all">
                      {mutation.isLoading ? 'Syncing Network...' : 'Finalize Identity ✓'}
                   </button>
                 )}
               </div>
            </div>
          </form>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
           Secured by AgriLink Protocol • Node 42.1
        </p>
      </div>
    </div>
  );
}
