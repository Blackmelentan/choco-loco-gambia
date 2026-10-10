/**
 * Kaabu Technologies - Choco Loco Digital Transformation Ecosystem
 * Main Application Component (App.jsx)
 * Coordinates React State, Rest APIs, Real-time WebSockets, and Modular UI Views.
 */

window.App = function App() {
  const [activeTab, setActiveTab] = React.useState('menu'); // 'menu', 'godseye', 'payroll', 'finance', 'staff'
  const [menuCategories, setMenuCategories] = React.useState([]);
  const [staffList, setStaffList] = React.useState([]);
  const [shifts, setShifts] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [salesOverview, setSalesOverview] = React.useState(null);
  
  // Real-time WebSocket state
  const [wsConnected, setWsConnected] = React.useState(false);
  const [wsEvents, setWsEvents] = React.useState([]);
  const [toastMessage, setToastMessage] = React.useState(null);

  // Cart & Modals
  const [cartItems, setCartItems] = React.useState([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [customizingItem, setCustomizingItem] = React.useState(null);
  const [isTimeClockOpen, setIsTimeClockOpen] = React.useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = React.useState(false);
  const [isReservationOpen, setIsReservationOpen] = React.useState(false);

  // Fetch initial data
  const fetchData = React.useCallback(async () => {
    try {
      const [menuRes, staffRes, shiftsRes, ordersRes, salesRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/staff'),
        fetch('/api/shifts'),
        fetch('/api/sales/orders'),
        fetch('/api/sales/overview')
      ]);

      if (menuRes.ok) setMenuCategories(await menuRes.json());
      if (staffRes.ok) setStaffList(await staffRes.json());
      if (shiftsRes.ok) setShifts(await shiftsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (salesRes.ok) setSalesOverview(await salesRes.json());
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup WebSocket connection
  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host || 'localhost:5000'}`;
    let socket = null;

    const connectWs = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          setWsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setWsEvents(prev => [data, ...prev.slice(0, 20)]);

            // Show toast on live events
            if (data.type === 'ORDER_PLACED') {
              showToast(`🔔 New Order #${data.order?.order_number} received!`);
              fetchData();
            } else if (data.type === 'ORDER_STATUS_UPDATED') {
              fetchData();
            } else if (data.type === 'RESERVATION_CREATED') {
              showToast(`🍽️ Table reservation for ${data.reservation?.guest_name} booked!`);
              fetchData();
            }
          } catch (err) {
            console.error('WS message error:', err);
          }
        };

        socket.onclose = () => {
          setWsConnected(false);
          setTimeout(connectWs, 4000);
        };

        socket.onerror = () => {
          setWsConnected(false);
        };
      } catch (e) {
        console.warn('WS Init warning:', e);
      }
    };

    connectWs();

    return () => {
      if (socket) socket.close();
    };
  }, [fetchData]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Cart operations
  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    showToast(`Added ${item.name} to order!`);
  };

  const handleUpdateCartQuantity = (index, newQty) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleOrderSuccess = (order, waveSession) => {
    setCartItems([]);
    fetchData();
    setIsOrderTrackerOpen(true);
    showToast(`Order #${order.order_number} confirmed!`);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, paymentStatus) => {
    try {
      const res = await fetch(`/api/sales/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, paymentStatus })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Order status update error:', err);
    }
  };

  const onDutyCount = staffList.filter(s => s.onDuty).length;

  return (
    <div className="min-h-screen bg-[#140905] text-[#FFF8F0] selection:bg-[#E5A93C] selection:text-[#140905] font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-[#E5A93C] text-[#140905] font-bold text-xs shadow-2xl shadow-[#E5A93C]/40 border border-[#FFF8F0] animate-bounce flex items-center gap-3">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="font-mono text-sm">✕</button>
        </div>
      )}

      {/* Global Navbar */}
      <window.Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTimeClock={() => setIsTimeClockOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onDutyStaffCount={onDutyCount}
        wsConnected={wsConnected}
      />

      {/* Main Tab Router */}
      <main>
        {activeTab === 'menu' && (
          <>
            <window.HeroSection
              onExploreMenu={() => {
                const el = document.getElementById('menu-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onBookTable={() => setIsReservationOpen(true)}
            />
            <div id="menu-collection">
              <window.MenuGrid
                menuCategories={menuCategories}
                onSelectItemForCustomization={(item) => setCustomizingItem(item)}
                onQuickAddToCart={(item) => handleAddToCart({
                  menuItemId: item.id,
                  name: item.name,
                  unitPriceGmd: item.priceGmd,
                  quantity: 1,
                  imageUrl: item.imageUrl,
                  customizations: []
                })}
              />
            </div>
          </>
        )}

        {activeTab === 'godseye' && (
          <window.GodsEyeDashboard
            salesOverview={salesOverview}
            orders={orders}
            staffList={staffList}
            shifts={shifts}
            wsEvents={wsEvents}
            wsConnected={wsConnected}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNavigateToStaff={() => setActiveTab('staff')}
            onNavigateToPayroll={() => setActiveTab('payroll')}
            onNavigateToFinance={() => setActiveTab('finance')}
          />
        )}

        {activeTab === 'payroll' && (
          <window.PayrollManager
            onRefreshTrigger={fetchData}
          />
        )}

        {activeTab === 'finance' && (
          <window.FinancialHub
            salesOverview={salesOverview}
            onExpenseLogged={fetchData}
          />
        )}

        {activeTab === 'staff' && (
          <window.StaffManager
            staffList={staffList}
            shifts={shifts}
            onRefreshStaff={fetchData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5A93C]/20 bg-[#0E0604] py-12 text-[#FFF8F0]/60 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-[#E5A93C]" />
            <div>
              <p className="font-serif font-bold text-[#FFF8F0] text-sm">Choco Loco Patisserie & Lounge</p>
              <p className="text-[11px] text-[#E5A93C]/80">Pipeline Mosque Junction, Kairaba Avenue, The Gambia</p>
            </div>
          </div>
          <div className="text-center md:text-right space-y-1">
            <p className="font-mono text-[#E5A93C]">KAABU TECHNOLOGIES ENTERPRISE BUILD • PRODUCTION ECOSYSTEM</p>
            <p>Integrated with Wave Mobile Money (GMD) • Geofenced Auditing • Real-Time WebSockets</p>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <window.CustomizationModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      <window.CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOrderSuccess={handleOrderSuccess}
      />

      <window.TimeClockModal
        isOpen={isTimeClockOpen}
        onClose={() => setIsTimeClockOpen(false)}
        staffList={staffList}
        onClockUpdate={fetchData}
      />

      <window.OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
      />

      <window.ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onReservationSuccess={() => {
          fetchData();
          showToast('Table reservation confirmed!');
        }}
      />

    </div>
  );
};
