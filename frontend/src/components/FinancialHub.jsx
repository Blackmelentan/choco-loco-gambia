/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: FinancialHub.jsx
 * Financial & Accounting Hub: Daily revenue, expense logging, payment method breakdown, net profit analytics.
 */

window.FinancialHub = function FinancialHub({ salesOverview, onExpenseLogged }) {
  const [expenses, setExpenses] = React.useState([]);
  const [showExpenseModal, setShowExpenseModal] = React.useState(false);
  const [newExpense, setNewExpense] = React.useState({
    title: '',
    category: 'raw_ingredients',
    amountGmd: '',
    paymentMethod: 'cash',
    vendorName: ''
  });

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/sales/expenses');
      if (res.ok) setExpenses(await res.json());
    } catch (err) {
      console.error('Expenses error:', err);
    }
  };

  React.useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amountGmd) return;

    try {
      const res = await fetch('/api/sales/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });
      if (res.ok) {
        setShowExpenseModal(false);
        setNewExpense({ title: '', category: 'raw_ingredients', amountGmd: '', paymentMethod: 'cash', vendorName: '' });
        fetchExpenses();
        if (onExpenseLogged) onExpenseLogged();
      }
    } catch (err) {
      alert('Failed to log expense');
    }
  };

  return (
    <section className="py-8 bg-[#140905] min-h-screen text-[#FFF8F0] space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5A93C] to-[#D49B44] flex items-center justify-center text-3xl shadow-xl shadow-[#E5A93C]/20 text-[#140905]">
              📊
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#FFF8F0]">
                Financial & Accounting Hub
              </h1>
              <p className="text-xs text-[#FFF8F0]/70 mt-1">
                Store ledger, payment channels, operating expenses, and net profit analytics
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/40 text-[#E5A93C] font-bold text-xs uppercase tracking-wider hover:bg-[#381D13] hover:border-[#E5A93C] transition-all flex items-center gap-2"
          >
            <span>+</span>
            <span>Log Store Expense</span>
          </button>
        </div>

        {/* 3 Overview Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">Total Revenue</span>
            <div className="text-3xl font-mono font-black text-emerald-400">
              +{salesOverview?.totalRevenueGmd || 0} D
            </div>
            <p className="text-[11px] text-[#FFF8F0]/50">Settled orders across all payment channels</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">Total Operating Expenses</span>
            <div className="text-3xl font-mono font-black text-red-400">
              -{salesOverview?.totalExpensesGmd || 0} D
            </div>
            <p className="text-[11px] text-[#FFF8F0]/50">Belgian imports, packaging, fresh fruits, power</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">Net Operating Position</span>
            <div className={`text-3xl font-mono font-black ${Number(salesOverview?.netProfitGmd || 0) >= 0 ? 'text-emerald-400' : 'text-[#F7C873]'}`}>
              {salesOverview?.netProfitGmd || 0} D
            </div>
            <p className="text-[11px] text-[#FFF8F0]/50">Inventory capitalized & daily cash flow</p>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-2xl space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#FFF8F0]">
            Payment Channels Breakdown (GMD)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#2A160E] border border-blue-500/30 space-y-1">
              <span className="text-xs font-bold text-blue-400">🌊 Wave Mobile Money</span>
              <p className="text-xl font-mono font-bold text-[#FFF8F0]">
                {salesOverview?.paymentMethods?.wave_money || 0} D
              </p>
              <span className="text-[10px] text-blue-400/80">Dominant Mobile Payment</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#2A160E] border border-emerald-500/30 space-y-1">
              <span className="text-xs font-bold text-emerald-400">💵 Cash at Register</span>
              <p className="text-xl font-mono font-bold text-[#FFF8F0]">
                {salesOverview?.paymentMethods?.cash || 0} D
              </p>
              <span className="text-[10px] text-emerald-400/80">POS Counter Till</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/30 space-y-1">
              <span className="text-xs font-bold text-[#E5A93C]">💳 Credit / Debit Card</span>
              <p className="text-xl font-mono font-bold text-[#FFF8F0]">
                {salesOverview?.paymentMethods?.card || 0} D
              </p>
              <span className="text-[10px] text-[#E5A93C]/80">Visa & Mastercard</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#2A160E] border border-purple-500/30 space-y-1">
              <span className="text-xs font-bold text-purple-400">🏦 Local Bank Transfer</span>
              <p className="text-xl font-mono font-bold text-[#FFF8F0]">
                {salesOverview?.paymentMethods?.local_transfer || 0} D
              </p>
              <span className="text-[10px] text-purple-400/80">Direct Bank Settlement</span>
            </div>
          </div>
        </div>

        {/* Expenses Ledger Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#FFF8F0]">
              Audited Store Expenses Ledger
            </h3>
            <span className="text-xs text-[#E5A93C] font-mono">{expenses.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5A93C]/20 text-[#E5A93C] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expense Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5A93C]/10 text-[#FFF8F0]">
                {expenses.map((exp, idx) => (
                  <tr key={idx} className="hover:bg-[#2A160E]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#FFF8F0]/70">{exp.expense_date}</td>
                    <td className="py-3 px-4 font-bold">{exp.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#2A160E] text-[#E5A93C]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#FFF8F0]/80">{exp.vendor_name || 'N/A'}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-[#FFF8F0]/70">{exp.payment_method}</td>
                    <td className="py-3 px-4 font-mono font-bold text-red-400">-{exp.amount_gmd} D</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-[#1E0F0A] rounded-3xl border border-[#E5A93C]/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5A93C]/20 pb-3">
                <h4 className="font-serif text-lg font-bold text-[#FFF8F0]">Log Store Operating Expense</h4>
                <button onClick={() => setShowExpenseModal(false)} className="text-[#FFF8F0]/60 hover:text-[#FFF8F0]">✕</button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Expense Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20kg Belgian Milk Chocolate"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    >
                      <option value="dairy_cocoa">Dairy & Cocoa</option>
                      <option value="raw_ingredients">Fresh Berries & Fruits</option>
                      <option value="packaging">Dessert Packaging</option>
                      <option value="utilities">Utilities & Power</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Amount (GMD)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4500"
                      value={newExpense.amountGmd}
                      onChange={(e) => setNewExpense({ ...newExpense, amountGmd: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Vendor / Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g. Bakau Farmers Cooperative"
                    value={newExpense.vendorName}
                    onChange={(e) => setNewExpense({ ...newExpense, vendorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] font-black text-xs uppercase tracking-wider shadow-lg"
                >
                  Save Expense Record
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
