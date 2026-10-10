/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: GodsEyeDashboard.jsx
 * "God's Eye" Live Operations Visualizer & Real-Time Control Center
 * Displays active store shifts, sales velocity, staffing radar, kitchen pipeline, and WebSocket telemetry.
 */

window.GodsEyeDashboard = function GodsEyeDashboard({
  salesOverview,
  orders = [],
  staffList = [],
  shifts = [],
  wsEvents = [],
  wsConnected,
  onUpdateOrderStatus,
  onNavigateToStaff,
  onNavigateToPayroll,
  onNavigateToFinance
}) {
  const activeStaff = staffList.filter(s => s.onDuty);
  const activeOrders = orders.filter(o => ['received', 'preparing', 'plating', 'ready'].includes(o.status));

  return (
    <section className="py-8 bg-[#140905] min-h-screen text-[#FFF8F0] space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* God's Eye Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/30 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5A93C] to-[#D49B44] flex items-center justify-center text-3xl shadow-xl shadow-[#E5A93C]/20 text-[#140905]">
              👁️
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#FFF8F0]">
                  God's Eye Operations Visualizer
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/40">
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-[#FFF8F0]/70 mt-1">
                Choco Loco Patisserie & Lounge • Pipeline Central Hub • Kaabu Operational Engine
              </p>
            </div>
          </div>

          {/* Real-time Connection Status */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/20 text-xs font-mono">
              <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span className="text-[#FFF8F0]/90">
                {wsConnected ? 'WebSocket Live Stream' : 'Polling Sync Mode'}
              </span>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-[#E5A93C] uppercase tracking-wider block font-bold">Store Reserve</span>
              <span className="text-base font-mono font-bold text-[#F7C873]">184,500 D</span>
            </div>
          </div>
        </div>

        {/* 4 Core Vital Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Today's Revenue */}
          <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-xl space-y-2 hover:border-[#E5A93C]/50 transition-all">
            <div className="flex items-center justify-between text-[#E5A93C]">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Sales Velocity</span>
              <span className="text-xl">💰</span>
            </div>
            <div className="text-3xl font-black font-mono text-[#FFF8F0]">
              {salesOverview?.totalRevenueGmd || 0} D
            </div>
            <div className="flex items-center justify-between text-xs text-[#FFF8F0]/60 pt-2 border-t border-[#E5A93C]/10">
              <span>{salesOverview?.totalOrdersCount || 0} Total Tickets</span>
              <span className="text-emerald-400 font-bold">Wave 81%</span>
            </div>
          </div>

          {/* Card 2: Active Store Shifts */}
          <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-xl space-y-2 hover:border-[#E5A93C]/50 transition-all">
            <div className="flex items-center justify-between text-[#E5A93C]">
              <span className="text-xs font-bold uppercase tracking-wider">Active Staff on Duty</span>
              <span className="text-xl">🧑‍🍳</span>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {activeStaff.length} <span className="text-base text-[#FFF8F0]/50 font-normal">/ {staffList.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#FFF8F0]/60 pt-2 border-t border-[#E5A93C]/10">
              <span>GPS Geofenced</span>
              <button onClick={onNavigateToStaff} className="text-[#E5A93C] hover:underline font-bold">
                View Shifts →
              </button>
            </div>
          </div>

          {/* Card 3: Kitchen Pipeline */}
          <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-xl space-y-2 hover:border-[#E5A93C]/50 transition-all">
            <div className="flex items-center justify-between text-[#E5A93C]">
              <span className="text-xs font-bold uppercase tracking-wider">Active Kitchen Queue</span>
              <span className="text-xl">🧇</span>
            </div>
            <div className="text-3xl font-black font-mono text-[#F7C873]">
              {activeOrders.length}
            </div>
            <div className="flex items-center justify-between text-xs text-[#FFF8F0]/60 pt-2 border-t border-[#E5A93C]/10">
              <span>Avg Prep: 11 mins</span>
              <span className="text-amber-400 font-bold">Fast Pace</span>
            </div>
          </div>

          {/* Card 4: Wave Payroll Status */}
          <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-xl space-y-2 hover:border-[#E5A93C]/50 transition-all">
            <div className="flex items-center justify-between text-[#E5A93C]">
              <span className="text-xs font-bold uppercase tracking-wider">Wave Auto-Disbursement</span>
              <span className="text-xl">🌊</span>
            </div>
            <div className="text-2xl font-black text-[#FFF8F0]">
              Instant Ready
            </div>
            <div className="flex items-center justify-between text-xs text-[#FFF8F0]/60 pt-2 border-t border-[#E5A93C]/10">
              <span>5 Verified Accounts</span>
              <button onClick={onNavigateToPayroll} className="text-[#E5A93C] hover:underline font-bold">
                Run Payroll →
              </button>
            </div>
          </div>

        </div>

        {/* Mid Section: Live Kitchen Pipeline & Staff Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Orders Interactive Kanban Board */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#FFF8F0]">
                  Live Kitchen Production Board
                </h3>
                <p className="text-xs text-[#FFF8F0]/60">Click buttons to advance order progress</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#2A160E] border border-[#E5A93C]/30 text-[#E5A93C]">
                {activeOrders.length} Active Orders
              </span>
            </div>

            <div className="space-y-3">
              {activeOrders.length === 0 ? (
                <div className="text-center py-12 text-[#FFF8F0]/40">
                  <p>All orders fulfilled and served!</p>
                </div>
              ) : (
                activeOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/20 hover:border-[#E5A93C]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-[#F7C873]">
                          #{order.order_number}
                        </span>
                        <span className="text-xs font-bold text-[#FFF8F0]">
                          {order.customer_name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#140905] text-[#E5A93C] border border-[#E5A93C]/20">
                          {order.table_number || 'Takeaway'}
                        </span>
                      </div>
                      
                      <div className="text-xs text-[#FFF8F0]/70 mt-1 flex flex-wrap gap-2">
                        {(order.items || []).map((it, idx) => (
                          <span key={idx} className="bg-[#1E0F0A] px-2 py-0.5 rounded text-[11px]">
                            {it.quantity}x {it.item_name}
                          </span>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-[#E5A93C] italic mt-1">
                          Note: "{order.notes}"
                        </p>
                      )}
                    </div>

                    {/* Stage Advancement Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl uppercase font-mono text-[#E5A93C] bg-[#140905]">
                        {order.status}
                      </span>

                      {order.status === 'received' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E5A93C] text-[#140905] hover:scale-105 transition-all"
                        >
                          Start Baking 🔥
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'plating')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F7C873] text-[#140905] hover:scale-105 transition-all"
                        >
                          Plate & Garnish 🍓
                        </button>
                      )}
                      {order.status === 'plating' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-400 text-[#140905] hover:scale-105 transition-all"
                        >
                          Ready for Service ✨
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'completed', 'paid')}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E63946] text-white hover:scale-105 transition-all"
                        >
                          Complete Order 🎉
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Staff Radar & Store Telemetry Feed */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active Staff List */}
            <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#FFF8F0]">
                  Staff Shift Radar
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {activeStaff.length} Clocked-In
                </span>
              </div>

              <div className="space-y-2.5">
                {staffList.map(st => (
                  <div
                    key={st.id}
                    className="p-3 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/15 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#FFF8F0]">{st.fullName}</p>
                      <p className="text-[10px] text-[#E5A93C]">{st.positionTitle}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      st.onDuty ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#140905] text-[#FFF8F0]/40'
                    }`}>
                      {st.onDuty ? 'On Duty' : 'Off Duty'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live WebSocket Event Stream */}
            <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-2xl space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#FFF8F0] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Event Audit Stream</span>
              </h3>
              
              <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[11px] text-[#FFF8F0]/70">
                {wsEvents.length === 0 ? (
                  <p className="text-[#FFF8F0]/40">Awaiting real-time triggers...</p>
                ) : (
                  wsEvents.map((evt, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-[#140905] border border-[#E5A93C]/10 flex items-center justify-between">
                      <span className="text-[#E5A93C] font-bold">{evt.type}</span>
                      <span className="text-[10px] text-[#FFF8F0]/40">{new Date(evt.timestamp || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
