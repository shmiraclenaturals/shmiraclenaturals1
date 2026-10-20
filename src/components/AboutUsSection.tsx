import React, { useState } from 'react';
import { 
  Sparkles, Leaf, Shield, Award, CheckCircle2, 
  Volume2, Play, Pause, ArrowRight, PhoneCall, 
  Clock, Droplets
} from 'lucide-react';
import { MIRACLE_VOICEOVER_SCRIPT } from '../data/shMiracleProducts';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';

interface AboutUsSectionProps {
  langMode?: 'ur' | 'en' | 'bi';
  onNavigateToShop: () => void;
  shopNumber?: string;
  siteConfig?: SiteConfig;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  langMode = 'en',
  onNavigateToShop,
  shopNumber = '03301285975',
  siteConfig = DEFAULT_SITE_CONFIG,
}) => {
  const isUrdu = langMode === 'ur';
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);

  const cleanPhone = (shopNumber || '03301285975').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0')
    ? '92' + cleanPhone.slice(1)
    : cleanPhone || '923301285975';

  const handleToggleAudio = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const activePart = MIRACLE_VOICEOVER_SCRIPT[activeVoiceIndex] || MIRACLE_VOICEOVER_SCRIPT[0];
        const utterance = new SpeechSynthesisUtterance(
          isUrdu ? activePart.audioUrdu : activePart.audioEnglish
        );
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlaying(false), 5000);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }
  };

  const values = [
    {
      icon: <Leaf className="w-6 h-6 text-[#00368B]" />,
      titleUrdu: '100% خالص نباتاتی اجزاء',
      titleEn: '100% Pure Botanical Ingredients',
      descUrdu:
        'ہمارے تمام صابن اور مصنوعات میں زیتون، بادام، ناریل اور 18 سے زائد نایاب دیسی جڑی بوٹیاں استعمال کی جاتی ہیں۔',
      descEn:
        'Handcrafted exclusively with pure native herbs, organic carrier oils, and steam-distilled floral waters.',
    },
    {
      icon: <Shield className="w-6 h-6 text-[#00368B]" />,
      titleUrdu: 'کیمیکل اور سلفیٹ سے پاک',
      titleEn: 'Chemical & Sulphate Free',
      descUrdu:
        'کسی قسم کے مصنوعی بلیچنگ ایجنٹ، پیرابین، سلیکون یا نقصان دہ صابنی کیمیکلز شامل نہیں کیے جاتے۔',
      descEn:
        'Zero artificial bleaching agents, sulfates, parabens, or synthetic fragrance chemicals.',
    },
    {
      icon: <Clock className="w-6 h-6 text-[#00368B]" />,
      titleUrdu: 'قدیم کولڈ پروسیس دستکاری',
      titleEn: 'Traditional Cold Process',
      descUrdu:
        'جڑی بوٹیوں کے قدرتی وٹامنز اور اینٹی آکسیڈنٹس کو محفوظ رکھنے کے لیے صابن کو قدرتی ٹھنڈے عمل سے پختہ کیا جاتا ہے۔',
      descEn:
        'Cured gently over 4 weeks to preserve sensitive botanicals, natural glycerin, and active antioxidants.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#00368B]" />,
      titleUrdu: 'روایتی حکمت اور جدید معیار',
      titleEn: 'Heritage Wisdom & Care',
      descUrdu:
        'قدیم طبِ یونانی کے رازوں اور جدید ہائجینک طریقوں سے ہر بیچ چھوٹی لاٹس میں تازہ تیار کیا جاتا ہے۔',
      descEn:
        'Formulated in small artisan batches in accordance with traditional herbal wisdom and modern hygiene.',
    },
  ];

  return (
    <div className="bg-[#f4f6f9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
        
        {/* Hero Brand Introduction Banner (dhamart.pk #00368B + #fab528 style) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#002868] via-[#00368B] to-[#0a4da8] text-white p-8 sm:p-12 shadow-lg">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fab528] text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUrdu ? siteConfig.aboutBadgeUr : siteConfig.aboutBadgeEn}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {isUrdu ? siteConfig.aboutTitleUr : siteConfig.aboutTitleEn}
            </h2>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              {isUrdu ? siteConfig.aboutDescriptionUr : siteConfig.aboutDescriptionEn}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateToShop}
                className="px-6 py-3.5 rounded-xl bg-[#fab528] hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{isUrdu ? 'مکمل کلیکشن دیکھیں (Shop Now)' : 'Explore Full Catalog (28 Items)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent(
                  'Hello! I would like to know more about SH Miracle products.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#fab528]" />
                <span>{isUrdu ? 'واٹس ایپ پر بات چیت' : 'Direct WhatsApp Inquiry'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-xs font-extrabold text-[#00368B] tracking-wider uppercase">
              {isUrdu ? 'ہمارے چار بنیادی اصول' : 'Our Quality Standards'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isUrdu ? 'ہمیں دیگر عام پروڈکٹس سے کیا چیز ممتاز بناتی ہے؟' : 'What Sets Our Formulations Apart'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#00368B] shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  {val.icon}
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  {isUrdu ? val.titleUrdu : val.titleEn}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isUrdu ? val.descUrdu : val.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cold-Process Story & Voiceover Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00368B] uppercase tracking-wider">
              <Droplets className="w-4 h-4" />
              <span>{isUrdu ? 'دستکاری کی مہارت' : 'Traditional Soap Making Process'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {isUrdu
                ? 'قدیم کولڈ پروسیس طریقہ کار: قدرتی گلیسرین کا تحفظ'
                : 'Cold-Process Formulation: Preserving Nature’s Glycerin'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isUrdu
                ? 'کمرشل صابن سازی میں صابن سے قیمتی قدرتی گلیسرین نکال لی جاتی ہے جس سے صابن جلد کو خشک کر دیتا ہے۔ اس کے برعکس، ہمارے ہاتھ سے تیار کردہ صابن میں خالص قدرتی گلیسرین محفوظ رہتی ہے۔'
                : 'Unlike commercial mass-produced soap bars that strip away nourishing glycerin, our cold-process method preserves 100% of the natural emollient glycerin, ensuring deep moisture with every lather.'}
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rich natural nutrients of Coffee, Aloe Vera, Saffron, Sandalwood & Goat Milk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gentle relief for cracked skin, dry patches, acne blemishes, and dark spots</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Steam-distilled pure Desi Rose water & 15 cold-pressed carrier oils</span>
              </div>
            </div>
          </div>

          {/* Audio Narration Box */}
          <div className="bg-[#00368B] text-white p-6 sm:p-7 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-blue-800 pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#fab528]" />
                <h4 className="font-bold text-white text-sm sm:text-base">
                  {isUrdu ? 'آڈیو وائس اوور سنیں' : 'Listen to Brand Story Audio'}
                </h4>
              </div>
              <button
                onClick={handleToggleAudio}
                className="px-3.5 py-1.5 rounded-xl bg-[#fab528] hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? (isUrdu ? 'وقفہ' : 'Pause') : (isUrdu ? 'سنیں' : 'Play')}</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#fab528] block">
                Script Part {activeVoiceIndex + 1} of {MIRACLE_VOICEOVER_SCRIPT.length}:
              </span>
              <p className="text-xs sm:text-sm text-white leading-relaxed bg-blue-950/60 p-4 rounded-xl border border-blue-800">
                "{isUrdu ? MIRACLE_VOICEOVER_SCRIPT[activeVoiceIndex]?.audioUrdu : MIRACLE_VOICEOVER_SCRIPT[activeVoiceIndex]?.audioEnglish}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-blue-200 font-mono">e-SH Miracle Mart Studio</span>
              <div className="flex items-center gap-1.5">
                {MIRACLE_VOICEOVER_SCRIPT.map((_, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveVoiceIndex(i);
                      if (isPlaying && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        setIsPlaying(false);
                      }
                    }}
                    className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      activeVoiceIndex === i ? 'bg-[#fab528] text-slate-950' : 'bg-blue-900 text-blue-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
