import React, { useState } from 'react';
import { 
  Search, Sparkles, ShoppingBag, Scale, Edit3, 
  PhoneCall, Menu, X, ChevronRight, MessageCircle, 
  HelpCircle, BookOpen, Home, Grid, MapPin, Zap, ShieldCheck
} from 'lucide-react';
import { MAIN_STORE_CATEGORIES, CATEGORIES, StoreCategoryItem } from '../data/soaps';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';

export type CurrentPageView = 'home' | 'products' | 'product-detail' | 'about' | 'service';

interface NavbarProps {
  currentView: CurrentPageView;
  setCurrentView: (view: CurrentPageView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  langMode: 'ur' | 'en' | 'bi';
  setLangMode: (mode: 'ur' | 'en' | 'bi') => void;
  openQuiz: () => void;
  openAdmin: () => void;
  cartCount: number;
  openCart: () => void;
  compareCount: number;
  openCompare: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories?: StoreCategoryItem[];
  shopNumber?: string;
  siteConfig?: SiteConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  langMode,
  setLangMode,
  openQuiz,
  openAdmin,
  cartCount,
  openCart,
  compareCount,
  openCompare,
  activeCategory,
  setActiveCategory,
  categories = [],
  shopNumber = '03301285975',
  siteConfig = DEFAULT_SITE_CONFIG,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Merge all categories for dropdown & drawer (deduplicated by id)
  const allNavCategories: StoreCategoryItem[] = Array.from(
    new Map(
      [
        ...MAIN_STORE_CATEGORIES,
        ...CATEGORIES.filter((c) => c.id !== 'prompt_featured'),
        ...categories,
      ].map((c) => [c.id, c])
    ).values()
  );

  const cleanPhone = (shopNumber || '03301285975').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0')
    ? '92' + cleanPhone.slice(1)
    : cleanPhone || '923301285975';

  const isUrdu = langMode === 'ur';

  const orderMsg = isUrdu
    ? 'السلام علیکم! مجھے صابن اور ہربل پروڈکٹس کے بارے میں معلومات اور آرڈر کرنا ہے۔'
    : 'Hello! I would like to order organic herbal soaps & products.';

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    setCurrentView('products');
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (view: CurrentPageView) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'products') {
      setCurrentView('products');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        
        {/* =================================================================
            TIER 1: DHAMART / FARMART TOP UTILITY BAR
        ================================================================= */}
        <div className="bg-[#f5f6f8] border-b border-slate-200 text-slate-600 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            
            {/* Left Welcome Text */}
            <div className="flex items-center gap-4">
              <p className="font-medium text-slate-700">
                Welcome to <sup className="text-[#00368B] font-bold">e</sup>
                <strong className="text-[#00368B] font-bold">{siteConfig.storeName}</strong> —{' '}
                {isUrdu ? siteConfig.topBarAnnouncementUr : siteConfig.topBarAnnouncementEn}
              </p>
              <span className="hidden md:inline-block text-slate-300">|</span>
              <span className="hidden md:inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isUrdu ? siteConfig.topBarPromoBadgeUr : siteConfig.topBarPromoBadgeEn}</span>
              </span>
            </div>

            {/* Right Utility Links */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              <button
                onClick={() => handleNavigateView('about')}
                className="hover:text-[#00368B] transition-colors hidden sm:inline"
              >
                {isUrdu ? 'ہمارے بارے میں' : 'About Us'}
              </button>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <button
                onClick={() => handleNavigateView('service')}
                className="hover:text-[#00368B] transition-colors hidden sm:inline"
              >
                {isUrdu ? 'آرڈر ٹریکنگ / مدد' : 'Order Help'}
              </button>
              <span className="text-slate-300 hidden sm:inline">|</span>

              {/* Language Switcher */}
              <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 text-[11px] font-bold">
                <button
                  onClick={() => setLangMode('en')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    langMode === 'en' ? 'bg-[#00368B] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLangMode('ur')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    langMode === 'ur' ? 'bg-[#00368B] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            TIER 2: DHAMART / FARMART MIDDLE HEADER (Logo, Location, Search, Hotline, Cart)
        ================================================================= */}
        <div className="bg-white py-3.5 px-4 border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Mobile Menu Button + Store Brand Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800"
                aria-label="Open Categories Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div
                onClick={() => handleNavigateView('home')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#00368B] flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-900 transition-colors overflow-hidden">
                  {siteConfig.logoImageUrl ? (
                    <img src={siteConfig.logoImageUrl} alt={siteConfig.storeName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-serif tracking-tighter text-[#fab528]">{siteConfig.logoText || 'SH'}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs font-extrabold text-[#fab528] -translate-y-2">e</span>
                    <span className="text-lg sm:text-2xl font-black tracking-tight text-[#00368B] leading-none">
                      {siteConfig.storeName}
                    </span>
                  </div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mt-0.5">
                    {isUrdu ? siteConfig.storeTaglineUr : siteConfig.storeTaglineEn}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Location Display + Wide Quick-Search Bar (Exact dhamart.pk style) */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl">
              
              {/* Delivery Location Box */}
              <div
                onClick={openCart}
                className="hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:border-[#00368B] cursor-pointer shrink-0 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00368B] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <span className="text-[10px] font-semibold text-slate-400 block">Delivery Area</span>
                  <span className="text-xs font-bold text-slate-800">
                    {isUrdu ? siteConfig.deliveryLocationTextUr : siteConfig.deliveryLocationTextEn}
                  </span>
                </div>
              </div>

              {/* Quick Search Form with Category Dropdown */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 flex items-center bg-[#f3f4f6] border-2 border-slate-200 focus-within:border-[#00368B] focus-within:bg-white rounded-xl overflow-hidden transition-all"
              >
                <select
                  value={activeCategory}
                  onChange={(e) => handleSelectCategory(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 px-3 py-2.5 border-r border-slate-300 focus:outline-none cursor-pointer max-w-[180px]"
                >
                  {allNavCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {isUrdu ? cat.labelUrdu : cat.labelEnglish}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'products') {
                      setCurrentView('products');
                    }
                  }}
                  placeholder={
                    isUrdu
                      ? 'صابن، شیمپو، ہیئر آئل یا جلد کا مسئلہ تلاش کریں...'
                      : "I'm shopping for organic soaps, shampoo, hair oil..."
                  }
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 bg-transparent focus:outline-none"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-2 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    ✕
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-[#00368B] hover:bg-blue-900 text-white px-4 py-2.5 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">{isUrdu ? 'تلاش' : 'Search'}</span>
                </button>
              </form>
            </div>

            {/* Right: 24/7 Hotline + Compare + Cart Counter */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              
              {/* Hotline Box */}
              <a
                href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent(orderMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-2.5 group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <span className="text-sm font-black text-slate-900 group-hover:text-[#00368B] block font-mono" dir="ltr">
                    0330-1285975
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">WhatsApp 24/7 Support</span>
                </div>
              </a>

              {/* Compare Icon Button */}
              <button
                onClick={openCompare}
                className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                title="Compare Products"
              >
                <Scale className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#fab528] text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {compareCount}
                </span>
              </button>

              {/* Cart Button with Badge & Label */}
              <button
                onClick={openCart}
                className="flex items-center gap-2.5 bg-[#00368B] hover:bg-blue-900 text-white px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#fab528]" />
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#fab528] text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <span className="text-[10px] text-blue-200 block">{isUrdu ? 'آپ کا آرڈر' : 'Your Cart'}</span>
                  <span className="text-xs font-bold text-white">
                    {isUrdu ? 'آرڈر بک کریں' : 'Order Now'}
                  </span>
                </div>
              </button>

            </div>
          </div>

          {/* Mobile Search & Category Bar */}
          <div className="mt-2.5 md:hidden flex items-center gap-2">
            <select
              value={activeCategory}
              onChange={(e) => handleSelectCategory(e.target.value)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 max-w-[140px] focus:outline-none"
            >
              {allNavCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {isUrdu ? cat.labelUrdu : cat.labelEnglish}
                </option>
              ))}
            </select>
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center bg-slate-100 border border-slate-300 rounded-xl overflow-hidden"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'products') {
                    setCurrentView('products');
                  }
                }}
                placeholder={isUrdu ? 'پروڈکٹ تلاش کریں...' : 'Search products...'}
                className="flex-1 px-3 py-2 text-xs text-slate-800 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#00368B] text-white px-3.5 py-2 text-xs font-bold flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* =================================================================
            TIER 3: DHAMART / FARMART BOTTOM NAVIGATION BAR (#00368B + #fab528)
        ================================================================= */}
        <div className="bg-[#00368B] text-white px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            
            {/* Left: Yellow "SHOP BY CATEGORY" Mega Button */}
            <div className="flex items-center gap-1 sm:gap-2 py-1.5">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="bg-[#fab528] hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shrink-0 shadow-xs transition-colors"
              >
                <Menu className="w-4 h-4" />
                <span className="uppercase tracking-wide">
                  {isUrdu ? 'تمام شعبہ جات (Categories)' : 'SHOP BY CATEGORY'}
                </span>
              </button>

              {/* Main Navigation Links */}
              <nav className="flex items-center gap-1 pl-2">
                <button
                  onClick={() => handleNavigateView('home')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    currentView === 'home'
                      ? 'bg-white/15 text-[#fab528]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'ہوم پیج' : 'Home'}</span>
                </button>

                <button
                  onClick={() => handleSelectCategory('all')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    currentView === 'products' && activeCategory === 'all'
                      ? 'bg-white/15 text-[#fab528]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'پروڈکٹس پیج (28)' : 'All Products (28)'}</span>
                </button>

                <button
                  onClick={() => handleSelectCategory('soaps')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    currentView === 'products' && activeCategory === 'soaps'
                      ? 'bg-white/15 text-[#fab528]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  🧼 {isUrdu ? 'ہربل صابن (20)' : 'Herbal Soaps'}
                </button>

                <button
                  onClick={() => handleSelectCategory('shampoos')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    currentView === 'products' && activeCategory === 'shampoos'
                      ? 'bg-white/15 text-[#fab528]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  🧴 {isUrdu ? 'شیمپوز' : 'Shampoos'}
                </button>

                <button
                  onClick={() => handleSelectCategory('oils')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    currentView === 'products' && activeCategory === 'oils'
                      ? 'bg-white/15 text-[#fab528]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  🌿 {isUrdu ? 'ہیئر آئل' : 'Hair Oils'}
                </button>

                <button
                  onClick={openQuiz}
                  className="px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap text-[#fab528] hover:bg-white/10 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'جلد کا مفت ٹیسٹ' : 'Skin Quiz'}</span>
                </button>

                <button
                  onClick={() => handleNavigateView('about')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    currentView === 'about'
                      ? 'bg-white/15 text-[#fab528]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {isUrdu ? 'ہمارے بارے میں' : 'About Us'}
                </button>

                <button
                  onClick={() => handleNavigateView('service')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    currentView === 'service'
                      ? 'bg-white/15 text-[#fab528]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {isUrdu ? 'کسٹمر سروس' : 'Customer Care'}
                </button>
              </nav>
            </div>

            {/* Right: Flash Deal Tag */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-[#fab528] shrink-0">
              <Zap className="w-4 h-4 fill-current" />
              <span>Special Organic Bundles Available!</span>
            </div>

          </div>
        </div>
      </header>

      {/* =================================================================
          SLIDE-OUT CATEGORY MEGA DRAWER
      ================================================================= */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="bg-[#00368B] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#fab528] text-slate-950 font-black flex items-center justify-center text-sm">
                  SH
                </div>
                <div>
                  <h3 className="font-bold text-sm">Shop By Category</h3>
                  <p className="text-[11px] text-blue-200">28 Pure Organic Products</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* All Categories in Drawer */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                  {isUrdu ? 'کیٹیگری منتخب کریں (جو سلیکٹ کریں گے وہی پروڈکٹس آئیں گے)' : 'Select Category to View Products'}
                </h4>
                <div className="space-y-1">
                  {allNavCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cat.id && currentView === 'products'
                          ? 'bg-[#00368B] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">{cat.icon}</span>
                        <span>{isUrdu ? cat.labelUrdu : cat.labelEnglish}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
