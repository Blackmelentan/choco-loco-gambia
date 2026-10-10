/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: OrderTrackerModal.jsx
 * Real-time order progress tracker with animated stages:
 * Received -> Melting Chocolate -> Plating -> Ready for Pickup/Dispatch
 */

window.OrderTrackerModal = function OrderTrackerModal({ isOpen, onClose, orders = [] }) {
  if (!isOpen) return null;

  const [selectedOrder, setSelectedOrder] = React.useState(orders[0] || null);

  React.useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    }
  }, [orders]);

  const stages = [
    { key: 'received', title: 'Order Received', desc: 'Sent to pastry kitchen', icon: '📝' },
    { key: 'preparing', title: 'Melting & Baking', desc: 'Tempering Belgian chocolate', icon: '🔥' },
    { key: 'plating', title: 'Artisanal Plating', desc: 'Adding strawberries & biscoff', icon: '🍓' },
    { key: 'ready', title: 'Ready for Service', desc: 'At pickup counter / table', icon: '✨' },
    { key: 'completed', title: 'Completed', desc: 'Enjoy your luxury dessert', icon: '🎉' }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'plating': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#1E0F0A] rounded-3xl border border-[#E5A93C]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#140905] border-b border-[#E5A93C]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📡</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#FFF8F0]">Live Kitchen Order Tracker</h3>
              <p className="text-xs text-[#E5A93C]/80">Connected to Choco Loco Pipeline Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2A160E] text-[#FFF8F0] hover:text-[#E5A93C] flex items-center justify-center border border-[#E5A93C]/20"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Order Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {orders.map(o => (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedOrder && selectedOrder.id === o.id
                    ? 'bg-[#E5A93C] text-[#140905] border-[#E5A93C] font-bold shadow-md'
                    : 'bg-[#2A160E] text-[#FFF8F0]/70 border-[#E5A93C]/20 hover:text-[#FFF8F0]'
                }`}
              >
                #{o.order_number} ({o.customer_name})
              </button>
            ))}
          </div>

          {selectedOrder ? (
            <div className="space-y-6">
              
              {/* Order Meta Card */}
              <div className="p-5 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#E5A93C]">Active Ticket</span>
                  <h4 className="font-serif text-2xl font-black text-[#FFF8F0]">{selectedOrder.order_number}</h4>
                  <p className="text-xs text-[#FFF8F0]/70">
                    Guest: {selectedOrder.customer_name} • {selectedOrder.table_number || 'Takeaway'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#FFF8F0]/60 block">Total Amount</span>
                  <span className="text-xl font-mono font-black text-[#F7C873]">{selectedOrder.total_gmd} D</span>
                  <span className="block text-[10px] uppercase font-bold text-emerald-400">
                    {selectedOrder.payment_method === 'wave_money' ? '🌊 Wave Mobile Paid' : '💵 Cash POS'}
                  </span>
                </div>
              </div>

              {/* Animated Progress Stepper */}
              <div className="p-6 rounded-2xl bg-[#140905] border border-[#E5A93C]/30 space-y-6">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
                  Live Preparation Pipeline
                </h5>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-6 right-6 h-1 bg-[#2A160E]">
                    <div
                      className="h-full bg-gradient-to-r from-[#E5A93C] to-[#D49B44] transition-all duration-700"
                      style={{ width: `${(getStageIndex(selectedOrder.status) / 4) * 100}%` }}
                    ></div>
                  </div>

                  {/* Stepper items */}
                  <div className="relative flex justify-between">
                    {stages.map((stage, idx) => {
                      const currentIdx = getStageIndex(selectedOrder.status);
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stage.key} className="flex flex-col items-center text-center max-w-[80px]">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all shadow-lg ${
                              isCurrent
                                ? 'bg-[#E5A93C] text-[#140905] border-[#FFF8F0] ring-4 ring-[#E5A93C]/30 scale-110'
                                : isComplete
                                ? 'bg-[#2A160E] text-[#E5A93C] border-[#E5A93C]'
                                : 'bg-[#1E0F0A] text-[#FFF8F0]/30 border-[#2A160E]'
                            }`}
                          >
                            {stage.icon}
                          </div>
                          <p className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-[#E5A93C]' : isComplete ? 'text-[#FFF8F0]' : 'text-[#FFF8F0]/40'}`}>
                            {stage.title}
                          </p>
                          <p className="text-[9px] text-[#FFF8F0]/50 hidden sm:block">
                            {stage.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#2A160E]/50 border border-[#E5A93C]/15 space-y-2">
                  <h6 className="text-xs font-bold text-[#FFF8F0]/90">Items in this Order</h6>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#E5A93C]/10 last:border-0">
                      <span className="text-[#FFF8F0]">{it.quantity}x {it.item_name}</span>
                      <span className="font-mono text-[#F7C873]">{it.subtotal_gmd} D</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 text-[#FFF8F0]/50">
              <p>No active orders being tracked</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
