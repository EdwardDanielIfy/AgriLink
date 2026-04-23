import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { useState } from 'react';

const agentSchema = z.object({
  fullName:    z.string().min(3, 'Full name is required'),
  phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number'),
  email:       z.string().email('Invalid email').optional().or(z.literal('')),
  territory:   z.string().min(3, 'Territory is required'),
  password:    z.string().min(8, 'Password must be at least 8 characters'),
});

export default function RegisterAgentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(agentSchema) });

  const mutation = useMutation({
    mutationFn: adminService.registerAgent,
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
      setTimeout(() => navigate('/dashboard/admin/users'), 1500);
    },
    onError: (err) => setSubmitError(err.response?.data?.message || 'Agent creation failed.'),
  });

  const inputClass = "w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-black text-sm text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-white/20";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2 block mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 font-black text-[10px] uppercase tracking-[0.4em] rounded-full mb-4 border border-green-500/20">
          Infrastructure Protocol
        </span>
        <h2 className="font-display font-black text-5xl tracking-tighter text-white leading-none">Register New Agent</h2>
        <p className="text-white/30 text-xs font-black uppercase tracking-widest mt-3">Expand the field network</p>
      </div>

      <div className="bg-[#1A1A1A] rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
          <span className="text-[15rem] font-display font-black leading-none italic text-white">A</span>
        </div>

        {success && (
          <div className="mb-8 bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-green-400 text-xs font-black uppercase tracking-widest text-center">
            ✓ Agent registered successfully. Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-10 relative z-10" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={labelClass}>Agent Full Name</label>
              <input {...register('fullName')} className={inputClass} placeholder="Full legal name" />
              {errors.fullName && <p className="text-red-400 text-[10px] font-black ml-2 mt-1 uppercase">! {errors.fullName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input {...register('phoneNumber')} className={inputClass} placeholder="080 0000 0000" />
              {errors.phoneNumber && <p className="text-red-400 text-[10px] font-black ml-2 mt-1 uppercase">! {errors.phoneNumber.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Regional Territory</label>
              <input {...register('territory')} className={inputClass} placeholder="e.g. Kano Central Hub" />
              {errors.territory && <p className="text-red-400 text-[10px] font-black ml-2 mt-1 uppercase">! {errors.territory.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address (Optional)</label>
              <input {...register('email')} autoComplete="off" className={inputClass} placeholder="agent@agrilink.com" />
              {errors.email && <p className="text-red-400 text-[10px] font-black ml-2 mt-1 uppercase">! {errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Access Password</label>
            <input type="password" {...register('password')} autoComplete="new-password" className={inputClass} placeholder="••••••••" />
            {errors.password && <p className="text-red-400 text-[10px] font-black ml-2 mt-1 uppercase">! {errors.password.message}</p>}
          </div>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400 text-xs font-black uppercase tracking-widest">
              🚨 {submitError}
            </div>
          )}

          <div className="pt-10 flex items-center justify-between border-t border-white/5">
            <button type="button" onClick={() => navigate(-1)} className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">
              ← Cancel
            </button>
            <button type="submit" disabled={mutation.isPending || success} className="bg-green-500 text-black px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all disabled:opacity-50">
              {mutation.isPending ? 'Registering...' : 'Finalize Registry ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
