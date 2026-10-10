/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: CartDrawer.jsx
 * Slide-out Glassmorphism Cart with Wave Mobile Money checkout integration,
 * customer phone entry, order type toggle, and order submission.
 */

window.CartDrawer = function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess
}) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [orderType, setOrderType] = React.useState('dine_in');
  const [tableNumber, setTableNumber] = React.useState('T-04');
  const [paymentMethod, setPaymentMethod] = React.useState('wave_money');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const subtotalGmd = React.useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.unitPriceGmd) * Number(item.quantity)), 0);
  }, [cartItems]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please provide your name and phone number for order updates');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/sales/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          orderType,
          tableNumber: orderType === 'dine_in' ? tableNumber : 'N/A',
          paymentMethod,
          items: cartItems.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            unitPriceGmd: item.unitPriceGmd,
            quantity: item.quantity,
            customizations: item.customizations || []
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Order creation failed');
      }

      const data = await response.json();
      onOrderSuccess(data.order, data.waveSession);
      onClose();
    } catch (err) {
      setErrorMsg('Checkout failed. Please try again or notify staff.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1E0F0A] border-l border-[#E5A93C]/30 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 bg-[#140905] border-b border-[#E5A93C]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛍️</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FFF8F0]">Your Dessert Order</h3>
                <p className="text-xs text-[#E5A93C]/80">{cartItems.length} items selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#2A160E] text-[#FFF8F0] hover:text-[#E5A93C] flex items-center justify-center border border-[#E5A93C]/20"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 text-[#FFF8F0]/50 space-y-3">
                <span className="text-4xl block">🧇</span>
                <p className="font-serif text-base font-bold text-[#FFF8F0]">Your cart is empty</p>
                <p className="text-xs">Explore our Belgian bubble waffles and sushi crepes!</p>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/20 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#FFF8F0]">{item.name}</h4>
                      <p className="text-xs text-[#F7C873] font-semibold">{item.unitPriceGmd} D each</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-[#E63946] text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Customizations tags */}
                  {item.customizations && item.customizations.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.customizations.map((cust, cIdx) => (
                        <span key={cIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#1E0F0A] text-[#E5A93C] border border-[#E5A93C]/20">
                          {cust}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5A93C]/10">
                    <div className="flex items-center gap-2 bg-[#1E0F0A] px-2 py-1 rounded-xl border border-[#E5A93C]/20">
                      <button
                        onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                        className="text-xs font-bold text-[#FFF8F0] px-1 hover:text-[#E5A93C]"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-[#FFF8F0] px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="text-xs font-bold text-[#FFF8F0] px-1 hover:text-[#E5A93C]"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#FFF8F0]">
                      {Number(item.unitPriceGmd) * Number(item.quantity)} D
                    </span>
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <div className="pt-4 space-y-4 border-t border-[#E5A93C]/20">
                
                {/* Order Type Selector */}
                <div>
                  <label className="text-xs font-bold text-[#FFF8F0] block mb-1.5">Dining Experience</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dine_in', label: 'Dine-In', icon: '🪑' },
                      { id: 'takeaway', label: 'Takeaway', icon: '🛍️' },
                      { id: 'pipeline_delivery', label: 'Delivery', icon: '🛵' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setOrderType(type.id)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          orderType === type.id
                            ? 'bg-[#E5A93C] text-[#140905] font-bold border-[#E5A93C]'
                            : 'bg-[#2A160E] text-[#FFF8F0]/70 border-[#E5A93C]/20'
                        }`}
                      >
                        <span className="block text-sm">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {orderType === 'dine_in' && (
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Table Number</label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g. T-04 or VIP Terrace"
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                )}

                {/* Customer Details */}
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Fatou Bah"
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Phone Number (Wave / SMS)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+220 7xx xxxx"
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-xs font-bold text-[#FFF8F0] block mb-1.5">Payment Method</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wave_money')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        paymentMethod === 'wave_money'
                          ? 'bg-[#1E0F0A] border-[#E5A93C] text-[#FFF8F0] ring-1 ring-[#E5A93C]'
                          : 'bg-[#2A160E] border-[#E5A93C]/20 text-[#FFF8F0]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌊</span>
                        <div>
                          <p className="font-bold text-[#FFF8F0]">Wave Mobile Money</p>
                          <p className="text-[10px] text-[#E5A93C]">Instant QR & One-Click App Payout</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                        Popular
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        paymentMethod === 'cash'
                          ? 'bg-[#1E0F0A] border-[#E5A93C] text-[#FFF8F0] ring-1 ring-[#E5A93C]'
                          : 'bg-[#2A160E] border-[#E5A93C]/20 text-[#FFF8F0]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💵</span>
                        <div>
                          <p className="font-bold text-[#FFF8F0]">Cash at POS Counter</p>
                          <p className="text-[10px] text-[#FFF8F0]/50">Pay server or cashier directly</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-[#E63946] font-semibold bg-[#E63946]/10 p-2.5 rounded-xl border border-[#E63946]/30">
                    {errorMsg}
                  </p>
                )}

              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#140905] border-t border-[#E5A93C]/20 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#FFF8F0]/70">Subtotal</span>
                <span className="font-mono font-bold text-[#FFF8F0]">{subtotalGmd} D</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-[#FFF8F0]">Grand Total</span>
                <span className="font-mono text-xl text-[#F7C873]">{subtotalGmd} D (GMD)</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5A93C] via-[#F7C873] to-[#D49B44] text-[#140905] font-black text-xs uppercase tracking-wider shadow-xl shadow-[#E5A93C]/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Transmitting to Kitchen...</span>
                ) : (
                  <>
                    <span>Confirm Order & Pay</span>
                    <span className="font-mono">({subtotalGmd} D)</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
