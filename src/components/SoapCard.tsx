import React from 'react';
import { SoapVariant } from '../data/soaps';
import { Check, Info, Scale, ShoppingBag, Star } from 'lucide-react';

interface SoapCardProps {
  soap: SoapVariant;
  langMode: 'ur' | 'en' | 'bi';
  onSelect: (soap: SoapVariant) => void;
  onAddToCart: (soap: SoapVariant) => void;
  isInCart: boolean;
  onToggleCompare: (soap: SoapVariant) => void;
  isCompared: boolean;
}

export const SoapCard: React.FC<SoapCardProps> = ({
  soap,
  langMode,
  onSelect,
  onAddToCart,
  isInCart,
  onToggleCompare,
  isCompared,
}) => {
  const displayImage =
    soap.imageUrl ||
    'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&auto=format&fit=crop&q=80';
  const isUrdu = langMode === 'ur';
  const mrpPrice = Math.round(soap.pricePkr * 1.25);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-[#00368B] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* TOP CLEAN PRODUCT IMAGE (dhamart.pk / Farmart Style) */}
      <div
        onClick={() => onSelect(soap)}
        className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#f8f9fa] cursor-pointer border-b border-slate-100"
      >
        <img
          src={displayImage}
          alt={soap.nameEnglish}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Left Discount + Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-[#fab528] text-slate-950 px-2.5 py-0.5 rounded-md shadow-xs">
            -20% OFF
          </span>
          <span className="inline-block text-[10px] font-bold bg-[#00368B] text-white px-2.5 py-0.5 rounded-md shadow-xs">
            {isUrdu ? soap.badgeUrdu : soap.badge}
          </span>
        </div>

        {/* Top Right Compare Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(soap);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border ${
            isCompared
              ? 'bg-[#00368B] text-white border-[#00368B]'
              : 'bg-white/95 hover:bg-[#00368B] text-slate-700 hover:text-white border-slate-200'
          }`}
          title={isUrdu ? 'موازنہ کریں' : 'Compare'}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        {/* Bottom Right Weight Tag */}
        <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold bg-white/95 text-slate-800 px-2 py-0.5 rounded-md shadow-xs border border-slate-200">
          {soap.weightGrams}g
        </span>
      </div>

      {/* CLEAN E-COMMERCE BODY BELOW IMAGE */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          {/* Store / Vendor Name */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>SH MIRACLE MART</span>
            <span className="text-emerald-600 font-semibold">● In Stock</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(soap)}
            className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#00368B] transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {isUrdu ? soap.nameUrdu : soap.nameEnglish}
          </h3>
          <p className="text-xs text-slate-500 font-urdu truncate">
            {isUrdu ? soap.nameEnglish : soap.nameUrdu}
          </p>

          {/* 5-Star Rating Row */}
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">(4.9)</span>
          </div>

          {/* Short Benefit Line */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
            {isUrdu ? soap.shortBenefitUrdu : soap.shortBenefitEnglish}
          </p>
        </div>

        {/* PRICE + ACTION BUTTONS AT BOTTOM */}
        <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-[#00368B]">
                Rs. {soap.pricePkr}
              </span>
              <span className="text-xs text-slate-400 line-through font-medium">
                Rs. {mrpPrice}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              COD Available
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onAddToCart(soap)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isInCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#00368B] hover:bg-[#fab528] text-white hover:text-slate-950'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'منتخب شدہ' : 'Selected'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'آرڈر کریں' : 'Order Now'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelect(soap)}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
              title="View Full Product Page"
            >
              <Info className="w-3.5 h-3.5 text-[#00368B]" />
              <span>{isUrdu ? 'تفصیل' : 'View'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
