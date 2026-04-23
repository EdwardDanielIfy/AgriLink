import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import farmerService from '../services/farmerService';
import { getUser, saveSession, getToken } from '../../../utils/auth';
import apiClient from '../../../lib/apiClient';

export default function FarmerProfilePage() {
  const user     = getUser();
  const farmerId = user?.farmerId;
  const queryClient = useQueryClient();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError,   setProfileError]   = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError,   setPwError]   = useState('');
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [profileData, setProfileData] = useState(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['farmer-profile', farmerId],
    queryFn: () => farmerService.getDashboardData(farmerId),
    enabled: !!farmerId,
    onSuccess: (data) => setProfileData({ fullName: data.fullName||'', location: data.location||'', primaryCrop: data.primaryCrop||'', bankName: data.bankName||'', bankAccountNumber: data.bankAccountNumber||'', bankAccountName: data.bankAccountName||'' }),
  });

  const profileMutation = useMutation({
    mutationFn: (data) => farmerService.updateProfile(farmerId, data),
    onSuccess: () => { setProfileSuccess(true); setProfileError(''); queryClient.invalidateQueries(['farmer-profile', farmerId]); setTimeout(() => setProfileSuccess(false), 3000); },
    onError: (err) => setProfileError(err.response?.data?.message || 'Failed to update profile.'),
  });

  const pwMutation = useMutation({
    mutationFn: (data) => farmerService.changePassword(farmerId, data),
    onSuccess: () => { setPwSuccess(true); setPwError(''); setPwData({ oldPassword:'', newPassword:'', confirmPassword:'' }); setTimeout(() => setPwSuccess(false), 3000); },
    onError: (err) => setPwError(err.response?.data?.message || 'Failed to change password.'),
  });

  const init = profile ? { fullName: profile.fullName||'', location: profile.location||'', primaryCrop: profile.primaryCrop||'', bankName: profile.bankName||'', bankAccountNumber: profile.bankAccountNumber||'', bankAccountName: profile.bankAccountName||'' } : {};

  const [form, setForm] = useState(init);
  const formData = Object.keys(form).length ? form : init;

  if (isLoading) return <div className="h-40 flex items-center justify-center text-white/30 font-black uppercase animate-pulse">Loading...</div>;

  const inputClass = "w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black text-white focus:outline-none focus:border-primary transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block mb-2";

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <div>
        <span className="inline-block px-4 py-1.5 bg-primary-950 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 border border-white/10">Profile Settings</span>
        <h2 className="font-display font-black text-5xl tracking-tighter text-white leading-none">My <span className="text-primary-400">Profile.</span></h2>
      </div>

      {/* Profile */}
      <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10">
        <h3 className="font-display font-black text-2xl text-white mb-8 tracking-tight">Personal Information</h3>
        {profileError && <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs font-black uppercase tracking-widest">{profileError}</div>}
        {profileSuccess && <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 text-xs font-black uppercase tracking-widest">✓ Profile updated</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { key:'fullName', label:'Full Name', placeholder:'Your name' },
            { key:'location', label:'Location', placeholder:'LGA / State' },
            { key:'primaryCrop', label:'Primary Crop', placeholder:'e.g. Maize' },
          ].map(f => (
            <div key={f.key}>
              <label className={labelClass}>{f.label}</label>
              <input value={formData[f.key]||''} onChange={e => setForm({...formData,[f.key]:e.target.value})} placeholder={f.placeholder} className={inputClass} />
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Bank Details (for payouts)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key:'bankName', label:'Bank Name', placeholder:'Access Bank' },
              { key:'bankAccountNumber', label:'Account Number', placeholder:'0123456789' },
              { key:'bankAccountName', label:'Account Name', placeholder:'FULL NAME' },
            ].map(f => (
              <div key={f.key}>
                <label className={labelClass}>{f.label}</label>
                <input value={formData[f.key]||''} onChange={e => setForm({...formData,[f.key]:e.target.value})} placeholder={f.placeholder} className={inputClass} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => profileMutation.mutate(formData)} disabled={profileMutation.isPending} className="bg-primary text-primary-950 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50">
            {profileMutation.isPending ? 'Saving...' : 'Save Profile ✓'}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10">
        <h3 className="font-display font-black text-2xl text-white mb-8 tracking-tight">Change Password</h3>
        {pwError && <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs font-black uppercase tracking-widest">{pwError}</div>}
        {pwSuccess && <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 text-xs font-black uppercase tracking-widest">✓ Password changed</div>}

        <div className="space-y-4">
          {[
            { key:'oldPassword', label:'Current Password' },
            { key:'newPassword', label:'New Password' },
            { key:'confirmPassword', label:'Confirm New Password' },
          ].map(f => (
            <div key={f.key}>
              <label className={labelClass}>{f.label}</label>
              <input type="password" value={pwData[f.key]} onChange={e => setPwData({...pwData,[f.key]:e.target.value})} placeholder="••••••••" className={inputClass} />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              if (pwData.newPassword !== pwData.confirmPassword) { setPwError("Passwords don't match"); return; }
              pwMutation.mutate({ oldPassword: pwData.oldPassword, newPassword: pwData.newPassword });
            }}
            disabled={pwMutation.isPending}
            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {pwMutation.isPending ? 'Changing...' : 'Change Password 🔑'}
          </button>
        </div>
      </div>
    </div>
  );
}
