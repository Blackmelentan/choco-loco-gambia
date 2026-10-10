/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: StaffManager.jsx
 * Staff accounts, role badges, shift schedules, and shift swap approvals.
 */

window.StaffManager = function StaffManager({ staffList = [], shifts = [], onRefreshStaff }) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [swaps, setSwaps] = React.useState([]);
  const [newStaff, setNewStaff] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'floor_staff',
    positionTitle: 'Artisan Barista',
    hourlyRateGmd: 150,
    waveMobileNumber: '+220'
  });

  const fetchSwaps = async () => {
    try {
      const res = await fetch('/api/shifts/swaps');
      if (res.ok) setSwaps(await res.json());
    } catch (err) {
      console.error('Swaps error:', err);
    }
  };

  React.useEffect(() => {
    fetchSwaps();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewStaff({ fullName: '', email: '', phone: '', role: 'floor_staff', positionTitle: 'Artisan Barista', hourlyRateGmd: 150, waveMobileNumber: '+220' });
        if (onRefreshStaff) onRefreshStaff();
      }
    } catch (err) {
      alert('Failed to create staff member');
    }
  };

  const handleSwapDecision = async (swapId, decision) => {
    try {
      const res = await fetch(`/api/shifts/swaps/${swapId}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      if (res.ok) fetchSwaps();
    } catch (err) {
      alert('Failed to process swap decision');
    }
  };

  return (
    <section className="py-8 bg-[#140905] min-h-screen text-[#FFF8F0] space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5A93C] to-[#D49B44] flex items-center justify-center text-3xl shadow-xl shadow-[#E5A93C]/20 text-[#140905]">
              🧑‍🍳
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#FFF8F0]">
                Staff Directory & Shift Operations
              </h1>
              <p className="text-xs text-[#FFF8F0]/70 mt-1">
                Role-based access, geofenced audit logs, and Wave Mobile Money accounts
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/40 text-[#E5A93C] font-bold text-xs uppercase tracking-wider hover:bg-[#381D13] hover:border-[#E5A93C] transition-all flex items-center gap-2"
          >
            <span>+</span>
            <span>Add Staff Member</span>
          </button>
        </div>

        {/* Staff Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map(st => (
            <div
              key={st.id}
              className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 hover:border-[#E5A93C]/50 shadow-xl space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#E5A93C] font-bold">{st.employeeCode}</span>
                  <h3 className="font-serif text-lg font-bold text-[#FFF8F0]">{st.fullName}</h3>
                  <p className="text-xs text-[#FFF8F0]/70">{st.positionTitle}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  st.onDuty ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#2A160E] text-[#FFF8F0]/50'
                }`}>
                  {st.onDuty ? '● On Duty' : '○ Off Duty'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-[#E5A93C]/10 text-[#FFF8F0]/80">
                <div className="flex justify-between">
                  <span className="text-[#FFF8F0]/50">Hourly Rate:</span>
                  <span className="font-bold text-[#F7C873]">{st.hourlyRateGmd} D/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FFF8F0]/50">Wave Account:</span>
                  <span className="text-blue-400">{st.waveMobileNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FFF8F0]/50">System Role:</span>
                  <span className="capitalize text-[#E5A93C]">{st.role?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shift Swap Requests Section */}
        {swaps.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#FFF8F0]">
              Pending Shift Swap Requests
            </h3>
            <div className="space-y-3">
              {swaps.map(swap => (
                <div key={swap.id} className="p-4 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#FFF8F0]">
                      {swap.requestingStaffName} ➔ {swap.targetStaffName}
                    </p>
                    <p className="text-[11px] text-[#E5A93C]">Shift: {swap.shiftTitle} • Reason: "{swap.reason}"</p>
                  </div>
                  {swap.manager_approval_status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSwapDecision(swap.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-[#140905] text-xs font-bold"
                      >
                        Approve Swap
                      </button>
                      <button
                        onClick={() => handleSwapDecision(swap.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs uppercase font-bold text-[#E5A93C]">{swap.manager_approval_status}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-[#1E0F0A] rounded-3xl border border-[#E5A93C]/40 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5A93C]/20 pb-3">
                <h4 className="font-serif text-lg font-bold text-[#FFF8F0]">Add Staff Profile</h4>
                <button onClick={() => setShowAddModal(false)} className="text-[#FFF8F0]/60 hover:text-[#FFF8F0]">✕</button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ousman Njie"
                    value={newStaff.fullName}
                    onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="staff@chocoloco.gm"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+220..."
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Position Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Chocolatier"
                      value={newStaff.positionTitle}
                      onChange={(e) => setNewStaff({ ...newStaff, positionTitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Role</label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    >
                      <option value="floor_staff">Floor Staff</option>
                      <option value="pos_cashier">POS Cashier</option>
                      <option value="shift_manager">Shift Manager</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Wage (D/hr)</label>
                    <input
                      type="number"
                      required
                      placeholder="150"
                      value={newStaff.hourlyRateGmd}
                      onChange={(e) => setNewStaff({ ...newStaff, hourlyRateGmd: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Wave Mobile No.</label>
                    <input
                      type="text"
                      required
                      placeholder="+220 311 4455"
                      value={newStaff.waveMobileNumber}
                      onChange={(e) => setNewStaff({ ...newStaff, waveMobileNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] font-black text-xs uppercase tracking-wider shadow-lg"
                >
                  Save Staff Member
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
