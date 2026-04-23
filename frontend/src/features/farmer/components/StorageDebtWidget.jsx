export default function StorageDebtWidget({ debt = 0 }) {
  const hasDebt = debt > 0;
  return (
    <div className={`rounded-[3rem] p-10 relative overflow-hidden shadow-2xl border ${
      hasDebt ? 'bg-red-900/20 border-red-500/20' : 'bg-green-900/20 border-green-500/20'
    }`}>
      <div className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full blur-3xl ${hasDebt ? 'bg-red-500/10' : 'bg-green-500/10'}`}></div>
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 border ${
          hasDebt ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'
        }`}>
          {hasDebt ? '⚠️' : '✅'}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Storage Debt</p>
        <h3 className={`font-display font-black text-5xl tracking-tighter mb-4 ${hasDebt ? 'text-red-400' : 'text-green-400'}`}>
          ₦{debt.toLocaleString()}
        </h3>
        <p className={`text-xs font-bold uppercase tracking-widest ${hasDebt ? 'text-red-400/70' : 'text-green-400/70'}`}>
          {hasDebt ? 'Outstanding balance to agent' : 'No outstanding balance'}
        </p>
      </div>
    </div>
  );
}
