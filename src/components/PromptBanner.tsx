import React from 'react';
import { SOAP_VARIANTS, SoapVariant } from '../data/soaps';
import { Sparkles, CheckCircle2, ArrowRightLeft } from 'lucide-react';

interface PromptBannerProps {
  onSelectSoap: (soap: SoapVariant) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  langMode?: 'ur' | 'en' | 'bi';
}

export const PromptBanner: React.FC<PromptBannerProps> = ({
  onSelectSoap,
  activeFilter,
  setActiveFilter,
  langMode = 'en',
}) => {
  const promptSoaps = SOAP_VARIANTS.filter((s) => s.featuredInPrompt);

  return (
    <div className="bg-gradient-to-b from-[#f4f0ea] to-[#faf8f5] border-b border-amber-200/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-300/50">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 flex items-center gap-2">
                <span>{langMode === 'ur' ? 'نمایاں ہربل صابن اور خاص فوائد' : 'Featured Handcrafted Herbal Soaps'}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-sans px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  Top 9 Selected
                </span>
              </h2>
              <p className="text-xs text-stone-600">
                {langMode === 'ur' 
                  ? 'قدرتی جڑی بوٹیوں سے تیار کردہ صابنوں کی سب سے زیادہ مانگی جانے والی کیٹیگریز' 
                  : 'Customer-favorite pure botanical soaps addressing acne, radiance, and deep hydration'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter(activeFilter === 'prompt_featured' ? 'all' : 'prompt_featured')}
              className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-medium ${
                activeFilter === 'prompt_featured'
                  ? 'bg-[#154734] text-amber-200 border-emerald-900 shadow-sm font-bold'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {activeFilter === 'prompt_featured'
                  ? (langMode === 'ur' ? 'تمام 20 صابن دیکھیں' : 'View All 20 Soaps')
                  : (langMode === 'ur' ? 'صرف 9 خاص صابن فلٹر کریں' : 'Filter Top 9 Soaps')}
              </span>
            </button>
          </div>
        </div>

        {/* Horizontal Quick Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {promptSoaps.map((soap) => (
            <div
              key={soap.id}
              onClick={() => onSelectSoap(soap)}
              className="bg-white rounded-2xl p-3.5 border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-3 relative overflow-hidden"
            >
              {/* Corner Badge */}
              <div className="w-12 h-12 rounded-xl bg-amber-50 shrink-0 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                {soap.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                    {langMode === 'ur' ? soap.nameUrdu : soap.nameEnglish}
                  </h3>
                  <span className="text-[11px] font-sans font-semibold text-emerald-800 shrink-0 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Rs. {soap.pricePkr}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-emerald-900 font-medium bg-emerald-50/70 p-2 rounded-xl border border-emerald-100/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">
                    {langMode === 'ur' ? soap.shortBenefitUrdu : soap.shortBenefitEnglish}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
