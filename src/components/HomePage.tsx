import React from 'react';
import { SoapVariant, StoreCategoryItem, MAIN_STORE_CATEGORIES, CATEGORIES, matchesProductCategory } from '../data/soaps';
import { MiracleProduct, VoiceoverScript } from '../data/shMiracleProducts';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';
import { BrandStory } from './BrandStory';
import { SoapCard } from './SoapCard';
import { 
  Sparkles, ArrowRight, ShieldCheck, Truck, 
  ShoppingBag, Zap, PhoneCall, RefreshCw
} from 'lucide-react';

interface HomePageProps {
  langMode: 'ur' | 'en' | 'bi';
  allProducts: SoapVariant[];
  miracleProducts: MiracleProduct[];
  voiceoverScripts?: VoiceoverScript[];
  siteConfig?: SiteConfig;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  categories?: StoreCategoryItem[];
  onOpenAdmin?: () => void;
  onNavigateToProducts: (category?: string) => void;
  onNavigateToAbout: () => void;
  onNavigateToService: () => void;
  onSelectProduct: (soap: SoapVariant) => void;
  onSelectMiracleProduct: (item: { id: string; nameUrdu: string; nameEnglish: string; pricePkr: number; emoji: string }) => void;
  onOpenQuiz: () => void;
  onOpenCart: () => void;
  cartItems: { soap: SoapVariant; quantity: number }[];
  onToggleCompare: (soap: SoapVariant) => void;
  comparedSoapIds: number[];
}

export const HomePage: React.FC<HomePageProps> = ({
  langMode,
  allProducts,
  miracleProducts,
  voiceoverScripts,
  siteConfig = DEFAULT_SITE_CONFIG,
  activeCategory = 'all',
  onSelectCategory,
  categories = [],
  onOpenAdmin,
  onNavigateToProducts,
  onSelectProduct,
  onSelectMiracleProduct,
  onOpenQuiz,
  onOpenCart,
  cartItems,
  onToggleCompare,
  comparedSoapIds,
}) => {
  const isUrdu = langMode === 'ur';

  // Build unified category list with live product counts
  const allHomeCategories: StoreCategoryItem[] = Array.from(
    new Map(
      [
        ...MAIN_STORE_CATEGORIES,
        ...CATEGORIES.filter((c) => c.id !== 'prompt_featured'),
        ...categories,
      ].map((c) => [c.id, c])
    ).values()
  );

  // Filter products strictly by the selected category
  const selectedCategoryProducts = allProducts.filter((p) =>
    matchesProductCategory(p, activeCategory)
  );

  const selectedCategoryObj =
    allHomeCategories.find((c) => c.id === activeCategory) || allHomeCategories[0];

  // Flash deals (top 4 products)
  const flashDealProducts = allProducts.slice(0, 4);

  // Featured Herbal Soaps (strictly matching 'soaps' category)
  const featuredSoaps = allProducts
    .filter((p) => matchesProductCategory(p, 'soaps'))
    .slice(0, 8);

  // Hair & Skincare range (strictly matching 'hair' or 'skincare' categories)
  const hairAndSkincareProducts = allProducts
    .filter(
      (p) =>
        matchesProductCategory(p, 'hair') || matchesProductCategory(p, 'skincare')
    )
    .slice(0, 4);

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      onNavigateToProducts(catId);
    }
  };

  return (
    <div className="bg-[#f4f6f9] space-y-10 pb-12 animate-in fade-in duration-300">
      
      {/* =====================================================================
          1. DHAMART / FARMART 2-COLUMN HERO + DUAL PROMO BANNERS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Main Hero Slider Card (8 Cols) */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#002868] via-[#00368B] to-[#0a4da8] text-white shadow-lg min-h-[380px] sm:min-h-[430px] flex items-center">
            <img
              src={siteConfig.heroBgImageUrl || 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=1200&auto=format&fit=crop&q=80'}
              alt={siteConfig.storeName}
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#002259]/95 via-[#00368B]/85 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fab528] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isUrdu ? siteConfig.heroBadgeUr : siteConfig.heroBadgeEn}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white">
                {isUrdu ? siteConfig.heroTitleUr : siteConfig.heroTitleEn}
              </h1>

              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                {isUrdu ? siteConfig.heroSubtitleUr : siteConfig.heroSubtitleEn}
              </p>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  {isUrdu ? 'ابتدائی قیمت:' : 'Starting From:'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#fab528]">
                  {siteConfig.heroStartingPrice}
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigateToProducts('all')}
                  className="px-7 py-3.5 rounded-xl bg-[#fab528] hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isUrdu ? siteConfig.heroPrimaryBtnUr : siteConfig.heroPrimaryBtnEn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenQuiz}
                  className="px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-xs transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#fab528]" />
                  <span>{isUrdu ? siteConfig.heroSecondaryBtnUr : siteConfig.heroSecondaryBtnEn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Dual Stacked Promo Cards (4 Cols — Exact dhamart.pk / Farmart Layout) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Top Promo Card */}
            <div
              onClick={() => onNavigateToProducts(siteConfig.topRightPromo.targetCategory || 'shampoos')}
              className="flex-1 relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 flex flex-col justify-between cursor-pointer group shadow-md min-h-[200px]"
            >
              <img
                src={siteConfig.topRightPromo.imageUrl || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80'}
                alt={siteConfig.topRightPromo.titleEn}
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent" />

              <div className="relative z-10 space-y-1.5 max-w-[240px]">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-[#fab528] text-slate-950 px-2.5 py-0.5 rounded-md">
                  {isUrdu ? siteConfig.topRightPromo.badgeUr : siteConfig.topRightPromo.badgeEn}
                </span>
                <h3 className="text-xl font-black text-white leading-tight">
                  {isUrdu ? siteConfig.topRightPromo.titleUr : siteConfig.topRightPromo.titleEn}
                </h3>
                <p className="text-xs text-emerald-100">
                  {isUrdu ? siteConfig.topRightPromo.subtitleUr : siteConfig.topRightPromo.subtitleEn}
                </p>
              </div>

              <div className="relative z-10 pt-3 flex items-center justify-between">
                <span className="text-lg font-black text-[#fab528]">{siteConfig.topRightPromo.priceText}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/15 px-3 py-1.5 rounded-lg group-hover:bg-[#fab528] group-hover:text-slate-950 transition-colors">
                  <span>{isUrdu ? siteConfig.topRightPromo.buttonTextUr : siteConfig.topRightPromo.buttonTextEn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Bottom Promo Card */}
            <div
              onClick={() => onNavigateToProducts(siteConfig.bottomRightPromo.targetCategory || 'soaps')}
              className="flex-1 relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-stone-900 text-white p-6 flex flex-col justify-between cursor-pointer group shadow-md min-h-[200px]"
            >
              <img
                src={siteConfig.bottomRightPromo.imageUrl || 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&auto=format&fit=crop&q=80'}
                alt={siteConfig.bottomRightPromo.titleEn}
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />

              <div className="relative z-10 space-y-1.5 max-w-[240px]">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-md">
                  {isUrdu ? siteConfig.bottomRightPromo.badgeUr : siteConfig.bottomRightPromo.badgeEn}
                </span>
                <h3 className="text-xl font-black text-white leading-tight">
                  {isUrdu ? siteConfig.bottomRightPromo.titleUr : siteConfig.bottomRightPromo.titleEn}
                </h3>
                <p className="text-xs text-amber-100">
                  {isUrdu ? siteConfig.bottomRightPromo.subtitleUr : siteConfig.bottomRightPromo.subtitleEn}
                </p>
              </div>

              <div className="relative z-10 pt-3 flex items-center justify-between">
                <span className="text-lg font-black text-[#fab528]">{siteConfig.bottomRightPromo.priceText}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/15 px-3 py-1.5 rounded-lg group-hover:bg-[#fab528] group-hover:text-slate-950 transition-colors">
                  <span>{isUrdu ? siteConfig.bottomRightPromo.buttonTextUr : siteConfig.bottomRightPromo.buttonTextEn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. DHAMART / FARMART 4-PILLAR SERVICE GUARANTEE BAR
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#00368B] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {isUrdu ? siteConfig.trustBadges[0].titleUr : siteConfig.trustBadges[0].titleEn}
              </h4>
              <p className="text-xs text-slate-500">{siteConfig.trustBadges[0].subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {isUrdu ? siteConfig.trustBadges[1].titleUr : siteConfig.trustBadges[1].titleEn}
              </h4>
              <p className="text-xs text-slate-500">{siteConfig.trustBadges[1].subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {isUrdu ? siteConfig.trustBadges[2].titleUr : siteConfig.trustBadges[2].titleEn}
              </h4>
              <p className="text-xs text-slate-500">{siteConfig.trustBadges[2].subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {isUrdu ? siteConfig.trustBadges[3].titleUr : siteConfig.trustBadges[3].titleEn}
              </h4>
              <p className="text-xs text-slate-500">{siteConfig.trustBadges[3].subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. BROWSE BY CATEGORY + INSTANT CATEGORY PRODUCTS VIEW
          (Whichever category is selected, ONLY its products appear right below!)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isUrdu ? siteConfig.categoriesHeadingUr : siteConfig.categoriesHeadingEn}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu
                  ? 'جو بھی کیٹیگری سلیکٹ کریں گے، صرف اسی کیٹیگری کے پروڈکٹس نیچے سامنے آ جائیں گے'
                  : 'Select any category below to immediately view only the products in that category'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-600">
                  {isUrdu ? '🗂️ کیٹیگری سلیکٹ کریں:' : '🗂️ Select Category:'}
                </span>
                <select
                  value={activeCategory}
                  onChange={(e) => handleCategoryClick(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border-2 border-[#00368B] bg-blue-50/50 text-xs font-extrabold text-slate-900 cursor-pointer focus:outline-none"
                >
                  {allHomeCategories.map((cat) => {
                    const count = allProducts.filter((p) => matchesProductCategory(p, cat.id)).length;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {isUrdu ? cat.labelUrdu : cat.labelEnglish} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={() => onNavigateToProducts(activeCategory)}
                className="text-xs font-bold text-[#00368B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isUrdu ? 'فل پیج ویو' : 'Full Catalog View'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Category Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {allHomeCategories.map((cat) => {
              const count = allProducts.filter((p) => matchesProductCategory(p, cat.id)).length;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group rounded-2xl p-3.5 border-2 transition-all text-center flex flex-col items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#00368B] text-white border-[#00368B] shadow-md scale-[1.02]'
                      : 'bg-slate-50/80 hover:bg-blue-50/60 text-slate-900 border-slate-200 hover:border-[#00368B]'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl transition-colors ${
                      isSelected
                        ? 'bg-white/15 border-white/25'
                        : 'bg-white border-slate-200 group-hover:border-blue-200'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-xs font-extrabold transition-colors line-clamp-1 ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isUrdu ? cat.labelUrdu : cat.labelEnglish}
                    </h3>
                    <span
                      className={`text-[10px] font-bold block mt-0.5 ${
                        isSelected ? 'text-[#fab528]' : 'text-slate-500'
                      }`}
                    >
                      {count} {isUrdu ? 'پروڈکٹس' : 'Products'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Category Products Grid (Immediately shows the products of whichever category is selected!) */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCategoryObj?.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {isUrdu ? selectedCategoryObj?.labelUrdu : selectedCategoryObj?.labelEnglish}
                </h3>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#00368B] border border-blue-200 text-xs font-extrabold">
                  {selectedCategoryProducts.length} {isUrdu ? 'پروڈکٹس' : 'Items'}
                </span>
              </div>

              {activeCategory !== 'all' && (
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  {isUrdu ? '✕ فلٹر ہٹائیں (تمام پروڈکٹس دیکھیں)' : '✕ Show All Products'}
                </button>
              )}
            </div>

            {selectedCategoryProducts.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 text-center space-y-2 border border-slate-200">
                <p className="text-sm font-bold text-slate-600">
                  {isUrdu
                    ? 'اس کیٹیگری میں ابھی کوئی پروڈکٹ نہیں ہے۔'
                    : 'No products found in this category.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {selectedCategoryProducts.map((soap) => (
                  <SoapCard
                    key={soap.id}
                    soap={soap}
                    langMode={langMode}
                    onSelect={(s) => onSelectProduct(s)}
                    onAddToCart={(s) => onSelectProduct(s)}
                    isInCart={cartItems.some((item) => item.soap.id === soap.id)}
                    onToggleCompare={onToggleCompare}
                    isCompared={comparedSoapIds.includes(soap.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FLASH DEALS / TOP SELLERS OF THE WEEK (dhamart.pk Style)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-6">
          
          {/* Section Header with Countdown Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#fab528] fill-current" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isUrdu ? siteConfig.flashDealsHeadingUr : siteConfig.flashDealsHeadingEn}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-rose-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                <span>Ends in:</span>
                <span className="font-mono">{siteConfig.flashDealsTimerText}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToProducts('all')}
              className="text-xs sm:text-sm font-bold text-[#00368B] hover:text-blue-900 flex items-center gap-1"
            >
              <span>{isUrdu ? 'تمام 28 پروڈکٹس دیکھیں' : 'View All 28 Products'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4-Column Flash Deal Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {flashDealProducts.map((soap) => (
              <SoapCard
                key={soap.id}
                soap={soap}
                langMode={langMode}
                onSelect={(s) => onSelectProduct(s)}
                onAddToCart={(s) => onSelectProduct(s)}
                isInCart={cartItems.some((item) => item.soap.id === soap.id)}
                onToggleCompare={onToggleCompare}
                isCompared={comparedSoapIds.includes(soap.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. 3 MID-PAGE PROMOTIONAL BANNERS (Signature Farmart / dhamart.pk Row)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {siteConfig.midBanners.map((banner, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateToProducts(banner.targetCategory || 'all')}
              className={`rounded-2xl bg-gradient-to-r ${banner.bgGradient || 'from-[#00368B] to-blue-800'} text-white p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all group`}
            >
              <div className="space-y-2 max-w-[200px]">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fab528] text-slate-950 px-2.5 py-0.5 rounded">
                  {banner.badge}
                </span>
                <h3 className="text-lg font-black leading-snug">
                  {banner.title}
                </h3>
                <p className="text-xs text-blue-100">{banner.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#fab528] pt-1 group-hover:translate-x-1 transition-transform">
                  <span>{banner.priceText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-5xl">{banner.emoji}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. ORGANIC HERBAL SOAPS DEPARTMENT SHOWCASE (8 Cards + View All)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00368B]">
                {siteConfig.soapsSectionSubheading}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {isUrdu ? siteConfig.soapsSectionHeadingUr : siteConfig.soapsSectionHeadingEn}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToProducts('soaps')}
                className="px-4 py-2 rounded-xl bg-[#00368B] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <span>{isUrdu ? 'تمام 20 صابن دیکھیں' : 'View All 20 Soaps'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredSoaps.map((soap) => (
              <SoapCard
                key={soap.id}
                soap={soap}
                langMode={langMode}
                onSelect={(s) => onSelectProduct(s)}
                onAddToCart={(s) => onSelectProduct(s)}
                isInCart={cartItems.some((item) => item.soap.id === soap.id)}
                onToggleCompare={onToggleCompare}
                isCompared={comparedSoapIds.includes(soap.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. SH MIRACLE HAIRCARE & SKINCARE DEPARTMENT SHOWCASE
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {siteConfig.hairSectionSubheading}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {isUrdu ? siteConfig.hairSectionHeadingUr : siteConfig.hairSectionHeadingEn}
              </h2>
            </div>

            <button
              onClick={() => onNavigateToProducts('shampoos')}
              className="px-4 py-2 rounded-xl bg-[#00368B] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <span>{isUrdu ? 'تمام شیمپو اور آئل دیکھیں' : 'Explore Hair & Skincare'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hairAndSkincareProducts.map((soap) => (
              <SoapCard
                key={soap.id}
                soap={soap}
                langMode={langMode}
                onSelect={(s) => onSelectProduct(s)}
                onAddToCart={(s) => onSelectProduct(s)}
                isInCart={cartItems.some((item) => item.soap.id === soap.id)}
                onToggleCompare={onToggleCompare}
                isCompared={comparedSoapIds.includes(soap.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. SH MIRACLE BRAND STORY & VIDEO VOICEOVER STUDIO (Part 1, 2, 3)
      ===================================================================== */}
      <BrandStory
        langMode={langMode}
        onAddToCart={onSelectMiracleProduct}
        openCart={onOpenCart}
        miracleProducts={miracleProducts}
        voiceoverScripts={voiceoverScripts}
        onOpenAdmin={onOpenAdmin}
      />

    </div>
  );
};
