/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: Navbar.jsx
 * Brand header, portal switcher (Customer View vs God's Eye Operations),
 * Quick Time-Clock trigger, and real-time live cart drawer trigger.
 */

window.Navbar = function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenTimeClock,
  onOpenReservation,
  onOpenOrderTracker,
  onDutyStaffCount,
  wsConnected
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#140905]/85 border-b border-[#E5A93C]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E5A93C] shadow-lg shadow-[#E5A93C]/20">
              <img 
                src="/assets/logo.jpg" 
                alt="Choco Loco Logo" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/static/logo.jpg'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8F0] via-[#F7C873] to-[#E5A93C]">
                  Choco Loco
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/40">
                  Lounge
                </span>
              </div>
              <p className="text-xs text-[#E5A93C]/70 font-sans tracking-wide">
                Pipeline, The Gambia • Opp. Mosque
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#221008]/80 p-1.5 rounded-full border border-[#E5A93C]/20 shadow-inner">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] shadow-lg shadow-[#E5A93C]/30 font-bold'
                  : 'text-[#FFF8F0]/80 hover:text-[#E5A93C] hover:bg-[#32170D]/50'
              }`}
            >
              🍽️ Patisserie Menu
            </button>
            <button
              onClick={() => setActiveTab('godseye')}
              className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'godseye'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] shadow-lg shadow-[#E5A93C]/30 font-bold'
                  : 'text-[#FFF8F0]/80 hover:text-[#E5A93C] hover:bg-[#32170D]/50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${wsConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${wsConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              👁️ God's Eye Dashboard
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'payroll'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] shadow-lg shadow-[#E5A93C]/30 font-bold'
                  : 'text-[#FFF8F0]/80 hover:text-[#E5A93C] hover:bg-[#32170D]/50'
              }`}
            >
              🌊 Wave Payroll
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'finance'
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] shadow-lg shadow-[#E5A93C]/30 font-bold'
                  : 'text-[#FFF8F0]/80 hover:text-[#E5A93C] hover:bg-[#32170D]/50'
              }`}
            >
              📊 Financial Hub
            </button>
          </nav>

          {/* Action Triggers: TimeClock, Reservation, Cart */}
          <div className="flex items-center gap-3">
            {/* Staff Time Clock Trigger */}
            <button
              onClick={onOpenTimeClock}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2A160E] border border-[#E5A93C]/40 text-[#FFF8F0] hover:bg-[#3D1E14] hover:border-[#E5A93C] transition-all shadow-md group"
              title="Staff GPS Time Clock"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">Time Clock</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#140905] text-[#E5A93C]">
                {onDutyStaffCount} On Duty
              </span>
            </button>

            {/* Table Reservation Trigger */}
            <button
              onClick={onOpenReservation}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#381D13]/70 text-[#F7C873] border border-[#E5A93C]/30 hover:border-[#E5A93C] transition-all"
            >
              <span>Book Table</span>
            </button>

            {/* Track Orders Trigger */}
            <button
              onClick={onOpenOrderTracker}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#381D13]/70 text-[#FFF8F0] border border-[#E5A93C]/30 hover:border-[#E5A93C] transition-all"
            >
              <span>Track Orders</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#E5A93C] to-[#D49B44] text-[#140905] font-bold shadow-lg shadow-[#E5A93C]/20 hover:scale-105 active:scale-95 transition-all"
              aria-label="View Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#E63946] text-[#FFF8F0] text-xs font-black flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
