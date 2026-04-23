import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import buyerService from '../services/buyerService';

const buyerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  businessName: z.string().min(3, 'Business name is required'),
  location: z.string().min(3, 'Location is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function BuyerRegistrationPage() {
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(buyerSchema)
  });

  const mutation = useMutation({
    mutationFn: buyerService.register,
    onSuccess: (res) => {
      if (res.success) {
        saveSession(res.data);
        navigate('/dashboard/buyer');
      }
    },
    onError: (err) => {
      setSubmitError(err.response?.data?.message || 'Registration failed. Marketplace rejection.');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#120F0A] flex items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500/40">
      {/* Immersive Marketplace Glow */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden opacity-30">
         <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-amber-900/40 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-orange-900/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-10">
           <Link to="/login" className="inline-block mb-6">
              <div className="w-16 h-16 bg-amber-700 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-2xl transform hover:rotate-12 transition-transform">
                 <span className="text-white font-display font-black text-3xl">A</span>
              </div>
           </Link>
           <h1 className="font-display text-5xl font-black text-white tracking-tighter leading-none mb-4">
              Enter The <br />
              <span className="text-amber-400 italic">Golden Market.</span>
           </h1>
           <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Procurement Entity Protocol</p>
        </div>

        <div className="bg-[#1C1814] rounded-[3.5rem] p-12 border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Personal Identity</label>
                <input {...register('fullName')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="Legal Full Name" />
                {errors.fullName && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.fullName.message}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Secure Connection</label>
                <input {...register('phoneNumber')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="080 0000 0000" />
                {errors.phoneNumber && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.phoneNumber.message}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Company / Business Entity</label>
              <input {...register('businessName')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="e.g. Landmark Foods Ltd" />
              {errors.businessName && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.businessName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Operations Center</label>
                 <input {...register('location')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="Lagos, Ibadan, etc." />
                 {errors.location && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.location.message}</p>}
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Corporate Email</label>
                 <input {...register('email')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="buyer@company.com" />
                 {errors.email && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.email.message}</p>}
               </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Access Key (Password)</label>
              <input type="password" {...register('password')} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-[10px] font-black ml-2 uppercase">! {errors.password.message}</p>}
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 text-xs font-black uppercase tracking-widest">
                 🚨 Marketplace Alert: {submitError}
              </div>
            )}

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                  ← Back To Entry
               </Link>
               <button type="submit" disabled={mutation.isLoading} className="bg-amber-500 text-amber-950 px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:scale-105 transition-all">
                  {mutation.isLoading ? 'Verifying Entity...' : 'Establish Connection ✓'}
               </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
           Commercial Registry Protocol • AgriLink Secondary
        </p>
      </div>
    </div>
  );
}
