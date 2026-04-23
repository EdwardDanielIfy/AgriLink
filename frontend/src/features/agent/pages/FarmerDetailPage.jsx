import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import agentService from '../services/agentService';
import { getUser } from '../../../utils/auth';

const editSchema = z.object({
  fullName: z.string().min(3, 'Full name is required').optional().or(z.literal('')),
  phoneNumber: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  primaryCrop: z.string().optional().or(z.literal('')),
  farmSize: z.string().optional().or(z.literal('')),
});

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black uppercase tracking-widest text-primary-900/40">{label}</span>
      <span className="font-black text-primary-950 text-sm">{value || '—'}</span>
    </div>
  );
}

export default function FarmerDetailPage() {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getUser();
  const agentId = user?.agentId;

  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: farmer, isLoading, isError } = useQuery({
    queryKey: ['farmer-detail', agentId, farmerId],
    queryFn: () => agentService.getFarmerById(agentId, farmerId),
    enabled: !!agentId && !!farmerId,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(editSchema),
    values: farmer
      ? {
          fullName: farmer.fullName || '',
          phoneNumber: farmer.phoneNumber || '',
          location: farmer.location || '',
          primaryCrop: farmer.primaryCrop || '',
          farmSize: farmer.farmSize?.toString() || '',
        }
      : {},
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      const cleaned = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
      );
      return agentService.updateFarmer(agentId, farmerId, cleaned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-detail', agentId, farmerId] });
      queryClient.invalidateQueries({ queryKey: ['agent-farmers', agentId] });
      setSaveSuccess(true);
      setSaveError('');
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err) => {
      setSaveError(err.response?.data?.message || 'Failed to update farmer. Please try again.');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 font-black text-primary-900/30 animate-pulse text-lg">
        Loading Farmer Profile...
      </div>
    );
  }

  if (isError || !farmer) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="font-black text-primary-950 text-lg">Farmer not found</p>
        <button
          onClick={() => navigate('/dashboard/agent/farmers')}
          className="bg-primary-950 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-800 transition-all"
        >
          ← Back to Farmers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Back button + header */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/dashboard/agent/farmers')}
          className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-950 flex items-center justify-center hover:bg-primary-100 transition-colors font-black text-lg"
        >
          ←
        </button>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary-900/40 mb-1">
            Farmer Profile
          </p>
          <h2 className="font-display font-black text-4xl tracking-tighter text-primary-950 leading-none">
            {farmer.fullName}
          </h2>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {saveSuccess && (
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-200 animate-in fade-in">
              ✓ Saved
            </span>
          )}
          <span
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              farmer.hasAppAccess
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {farmer.hasAppAccess ? 'Active' : 'Offline'}
          </span>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider">
          {saveError}
        </div>
      )}

      {/* Card */}
      <div className="bg-white rounded-[3rem] border-2 border-primary-950/5 shadow-xl overflow-hidden">
        {/* Card header bar */}
        <div className="bg-primary-950 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent text-primary-950 flex items-center justify-center font-black text-2xl shadow-lg">
              {farmer.fullName?.charAt(0)}
            </div>
            <div>
              <p className="font-black text-white text-lg">{farmer.fullName}</p>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                ID: {farmer.farmerId || farmer.id}
              </p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => { setIsEditing(true); setSaveError(''); }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/20"
            >
              ✏️ Edit
            </button>
          ) : (
            <button
              onClick={() => { setIsEditing(false); reset(); setSaveError(''); }}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-red-500/20"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Card body */}
        <div className="p-10">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoRow label="Phone Number" value={farmer.phoneNumber} />
              <InfoRow label="Location" value={farmer.location} />
              <InfoRow label="Primary Crop" value={farmer.primaryCrop} />
              <InfoRow label="Farm Size" value={farmer.farmSize ? `${farmer.farmSize} ha` : null} />
              <InfoRow label="BVN / NIN" value={farmer.bvn} />
              <InfoRow label="Bank" value={farmer.bankName} />
              <InfoRow label="Account Number" value={farmer.bankAccountNumber} />
              <InfoRow
                label="Registered"
                value={farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) : null}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { key: 'fullName', label: 'Full Name', placeholder: 'Musa Ibrahim' },
                  { key: 'phoneNumber', label: 'Phone Number', placeholder: '080 0000 0000' },
                  { key: 'location', label: 'Location (LGA / State)', placeholder: 'Ikorodu, Lagos' },
                  { key: 'primaryCrop', label: 'Primary Crop', placeholder: 'White Yam' },
                  { key: 'farmSize', label: 'Farm Size (Hectares)', placeholder: '5.5' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label className="inline-block px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg ml-1">
                      {label}
                    </label>
                    <input
                      {...register(key)}
                      placeholder={placeholder}
                      className="w-full bg-surface border-4 border-primary-900/5 px-5 py-3 rounded-2xl font-black text-sm focus:outline-none focus:border-primary transition-all"
                    />
                    {errors[key] && (
                      <p className="text-red-500 text-[10px] font-black ml-2">! {errors[key].message}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t-2 border-primary-900/5">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-primary-950 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-primary-800 transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  {mutation.isPending ? 'Saving...' : 'Save Changes ✓'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
