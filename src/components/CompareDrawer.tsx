import React from 'react';
import { SoapVariant } from '../data/soaps';
import { X, Scale, Trash2, ShieldCheck } from 'lucide-react';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedSoaps: SoapVariant[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onSelectSoap: (soap: SoapVariant) => void;
  langMode?: 'ur' | 'en' | 'bi';
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  isOpen,
  onClose,
  comparedSoaps,
  onRemove,
  onClear,
  onSelectSoap,
  langMode = 'en',
}) => {
  if (!isOpen) return null;

  const isUrdu = langMode === 'ur';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 relative text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-700" />
            <h3 className="text-xl font-bold font-serif text-stone-900">
              {isUrdu ? 'صابنوں کا موازنہ (Soap Comparison)' : 'Soap Comparison (Side-by-Side)'}
            </h3>
          </div>
          {comparedSoaps.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'تمام موازنہ ختم کریں' : 'Clear All'}</span>
            </button>
          )}
        </div>

        {comparedSoaps.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            {isUrdu 
              ? 'موازنہ کرنے کے لیے کسی بھی صابن پر "موازنہ کریں" کا بٹن دبائیں۔ (زیادہ سے زیادہ 3 صابن)' 
              : 'Click "Compare" on any soap card to compare up to 3 soaps side-by-side.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedSoaps.map((soap) => (
              <div
                key={soap.id}
                className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between space-y-4 relative"
              >
                <button
                  onClick={() => onRemove(soap.id)}
                  className="absolute top-3 right-3 text-stone-400 hover:text-rose-600 p-1"
                  title="Remove from compare"
                >
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <div className="text-4xl text-center py-2 bg-white rounded-xl border border-stone-100 mb-2">
                    {soap.emoji}
                  </div>
                  <h4 className="font-bold font-serif text-center text-stone-900 text-base">
                    {isUrdu ? soap.nameUrdu : soap.nameEnglish}
                  </h4>
                  <p className="text-xs text-center text-stone-500 mb-3">
                    {isUrdu ? soap.nameEnglish : soap.nameUrdu}
                  </p>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1 mb-3">
                    <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isUrdu ? 'فائدہ:' : 'Benefit:'}</span>
                    </span>
                    <p className="text-xs font-semibold text-emerald-900">
                      {isUrdu ? soap.shortBenefitUrdu : soap.shortBenefitEnglish}
                    </p>
                  </div>
                  <div className="text-xs text-stone-700 space-y-1">
                    <span className="font-bold block text-stone-900">{isUrdu ? 'موزوں برائے:' : 'Recommended For:'}</span>
                    <div className="flex flex-wrap gap-1">
                      {(isUrdu ? soap.skinTypesUrdu : soap.skinTypesEnglish).map((st, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded border text-[10px]">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#154734] font-sans">
                    Rs. {soap.pricePkr}
                  </span>
                  <button
                    onClick={() => {
                      onSelectSoap(soap);
                      onClose();
                    }}
                    className="text-xs font-bold bg-[#154734] text-amber-100 px-3 py-1.5 rounded-lg"
                  >
                    {isUrdu ? 'مکمل تفصیل' : 'View Full Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
