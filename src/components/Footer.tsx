import React from 'react';
import { Mail, Phone, MessageCircle, ArrowUp, MapPin, Clock, Edit3, Lock } from 'lucide-react';
import { CurrentPageView } from './Navbar';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';

interface FooterProps {
  shopPhone?: string;
  shopEmail?: string;
  onOpenAdmin?: () => void;
  langMode?: 'ur' | 'en' | 'bi';
  onNavigateView?: (view: CurrentPageView) => void;
  siteConfig?: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({
  shopPhone = '03301285975',
  shopEmail = 'sufinatural1@gmail.com',
  onOpenAdmin,
  langMode = 'en',
  onNavigateView,
  siteConfig = DEFAULT_SITE_CONFIG,
}) => {
  const cleanPhone = (shopPhone || '03301285975').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0')
    ? '92' + cleanPhone.slice(1)
    : cleanPhone || '923301285975';

  const isUrdu = langMode === 'ur';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      
      {/* =====================================================================
          1. DHAMART / FARMART TOP NEWSLETTER & WHATSAPP VIP BANNER (#00368B)
      ===================================================================== */}
      <div className="bg-[#00368B] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#fab528]">
              {isUrdu ? siteConfig.footerBannerTagUr : siteConfig.footerBannerTagEn}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isUrdu ? siteConfig.footerBannerTitleUr : siteConfig.footerBannerTitleEn}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              {isUrdu ? siteConfig.footerBannerSubUr : siteConfig.footerBannerSubEn}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent(
                'Hello! I want to place an order on SH Miracle Mart.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#fab528] hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isUrdu ? 'واٹس ایپ پر آرڈر کریں (0330-1285975)' : 'Order on WhatsApp (0330-1285975)'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. DHAMART / FARMART CRISP WHITE MULTI-COLUMN FOOTER
      ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Store Brand & Contact Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#00368B] flex items-center justify-center text-[#fab528] font-serif font-bold text-lg shadow-xs overflow-hidden">
                {siteConfig.logoImageUrl ? (
                  <img src={siteConfig.logoImageUrl} alt={siteConfig.storeName} className="w-full h-full object-cover" />
                ) : (
                  siteConfig.logoText || 'SH'
                )}
              </div>
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs font-extrabold text-[#fab528] -translate-y-1.5">e</span>
                  <span className="text-xl font-black tracking-tight text-[#00368B] leading-none">
                    {siteConfig.storeName}
                  </span>
                </div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  {isUrdu ? siteConfig.storeTaglineUr : siteConfig.storeTaglineEn}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              {isUrdu ? siteConfig.footerAboutUr : siteConfig.footerAboutEn}
            </p>

            <div className="space-y-2 pt-1 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00368B] shrink-0" />
                <span>
                  Hotline 24/7: <strong className="text-[#00368B] font-mono text-sm">{shopPhone}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00368B] shrink-0" />
                <span>
                  Email: <strong className="text-slate-900 font-mono">{shopEmail}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#00368B] shrink-0" />
                <span>{siteConfig.footerAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#00368B] shrink-0" />
                <span>Hours: {siteConfig.footerHours}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Useful Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {isUrdu ? 'اہم صفحات (Useful Links)' : 'Useful Links'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('home');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  {isUrdu ? 'ہوم پیج (Home)' : 'Home Page'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('products');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  {isUrdu ? 'تمام مصنوعات (28 آئٹمز)' : 'All Products Catalog (28)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('about');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  {isUrdu ? 'ہمارے بارے میں (About Us)' : 'About Us & Philosophy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('service');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  {isUrdu ? 'کسٹمر سروس اور آرڈر مدد' : 'Customer Care & FAQs'}
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#00368B] font-bold hover:underline cursor-pointer"
                  >
                    {isUrdu ? '⚙️ ایڈمن پینل کھولیں' : '⚙️ Admin Studio (Manage Store)'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Shop Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {isUrdu ? 'شعبہ جات (Categories)' : 'Shop Categories'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('products');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  🧼 {isUrdu ? 'ہربل صابن (20 اقسام)' : 'Organic Herbal Soaps (20)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('products');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  🧴 {isUrdu ? '18 جڑی بوٹیوں والا شیمپو' : 'SH Miracle 18-Herbs Shampoo'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('products');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  🌿 {isUrdu ? 'ایس ایچ میریکل ہیئر آئل' : 'Miracle Drops Hair Oil'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('products');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  🌹 {isUrdu ? 'خالص عرق گلاب سپرے' : 'Pure Distilled Rose Water'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateView && onNavigateView('products');
                    scrollToTop();
                  }}
                  className="hover:text-[#00368B] transition-colors cursor-pointer"
                >
                  ✨ {isUrdu ? 'وائٹ پرل بیوٹی کریم' : 'White Pearl Beauty Cream'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Customer Care & Payment Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {isUrdu ? 'ادائیگی اور ڈیلیوری' : 'Payment & Shipping'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We offer safe doorstep Cash on Delivery (COD) across Pakistan as well as EasyPaisa, JazzCash & Bank Transfer.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                💵 Cash on Delivery
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#00368B] font-bold text-[10px]">
                📱 EasyPaisa / JazzCash
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[10px]">
                🏦 Bank Transfer
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================================
          3. BOTTOM COPYRIGHT & BACK TO TOP BAR
      ===================================================================== */}
      <div className="bg-[#f5f6f8] border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <p>
              {siteConfig.footerCopyright}
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title="Admin Studio (Ctrl + Shift + A)"
                className="opacity-25 hover:opacity-100 transition-opacity text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer select-none"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Admin</span>
              </button>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#00368B] text-slate-700 hover:text-white border border-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'اوپر جائیں' : 'Back to Top'}</span>
          </button>
        </div>
      </div>

    </footer>
  );
};
