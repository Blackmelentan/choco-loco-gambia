/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: CustomizationModal.jsx
 * Dynamic customization engine: toppings, Belgian glazes, gelato scoops, quantity, and live price recalculation.
 */

window.CustomizationModal = function CustomizationModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  const [quantity, setQuantity] = React.useState(1);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [specialInstructions, setSpecialInstructions] = React.useState('');

  // Handle single or multi select
  const toggleOption = (groupId, option, isRequired, maxSelections) => {
    setSelectedOptions(prev => {
      const currentGroupSelections = prev[groupId] || [];
      const exists = currentGroupSelections.some(o => o.id === option.id);

      if (exists) {
        return {
          ...prev,
          [groupId]: currentGroupSelections.filter(o => o.id !== option.id)
        };
      } else {
        if (maxSelections === 1 || isRequired) {
          // Replace selection
          return { ...prev, [groupId]: [option] };
        } else {
          if (currentGroupSelections.length < maxSelections) {
            return { ...prev, [groupId]: [...currentGroupSelections, option] };
          }
          return prev;
        }
      }
    });
  };

  // Calculate live total price
  const additionalCost = React.useMemo(() => {
    let extra = 0;
    Object.values(selectedOptions).forEach(opts => {
      opts.forEach(opt => {
        extra += Number(opt.additionalPriceGmd || 0);
      });
    });
    return extra;
  }, [selectedOptions]);

  const unitTotalGmd = Number(item.priceGmd) + additionalCost;
  const grandTotalGmd = unitTotalGmd * quantity;

  const handleConfirm = () => {
    const flatCustomizations = [];
    Object.values(selectedOptions).forEach(opts => {
      opts.forEach(opt => {
        flatCustomizations.push(opt.name);
      });
    });

    onAddToCart({
      menuItemId: item.id,
      name: item.name,
      unitPriceGmd: unitTotalGmd,
      quantity,
      imageUrl: item.imageUrl,
      customizations: flatCustomizations,
      specialInstructions
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#1E0F0A] rounded-3xl border border-[#E5A93C]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="relative h-48 bg-[#2A160E] overflow-hidden">
          <img
            src={item.imageUrl || '/assets/signature_waffle.jpg'}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/static/signature_waffle.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F0A] via-[#1E0F0A]/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#140905]/80 text-[#FFF8F0] border border-[#E5A93C]/30 flex items-center justify-center hover:bg-[#E5A93C] hover:text-[#140905] transition-all"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E5A93C]">
              Customize Your Dessert
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#FFF8F0]">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Customization Groups */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <p className="text-xs text-[#FFF8F0]/70 font-light leading-relaxed">
            {item.description}
          </p>

          {(item.customizationGroups || []).map(group => {
            const currentSelected = selectedOptions[group.id] || [];
            return (
              <div key={group.id} className="p-4 rounded-2xl bg-[#2A160E]/60 border border-[#E5A93C]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#FFF8F0]">{group.groupName}</h4>
                    <p className="text-[11px] text-[#E5A93C]/80">
                      {group.isRequired ? 'Required (Select 1)' : `Optional (Max ${group.maxSelections})`}
                    </p>
                  </div>
                  {group.isRequired && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30">
                      Required
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {group.options.map(option => {
                    const isSelected = currentSelected.some(o => o.id === option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleOption(group.id, option, group.isRequired, group.maxSelections)}
                        className={`p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#E5A93C] text-[#140905] border-[#E5A93C] font-bold shadow-md shadow-[#E5A93C]/20'
                            : 'bg-[#1E0F0A] text-[#FFF8F0]/80 border-[#E5A93C]/20 hover:border-[#E5A93C]/60 hover:text-[#FFF8F0]'
                        }`}
                      >
                        <span>{option.name}</span>
                        <span className={isSelected ? 'text-[#140905]' : 'text-[#E5A93C]'}>
                          {Number(option.additionalPriceGmd) > 0 ? `+${option.additionalPriceGmd} D` : 'Included'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#FFF8F0]/90">
              Special Kitchen Notes / Dietary Preferences
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Extra drizzle on the side, allergic to peanuts, light sugar..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#2A160E] border border-[#E5A93C]/30 text-xs text-[#FFF8F0] placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#E5A93C]"
            />
          </div>

        </div>

        {/* Modal Footer (Quantity + Confirm CTA) */}
        <div className="p-6 bg-[#140905] border-t border-[#E5A93C]/20 flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-[#1E0F0A] px-3 py-1.5 rounded-2xl border border-[#E5A93C]/30">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-[#2A160E] text-[#FFF8F0] hover:text-[#E5A93C] flex items-center justify-center font-bold text-lg"
            >
              -
            </button>
            <span className="font-mono font-bold text-sm text-[#FFF8F0] w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-[#2A160E] text-[#FFF8F0] hover:text-[#E5A93C] flex items-center justify-center font-bold text-lg"
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E5A93C] via-[#F7C873] to-[#D49B44] text-[#140905] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E5A93C]/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between"
          >
            <span>Add to Order</span>
            <span className="text-sm font-black">{grandTotalGmd} D (GMD)</span>
          </button>

        </div>

      </div>
    </div>
  );
};
