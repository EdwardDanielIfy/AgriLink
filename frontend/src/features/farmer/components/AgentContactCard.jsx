export default function AgentContactCard({ agent }) {
  return (
    <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-green-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Your Field Agent</p>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-900/30 border border-green-500/20 flex items-center justify-center text-3xl flex-shrink-0">
            {agent.avatar || '👨🏽‍💼'}
          </div>
          <div>
            <h4 className="font-display font-black text-2xl text-white tracking-tight leading-tight">{agent.name}</h4>
            <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mt-1">{agent.region}</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Direct Line</p>
          <p className="font-black text-white tracking-widest">{agent.phone}</p>
        </div>
      </div>
    </div>
  );
}
