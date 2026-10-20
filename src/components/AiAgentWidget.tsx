import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, X, Sparkles, Languages, ExternalLink,
  MessageCircle, Zap, ShieldCheck, CheckCircle2, User, MapPin, Phone, ShoppingBag
} from 'lucide-react';
import { SoapVariant } from '../data/soaps';
import { MiracleProduct } from '../data/shMiracleProducts';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
  extractedOrder?: {
    customerName?: string;
    name?: string;
    phone?: string;
    address?: string;
    items?: string[];
    totalPkr?: number;
  };
}

interface AiAgentWidgetProps {
  soaps: SoapVariant[];
  miracleProducts: MiracleProduct[];
  langMode?: 'ur' | 'en' | 'bi';
  shopNumber: string;
  onUpdateShopNumber?: (num: string) => void;
  onAddToCart?: (item: any) => void;
}

export const AiAgentWidget: React.FC<AiAgentWidgetProps> = ({
  shopNumber = '03301285975',
  onUpdateShopNumber,
  langMode = 'en',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'whatsapp' | 'setup'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPromptBanner, setShowPromptBanner] = useState(true);

  const isUrdu = langMode === 'ur';

  // Customer order fields collected during conversation
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    address: '',
    items: '',
  });

  const initialGreeting = isUrdu 
    ? 'السلام علیکم ورحمتہ اللہ وبرکاتہ! خوش آمدید۔ میں صوفی نیچرل اور SH Miracle کا سینئر AI بیوٹی اور سیلز اسسٹنٹ ہوں۔\n\nآپ مجھ سے کسی بھی زبان میں اپنے جلد یا بالوں کے مسائل کے لیے موزوں پراڈکٹس پوچھ سکتے ہیں یا یہیں براہ راست واٹس ایپ آرڈر بک کروا سکتے ہیں!'
    : 'Hello and welcome! I am your Senior Herbal Consultant for Sufi Natural & SH Miracle.\n\nFeel free to ask me for custom organic skincare/haircare recommendations, ingredient details, or place a direct WhatsApp order with Cash on Delivery across Pakistan!';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Quick Prompt Options
  const quickPrompts = isUrdu ? [
    'چہرے کے کیل مہاسوں اور دانوں کے لیے کون سا صابن بہتر ہے؟',
    'Coffee Rice soap & Aloe Vera price check',
    'AOA! Hair fall ke liye SH Miracle shampoo & oil mangwana hai',
    'خشک جلد کے لیے بکری کا دودھ صابن آرڈر کرنا ہے',
  ] : [
    'Which soap is best for acne and pimples?',
    'Price of Coffee & Rice and Goat Milk soap',
    'I want to order SH Miracle Shampoo & Hair Oil',
    'Best soap for dry and sensitive skin?',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    try {
      // Call backend AI Agent proxy route
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
          shopNumber,
          userLanguage: isUrdu ? 'ur' : 'en'
        })
      });

      if (!response.ok) {
        throw new Error('API server unavailable on static host');
      }

      const data = await response.json();
      
      // Check if response contains extracted order JSON block
      let rawReply = data.reply || '';
      let extractedData: any = null;
      const jsonMatch = rawReply.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[1]);
          rawReply = rawReply.replace(/```json\s*([\s\S]*?)\s*```/, '').trim();
          if (extractedData.customerName) setOrderDetails(prev => ({ ...prev, name: extractedData.customerName }));
          if (extractedData.phone) setOrderDetails(prev => ({ ...prev, phone: extractedData.phone }));
          if (extractedData.address) setOrderDetails(prev => ({ ...prev, address: extractedData.address }));
        } catch (e) {
          console.error('JSON parse error from AI agent', e);
        }
      }

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: rawReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedOrder: extractedData
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      // Smart Fallback reply
      const lower = textToSend.toLowerCase();
      let fallbackText = 'Thank you for reaching out! We offer 100% pure herbal soaps and organic beauty products crafted in Pakistan.';
      if (lower.includes('acne') || lower.includes('pimple') || lower.includes('دانے')) {
        fallbackText = 'For acne-prone skin, our "Neem & Turmeric Soap" (Rs. 250) and "Tea Tree Anti Acne Soap" (Rs. 250) are highly effective in clearing bacteria and calming redness. Would you like to place an order?';
      } else if (lower.includes('hair') || lower.includes('shampoo') || lower.includes('oil')) {
        fallbackText = 'For hair loss, dandruff, and healthy growth, our "SH Miracle Herbal Shampoo with 18 Herbs" (Rs. 550) and "Miracle Drops Hair Oil" (Rs. 650) provide tested, sulfate-free root nourishment.';
      } else if (lower.includes('dry') || lower.includes('moisture')) {
        fallbackText = 'For dry skin, our "Goat Milk Soap" (Rs. 260) and "Pure Vegetable Glycerin" (Rs. 220) lock in deep hydration and repair rough skin barriers.';
      } else {
        fallbackText = 'You can browse any soap on our store or directly message us on WhatsApp at 0330 1285975 for instant Cash on Delivery ordering across Pakistan!';
      }

      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Build clean WhatsApp message link
  const cleanPhone = (shopNumber || '03301285975').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : (cleanPhone || '923301285975');

  const generateWhatsAppLink = (customText?: string) => {
    let msg = customText;
    if (!msg) {
      msg = `*🌿 Sufi Natural & SH Miracle - WhatsApp Order*\n----------------------------------\n`;
      if (orderDetails.name) msg += `👤 Customer Name: ${orderDetails.name}\n`;
      if (orderDetails.phone) msg += `📱 Phone Number: ${orderDetails.phone}\n`;
      if (orderDetails.address) msg += `📍 Address & City: ${orderDetails.address}\n`;
      if (orderDetails.items) msg += `🛍️ Items Requested: ${orderDetails.items}\n`;
      msg += `----------------------------------\nPayment Method: Cash On Delivery`;
    }
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Floating Widget Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        
        {/* Welcome Proactive Tooltip */}
        {showPromptBanner && !isOpen && (
          <div className="bg-stone-900/95 text-amber-100 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-amber-400/40 text-xs max-w-xs animate-bounce flex items-start gap-2 relative">
            <span className="text-xl">🌿</span>
            <div>
              <p className="font-bold text-amber-300">
                {isUrdu ? '24/7 AI اسسٹنٹ دستیاب ہے!' : '24/7 AI Beauty Consultant!'}
              </p>
              <p className="text-[11px] text-stone-300 leading-tight mt-0.5">
                {isUrdu 
                  ? 'جلد یا بالوں کے مسائل پوچھیں یا واٹس ایپ پر فوری آرڈر بک کروائیں'
                  : 'Ask skin/hair questions or place your WhatsApp order in 1 click!'}
              </p>
            </div>
            <button 
              onClick={() => setShowPromptBanner(false)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowPromptBanner(false);
          }}
          className="relative group bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-amber-200 p-3.5 sm:p-4 rounded-full shadow-2xl border-2 border-amber-400 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {/* Online Pulse Dot */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
          </span>
          <Bot className="w-6 h-6 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline font-bold text-sm pr-1">
            {isUrdu ? 'AI کنسلٹنٹ' : 'AI Consultant'}
          </span>
        </button>
      </div>

      {/* AI Agent Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white w-full sm:w-[480px] h-[92vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0d3324] via-[#154734] to-[#0d3324] text-white p-4 border-b border-amber-500/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                  <Bot className="w-6 h-6" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-950 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-amber-200 font-serif">
                      {isUrdu ? 'صوفی نیچرل AI اسسٹنٹ' : 'Sufi Natural AI Consultant'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-mono border border-emerald-400/40">
                      Gemini AI
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90">
                    {isUrdu ? '24/7 کسٹمر سپورٹ اور واٹس ایپ آرڈر گائیڈ' : '24/7 Skin, Haircare & WhatsApp Order Assistant'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Header Tabs */}
            <div className="bg-stone-100 p-2 border-b border-stone-200 grid grid-cols-3 gap-1 shrink-0 text-xs font-bold">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'chat'
                    ? 'bg-emerald-900 text-amber-200 shadow-sm border border-amber-400/30'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'AI بات چیت' : 'AI Chat'}</span>
              </button>

              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'whatsapp'
                    ? 'bg-emerald-900 text-amber-200 shadow-sm border border-amber-400/30'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isUrdu ? 'فوری آرڈر فارم' : 'Order Form'}</span>
              </button>

              <button
                onClick={() => setActiveTab('setup')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'setup'
                    ? 'bg-emerald-900 text-amber-200 shadow-sm border border-amber-400/30'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUrdu ? 'واٹس ایپ نمبر' : 'Contact'}</span>
              </button>
            </div>

            {/* TAB 1: AI Chat & Instant Support */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden bg-stone-50">
                
                {/* Chat Messages Scrollable */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  
                  {/* Language Notice */}
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2 text-center text-[11px] text-amber-900 flex items-center justify-center gap-1.5 shadow-xs">
                    <Languages className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {isUrdu 
                        ? 'آپ اردو، انگلش یا رومن اردو میں سوال پوچھ سکتے ہیں۔' 
                        : 'You can chat in English, Urdu, or Roman Urdu seamlessly.'}
                    </span>
                  </div>

                  {/* Messages List */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-emerald-800 text-amber-100 rounded-br-none border border-emerald-700'
                            : 'bg-white text-stone-800 rounded-bl-none border border-stone-200/90 shadow-md'
                        }`}
                      >
                        {msg.sender === 'agent' && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 mb-1 pb-1 border-b border-emerald-100">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{isUrdu ? 'صوفی نیچرل AI کنسلٹنٹ' : 'Sufi Natural AI Consultant'}</span>
                          </div>
                        )}
                        <p className="whitespace-pre-line">{msg.text}</p>

                        {/* Extracted Order Box if ready */}
                        {msg.extractedOrder && (msg.extractedOrder.customerName || msg.extractedOrder.name) && (
                          <div className="mt-3 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300 text-xs text-emerald-950 space-y-1">
                            <p className="font-bold flex items-center gap-1 text-emerald-900">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{isUrdu ? 'آرڈر تفصیلات تیار ہیں:' : 'Order Summary Ready:'}</span>
                            </p>
                            <p>Name: {msg.extractedOrder.customerName || msg.extractedOrder.name}</p>
                            <p>Phone: {msg.extractedOrder.phone}</p>
                            <p>Address: {msg.extractedOrder.address}</p>
                            <a
                              href={generateWhatsAppLink()}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold rounded-lg shadow-sm"
                            >
                              {isUrdu ? 'واٹس ایپ پر 1-کلک میں تصدیق کریں' : 'Confirm Order in 1-Click on WhatsApp'}
                            </a>
                          </div>
                        )}

                        <span className="block text-[9px] text-stone-400 text-right mt-1 font-mono">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-stone-500 text-xs bg-white p-3 rounded-2xl border border-stone-200 max-w-[140px]">
                      <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span>{isUrdu ? 'سوچ رہا ہے...' : 'Consulting...'}</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick Prompts Carousel */}
                <div className="p-2 bg-stone-100 border-t border-stone-200 overflow-x-auto flex gap-1.5 text-xs no-scrollbar shrink-0">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp)}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-300 hover:border-emerald-400 text-[11px] transition-all shadow-2xs font-medium"
                    >
                      {qp}
                    </button>
                  ))}
                </div>

                {/* Input Controls */}
                <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isUrdu ? 'اپنا سوال لکھیں...' : 'Ask about soaps, skin problems, or ordering...'}
                    className="flex-1 py-2.5 px-3.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs sm:text-sm outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: WhatsApp Direct Order Form */}
            {activeTab === 'whatsapp' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50 text-xs sm:text-sm text-stone-800">
                <div className="bg-emerald-900 text-amber-200 p-4 rounded-2xl border border-amber-400/40 shadow-md">
                  <div className="flex items-center gap-2 text-base font-bold text-amber-300 font-serif">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                    <span>{isUrdu ? 'براہ راست واٹس ایپ آرڈر فارم' : 'Direct WhatsApp Order Form'}</span>
                  </div>
                  <p className="text-xs text-emerald-100/90 mt-1">
                    {isUrdu 
                      ? `فارم پر کریں، آپ کا آرڈر تیار ہو کر براہ راست دکان کے واٹس ایپ (${formattedPhone}) پر کھل جائے گا۔`
                      : `Fill out your delivery details, and your order will open pre-formatted on WhatsApp (${formattedPhone}) for immediate processing.`}
                  </p>
                </div>

                {/* Order Details Input Fields */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isUrdu ? 'آپ کا نام (Full Name):' : 'Full Name:'}</span>
                    </label>
                    <input
                      type="text"
                      value={orderDetails.name}
                      onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isUrdu ? 'فون نمبر (Phone Number):' : 'Phone / WhatsApp Number:'}</span>
                    </label>
                    <input
                      type="text"
                      value={orderDetails.phone}
                      onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                      placeholder="03001234567"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isUrdu ? 'مکمل پتہ اور شہر (Delivery Address & City):' : 'Delivery Address & City:'}</span>
                    </label>
                    <input
                      type="text"
                      value={orderDetails.address}
                      onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                      placeholder="House #, Street, Area, City"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isUrdu ? 'مطلوبہ پراڈکٹس اور تعداد:' : 'Selected Products & Quantities:'}</span>
                    </label>
                    <textarea
                      rows={3}
                      value={orderDetails.items}
                      onChange={(e) => setOrderDetails({ ...orderDetails, items: e.target.value })}
                      placeholder="e.g. 2x Coffee & Rice Soap, 1x SH Miracle Shampoo, 1x Saffron Soap"
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-all text-sm"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-300" />
                  <span>{isUrdu ? 'واٹس ایپ پر آرڈر بھیجیں' : 'Send Order to Official WhatsApp'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* TAB 3: Agent Setup & WhatsApp Number Admin */}
            {activeTab === 'setup' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50 text-xs sm:text-sm text-stone-800">
                <div className="bg-amber-100 text-amber-950 p-4 rounded-2xl border border-amber-300">
                  <h4 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>{isUrdu ? 'دکان کا آفیشل واٹس ایپ نمبر' : 'Store Official WhatsApp Contact'}</span>
                  </h4>
                  <p className="text-xs text-amber-800 mt-1">
                    {isUrdu 
                      ? 'تمام کسٹمرز کے آرڈرز اور استفسارات اس نمبر پر موصول ہوں گے۔' 
                      : 'All customer order inquiries and checkouts route to this number.'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                  <label className="block font-bold text-stone-800">
                    {isUrdu ? 'واٹس ایپ نمبر درج کریں:' : 'WhatsApp Business Number:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shopNumber}
                      onChange={(e) => onUpdateShopNumber && onUpdateShopNumber(e.target.value)}
                      placeholder="03301285975"
                      className="flex-1 p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 font-mono text-sm outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    International format: <strong className="font-mono text-emerald-800">+{formattedPhone}</strong>
                  </p>
                </div>

                {/* AI Features Guide */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                  <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isUrdu ? 'AI اسسٹنٹ کی خصوصیات:' : 'AI Consultant Features:'}</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                    <li>Fluid replies in English, Urdu, and Roman Urdu</li>
                    <li>Tailored soap and hair care routines based on skin conditions</li>
                    <li>Automatic extraction of customer name, address, and items into WhatsApp links</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
