import React, { useState, useEffect } from 'react';
import { SoapVariant } from '../data/soaps';
import { 
  ArrowLeft, ShieldCheck, Plus, Minus, ShoppingBag, Leaf, 
  Droplets, HeartHandshake, Truck, CheckCircle2, 
  Scale, Sparkles, Home, Grid, Star, PhoneCall, RefreshCw
} from 'lucide-react';
import { SoapCard } from './SoapCard';

interface ProductDetailPageProps {
  soap: SoapVariant;
  allProducts: SoapVariant[];
  onBackToProducts: () => void;
  onBackToHome: () => void;
  onSelectProduct: (soap: SoapVariant) => void;
  onOrderNow: (soap: SoapVariant, qty: number) => void;
  isInCart: boolean;
  onToggleCompare: (soap: SoapVariant) => void;
  comparedSoapIds: number[];
  langMode?: 'ur' | 'en' | 'bi';
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  soap,
  allProducts,
  onBackToProducts,
  onBackToHome,
  onSelectProduct,
  onOrderNow,
  isInCart,
  onToggleCompare,
  comparedSoapIds,
  langMode = 'en',
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [soap.id]);

  const isUrdu = langMode === 'ur';
  const displayImage =
    soap.imageUrl ||
    'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&auto=format&fit=crop&q=80';
  const isCompared = comparedSoapIds.includes(soap.id);
  const mrpPrice = Math.round(soap.pricePkr * 1.25);

  const relatedProducts = allProducts
    .filter((p) => p.id !== soap.id && (p.category === soap.category || p.featuredInPrompt))
    .slice(0, 4);

  return (
    <div className="bg-[#f4f6f9] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Top Breadcrumb & Back Navigation Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={onBackToHome}
              className="hover:text-[#00368B] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ہوم پیج' : 'Home'}</span>
            </button>
            <span>/</span>
            <button
              onClick={onBackToProducts}
              className="hover:text-[#00368B] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'تمام پروڈکٹس' : 'Products'}</span>
            </button>
            <span>/</span>
            <span className="text-[#00368B] font-bold truncate max-w-[200px] sm:max-w-xs">
              {isUrdu ? soap.nameUrdu : soap.nameEnglish}
            </span>
          </div>

          <button
            onClick={onBackToProducts}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#00368B] text-slate-700 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isUrdu ? '← واپس پروڈکٹس پیج پر جائیں' : '← Back to All Products'}</span>
          </button>
        </div>

        {/* ===================================================================
            DHAMART / FARMART 3-COLUMN SINGLE PRODUCT VIEW
        =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Col 1 (5 Cols): Crisp Product Photo Box */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
              <img
                src={displayImage}
                alt={soap.nameEnglish}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-xs font-extrabold uppercase bg-[#fab528] text-slate-950 px-3 py-1 rounded-lg shadow-xs">
                -20% OFF
              </span>
              <span className="absolute top-3 right-3 text-xs font-bold bg-[#00368B] text-white px-3 py-1 rounded-lg shadow-xs">
                {isUrdu ? soap.badgeUrdu : soap.badge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700">
                ⚖️ {soap.weightGrams}g Bar
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-800">
                🌿 100% Organic
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 font-bold text-[#00368B]">
                ✨ SLS Free
              </div>
            </div>
          </div>

          {/* Col 2 (4 Cols): Product Title, Rating, Price, Benefits & Order Box */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Brand: <strong className="text-[#00368B]">SH MIRACLE MART</strong></span>
                <span className="text-emerald-600">● In Stock</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {isUrdu ? soap.nameUrdu : soap.nameEnglish}
              </h1>
              <p className="text-sm text-slate-500 font-urdu font-bold">
                {isUrdu ? soap.nameEnglish : soap.nameUrdu}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-600">(4.9 / 5.0 Customer Reviews)</span>
              </div>
            </div>

            {/* Price Block */}
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">Special COD Price:</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-[#00368B]">
                    Rs. {soap.pricePkr}
                  </span>
                  <span className="text-sm text-slate-400 line-through font-semibold">
                    Rs. {mrpPrice}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total ({quantity}x):</span>
                <span className="text-lg font-black text-emerald-700">
                  Rs. {soap.pricePkr * quantity}
                </span>
              </div>
            </div>

            {/* Key Benefit Highlight */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00368B]" />
                <span>{isUrdu ? 'خاص فائدہ (Primary Benefit)' : 'Primary Skin Benefit'}</span>
              </h3>
              <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                {isUrdu ? soap.shortBenefitUrdu : soap.shortBenefitEnglish}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isUrdu ? soap.fullBenefitUrdu : soap.fullBenefitEnglish}
              </p>
            </div>

            {/* Quantity + Order Now CTA */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-bold shadow-2xs cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-black text-base text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-bold shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOrderNow(soap, quantity)}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-[#00368B] hover:bg-[#fab528] text-white hover:text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isUrdu
                      ? `ابھی آرڈر بک کریں (Rs. ${soap.pricePkr * quantity})`
                      : `Order Now — Rs. ${soap.pricePkr * quantity}`}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => onToggleCompare(soap)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCompared
                    ? 'bg-blue-50 border-[#00368B] text-[#00368B]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? 'Added to Compare' : 'Compare with other products'}</span>
              </button>
            </div>
          </div>

          {/* Col 3 (3 Cols): Farmart / dhamart.pk Right Delivery & Ingredients Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3.5 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                Delivery & Guarantees
              </h4>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#00368B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Nationwide COD Delivery</strong>
                  <span className="text-slate-500">2–3 working days across Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">100% Pure & Authentic</strong>
                  <span className="text-slate-500">Zero Sulfates, Zero Parabens</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#00368B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">WhatsApp Helpline</strong>
                  <span className="text-slate-500 font-mono">0330-1285975 (24/7)</span>
                </div>
              </div>
            </div>

            {/* Active Botanical Ingredients Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Key Ingredients</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(isUrdu ? soap.keyIngredientsUrdu : soap.keyIngredientsEnglish).map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold"
                  >
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* How to Use Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#00368B]" />
                <span>How To Use</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isUrdu ? soap.howToUseUrdu : soap.howToUseEnglish}
              </p>
            </div>
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {isUrdu ? 'ملتی جلتی مصنوعات (Related Products)' : 'Related Products You May Like'}
              </h2>
              <button
                onClick={onBackToProducts}
                className="text-xs font-bold text-[#00368B] hover:underline cursor-pointer"
              >
                {isUrdu ? 'تمام دیکھیں →' : 'View All 28 Products →'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((relSoap) => (
                <SoapCard
                  key={relSoap.id}
                  soap={relSoap}
                  langMode={langMode || 'en'}
                  onSelect={(s) => onSelectProduct(s)}
                  onAddToCart={(s) => onSelectProduct(s)}
                  isInCart={false}
                  onToggleCompare={onToggleCompare}
                  isCompared={comparedSoapIds.includes(relSoap.id)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
