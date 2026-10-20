import React, { useState } from 'react';
import { SoapVariant } from '../data/soaps';
import { 
  X, ShieldCheck, Plus, Minus, ShoppingBag, Leaf, 
  Droplets, HeartHandshake, ArrowRight, Check, Zap, Sparkles 
} from 'lucide-react';

interface SoapDetailModalProps {
  soap: SoapVariant | null;
  onClose: () => void;
  onAddToCart: (soap: SoapVariant, qty: number, openCheckout?: boolean) => void;
  isInCart: boolean;
  langMode?: 'ur' | 'en' | 'bi';
}

export const SoapDetailModal: React.FC<SoapDetailModalProps> = ({
  soap,
  onClose,
  onAddToCart,
  isInCart,
  langMode = 'en',
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!soap) return null;

  const isUrdu = langMode === 'ur';
  const displayImage = soap.imageUrl || 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&auto=format&fit=crop&q=80';

  const handleOrderNow = () => {
    // Add to cart and immediately open customer details checkout modal
    onAddToCart(soap, quantity, true);
    onClose();
  };

  const handleAddToCartOnly = () => {
    // Add to cart and directly open customer details checkout modal as requested by user
    onAddToCart(soap, quantity, true);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-500/30 relative text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-stone-100 text-stone-700 shadow-lg flex items-center justify-center transition-all border border-stone-200"
          title="بند کریں (Close)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Product Image and Identity */}
        <div className="relative bg-stone-950 border-b border-stone-200 overflow-hidden">
          
          {/* Main Visual Image Banner */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden">
            <img
              src={displayImage}
              alt={soap.nameEnglish}
              className="w-full h-full object-cover"
            />
            {/* Dark Gradient Overlay for Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            {/* Badges on Top */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-800/95 text-amber-200 border border-amber-400/40 shadow-md">
                {isUrdu ? soap.badgeUrdu : soap.badge}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-900/80 text-stone-200 border border-stone-700">
                {soap.category}
              </span>
            </div>

            {/* Bottom Title inside Image Banner */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 drop-shadow-md">
                  {isUrdu ? soap.nameUrdu : soap.nameEnglish}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-300 font-medium drop-shadow-xs">
                  {isUrdu ? soap.nameEnglish : soap.nameUrdu}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/95 text-2xl flex items-center justify-center shadow-lg border border-white/40 shrink-0">
                {soap.emoji}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-5">
          
          {/* Main Benefit Highlight */}
          <div className="bg-emerald-50/90 rounded-2xl p-4 sm:p-5 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{isUrdu ? 'خصوصی فوائد (Key Benefits):' : 'Key Skin & Body Benefits:'}</span>
            </div>
            
            <p className="text-base sm:text-lg font-bold text-emerald-900 leading-relaxed font-serif">
              {isUrdu ? soap.shortBenefitUrdu : soap.shortBenefitEnglish}
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-2 border-t border-emerald-200/70">
              {isUrdu ? soap.fullBenefitUrdu : soap.fullBenefitEnglish}
            </p>
          </div>

          {/* Skin Suitability & Key Ingredients Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Skin Suitability */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2">
              <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-urdu">
                <HeartHandshake className="w-4 h-4 text-amber-700" />
                <span>{isUrdu ? 'موزوں برائے (Skin & Hair Types):' : 'Recommended For:'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(isUrdu ? soap.skinTypesUrdu : soap.skinTypesEnglish).map((st, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-amber-950 px-2.5 py-1 rounded-lg border border-amber-200 font-medium"
                  >
                    • {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-urdu">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>{isUrdu ? 'اہم اجزاء (Key Ingredients):' : 'Key Ingredients:'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(isUrdu ? soap.keyIngredientsUrdu : soap.keyIngredientsEnglish).map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200 font-medium"
                  >
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* How to use */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-1.5">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-urdu">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <span>{isUrdu ? 'طریقہ استعمال (How to Use):' : 'Directions for Use:'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-urdu">
              {isUrdu ? soap.howToUseUrdu : soap.howToUseEnglish}
            </p>
          </div>

          {/* Delivery & Assurance Notice */}
          <div className="bg-emerald-950 text-amber-100 p-3 rounded-2xl text-xs flex items-center justify-between gap-2">
            <span className={`flex items-center gap-2 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
              <span className="text-base">🚚</span>
              <span>
                <strong>{isUrdu ? 'کیش آن ڈیلیوری:' : 'Cash on Delivery:'}</strong>{' '}
                {isUrdu ? 'پورے پاکستان میں 2 سے 3 دن میں ہوم ڈیلیوری' : 'Nationwide doorstep delivery in 2-3 business days'}
              </span>
            </span>
            <span className="text-amber-300 font-mono text-[11px] font-bold">100% Herbal</span>
          </div>

          {/* DIRECT PURCHASE ACTION & QUANTITY BOX */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Price and Stepper */}
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
              <div>
                <span className="text-[11px] text-stone-500 block font-urdu">
                  {isUrdu ? 'کل قیمت:' : 'Total Price:'}
                </span>
                <span className="text-2xl font-bold font-sans text-emerald-900">
                  Rs. {soap.pricePkr * quantity}
                </span>
                <span className="text-[10px] text-stone-400 block font-mono">
                  (Rs. {soap.pricePkr} × {quantity})
                </span>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-300 shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg hover:bg-white text-stone-700 transition-colors"
                  title="کم کریں"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold font-sans text-sm text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-lg hover:bg-white text-stone-700 transition-colors"
                  title="بڑھائیں"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PRIMARY ORDER BUTTON: IMMEDIATELY OPENS CUSTOMER DETAILS CHECKOUT */}
            <button
              onClick={handleOrderNow}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-amber-200 font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-98 border border-amber-400/40"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className={`${isUrdu ? 'font-urdu' : 'font-sans'} text-sm`}>
                {isUrdu ? 'ابھی آرڈر کریں اور ڈیٹیل دیں' : 'Order Now (Enter Details)'}
              </span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
