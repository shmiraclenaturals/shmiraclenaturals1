import React, { useState } from 'react';
import { Play, Pause, Volume2, Sparkles, Leaf, ShieldCheck, ShoppingBag, Check, Award, Zap, Video, Star } from 'lucide-react';
import { SH_MIRACLE_PRODUCTS, MIRACLE_VOICEOVER_SCRIPT, MiracleProduct, VoiceoverScript } from '../data/shMiracleProducts';

interface BrandStoryProps {
  langMode: 'ur' | 'en' | 'bi';
  onAddToCart: (item: { id: string; nameUrdu: string; nameEnglish: string; pricePkr: number; emoji: string }) => void;
  openCart: () => void;
  miracleProducts?: MiracleProduct[];
  voiceoverScripts?: VoiceoverScript[];
  onOpenAdmin?: () => void;
}

// Helper to detect YouTube URLs and convert to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export const BrandStory: React.FC<BrandStoryProps> = ({
  langMode,
  onAddToCart,
  miracleProducts,
  voiceoverScripts,
  onOpenAdmin,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeScriptIndex, setActiveScriptIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hair' | 'skincare' | 'soaps' | 'spray'>('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const productsList = miracleProducts || SH_MIRACLE_PRODUCTS;
  const scriptsList = voiceoverScripts && voiceoverScripts.length > 0 ? voiceoverScripts : MIRACLE_VOICEOVER_SCRIPT;
  const isUrdu = langMode === 'ur';

  // Web Speech API Narrator
  const handleToggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const textToSpeak = scriptsList
          .map((s) => (isUrdu ? s.audioUrdu : s.audioEnglish))
          .join(' ');

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
        utterance.rate = 0.95;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);

        let currentPart = 0;
        const interval = setInterval(() => {
          currentPart = (currentPart + 1) % scriptsList.length;
          setActiveScriptIndex(currentPart);
          if (currentPart === 0) {
            clearInterval(interval);
          }
        }, 6000);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? productsList
      : productsList.filter((p) => p.category === selectedCategory);

  const handleAddProduct = (product: MiracleProduct) => {
    onAddToCart({
      id: product.id,
      nameUrdu: product.nameUrdu,
      nameEnglish: product.nameEnglish,
      pricePkr: product.pricePkr,
      emoji: product.emoji,
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="miracle-story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* =====================================================================
          1. SH MIRACLE BRAND STORY & VIDEO VOICEOVER (Part 1, 2, 3) — dhamart.pk Style
      ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-2xs space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleAudio}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all transform hover:scale-105 shadow-md shrink-0 cursor-pointer ${
                isPlaying
                  ? 'bg-[#fab528] text-slate-950 ring-4 ring-amber-400/30'
                  : 'bg-[#00368B] hover:bg-blue-900 text-white'
              }`}
              title={isUrdu ? 'آواز سنیں (Listen Voiceover)' : 'Play Voiceover Narration'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current animate-pulse" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5 text-[#fab528]" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-[#00368B] border border-blue-200">
                  {isUrdu ? 'آفیشل برانڈ ویڈیو اسٹوڈیو' : 'Official Brand Video Studio'}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'آواز چل رہی ہے...' : 'Playing narration...'}</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {isUrdu
                  ? 'SH Miracle برانڈ تعارف اور ویڈیو وائس اوور (Part 1, 2, 3)'
                  : 'SH Miracle Brand Story & Video Voiceover (Part 1, 2, 3)'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu
                  ? 'ہماری ہر پروڈکٹ کو "Miracle" کیوں کہا جاتا ہے؟ پارٹ 1، پارٹ 2 اور پارٹ 3 کی ویڈیوز دیکھیں یا باآواز سنیں'
                  : 'Discover why every product of ours carries the name "Miracle". Watch Part 1, 2 & 3 videos or listen to our narration.'}
              </p>
            </div>
          </div>

          {/* Audio Visualizer */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
              {[40, 75, 30, 90, 60, 85, 45, 95, 50, 70, 35, 80].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-[#00368B] animate-pulse' : 'bg-slate-300'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(25, height * (i % 2 === 0 ? 1 : 0.7))}%` : '25%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Part 1, Part 2, Part 3 Crisp White Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scriptsList.map((script, idx) => {
            const isActive = activeScriptIndex === idx;
            const ytEmbed = script.videoUrl ? getYouTubeEmbedUrl(script.videoUrl) : null;

            return (
              <div
                key={script.part}
                onClick={() => setActiveScriptIndex(idx)}
                className={`cursor-pointer rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-50/50 border-[#00368B] shadow-md ring-2 ring-[#00368B]/15'
                    : 'bg-slate-50/70 border-slate-200 hover:border-[#00368B]/50 hover:bg-white'
                }`}
              >
                <div>
                  {/* Part Badge Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 rounded-lg bg-[#00368B] text-white font-extrabold">
                      {isUrdu ? `پارٹ 0${script.part} · ${script.badge}` : `Part 0${script.part} · ${script.badge}`}
                    </span>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      {script.videoUrl && <Video className="w-3.5 h-3.5 text-[#00368B]" />}
                      <span>Scene 0{script.part}</span>
                    </span>
                  </div>

                  {/* Video Player Box on Top of Card */}
                  {script.videoUrl ? (
                    <div
                      className="mb-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shadow-sm relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {ytEmbed ? (
                        <iframe
                          src={ytEmbed}
                          title={`SH Miracle Part ${script.part} Video`}
                          className="w-full h-48 sm:h-52 border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          key={script.videoUrl}
                          src={script.videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-48 sm:h-52 object-cover bg-black"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 mb-3 bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="flex items-start gap-2">
                        <span className="text-base shrink-0">🎬</span>
                        <p className="line-clamp-2 font-medium text-slate-700">
                          {isUrdu ? script.visualUrdu : script.visualEnglish}
                        </p>
                      </div>
                      {onOpenAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAdmin();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#00368B] text-[#00368B] hover:text-white border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>
                            {isUrdu
                              ? `+ پارٹ ${script.part} کی ویڈیو لگائیں (ایڈمن پینل)`
                              : `+ Upload Video for Part ${script.part} (Admin)`}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Voiceover Script Box */}
                <div className="text-sm bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[#00368B] text-[11px] font-extrabold uppercase tracking-wider block mb-1">
                    {isUrdu ? script.speaker : 'Voiceover Narration'}
                  </span>
                  <p className="text-slate-800 font-bold text-xs sm:text-sm leading-relaxed">
                    "{isUrdu ? script.audioUrdu : script.audioEnglish}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. 100% PURE BOTANICAL INGREDIENTS STRIP (dhamart.pk Crisp White Cards)
      ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              100% Chemical & Sulfate Free
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>{isUrdu ? '100% خالص قدرتی جڑی بوٹیاں اور اجزاء' : 'Pure Botanical Ingredients We Use'}</span>
            </h3>
          </div>
          <span className="text-xs font-bold text-[#00368B] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
            Lab Tested & Cold-Pressed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {[
            { nameUrdu: 'ایلو ویرا جیل', nameEn: 'Aloe Vera Gel', emoji: '🌿', descUrdu: 'گہری نمی اور خشکی سے نجات', descEn: 'Deep soothing moisture', bg: 'bg-emerald-50 border-emerald-200' },
            { nameUrdu: 'نیم اور ہلدی', nameEn: 'Neem & Turmeric', emoji: '🍃', descUrdu: 'کیل مہاسوں کا قدرتی علاج', descEn: 'Anti-acne purification', bg: 'bg-lime-50 border-lime-200' },
            { nameUrdu: 'کشیدہ عرق گلاب', nameEn: 'Distilled Rose Water', emoji: '🌹', descUrdu: 'مساموں کی تنگی اور تازگی', descEn: 'Pore refining & glow', bg: 'bg-rose-50 border-rose-200' },
            { nameUrdu: 'آرگینک کافی', nameEn: 'Organic Coffee & Rice', emoji: '☕', descUrdu: 'ڈیڈ سکن کا قدرتی خاتمہ', descEn: 'Natural micro-exfoliation', bg: 'bg-amber-50 border-amber-200' },
            { nameUrdu: '18 نایاب بوٹیاں', nameEn: '18 Native Herbs', emoji: '🌱', descUrdu: 'بالوں کا گرنا بند اور لمبائی', descEn: 'Roots & hair growth elixir', bg: 'bg-teal-50 border-teal-200' },
            { nameUrdu: 'خالص گلیسرین', nameEn: 'Pure Glycerin', emoji: '💧', descUrdu: 'پھٹی ایڑیوں کا فوری علاج', descEn: 'Moisture lock barrier', bg: 'bg-sky-50 border-sky-200' },
            { nameUrdu: 'ملتانی مٹی', nameEn: "Fuller's Earth", emoji: '🏺', descUrdu: 'چہرے کے اضافی تیل سے نجات', descEn: 'Deep oil & grime detox', bg: 'bg-orange-50 border-orange-200' },
          ].map((herb, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-[#00368B] hover:shadow-md transition-all text-center group"
            >
              <div className={`w-12 h-12 mx-auto rounded-2xl ${herb.bg} border flex items-center justify-center text-2xl mb-2.5 group-hover:scale-110 transition-transform`}>
                {herb.emoji}
              </div>
              <h4 className="font-bold text-xs text-slate-900">
                {isUrdu ? herb.nameUrdu : herb.nameEn}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {isUrdu ? herb.descUrdu : herb.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          3. SH MIRACLE COMPLETE CARE RANGE (Crisp dhamart.pk White Product Grid)
      ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#fab528]" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isUrdu ? 'SH Miracle خصوصی ہربل رینج' : 'SH Miracle Signature Care Range'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isUrdu
                ? '18 جڑی بوٹیوں والا شیمپو، ہیئر آئل، عرق گلاب سپرے اور بیوٹی کریم'
                : '18-Herbs Shampoo, Miracle Drops Hair Oil, Pure Distilled Rose Water & Beauty Creams'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
            {[
              { id: 'all', nameUrdu: 'تمام (All)', nameEn: 'All Items' },
              { id: 'hair', nameUrdu: 'شیمپو اور آئل', nameEn: 'Hair Care' },
              { id: 'skincare', nameUrdu: 'سکن کیئر', nameEn: 'Skin Care' },
              { id: 'soaps', nameUrdu: 'ہربل صابن', nameEn: 'Soaps' },
              { id: 'spray', nameUrdu: 'عرق گلاب', nameEn: 'Rose Spray' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#00368B] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isUrdu ? tab.nameUrdu : tab.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Crisp White Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const isAdded = addedIds[product.id];
            const displayImg =
              product.imageUrl ||
              'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80';
            const mrp = Math.round(product.pricePkr * 1.25);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#00368B] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Product Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img
                    src={displayImg}
                    alt={product.nameEnglish}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase bg-[#fab528] text-slate-950 px-2.5 py-0.5 rounded-md shadow-xs">
                      {isUrdu ? product.badgeUrdu : product.badgeEnglish}
                    </span>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold bg-white/95 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {product.size}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>SH MIRACLE OFFICIAL</span>
                      <span className="text-emerald-600">● In Stock</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#00368B] transition-colors line-clamp-1">
                      {isUrdu ? product.nameUrdu : product.nameEnglish}
                    </h4>
                    <p className="text-xs text-slate-500 font-urdu truncate">
                      {isUrdu ? product.nameEnglish : product.nameUrdu}
                    </p>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500">(5.0)</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                      {isUrdu ? product.descriptionUrdu : product.descriptionEnglish}
                    </p>
                  </div>

                  {/* Price & Order Button */}
                  <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#00368B]">
                          Rs. {product.pricePkr}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          Rs. {mrp}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        COD
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddProduct(product)}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#00368B] hover:bg-[#fab528] text-white hover:text-slate-950'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isUrdu ? 'آرڈر میں شامل ہو گیا' : 'Added to Order'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>{isUrdu ? 'ابھی آرڈر کریں (Order Now)' : 'Order Now'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
