export default function FarmerStatGrid({ stats }) {
  const cards = [
    { label:'Active Listings',    value: stats?.activeListings    ?? 0,  icon:'🌾', accent:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/20' },
    { label:'Total Sales (Est.)', value:`₦${(stats?.totalSales||0).toLocaleString()}`, icon:'💰', accent:'text-amber-400', bg:'bg-amber-500/10', border:'border-amber-500/20' },
    { label:'Storage Debt',       value:`₦${(stats?.storageDebt||0).toLocaleString()}`,icon:'🏦', accent:'text-red-400',   bg:'bg-red-500/10',   border:'border-red-500/20'   },
    { label:'Agent Connections',  value: stats?.marketConnections ?? 0,  icon:'📡', accent:'text-blue-400',  bg:'bg-blue-500/10',  border:'border-blue-500/20'  },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(card => (
        <div key={card.label} className={`bg-white/5 rounded-[2.5rem] p-8 border ${card.border} shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all`}>
          <div className={`absolute -right-4 -top-4 w-20 h-20 ${card.bg} rounded-full group-hover:scale-150 transition-transform duration-700 blur-xl`}></div>
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} border ${card.border} flex items-center justify-center text-xl mb-6`}>{card.icon}</div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">{card.label}</p>
            <h4 className={`font-display font-black text-4xl ${card.accent} tracking-tighter`}>{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
