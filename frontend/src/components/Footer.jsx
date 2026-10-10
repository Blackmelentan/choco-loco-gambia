/**
 * Kaabu Technologies - Choco Loco Marketing Ecosystem
 * Component: Footer.jsx
 * High-impact luxury brand footer with operating hours, social links,
 * location beacon in Pipeline, newsletter subscription, and Kaabu agency signature.
 */

window.Footer = function Footer({ onNavigate }) {
  const [emailInput, setEmailInput] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#0D0503] text-[#FFF8F0]/70 border-t border-[#E5A93C]/20 pt-16 pb-12 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5A93C]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E5A93C]/15">
          
          {/* Brand Intro */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <img
                src="/assets/logo.jpg"
                alt="Choco Loco Logo"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#E5A93C] shadow-lg shadow-[#E5A93C]/20"
                onError={(e) => { e.target.src = '/static/logo.jpg'; }}
              />
              <div>
                <h3 className="font-serif text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8F0] via-[#F7C873] to-[#E5A93C]">
                  Choco Loco
                </h3>
                <p className="text-xs text-[#E5A93C]/80 font-medium tracking-wide">
                  Patisserie & Lounge • The Gambia
                </p>
              </div>
            </div>

            <p className="text-xs text-[#FFF8F0]/70 font-light leading-relaxed max-w-sm">
              The Gambia’s premier artisan dessert destination. Handcrafted Belgian bubble waffles, pistachio sushi crepes, and speculoos patisserie crafted fresh to order opposite the Pipeline Mosque.
            </p>

            {/* Direct Contact Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/2204000060"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2A160E] border border-emerald-500/40 text-emerald-400 hover:bg-[#3D1E14] transition-all shadow-md"
              >
                <span>💬 WhatsApp Concierge</span>
              </a>
              <a
                href="tel:+2204000060"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2A160E] border border-[#E5A93C]/30 text-[#F7C873] hover:bg-[#3D1E14] transition-all"
              >
                <span>📞 +220 400 0060</span>
              </a>
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#FFF8F0] uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#E5A93C] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#E5A93C] transition-colors">
                  Digital Menu & Ordering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#E5A93C] transition-colors">
                  Our Story & Craft
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catering')} className="hover:text-[#E5A93C] transition-colors">
                  Catering & Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('location')} className="hover:text-[#E5A93C] transition-colors">
                  Locations & Booking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#E5A93C] transition-colors">
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#FFF8F0] uppercase tracking-wider">
              Lounge Hours
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-[#FFF8F0] font-semibold">Mon – Tue, Thu – Sat</p>
                <p className="text-[#E5A93C] font-mono">7:00 AM – 11:00 PM</p>
              </div>
              <div>
                <p className="text-[#FFF8F0] font-semibold">Sunday</p>
                <p className="text-[#E5A93C] font-mono">8:00 AM – 11:00 PM</p>
              </div>
              <div>
                <p className="text-[#FFF8F0] font-semibold">Wednesday</p>
                <p className="text-red-400/80 font-mono">Closed (Pastry R&D)</p>
              </div>
            </div>
          </div>

          {/* VIP Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#FFF8F0] uppercase tracking-wider">
              VIP Chocolate Club
            </h4>
            <p className="text-xs text-[#FFF8F0]/70 font-light">
              Receive exclusive tasting invites, seasonal dessert drops, and secret menu passcodes.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                🎉 Welcome to the Club! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E0F0A] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#E5A93C]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] text-xs font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                >
                  Join VIP Club
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Section: Copyright & Agency Signature */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#FFF8F0]/50">
          <p>© {new Date().getFullYear()} Choco Loco Patisserie & Lounge. All Rights Reserved. Pipeline, The Gambia.</p>
          
          <div className="flex items-center gap-4">
            <span className="font-mono text-[#E5A93C]">
              DESIGNED & POWERED BY KAABU TECHNOLOGIES
            </span>
            <span className="text-[#FFF8F0]/30">•</span>
            <span>Wave Mobile Money Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
