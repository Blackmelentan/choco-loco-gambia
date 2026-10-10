/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: ReservationModal.jsx
 * Lounge Table Reservation trigger (VIP Lounge, Terrace, Main Hall)
 */

window.ReservationModal = function ReservationModal({ isOpen, onClose, onReservationSuccess }) {
  if (!isOpen) return null;

  const [guestName, setGuestName] = React.useState('');
  const [guestPhone, setGuestPhone] = React.useState('');
  const [guestCount, setGuestCount] = React.useState(2);
  const [reservationDate, setReservationDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [reservationTime, setReservationTime] = React.useState('19:30');
  const [tablePreference, setTablePreference] = React.useState('vip_lounge');
  const [specialRequests, setSpecialRequests] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sales/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          guestPhone,
          guestCount: Number(guestCount),
          reservationDate,
          reservationTime,
          tablePreference,
          specialRequests
        })
      });

      if (!res.ok) throw new Error('Booking failed');
      const data = await res.json();
      setSuccessMsg('VIP Lounge table successfully reserved!');
      setTimeout(() => {
        onReservationSuccess(data);
        onClose();
      }, 1500);
    } catch (err) {
      alert('Failed to book table. Please contact +220 400 0060.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#1E0F0A] rounded-3xl border border-[#E5A93C]/40 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5A93C]/20 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5A93C]">Choco Loco Lounge</span>
            <h3 className="font-serif text-2xl font-bold text-[#FFF8F0]">Reserve a Table</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2A160E] text-[#FFF8F0] hover:text-[#E5A93C] flex items-center justify-center border border-[#E5A93C]/20"
          >
            ✕
          </button>
        </div>

        {successMsg ? (
          <div className="py-10 text-center space-y-3">
            <span className="text-4xl">🎉</span>
            <h4 className="font-serif text-xl font-bold text-[#FFF8F0]">{successMsg}</h4>
            <p className="text-xs text-[#E5A93C]">Confirmation dispatched via SMS/WhatsApp</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aisha Jallow"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+220 7xx xxxx"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Guests</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests</option>
                  <option value={8}>8+ Party</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Lounge Seating Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'vip_lounge', label: 'VIP Lounge', icon: '✨' },
                  { id: 'terrace', label: 'Open Terrace', icon: '🌿' },
                  { id: 'main_hall', label: 'Main Hall', icon: '🏛️' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTablePreference(s.id)}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      tablePreference === s.id
                        ? 'bg-[#E5A93C] text-[#140905] font-bold border-[#E5A93C]'
                        : 'bg-[#2A160E] text-[#FFF8F0]/70 border-[#E5A93C]/20'
                    }`}
                  >
                    <span>{s.icon} {s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#FFF8F0] block mb-1">Special Occasion / Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Anniversary celebration, birthday cake surprise..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#E5A93C]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#E5A93C]/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming Reservation...' : 'Confirm Lounge Reservation'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
