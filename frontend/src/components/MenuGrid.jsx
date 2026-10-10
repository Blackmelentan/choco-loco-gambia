/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: MenuGrid.jsx
 * Interactive Menu & Ordering System with category filtering,
 * item previews, signature badges, and customizer trigger.
 */

window.MenuGrid = function MenuGrid({ menuCategories, onSelectItemForCustomization, onQuickAddToCart }) {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Flatten items for filtering
  const allItems = React.useMemo(() => {
    const list = [];
    menuCategories.forEach(cat => {
      (cat.items || []).forEach(item => {
        list.push({ ...item, categoryName: cat.name, categorySlug: cat.slug });
      });
    });
    return list;
  }, [menuCategories]);

  const filteredItems = React.useMemo(() => {
    return allItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.categorySlug === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allItems, selectedCategory, searchQuery]);

  return (
    <section className="py-12 bg-[#140905] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5A93C]/20">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E5A93C] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]"></span>
              Artisan Creations • Freshly Baked
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFF8F0]">
              The Choco Loco Collection
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search waffles, crepes, drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-2xl bg-[#1E0F0A] border border-[#E5A93C]/30 text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#E5A93C] transition-all"
            />
            <svg className="w-4 h-4 text-[#E5A93C]/70 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3 text-xs text-[#FFF8F0]/50 hover:text-[#FFF8F0]">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap tracking-wide transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] shadow-lg shadow-[#E5A93C]/20 font-bold'
                : 'bg-[#1E0F0A] text-[#FFF8F0]/70 border border-[#E5A93C]/20 hover:text-[#E5A93C]'
            }`}
          >
            All Specialties ({allItems.length})
          </button>
          {menuCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap tracking-wide transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] shadow-lg shadow-[#E5A93C]/20 font-bold'
                  : 'bg-[#1E0F0A] text-[#FFF8F0]/70 border border-[#E5A93C]/20 hover:text-[#E5A93C]'
              }`}
            >
              {cat.name} ({(cat.items || []).length})
            </button>
          ))}
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#1E0F0A]/50 rounded-3xl border border-[#E5A93C]/10">
            <p className="text-3xl mb-2">🍫</p>
            <h3 className="font-serif text-lg font-bold text-[#FFF8F0]">No delicacies found</h3>
            <p className="text-xs text-[#FFF8F0]/50 mt-1">Try searching for something else like "waffle" or "biscoff"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group relative bg-[#1E0F0A] rounded-3xl border border-[#E5A93C]/20 hover:border-[#E5A93C]/60 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#E5A93C]/10 transition-all duration-300 flex flex-col justify-between"
              >
                
                {/* Image Section */}
                <div className="relative h-60 w-full overflow-hidden bg-[#2A160E]">
                  <img
                    src={item.imageUrl || '/assets/signature_waffle.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = '/static/signature_waffle.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F0A] via-transparent to-black/20"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {item.isSignature ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] shadow-md">
                        ★ Signature
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-medium bg-[#140905]/80 text-[#FFF8F0]/80 backdrop-blur-md border border-[#E5A93C]/20">
                        {item.categoryName}
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#140905]/80 text-[#F7C873] backdrop-blur-md border border-[#E5A93C]/20 flex items-center gap-1">
                      <span>⏱️</span> {item.prepTimeMinutes || 10}m prep
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-[#140905]/90 backdrop-blur-md border border-[#E5A93C]/40 text-right shadow-lg">
                    <span className="text-lg font-black text-[#F7C873]">{item.priceGmd} D</span>
                    <span className="text-[10px] text-[#FFF8F0]/60 ml-1">GMD</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#FFF8F0] group-hover:text-[#F7C873] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#FFF8F0]/70 mt-2 font-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Customization options indicator */}
                  {item.customizationGroups && item.customizationGroups.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#E5A93C]/80 bg-[#2A160E]/50 px-3 py-1.5 rounded-xl border border-[#E5A93C]/10">
                      <span>✨</span>
                      <span>Customizable glazes, toppings & gelato</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectItemForCustomization(item)}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#E5A93C] to-[#D49B44] text-[#140905] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E5A93C]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Customize & Order</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onQuickAddToCart(item)}
                      className="p-3 rounded-2xl bg-[#2A160E] text-[#FFF8F0] border border-[#E5A93C]/30 hover:border-[#E5A93C] hover:bg-[#381D13] transition-all"
                      title="Quick Add Default"
                    >
                      <svg className="w-4 h-4 text-[#F7C873]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
