import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { saveSession, ROLE_ROUTES } from '../utils/auth';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;

const roles = [
  { id: 'FARMER', label: 'Farmer',  icon: '🌾', color: 'bg-primary-600',   endpoint: '/farmers/login',  canRegister: true  },
  { id: 'AGENT',  label: 'Agent',   icon: '📋', color: 'bg-accent',         endpoint: '/agents/login',   canRegister: false },
  { id: 'BUYER',  label: 'Buyer',   icon: '🏪', color: 'bg-secondary-600',  endpoint: '/buyers/login',   canRegister: true  },
  { id: 'ADMIN',  label: 'Admin',   icon: '🛡️', color: 'bg-gray-900',       endpoint: '/admin/login',    canRegister: false },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    if (selectedRole.id === 'ADMIN' && !data.identifier.includes('@')) {
      setError('Admin login requires a valid email address.');
      return;
    } else if (selectedRole.id !== 'ADMIN' && !phoneRegex.test(data.identifier)) {
      setError('Enter a valid Nigerian phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = selectedRole.id === 'ADMIN'
        ? { email: data.identifier, password: data.password }
        : { phoneNumber: data.identifier, password: data.password };

      const response = await apiClient.post(selectedRole.endpoint, payload);

      if (response.data.success) {
        // Backend might return raw JWT string or an AuthResponse object { token, user }
        const authData = response.data.data;
        const token = typeof authData === 'string' ? authData : authData.token;
        const user = typeof authData === 'object' ? authData.user : undefined;
        saveSession({ token, user });
        navigate(ROLE_ROUTES[selectedRole.id]);
      } else {
        setError(response.data.message || 'Authentication failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.data || err.response?.data?.message || 'Connection failed. Check your network.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative selection:bg-accent/40 earth-bg bg-primary-950/5">
      {/* Visual / Branding Side for Desktop */}
      <div className="hidden lg:flex flex-col flex-1 relative bg-primary-950 items-center justify-center p-12 overflow-hidden shadow-2xl z-20">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-900 blur-[120px]"></div>
        </div>
        
        <div className="z-10 relative flex flex-col items-center max-w-2xl text-center">
            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl transform transition-transform group-hover:-rotate-12 border-4 border-white pb-3 mb-12">
                <span className="text-primary-950 font-display font-black text-7xl leading-none">A</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-lg">
                Access <span className="text-accent underline decoration-8 underline-offset-8">The Soil.</span><br/>Cultivate Success.
            </h1>
            <p className="text-white/60 text-xl font-medium max-w-lg mb-12">
                Join the largest network of Nigerian farmers, verified agents, and premium buyers in one unified marketplace.
            </p>
            
            <div className="flex gap-4">
               {roles.map(r => (
                  <div key={r.id} className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 shadow-xl w-28">
                     <span className="text-4xl mb-3 drop-shadow-md">{r.icon}</span>
                     <span className="text-white/80 text-[10px] uppercase font-black tracking-widest">{r.label}</span>
                  </div>
               ))}
            </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center p-6 lg:p-12 z-10 relative bg-white/50 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none">
        
        {/* Mobile App Header (Hidden on Desktop) */}
        <div className="lg:hidden flex flex-col items-center mb-10 pt-8 animate-fade-in">
          <Link to="/" className="group mb-4">
            <div className="w-20 h-20 bg-primary-700 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,102,51,0.4)] transform transition-transform active:scale-95 border-4 border-white hover:-rotate-12">
              <span className="text-white font-display font-black text-5xl leading-none">A</span>
            </div>
          </Link>
          <span className="inline-block px-5 py-2 bg-accent text-primary-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-full shadow-lg border border-white/20">
            AgriLink Portal Login
          </span>
        </div>

        <div className="w-full max-w-md mx-auto z-10 animate-fade-in">
          {/* Role Selector */}
          <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-2 border-white mb-8 flex gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => { setSelectedRole(role); setError(''); }}
                className={`flex-1 flex flex-col items-center py-5 rounded-[2rem] transition-all relative overflow-hidden ${
                  selectedRole.id === role.id
                    ? 'bg-primary-950 text-white shadow-2xl scale-[1.08] z-10'
                    : 'hover:bg-primary-50 text-primary-900/40'
                }`}
              >
                <span className="text-2xl mb-1">{role.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">{role.label}</span>
                {selectedRole.id === role.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-secondary"></div>
                )}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[4rem] p-10 lg:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-2 border-white relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${selectedRole.color} opacity-10 rounded-bl-[5rem]`}></div>

            <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-8">
              {error && (
                <div className="bg-red-50 border-l-8 border-red-500 text-red-700 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label className="inline-block px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-xl ml-1 shadow-md">
                  {selectedRole.id === 'ADMIN' ? 'Admin Email Address' : 'Registered Phone Number'}
                </label>
                <input
                  type={selectedRole.id === 'ADMIN' ? 'email' : 'tel'}
                  {...register('identifier')}
                  placeholder={selectedRole.id === 'ADMIN' ? 'admin@agrilink.com' : '080 0000 0000'}
                  className="w-full bg-surface border-4 border-primary-900/5 px-8 py-5 rounded-[2rem] font-black text-lg focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-primary-950/10"
                />
                {errors.identifier && <p className="text-red-500 text-[10px] font-black mt-1 ml-4 italic">! {errors.identifier.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="inline-block px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-xl ml-1 shadow-md">
                  Secure Portal Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full bg-surface border-4 border-primary-900/5 px-8 py-5 rounded-[2rem] font-black text-lg focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-primary-950/10"
                />
                {errors.password && <p className="text-red-500 text-[10px] font-black mt-1 ml-4 italic">! {errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-950 text-white py-7 rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(0,102,51,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 border-b-8 border-primary-900 group"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="uppercase tracking-[0.1em]">Secure Login</span>
                    <span className="opacity-40 group-hover:translate-x-2 transition-transform">→</span>
                  </>
                )}
              </button>

              <div className="mt-10 pt-8 border-t-2 border-primary-900/5 space-y-6">
                {selectedRole.canRegister && (
                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-900/30 block mb-3">No account for {selectedRole.label}?</span>
                    <Link to={`/register/${selectedRole.id.toLowerCase()}`} className="inline-block bg-secondary text-primary-950 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-xl hover:-translate-y-1">
                      Instant Registration
                    </Link>
                  </div>
                )}
              </div>
            </form>
          </div>

          <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-primary-900/40">
            © {new Date().getFullYear()} AgriLink Infrastructure • Lagos, NG
          </p>
        </div>
      </div>
    </div>
  );
}
