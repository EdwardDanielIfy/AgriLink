import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import agentService from '../services/agentService';
import { getUser, saveSession, getToken } from '../../../utils/auth';

const profileFields = [
  { key:'fullName',  label:'Full Name',          placeholder:'Your full name' },
  { key:'email',     label:'Email Address',       placeholder:'agent@agrilink.ng' },
  { key:'territory', label:'Territory / Region',  placeholder:'Kano North' },
];

export default function AgentProfilePage() {
  const queryClient = useQueryClient();
  const user        = getUser();
  const agentId     = user?.agentId;

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError,   setProfileError]   = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError,   setPwError]   = useState('');
  const [pw, setPw] = useState({ oldPassword:'', newPassword:'', confirmPassword:'' });
  const [form, setForm] = useState({});

  const { data: profile, isLoading } = useQuery({
    queryKey: ['agent-profile', agentId],
    queryFn: () => agentService.getProfile(agentId),
    enabled: !!agentId,
    onSuccess: d => setForm({ fullName:d.fullName||'', email:d.email||'', territory:d.territory||'' }),
  });

  const profileMutation = useMutation({
    mutationFn: d => agentService.updateProfile(agentId, d),
    onSuccess: updated => {
      queryClient.invalidateQueries(['agent-profile', agentId]);
      saveSession({ token: getToken(), user: updated });
      setProfileSuccess(true); setProfileError('');
      setTimeout(() => setProfileSuccess(false), 3000);
    },
    onError: err => setProfileError(err.response?.data?.message || 'Failed to update profile.'),
  });

  const pwMutation = useMutation({
    mutationFn: d => agentService.changePassword(agentId, d),
    onSuccess: () => { setPwSuccess(true); setPwError(''); setPw({ oldPassword:'', newPassword:'', confirmPassword:'' }); setTimeout(() => setPwSuccess(false), 3000); },
    onError: err => setPwError(err.response?.data?.message || 'Failed to change password.'),
  });

  const inputClass = "w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black text-white focus:outline-none focus:border-orange-400 transition-all placeholder:text-white/20";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block mb-2";

  if (isLoading) return <div className="h-40 flex items-center justify-center text-white/20 font-black uppercase animate-pulse">Loading...</div>;

  const data = Object.keys(form).length ? form : { fullName: profile?.fullName||'', email: profile?.email||'', territory: profile?.territory||'' };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <div>
        <span className="inline-block px-4 py-1.5 bg-orange-600/20 text-orange-300 font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-4 border border-orange-600/20">Agent Settings</span>
        <h2 className="font-display font-black text-5xl tracking-tighter text-white leading-none">My <span className="text-orange-300">Profile.</span></h2>
      </div>

      {/* Info card */}
      <div className="bg-[#001A0D] rounded-[3rem] p-10 border border-white/5 shadow-xl">
        <h3 className="font-display font-black text-2xl text-white mb-8 tracking-tight">Personal Information</h3>
        {profileError && <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs font-black uppercase">{profileError}</div>}
        {profileSuccess && <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 text-xs font-black uppercase">✓ Profile updated</div>}

        <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Agent ID</p>
            <p className="font-black text-white font-mono text-sm">{profile?.agentId}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Territory</p>
            <p className="font-black text-orange-300 text-sm">{profile?.territory || '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {profileFields.map(f => (
            <div key={f.key}>
              <label className={labelClass}>{f.label}</label>
              <input value={data[f.key]||''} onChange={e => setForm({...data,[f.key]:e.target.value})} placeholder={f.placeholder} className={inputClass} />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button onClick={() => profileMutation.mutate(data)} disabled={profileMutation.isPending} className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 shadow-xl">
            {profileMutation.isPending ? 'Saving...' : 'Save Profile ✓'}
          </button>
        </div>
      </div>

      {/* Password card */}
      <div className="bg-[#001A0D] rounded-[3rem] p-10 border border-white/5 shadow-xl">
        <h3 className="font-display font-black text-2xl text-white mb-8 tracking-tight">Change Password</h3>
        {pwError && <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs font-black uppercase">{pwError}</div>}
        {pwSuccess && <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 text-xs font-black uppercase">✓ Password changed</div>}

        <div className="space-y-4">
          {[{k:'oldPassword',l:'Current Password'},{k:'newPassword',l:'New Password'},{k:'confirmPassword',l:'Confirm New Password'}].map(f => (
            <div key={f.k}>
              <label className={labelClass}>{f.l}</label>
              <input type="password" value={pw[f.k]} onChange={e => setPw({...pw,[f.k]:e.target.value})} placeholder="••••••••" className={inputClass} />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              if (pw.newPassword !== pw.confirmPassword) { setPwError("Passwords don't match"); return; }
              pwMutation.mutate({ oldPassword: pw.oldPassword, newPassword: pw.newPassword });
            }}
            disabled={pwMutation.isPending}
            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 shadow-xl"
          >
            {pwMutation.isPending ? 'Changing...' : 'Change Password 🔑'}
          </button>
        </div>
      </div>
    </div>
  );
}
