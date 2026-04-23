import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import buyerService from '../services/buyerService';
import { getUser } from '../../../utils/auth';

const STATUS_STYLE = {
  OFFER_MADE:'bg-blue-100 text-blue-700 border-blue-200',
  AWAITING_RESPONSE:'bg-amber-100 text-amber-700 border-amber-200',
  ACCEPTED:'bg-green-100 text-green-700 border-green-200',
  REJECTED:'bg-red-100 text-red-700 border-red-200',
  AWAITING_PAYMENT:'bg-purple-100 text-purple-700 border-purple-200',
  PAYMENT_CONFIRMED:'bg-cyan-100 text-cyan-700 border-cyan-200',
  LOGISTICS_ARRANGED:'bg-indigo-100 text-indigo-700 border-indigo-200',
  IN_TRANSIT:'bg-orange-100 text-orange-700 border-orange-200',
  DELIVERED:'bg-teal-100 text-teal-700 border-teal-200',
  COMPLETE:'bg-green-100 text-green-800 border-green-300',
  EXPIRED:'bg-gray-100 text-gray-600 border-gray-200',
};

const TIMELINE = ['OFFER_MADE','AWAITING_RESPONSE','ACCEPTED','AWAITING_PAYMENT','PAYMENT_CONFIRMED','LOGISTICS_ARRANGED','IN_TRANSIT','DELIVERED','COMPLETE'];

export default function BuyerTransactionDetailPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [paymentError, setPaymentError] = useState('');
  const [smsOpen, setSmsOpen] = useState(false);

  const { data: tx, isLoading } = useQuery({
    queryKey: ['buyer-tx-detail', transactionId],
    queryFn: () => buyerService.getTransactionById(transactionId),
    enabled: !!transactionId,
  });

  const { data: smsHistory } = useQuery({
    queryKey: ['tx-sms', transactionId],
    queryFn: () => buyerService.getSmsHistory(transactionId),
    enabled: smsOpen,
  });

  const deliveryMutation = useMutation({
    mutationFn: () => buyerService.confirmDelivery(transactionId),
    onSuccess: () => queryClient.invalidateQueries(['buyer-tx-detail', transactionId]),
  });

  const paymentMutation = useMutation({
    mutationFn: () => buyerService.initializePayment(transactionId),
    onSuccess: (data) => { if (data?.authorizationUrl) window.location.href = data.authorizationUrl; },
    onError: (err) => setPaymentError(err.response?.data?.message || 'Payment initialization failed.'),
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center text-primary-900/30 font-black uppercase animate-pulse">Loading...</div>;
  if (!tx) return <div className="text-center py-20"><p className="text-primary-900/30 font-black uppercase">Not found.</p><button onClick={() => navigate(-1)} className="mt-4 text-secondary-600 font-black text-sm hover:underline">← Back</button></div>;

  const currentStep = TIMELINE.indexOf(tx.status);
  const canPay     = tx.status === 'ACCEPTED';
  const canConfirm = tx.status === 'IN_TRANSIT';
  const total      = (tx.offeredPrice || 0) * (tx.quantitySold || 1);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/buyer/orders')} className="w-10 h-10 rounded-full bg-primary-950/5 hover:bg-primary-950/10 transition-colors text-primary-950 flex items-center justify-center font-black">←</button>
        <div>
          <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-2 border border-secondary/20">Order Detail</span>
          <h2 className="font-display font-black text-4xl text-primary-950 tracking-tighter">{tx.transactionId}</h2>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-[3rem] p-10 border-4 border-white shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-display font-black text-xl text-primary-950">Progress Tracker</h3>
          <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[tx.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {tx.status?.replace(/_/g,' ')}
          </span>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex items-center gap-2 min-w-max">
            {TIMELINE.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    i < currentStep  ? 'bg-secondary text-white' :
                    i === currentStep ? 'bg-primary-950 text-white ring-4 ring-primary-950/20' :
                    'bg-primary-50 text-primary-900/20'
                  }`}>{i < currentStep ? '✓' : i+1}</div>
                  <span className={`text-[7px] font-black uppercase text-center max-w-[60px] leading-tight ${i <= currentStep ? 'text-primary-950' : 'text-primary-900/20'}`}>
                    {step.replace(/_/g,' ')}
                  </span>
                </div>
                {i < TIMELINE.length - 1 && <div className={`w-6 h-0.5 mb-4 ${i < currentStep ? 'bg-secondary' : 'bg-primary-100'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="bg-white rounded-[3rem] p-10 border-4 border-white shadow-2xl">
        <h3 className="font-display font-black text-xl text-primary-950 mb-8">Financial Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { label:'Offered Price',     value:`₦${(tx.offeredPrice||0).toLocaleString()}` },
            { label:'Quantity',          value:`${tx.quantitySold||'—'} units` },
            { label:'Total Value',       value:`₦${total.toLocaleString()}` },
            { label:'Logistics Partner', value: tx.logisticsPartner||'—' },
            { label:'Tracking Number',   value: tx.logisticsTrackingNumber||'—' },
            { label:'Payment Reference', value: tx.paymentReference||'—' },
          ].map(item => (
            <div key={item.label} className="bg-[#FFFBF2] rounded-2xl p-5 border-2 border-secondary/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary-900/40 mb-1">{item.label}</p>
              <p className="font-black text-primary-950 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pay action */}
      {canPay && (
        <div className="bg-secondary rounded-[3rem] p-10 text-white shadow-2xl">
          <h3 className="font-display font-black text-2xl mb-3">Ready to Pay</h3>
          <p className="text-white/70 text-sm mb-8">The farmer accepted your offer. Pay now to proceed with logistics.</p>
          {paymentError && <div className="mb-4 bg-red-500/20 p-4 rounded-xl text-red-200 text-xs font-black uppercase">{paymentError}</div>}
          <button onClick={() => paymentMutation.mutate()} disabled={paymentMutation.isPending} className="bg-white text-secondary-700 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-950 hover:text-white transition-all shadow-xl disabled:opacity-50">
            {paymentMutation.isPending ? 'Initializing...' : `Pay ₦${total.toLocaleString()} via Paystack →`}
          </button>
        </div>
      )}

      {/* Confirm delivery */}
      {canConfirm && (
        <div className="bg-primary-950 rounded-[3rem] p-10 text-white shadow-2xl">
          <h3 className="font-display font-black text-2xl mb-3">Confirm Delivery</h3>
          <p className="text-white/60 text-sm mb-8">Has your produce arrived? Confirming releases payment to the farmer.</p>
          <button onClick={() => deliveryMutation.mutate()} disabled={deliveryMutation.isPending} className="bg-secondary text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50">
            {deliveryMutation.isPending ? 'Confirming...' : '✓ Confirm Delivery Received'}
          </button>
        </div>
      )}

      {/* SMS History */}
      <div className="bg-white rounded-[3rem] p-10 border-4 border-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-black text-xl text-primary-950">SMS Notifications</h3>
          <button onClick={() => setSmsOpen(!smsOpen)} className="text-[10px] font-black uppercase tracking-widest text-secondary-600 hover:text-primary-950 transition-colors">
            {smsOpen ? 'Hide' : 'View History'}
          </button>
        </div>
        {smsOpen && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {!smsHistory || smsHistory.length === 0 ? (
              <p className="text-center text-primary-900/30 text-xs font-black uppercase py-4">No SMS for this transaction</p>
            ) : smsHistory.map((sms, i) => (
              <div key={i} className="bg-[#FFFBF2] rounded-xl p-4 border-2 border-secondary/10">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${sms.delivered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sms.delivered ? '✓ Delivered' : '✗ Failed'} — {sms.smsType?.replace(/_/g,' ')}
                  </span>
                  <span className="text-[9px] text-primary-900/30 font-bold">{new Date(sms.sentAt).toLocaleString()}</span>
                </div>
                <p className="text-primary-950 text-xs font-bold">{sms.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
