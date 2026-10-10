/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: HeroSection.jsx
 * High-converting luxury brand showcase with dessert highlights,
 * location beacon, and direct action triggers.
 */

window.HeroSection = function HeroSection({ onExploreMenu, onBookTable }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#140905] via-[#1E0F0A] to-[#140905]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#E63946]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A160E] border border-[#E5A93C]/40 text-[#E5A93C] text-xs font-semibold tracking-wider uppercase shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open Today • 8:00 AM – 11:00 PM • Pipeline Mosque Junction
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-[#FFF8F0] tracking-tight leading-[1.1]">
              Indulge in Pure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8F0] via-[#F7C873] to-[#E5A93C] drop-shadow-sm">
                Chocolate Royalty.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#FFF8F0]/75 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Step inside The Gambia’s premier artisan dessert lounge. Hand-tempered Belgian chocolate, crisp golden bubble waffles, pistachio sushi crepes, and decadent Lotus Biscoff patisserie crafted fresh to order.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5A93C] via-[#F7C873] to-[#D49B44] text-[#140905] text-sm font-bold tracking-wider uppercase shadow-xl shadow-[#E5A93C]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                <span>Explore Dessert Menu</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={onBookTable}
                className="px-7 py-4 rounded-2xl bg-[#2A160E]/80 backdrop-blur-md border border-[#E5A93C]/40 text-[#FFF8F0] text-sm font-semibold tracking-wide hover:bg-[#381D13] hover:border-[#E5A93C] transition-all flex items-center gap-2"
              >
                <span>Reserve VIP Lounge</span>
                <span className="text-xs text-[#E5A93C] font-mono">Terrace Available</span>
              </button>
            </div>

            {/* Micro Trust Points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5A93C]/15 max-w-lg mx-auto lg:mx-0">
              <div className="text-left">
                <p className="text-xs text-[#E5A93C] font-bold">100% Belgian</p>
                <p className="text-xs text-[#FFF8F0]/60">Callebaut Cocoa</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-[#E5A93C] font-bold">Wave Mobile</p>
                <p className="text-xs text-[#FFF8F0]/60">Instant Checkout</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-[#E5A93C] font-bold">~10 Mins</p>
                <p className="text-xs text-[#FFF8F0]/60">Fresh Prep Time</p>
              </div>
            </div>

          </div>

          {/* Right Hero Showcase Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Main Showcase Image */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#E5A93C]/40 shadow-2xl shadow-[#140905] group">
                <img
                  src="/assets/signature_waffle.jpg"
                  alt="Choco Loco Signature Bubble Waffle"
                  className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140905] via-transparent to-transparent"></div>
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl backdrop-blur-md bg-[#1E0F0A]/90 border border-[#E5A93C]/30 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#E5A93C]">Chef Signature</span>
                    <h3 className="font-serif text-lg font-bold text-[#FFF8F0]">Belgian Bubble Waffle</h3>
                    <p className="text-xs text-[#FFF8F0]/70">Warm milk chocolate, strawberries, biscoff & gelato</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#F7C873]">420 D</span>
                    <span className="block text-[10px] text-[#FFF8F0]/50">GMD</span>
                  </div>
                </div>
              </div>

              {/* Floating Accent Mini-Card */}
              <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 p-3 rounded-2xl backdrop-blur-xl bg-[#2A160E]/95 border border-[#E5A93C]/40 shadow-2xl animate-pulse">
                <img src="/assets/pistachio_crepe.jpg" alt="Pistachio Crepe" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-bold text-[#FFF8F0]">Pistachio Sushi Crepe</p>
                  <p className="text-[10px] text-[#E5A93C]">Trending in Pipeline Lounge</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
