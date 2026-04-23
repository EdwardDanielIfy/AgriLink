export default function AgentStatGrid({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: 'Total Farmers',        value: stats.totalFarmers        ?? 0,  icon: '👥', accent: 'text-green-400',  border: 'border-green-500/20',  bg: 'bg-green-500/10'  },
    { label: 'SMS-Only Farmers',     value: stats.pendingFarmers      ?? 0,  icon: '📱', accent: 'text-orange-300', border: 'border-orange-500/20', bg: 'bg-orange-500/10' },
    { label: 'Active Transactions',  value: stats.pendingTransactions ?? 0,  icon: '💸', accent: 'text-amber-400',  border: 'border-amber-500/20',  bg: 'bg-amber-500/10'  },
    { label: 'Completed Deals',      value: stats.completedTransactions ?? 0,icon: '✅', accent: 'text-green-300',  border: 'border-green-500/20',  bg: 'bg-green-500/10'  },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.label} className={`bg-[#002B18] rounded-[2.5rem] p-8 border ${card.border} shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all`}>
          <div className={`absolute -right-4 -top-4 w-20 h-20 ${card.bg} rounded-full group-hover:scale-150 transition-transform duration-700 blur-xl`}></div>
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.border} border flex items-center justify-center text-xl mb-6`}>
              {card.icon}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">{card.label}</p>
            <h4 className={`font-display font-black text-5xl ${card.accent} tracking-tighter`}>{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
