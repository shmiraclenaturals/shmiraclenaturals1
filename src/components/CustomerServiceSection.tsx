import React, { useState } from 'react';
import { 
  Headphones, Truck, ShieldCheck, MessageCircle, 
  Phone, Mail, HelpCircle, ChevronDown, ChevronUp, 
  CheckCircle2
} from 'lucide-react';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';

interface CustomerServiceSectionProps {
  langMode?: 'ur' | 'en' | 'bi';
  shopNumber?: string;
  shopEmail?: string;
  onNavigateToShop: () => void;
  siteConfig?: SiteConfig;
}

export const CustomerServiceSection: React.FC<CustomerServiceSectionProps> = ({
  langMode = 'en',
  shopNumber = '03301285975',
  shopEmail = 'sufinatural1@gmail.com',
  siteConfig = DEFAULT_SITE_CONFIG,
}) => {
  const isUrdu = langMode === 'ur';

  const cleanPhone = (shopNumber || '03301285975').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0')
    ? '92' + cleanPhone.slice(1)
    : cleanPhone || '923301285975';

  const [inquirerName, setInquirerName] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('Order Tracking / Help');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = siteConfig.faqs && siteConfig.faqs.length > 0 ? siteConfig.faqs : DEFAULT_SITE_CONFIG.faqs;

  const whatsappInquiryUrl = () => {
    let msg = `*🌿 e-SH Miracle Mart - Customer Support*\n----------------------------------\n`;
    msg += `👤 *Name:* ${inquirerName || 'Customer'}\n`;
    if (inquirerPhone) msg += `📱 *Phone:* ${inquirerPhone}\n`;
    msg += `📌 *Topic:* ${inquiryTopic}\n`;
    msg += `💬 *Message:* ${inquiryMessage}\n`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-[#f4f6f9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-[#002868] via-[#00368B] to-[#0a4da8] rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider bg-[#fab528] text-slate-950 px-3 py-1 rounded-full">
              {siteConfig.serviceBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {isUrdu ? siteConfig.serviceTitleUr : siteConfig.serviceTitleEn}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100">
              {isUrdu ? siteConfig.serviceSubtitleUr : siteConfig.serviceSubtitleEn}
            </p>
          </div>

          <a
            href={`https://wa.me/${formattedPhone}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#fab528] hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp: 0330-1285975</span>
          </a>
        </div>

        {/* 3 Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#00368B] flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">24/7 WhatsApp Helpline</h3>
            <p className="text-xs text-slate-500">Direct order booking & skin advice</p>
            <p className="text-lg font-black text-[#00368B] font-mono">0330-1285975</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Nationwide COD Shipping</h3>
            <p className="text-xs text-slate-500">Fast 2–3 business days delivery across Pakistan</p>
            <p className="text-sm font-extrabold text-emerald-700">Pay Cash on Delivery</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Official Email Support</h3>
            <p className="text-xs text-slate-500">For wholesale, B2B & order inquiries</p>
            <p className="text-sm font-bold text-slate-900 font-mono">{shopEmail}</p>
          </div>
        </div>

        {/* FAQs + Direct Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 7 Cols: FAQs */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00368B]" />
              <span>{isUrdu ? 'اکثر پوچھے گئے سوالات (FAQs)' : 'Frequently Asked Questions'}</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                    >
                      <span>{isUrdu ? faq.qUrdu : faq.qEn}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#00368B] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {isUrdu ? faq.aUrdu : faq.aEn}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Quick WhatsApp Message Box */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-[#00368B]" />
              <span>{isUrdu ? 'ہمیں براہ راست پیغام بھیجیں' : 'Send Us a Direct Message'}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={inquirerName}
                  onChange={(e) => setInquirerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={inquirerPhone}
                  onChange={(e) => setInquirerPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message / Question</label>
                <textarea
                  rows={3}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Write your question or order inquiry..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <a
                href={whatsappInquiryUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => setInquirySent(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#00368B] hover:bg-[#fab528] text-white hover:text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp Now</span>
              </a>

              {inquirySent && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Opening WhatsApp to send your inquiry!</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
