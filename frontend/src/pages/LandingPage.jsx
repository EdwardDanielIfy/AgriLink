import { Link } from 'react-router-dom';
import farmerImg from '../assets/hero-nigeria.png';
import harvestImg from '../assets/harvest.png';
import agentImg from '../assets/agent-action.png';
import hubImg from '../assets/preservation-hub.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-secondary/30 earth-bg">
      {/* Immersive Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white/95 backdrop-blur-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
              <span className="text-white font-display font-black text-2xl leading-none">A</span>
            </div>
            <span className="font-display font-extrabold text-2xl text-primary-950 tracking-tighter">AgriLink</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#hub" className="text-sm font-black text-black hover:text-primary-700 transition-all">Preservation</a>
            <a href="#link" className="text-sm font-black text-black hover:text-primary-700 transition-all">Digital Link</a>
            <Link to="/login" className="bg-primary hover:bg-primary-700 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95">
              Access Portal
            </Link>
          </div>

          <div className="md:hidden">
            <Link to="/login" className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* The Root: Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="z-10 animate-fade-in order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-950 text-white text-[10px] font-black tracking-[0.25em] uppercase mb-8 ml-1 shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Official Nigerian Agri-Infrastructure
              </div>
              
              <h1 className="font-display text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 drop-shadow-[0_10px_10px_rgba(255,255,255,0.3)]">
                <span className="text-white bg-primary-950 inline-block px-6 py-2 rounded-2xl mb-2">Empowering</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-accent to-secondary-600">The Harvest.</span>
              </h1>
              
              <div className="relative mb-12 max-w-lg">
                <div className="absolute inset-0 bg-white/60 blur-xl rounded-3xl -z-10"></div>
                <p className="text-xl text-black font-extrabold leading-relaxed border-l-8 border-accent pl-8 bg-white/95 backdrop-blur-md py-8 rounded-r-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                  The first digital infrastructure specifically engineered to protect, preserve, and connect Nigerian agriculture.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-8 items-center">
                <Link to="/login" className="group relative">
                  <div className="absolute inset-0 bg-secondary rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <button className="relative bg-black text-white px-14 py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-primary-900 hover:-translate-y-1 active:translate-y-0 transition-all font-sans uppercase tracking-tight">
                    Access Portal
                  </button>
                </Link>
                <div className="flex flex-col ml-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-950/40">New to the soil?</span>
                  <Link to="/login" className="text-sm font-black uppercase tracking-widest text-primary-700 hover:text-accent border-b-2 border-primary-700/20 hover:border-accent transition-all pb-1">Create Account</Link>
                </div>
              </div>
            </div>

            {/* Right: Authentic Farmer Image */}
            <div className="relative order-1 lg:order-2 group">
              <div className="relative z-10 w-full aspect-[4/5] overflow-hidden rounded-[4rem] rounded-tr-[12rem] rounded-bl-[12rem] shadow-[0_50px_100px_-20px_rgba(0,102,51,0.5)] border-[12px] border-white backdrop-blur-sm">
                <img 
                  src={farmerImg} 
                  alt="Authentic Nigerian Farmer with Yam" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent"></div>
              </div>
              
              {/* Decorative Vibrant Accents */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/40 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
              <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-primary/30 rounded-full blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </section>

        {/* Section 01: Preservation Hub */}
        <section id="hub" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 group">
                 <div className="relative">
                    <div className="relative z-10 w-full aspect-[4/3] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-3xl">
                       <img src={hubImg} alt="AgriLink Preservation Hub" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                 </div>
              </div>
              
              <div className="order-1 lg:order-2">
                 <span className="inline-block px-4 py-1.5 bg-secondary text-primary-950 font-black text-[9px] uppercase tracking-[0.3em] mb-4 rounded-full shadow-lg">Modern Infrastructure</span>
                 <h2 className="font-display text-5xl md:text-7xl font-black text-white bg-primary-950 inline-block px-8 py-4 rounded-[2rem] tracking-tighter leading-none mb-8 shadow-2xl">
                    Smart <br />Preservation.
                 </h2>
                 <div className="relative">
                    <div className="absolute inset-0 bg-white/70 blur-2xl rounded-[3rem] -z-10"></div>
                    <p className="text-xl text-black font-extrabold mb-12 leading-relaxed bg-white/95 backdrop-blur-md p-10 border-2 border-white rounded-[3rem] shadow-2xl">
                        We digitize the preservation process. Our hubs monitor storage conditions, track quality metrics, and ensure zero-waste for the Nigerian farmer.
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <div className="bg-primary-950 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Verified Storage</div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Digital Linking */}
        <section id="link" className="py-32 relative">
           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div>
                    <span className="inline-block px-4 py-1.5 bg-accent text-primary-950 font-black text-[9px] uppercase tracking-[0.3em] mb-4 rounded-full shadow-lg">The Digital Pipeline</span>
                    <h2 className="font-display text-5xl md:text-7xl font-black text-white bg-primary-950 inline-block px-8 py-4 rounded-[2rem] tracking-tighter leading-none mb-8 shadow-2xl">
                       Connecting <br />The Trade.
                    </h2>
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/70 blur-2xl rounded-[3rem] -z-10"></div>
                      <p className="text-xl text-black font-extrabold mb-12 leading-relaxed bg-white/95 backdrop-blur-md p-10 border-2 border-white rounded-[3rem] shadow-2xl italic">
                        "Linking the rural Nigerian farm directly to the high-demand urban buyer. Verified, transparent, and built on digital trust."
                      </p>
                    </div>
                    <div className="space-y-6">
                       <div className="flex items-center gap-6 bg-primary-950 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 group hover:bg-black transition-all">
                          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">✓</div>
                          <span className="text-sm font-black tracking-widest uppercase">Verified Access Portal</span>
                       </div>
                    </div>
                 </div>

                 <div className="group">
                    <div className="relative">
                       <div className="relative z-10 w-full aspect-[4/3] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-3xl">
                          <img src={agentImg} alt="Digital Linking Process in Nigeria" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Bountiful Harvest Gallery Area */}
        <section className="py-32 relative overflow-hidden">
           <div className="max-w-7xl mx-auto px-6">
              <div className="bg-primary-950/95 backdrop-blur-2xl rounded-[5rem] p-12 md:p-24 overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-white/10">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                       <h3 className="font-display text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
                          The Produce <br /> We Protect.
                       </h3>
                       <p className="text-primary-100 text-lg font-semibold mb-12 opacity-80">
                          From the fertile soils of the North to the lush farms of the South—AgriLink is the guardian of the Nigerian bounty.
                       </p>
                       <img src={harvestImg} alt="Bountiful Nigerian Harvest" className="w-full h-64 object-cover rounded-[3rem] shadow-2xl hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="hidden lg:block relative h-full">
                       <div className="absolute inset-0 bg-gradient-to-r from-primary-950 to-transparent z-10 w-1/4"></div>
                       <img src={farmerImg} alt="" className="w-full h-full object-cover rounded-[3rem] opacity-30 grayscale" />
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-black py-24 text-white relative overflow-hidden">
        {/* Massive branding texture in footer */}
        <div className="absolute -bottom-20 -right-20 opacity-[0.05] pointer-events-none">
            <span className="text-[40rem] font-display font-black leading-none">A</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-12 flex flex-col items-center text-center mb-16">
              <div className="w-20 h-20 bg-primary-700 rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform -rotate-12">
                  <span className="text-white font-display font-black text-5xl leading-none">A</span>
              </div>
              <span className="font-display font-black text-6xl text-white tracking-tighter mb-4">AgriLink</span>
              <p className="text-white/80 font-bold text-lg">Digital Infrastructure for the Nigerian Soil.</p>
            </div>
          </div>
          
          <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.4em] gap-8">
            <p>© 2026 AgriLink Infrastructure LTD. Authentically West African.</p>
            <div className="flex gap-10">
               <a href="#" className="hover:text-white transition-colors">Yoruba</a>
               <a href="#" className="hover:text-white transition-colors">Hausa</a>
               <a href="#" className="hover:text-white transition-colors">Igbo</a>
               <a href="#" className="hover:text-white transition-colors">English</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
