import React, { useState, useEffect } from 'react';
import { SoapVariant } from '../data/soaps';
import { 
  X, ShoppingBag, Plus, Minus, Trash2, Send, Copy, 
  Check, Sparkles, MapPin, Phone, User, MessageCircle, 
  Building2, ShieldCheck, Truck, AlertCircle, FileText, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CartItem {
  soap: SoapVariant;
  quantity: number;
}

interface CartOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (soapId: number, qty: number) => void;
  onRemoveItem: (soapId: number) => void;
  onClearCart: () => void;
  shopNumber?: string;
  langMode?: 'ur' | 'en' | 'bi';
}

export const CartOrderModal: React.FC<CartOrderModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  shopNumber = '03301285975',
  langMode = 'en',
}) => {
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('sh_cust_name') || '');
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('sh_cust_phone') || '');
  const [customerCity, setCustomerCity] = useState(() => localStorage.getItem('sh_cust_city') || '');
  const [customerAddress, setCustomerAddress] = useState(() => localStorage.getItem('sh_cust_address') || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Persist customer info for returning visits
  useEffect(() => {
    if (customerName) localStorage.setItem('sh_cust_name', customerName);
  }, [customerName]);

  useEffect(() => {
    if (customerPhone) localStorage.setItem('sh_cust_phone', customerPhone);
  }, [customerPhone]);

  useEffect(() => {
    if (customerCity) localStorage.setItem('sh_cust_city', customerCity);
  }, [customerCity]);

  useEffect(() => {
    if (customerAddress) localStorage.setItem('sh_cust_address', customerAddress);
  }, [customerAddress]);

  if (!isOpen) return null;

  const isUrdu = langMode === 'ur';

  const totalAmount = cartItems.reduce((sum, item) => sum + item.soap.pricePkr * item.quantity, 0);

  // Clean phone number format for WhatsApp (defaults to 923301285975)
  const cleanPhone = (shopNumber || '03301285975').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : (cleanPhone || '923301285975');

  // Generate WhatsApp message string
  const generateMessageText = () => {
    const oNum = orderNumber || `SH-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isUrdu) {
      let msg = `*🌿 صوفی نیچرل آرگینک سوپس اور SH Miracle - نیا آرڈر*\n`;
      msg += `*آرڈر نمبر:* #${oNum}\n`;
      msg += `----------------------------------\n`;
      msg += `📋 *کسٹمر کی معلومات (Customer Details):*\n`;
      msg += `👤 *پورا نام:* ${customerName.trim() || 'نام درج نہیں'}\n`;
      msg += `📱 *موبائل / واٹس ایپ:* ${customerPhone.trim() || 'فون درج نہیں'}\n`;
      if (customerCity) msg += `🏙️ *شہر:* ${customerCity.trim()}\n`;
      if (customerAddress) msg += `📍 *مکمل پتہ:* ${customerAddress.trim()}\n`;
      if (specialInstructions) msg += `📝 *نوٹ:* ${specialInstructions.trim()}\n`;
      msg += `----------------------------------\n`;
      msg += `🛍️ *آرڈر کردہ پروڈکٹس:*\n`;
      cartItems.forEach((item, index) => {
        msg += `${index + 1}. ${item.soap.nameUrdu} (${item.soap.nameEnglish})\n    تعداد: ${item.quantity} | قیمت: Rs. ${item.soap.pricePkr} x ${item.quantity} = Rs. ${item.soap.pricePkr * item.quantity}\n`;
      });
      msg += `----------------------------------\n`;
      msg += `💰 *کل رقم (Total Bill): Rs. ${totalAmount}*\n`;
      msg += `🚚 *طریقہ ادائیگی: کیش آن ڈیلیوری (Cash On Delivery)*\n`;
      msg += `----------------------------------\n`;
      msg += `براہ کرم میرے آرڈر کی تصدیق فرما کر جلد روانہ فرمائیں۔ شکریہ!`;
      return msg;
    } else {
      let msg = `*🌿 Sufi Natural Organic Soaps & SH Miracle - New Order*\n`;
      msg += `*Order Reference:* #${oNum}\n`;
      msg += `----------------------------------\n`;
      msg += `📋 *Customer Details:*\n`;
      msg += `👤 *Customer Name:* ${customerName.trim() || 'Not specified'}\n`;
      msg += `📱 *Phone / WhatsApp:* ${customerPhone.trim() || 'Not specified'}\n`;
      if (customerCity) msg += `🏙️ *City:* ${customerCity.trim()}\n`;
      if (customerAddress) msg += `📍 *Complete Address:* ${customerAddress.trim()}\n`;
      if (specialInstructions) msg += `📝 *Note:* ${specialInstructions.trim()}\n`;
      msg += `----------------------------------\n`;
      msg += `🛍️ *Ordered Products:*\n`;
      cartItems.forEach((item, index) => {
        msg += `${index + 1}. ${item.soap.nameEnglish} (${item.soap.nameUrdu})\n    Qty: ${item.quantity} | Price: Rs. ${item.soap.pricePkr} x ${item.quantity} = Rs. ${item.soap.pricePkr * item.quantity}\n`;
      });
      msg += `----------------------------------\n`;
      msg += `💰 *Total Amount: Rs. ${totalAmount}*\n`;
      msg += `🚚 *Payment: Cash On Delivery (COD All Across Pakistan)*\n`;
      msg += `----------------------------------\n`;
      msg += `Please confirm and dispatch my order. Thank you!`;
      return msg;
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateMessageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppOrder = () => {
    // Validate that at least Name and Phone are entered
    if (!customerName.trim()) {
      setValidationError('براہ کرم اپنا پورا نام درج فرمائیں (Please enter your name)');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setValidationError('براہ کرم اپنا درست موبائل یا واٹس ایپ نمبر درج فرمائیں');
      return;
    }

    setValidationError('');
    const oNum = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(oNum);

    const encoded = encodeURIComponent(generateMessageText());
    window.open(`https://wa.me/${formattedPhone}?text=${encoded}`, '_blank');
    setOrderSent(true);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCashOnDeliveryDirect = () => {
    if (!customerName.trim()) {
      setValidationError('براہ کرم اپنا پورا نام درج فرمائیں (Please enter your name)');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setValidationError('براہ کرم اپنا درست موبائل یا واٹس ایپ نمبر درج فرمائیں');
      return;
    }
    if (!customerAddress.trim()) {
      setValidationError('براہ کرم اپنا مکمل پتہ اور شہر درج فرمائیں تاکہ پارسل پہنچ سکے');
      return;
    }

    setValidationError('');
    const oNum = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(oNum);
    setOrderSent(true);

    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-900/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-amber-500/30 p-5 sm:p-7 relative text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all border border-stone-200"
          title="بند کریں (Close)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  {isUrdu ? 'کسٹمر ڈیٹیلز اور آرڈر کنفرمیشن' : 'Customer Details & Order Checkout'}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-sans">
                  COD Available
                </span>
              </div>
              <p className="text-xs text-stone-500 font-urdu mt-0.5">
                {isUrdu ? 'اپنی معلومات درج کریں اور واٹس ایپ یا کیش آن ڈیلیوری آرڈر کنفرم کریں' : 'Enter your details for quick WhatsApp or Cash on Delivery order'}
              </p>
            </div>
          </div>
          {cartItems.length > 0 && !orderSent && (
            <button
              onClick={onClearCart}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium font-urdu"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'خالی کریں' : 'Clear'}</span>
            </button>
          )}
        </div>

        {orderSent ? (
          /* SUCCESS ORDER CONFIRMATION SCREEN */
          <div className="text-center py-8 space-y-4 animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner border border-emerald-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                آرڈر نمبر: #{orderNumber}
              </span>
              <h4 className="text-2xl font-bold font-serif text-stone-900 pt-2 font-urdu">
                {isUrdu ? 'مبارک ہو! آپ کا آرڈر کامیابی سے موصول ہو گیا ہے' : 'Thank You! Your Order Has Been Placed'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-urdu">
                {isUrdu 
                  ? `جناب ${customerName} صاحب! آپ کا آرڈر درج کر لیا گیا ہے۔ ہماری ٹیم پارسل کیش آن ڈیلیوری پر آپ کے پتے پر 2 سے 3 دن میں روانہ کر دے گی۔`
                  : `Dear ${customerName}! Your order has been placed. We will dispatch your parcel via Cash On Delivery within 2-3 business days.`}
              </p>
            </div>

            {/* Quick Action to send on WhatsApp as backup */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واٹس ایپ پر رسید حاصل کریں</span>
              </button>

              <button
                onClick={() => {
                  setOrderSent(false);
                  onClearCart();
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-stone-100 font-bold text-xs"
              >
                {isUrdu ? 'مزید شاپنگ کریں' : 'Continue Shopping'}
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART SCREEN */
          <div className="text-center py-12 text-stone-500 space-y-3">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="font-urdu">{isUrdu ? 'آپ کی ٹوکری خالی ہے۔ کسی بھی پروڈکٹ پر کلک کر کے آرڈر شروع کریں۔' : 'Your cart is currently empty.'}</p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#154734] text-amber-100 font-bold rounded-xl text-xs font-urdu"
            >
              {isUrdu ? 'مصنوعات دیکھیں (Browse Products)' : 'Browse Products'}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* VALIDATION ALERT */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-shake font-urdu">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* CUSTOMER DETAILS FORM */}
            <div className="bg-amber-50/70 p-4 sm:p-5 rounded-3xl border border-amber-300/80 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <h4 className={`text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  <User className="w-4 h-4 text-emerald-800" />
                  <span>{isUrdu ? 'کسٹمر کی معلومات برائے ہوم ڈیلیوری:' : 'Customer Delivery Information:'}</span>
                </h4>
                <span className={`text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'ضروری معلومات' : 'Required for COD'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Full Name */}
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold text-stone-700 block ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {isUrdu ? 'آپ کا پورا نام: *' : 'Full Name: *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder={isUrdu ? 'مثال: علی احمد' : 'e.g. John Doe'}
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                    />
                  </div>
                </div>

                {/* 2. Phone / WhatsApp Number */}
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold text-stone-700 block ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {isUrdu ? 'موبائل یا واٹس ایپ نمبر: *' : 'Mobile / WhatsApp Number: *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="03001234567"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 3. City Name */}
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold text-stone-700 block ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {isUrdu ? 'شہر کا نام:' : 'City / Town: *'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={isUrdu ? 'لاہور، کراچی، اسلام آباد، راولپنڈی وغیرہ' : 'e.g. Lahore, Karachi, Islamabad'}
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium ${isUrdu ? 'font-urdu' : 'font-sans'}`}
                    />
                  </div>
                </div>

                {/* 4. Complete Address */}
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold text-stone-700 block ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {isUrdu ? 'مکمل گھر یا دکان کا پتہ:' : 'Complete Delivery Address: *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={isUrdu ? 'مکان نمبر، گلی، محلہ یا قریبی مشہور جگہ' : 'House / Flat no, Street, Sector / Colony'}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions (Optional) */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder={isUrdu ? 'کوئی خاص ہدایت یا وقت؟ (اختیاری)' : 'Any delivery instructions? (Optional)'}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-600 ${isUrdu ? 'font-urdu' : 'font-sans'}`}
                />
              </div>
            </div>

            {/* ORDERED ITEMS LIST */}
            <div className="space-y-2">
              <div className={`flex items-center justify-between text-xs font-bold text-stone-700 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                <span>{isUrdu ? `منتخب کردہ مصنوعات (${cartItems.length} آئٹمز):` : `Ordered Products (${cartItems.length} items):`}</span>
                <span className="text-[11px] text-stone-400 font-mono">{isUrdu ? 'تعداد کم یا زیادہ کریں' : 'Adjust Quantity'}</span>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {cartItems.map(({ soap, quantity }) => (
                  <div
                    key={soap.id}
                    className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden text-xl">
                        {soap.imageUrl ? (
                          <img src={soap.imageUrl} alt={soap.nameEnglish} className="w-full h-full object-cover" />
                        ) : (
                          <span>{soap.emoji}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {isUrdu ? soap.nameUrdu : soap.nameEnglish}
                        </h5>
                        <span className="text-xs text-stone-500 font-sans">
                          Rs. {soap.pricePkr} × {quantity} = <strong className="text-emerald-900">Rs. {soap.pricePkr * quantity}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center bg-white rounded-xl border border-stone-300 p-0.5 shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(soap.id, quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-700 rounded-lg"
                          title="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-bold text-xs font-sans text-stone-900">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(soap.id, quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-700 rounded-lg"
                          title="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(soap.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL BILL & COD BADGE */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-amber-50 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3 shadow-sm">
              <div>
                <span className={`text-xs text-amber-300 block ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'کل بل کی رقم (Cash On Delivery):' : 'Total Payable Bill (COD):'}
                </span>
                <span className="text-2xl font-bold font-sans text-white">
                  Rs. {totalAmount}
                </span>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200 bg-emerald-800/80 px-2.5 py-1 rounded-full border border-emerald-600/60 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  <Truck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isUrdu ? 'کیش آن ڈیلیوری (COD)' : 'Cash On Delivery (COD)'}</span>
                </span>
                <span className={`block text-[10px] text-amber-300/80 mt-0.5 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                  {isUrdu ? 'پارسل موصول ہونے پر رقم ادا کریں' : 'Pay cash upon parcel delivery'}
                </span>
              </div>
            </div>

            {/* FINAL ORDER ACTION BUTTONS */}
            <div className="space-y-2 pt-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Main WhatsApp Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-amber-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.01] active:scale-98 border border-emerald-600/50"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
                    {isUrdu ? 'واٹس ایپ پر آرڈر بھیجیں' : 'Confirm Order on WhatsApp'}
                  </span>
                </button>

                {/* 2. Direct Cash on Delivery Book Button */}
                <button
                  onClick={handleCashOnDeliveryDirect}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.01] active:scale-98 border border-amber-400"
                >
                  <Check className="w-4 h-4 text-stone-950" />
                  <span className={isUrdu ? 'font-urdu' : 'font-sans'}>
                    {isUrdu ? 'کیش آن ڈیلیوری بک کریں' : 'Book Cash on Delivery Order'}
                  </span>
                </button>
              </div>

              {/* Copy Summary Option */}
              <div className="flex items-center justify-between text-xs text-stone-500 px-1 pt-1">
                <span>{isUrdu ? 'آفیشل ہیلپ لائن:' : 'Support Hotline:'} <strong>0330 1285975</strong></span>
                <button
                  onClick={handleCopySummary}
                  className={`text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1 ${isUrdu ? 'font-urdu' : 'font-sans'}`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isUrdu ? 'آرڈر کاپی ہو گیا!' : 'Order Copied!') : (isUrdu ? 'آرڈر تفصیل کاپی کریں' : 'Copy Order Text')}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
