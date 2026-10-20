export interface PromoCardConfig {
  badgeEn: string;
  badgeUr: string;
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  subtitleUr: string;
  priceText: string;
  buttonTextEn: string;
  buttonTextUr: string;
  imageUrl: string;
  targetCategory: string;
}

export interface MidBannerConfig {
  badge: string;
  title: string;
  subtitle: string;
  priceText: string;
  emoji: string;
  targetCategory: string;
  bgGradient: string;
}

export interface TrustBadgeConfig {
  titleEn: string;
  titleUr: string;
  subtitle: string;
}

export interface FaqItemConfig {
  qEn: string;
  qUrdu: string;
  aEn: string;
  aUrdu: string;
}

export interface SiteConfig {
  // Theme Colors
  primaryColor?: string;
  accentColor?: string;

  // 1. Header & Branding
  storeName: string;
  storeTaglineEn: string;
  storeTaglineUr: string;
  logoText: string;
  logoImageUrl?: string;
  topBarAnnouncementEn: string;
  topBarAnnouncementUr: string;
  topBarPromoBadgeEn: string;
  topBarPromoBadgeUr: string;
  deliveryLocationTextEn: string;
  deliveryLocationTextUr: string;

  // 2. Main Hero Banner & 2 Right Promo Cards
  heroBadgeEn: string;
  heroBadgeUr: string;
  heroTitleEn: string;
  heroTitleUr: string;
  heroSubtitleEn: string;
  heroSubtitleUr: string;
  heroStartingPrice: string;
  heroPrimaryBtnEn: string;
  heroPrimaryBtnUr: string;
  heroSecondaryBtnEn: string;
  heroSecondaryBtnUr: string;
  heroBgImageUrl: string;

  topRightPromo: PromoCardConfig;
  bottomRightPromo: PromoCardConfig;

  // 3. 4 Trust / Service Guarantee Badges
  trustBadges: [TrustBadgeConfig, TrustBadgeConfig, TrustBadgeConfig, TrustBadgeConfig];

  // 4. Homepage Section Headings & Countdown
  categoriesHeadingEn: string;
  categoriesHeadingUr: string;
  flashDealsHeadingEn: string;
  flashDealsHeadingUr: string;
  flashDealsTimerText: string;
  soapsSectionSubheading: string;
  soapsSectionHeadingEn: string;
  soapsSectionHeadingUr: string;
  hairSectionSubheading: string;
  hairSectionHeadingEn: string;
  hairSectionHeadingUr: string;

  // 5. 3 Mid-Page Promotional Banners
  midBanners: [MidBannerConfig, MidBannerConfig, MidBannerConfig];

  // 6. About Us Page Content
  aboutBadgeEn: string;
  aboutBadgeUr: string;
  aboutTitleEn: string;
  aboutTitleUr: string;
  aboutDescriptionEn: string;
  aboutDescriptionUr: string;

  // 7. Customer Service & FAQ Page Content
  serviceBadge: string;
  serviceTitleEn: string;
  serviceTitleUr: string;
  serviceSubtitleEn: string;
  serviceSubtitleUr: string;
  deliveryTimeText: string;
  returnPolicyText: string;
  faqs: FaqItemConfig[];

  // 8. Footer Content
  footerBannerTagEn: string;
  footerBannerTagUr: string;
  footerBannerTitleEn: string;
  footerBannerTitleUr: string;
  footerBannerSubEn: string;
  footerBannerSubUr: string;
  footerAboutEn: string;
  footerAboutUr: string;
  footerAddress: string;
  footerHours: string;
  footerCopyright: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // Theme Colors
  primaryColor: '#00368B',
  accentColor: '#fab528',

  // 1. Header & Branding
  storeName: 'SH MIRACLE MART',
  storeTaglineEn: 'Sufi Natural & Organic Care',
  storeTaglineUr: '100% خالص آرگینک ہربل اسٹور',
  logoText: 'SH',
  logoImageUrl: '',
  topBarAnnouncementEn: '100% Pure Organic & Handcrafted Herbal Products',
  topBarAnnouncementUr: '100% خالص آرگینک اور قدرتی ہربل مصنوعات',
  topBarPromoBadgeEn: '⚡ Cash On Delivery Nationwide Across Pakistan',
  topBarPromoBadgeUr: '⚡ پورے پاکستان میں کیش آن ڈیلیوری کی سہولت',
  deliveryLocationTextEn: 'All Pakistan COD',
  deliveryLocationTextUr: 'پورے پاکستان میں ڈیلیوری',

  // 2. Main Hero Banner
  heroBadgeEn: '100% Pure Organic & Herbal Mart',
  heroBadgeUr: '100% خالص آرگینک ہربل مارٹ',
  heroTitleEn: 'Pure Botanical Soaps, 18-Herb Shampoos & Miracle Hair Oils',
  heroTitleUr: 'خالص ہربل صابن، شیمپو اور ہیئر آئل اب ایک ہی کلک پر!',
  heroSubtitleEn:
    'Experience chemical-free skincare & haircare crafted with cold-pressed carrier oils and native herbs. Fast doorstep Cash on Delivery across Pakistan.',
  heroSubtitleUr:
    'کیمیکل، سلفیٹ اور پیرابین سے 100% پاک۔ پورے پاکستان میں تیز ترین ہوم ڈیلیوری اور کیش آن ڈیلیوری کی سہولت!',
  heroStartingPrice: 'Rs. 220',
  heroPrimaryBtnEn: 'Shop All Products',
  heroPrimaryBtnUr: 'ابھی خریداری کریں (Shop Now)',
  heroSecondaryBtnEn: 'Free Skin Quiz',
  heroSecondaryBtnUr: 'جلد کا مفت ٹیسٹ',
  heroBgImageUrl:
    'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=1200&auto=format&fit=crop&q=80',

  topRightPromo: {
    badgeEn: '18 Native Herbs',
    badgeUr: '18 قدرتی جڑی بوٹیاں',
    titleEn: 'SH Miracle Hair Shampoo & Oil',
    titleUr: 'ایس ایچ میریکل ہربل شیمپو اور آئل',
    subtitleEn: 'Stop hair fall & boost natural thickness',
    subtitleUr: 'بالوں کا گرنا روکے اور خشکی ختم کرے',
    priceText: 'Rs. 550',
    buttonTextEn: 'Shop Now',
    buttonTextUr: 'ابھی دیکھیں',
    imageUrl:
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    targetCategory: 'shampoos',
  },

  bottomRightPromo: {
    badgeEn: '20 Pure Variants',
    badgeUr: '20 خالص اقسام',
    titleEn: '20 Cold-Pressed Organic Soaps',
    titleUr: '20 خالص آرگینک ہربل صابن',
    subtitleEn: 'Coffee, Neem, Aloe Vera, Saffron & Goat Milk',
    subtitleUr: 'کافی، نیم، ایلو ویرا، زعفران اور بکری کا دودھ',
    priceText: 'Rs. 230 – 290',
    buttonTextEn: 'Explore Soaps',
    buttonTextUr: 'تمام صابن دیکھیں',
    imageUrl:
      'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&auto=format&fit=crop&q=80',
    targetCategory: 'soaps',
  },

  // 3. 4 Trust Badges
  trustBadges: [
    {
      titleEn: 'Fast Nationwide Delivery',
      titleUr: 'پورے پاکستان میں تیز ڈیلیوری',
      subtitle: 'Doorstep delivery across all cities',
    },
    {
      titleEn: '100% Pure & Organic',
      titleUr: '100% خالص اور آرگینک',
      subtitle: 'Zero Sulfates, Zero Parabens',
    },
    {
      titleEn: 'Cash On Delivery (COD)',
      titleUr: 'کیش آن ڈیلیوری (COD)',
      subtitle: 'Pay safely when you receive parcel',
    },
    {
      titleEn: '24/7 Dedicated Support',
      titleUr: '24/7 واٹس ایپ سپورٹ',
      subtitle: 'Direct WhatsApp Support & Advice',
    },
  ],

  // 4. Homepage Section Headings
  categoriesHeadingEn: 'Browse By Category',
  categoriesHeadingUr: 'شعبہ جات کے مطابق خریداری (Browse By Category)',
  flashDealsHeadingEn: 'Flash Deals & Top Best-Sellers',
  flashDealsHeadingUr: 'فلیش ڈیلز اور سب سے زیادہ فروخت ہونے والی مصنوعات',
  flashDealsTimerText: '08h : 42m : 19s',
  soapsSectionSubheading: '100% Cold-Pressed Botanical Bars',
  soapsSectionHeadingEn: 'Handcrafted Organic Herbal Soaps',
  soapsSectionHeadingUr: 'خالص ہربل اور آرگینک صابن (Herbal Soaps)',
  hairSectionSubheading: '18 Native Herbs & Cold-Pressed Carrier Oils',
  hairSectionHeadingEn: 'SH Miracle Shampoos, Hair Oils & Skincare',
  hairSectionHeadingUr: 'ایس ایچ میریکل شیمپو، ہیئر آئل اور سکن کیئر',

  // 5. 3 Mid-Page Promotional Banners
  midBanners: [
    {
      badge: 'Instant Glow',
      title: 'Coffee & Rice Scrub Soap',
      subtitle: 'Removes dead skin & suntan',
      priceText: 'Order at Rs. 250',
      emoji: '☕',
      targetCategory: 'brightening',
      bgGradient: 'from-[#00368B] to-blue-800',
    },
    {
      badge: '18 Herbs + 15 Oils',
      title: 'SH Miracle Drops Hair Oil',
      subtitle: 'Deep root nourishment',
      priceText: 'Order at Rs. 650',
      emoji: '🌿',
      targetCategory: 'oils',
      bgGradient: 'from-emerald-800 to-teal-900',
    },
    {
      badge: 'Royal Care',
      title: 'Saffron & Goat Milk Soaps',
      subtitle: 'Soft, velvety winter hydration',
      priceText: 'Order at Rs. 260',
      emoji: '🌺',
      targetCategory: 'moisture',
      bgGradient: 'from-amber-700 to-amber-900',
    },
  ],

  // 6. About Us Page Content
  aboutBadgeEn: 'About e-SH Miracle Mart',
  aboutBadgeUr: 'ہمارے بارے میں اور برانڈ فلاسفی',
  aboutTitleEn: 'The Craft of Sufi Natural & SH Miracle Naturals',
  aboutTitleUr: 'صوفی نیچرل آرگینک سوپس اور SH Miracle کی کہانی',
  aboutDescriptionEn:
    'Founded on the principle that true dermal wellness thrives without synthetic detergents, harsh sulfates, or artificial fillers. Every soap bar and hair formula is handcrafted using cold-pressed methods.',
  aboutDescriptionUr:
    'ہماری بنیاد اس یقین پر رکھی گئی کہ جلد اور بالوں کی اصل خوبصورتی اور صحت کیمیکلز سے نہیں، بلکہ قدرت کے خالص پودوں، بیجوں اور نباتاتی تیلوں میں پوشیدہ ہے۔',

  // 7. Customer Service & FAQ Page Content
  serviceBadge: '24/7 Customer Care Center',
  serviceTitleEn: 'We Are Here to Assist You 24/7',
  serviceTitleUr: 'ہماری کسٹمر سروس اور مکمل سپورٹ',
  serviceSubtitleEn:
    'Get instant assistance with orders, nationwide COD delivery tracking, and herbal consultations.',
  serviceSubtitleUr:
    'آرڈر ٹریکنگ، کیش آن ڈیلیوری اور سکن کیئر مشورے کے لیے کسی بھی وقت رابطہ کریں',
  deliveryTimeText: '2–3 Working Days Across Pakistan',
  returnPolicyText: '7-Day Easy Replacement Guarantee on Damaged Parcels',
  faqs: [
    {
      qUrdu: 'کیا صوفی نیچرل اور SH Miracle کے تمام صابن 100% کیمیکل فری ہیں؟',
      qEn: 'Are all Sufi Natural & SH Miracle products 100% chemical-free?',
      aUrdu:
        'جی بالکل! ہمارے تمام ہربل صابن، شیمپوز اور ہیئر آئلز پیرابین، سلفیٹ (SLS/SLES)، مصنوعی رنگوں اور نقصان دہ صابنی کیمیکلز سے 100% پاک ہیں۔',
      aEn: 'Yes, completely. Our handcrafted soaps, herbal shampoo, and hair oils are formulated strictly without parabens, SLS/SLES, mineral oil, or synthetic bleaching agents.',
    },
    {
      qUrdu: 'پورے پاکستان میں ڈیلیوری کا کتنا وقت لگتا ہے اور کیش آن ڈیلیوری کیسے کام کرتی ہے؟',
      qEn: 'How long does delivery take and how does Cash On Delivery work?',
      aUrdu:
        'آرڈر کنفرم ہونے کے بعد پارسل 2 سے 3 ورکنگ دنوں میں پاکستان کے تمام شہروں تک پہنچایا جاتا ہے۔ آپ کو رقم پارسل ملنے کے وقت رائیڈر کو نقد ادا کرنی ہوتی ہے۔',
      aEn: 'Orders are dispatched promptly and delivered nationwide across Pakistan in 2 to 3 business days with convenient Cash on Delivery (COD).',
    },
    {
      qUrdu: 'کیا یہ صابن چہرے کے ساتھ ساتھ پورے جسم پر بھی استعمال کیے جا سکتے ہیں؟',
      qEn: 'Can these soaps be used on both face and body?',
      aUrdu:
        'جی ہاں! ہمارے تمام صابن قدرتی طور پر نرم اور موئسچرائزنگ ہیں کہ آپ انہیں روزانہ چہرے اور پورے جسم پر استعمال کر سکتے ہیں۔',
      aEn: 'Absolutely. Due to high natural cold-pressed oil content, our bars are mild and nourishing for daily facial cleansing as well as body baths.',
    },
    {
      qUrdu: 'اگر مجھے پروڈکٹ کے بارے میں رہنمائی چاہیے تو کس سے رابطہ کروں؟',
      qEn: 'How can I get skin advice or track my parcel status?',
      aUrdu:
        'آپ کسی بھی وقت ہمارے آفیشل واٹس ایپ نمبر 03301285975 پر براہ راست رابطہ کر سکتے ہیں۔ ہماری کسٹمر کیئر ٹیم 24 گھنٹے حاضر ہے۔',
      aEn: 'You can directly connect with our dedicated customer support on WhatsApp (0330-1285975) or email sufinatural1@gmail.com for instant tracking and recommendations.',
    },
  ],

  // 8. Footer Content
  footerBannerTagEn: '20% OFF Combos & Fast Dispatch',
  footerBannerTagUr: 'تازہ ترین ڈسکاؤنٹس اور آفرز',
  footerBannerTitleEn: 'Need Help Choosing the Right Organic Soap or Hair Oil?',
  footerBannerTitleUr: 'واٹس ایپ پر براہِ راست آرڈر یا مفت مشورے کے لیے رابطہ کریں!',
  footerBannerSubEn:
    'Chat directly with our herbal specialists on WhatsApp for instant Cash on Delivery booking.',
  footerBannerSubUr:
    'ہمارے نمائندے 24/7 آپ کی رہنمائی کے لیے موجود ہیں — پورے پاکستان میں کیش آن ڈیلیوری',
  footerAboutEn:
    'Your trusted online destination for 100% pure cold-pressed herbal soaps, 18-herb shampoos, miracle hair oils, and organic skincare across Pakistan.',
  footerAboutUr:
    'صوفی نیچرل اور SH Miracle کا مقصد ہر گھر تک 100% خالص جڑی بوٹیوں اور کولڈ پریسڈ تیلوں سے تیار کردہ کیمیکل فری صابن، شیمپو اور ہیئر آئل پہنچانا ہے۔',
  footerAddress: 'Nationwide Delivery Across Pakistan (Cash on Delivery)',
  footerHours: 'Mon – Sun (24/7 Online Ordering)',
  footerCopyright: '© 2025 e-SH Miracle Mart (Sufi Natural Organic Soaps). All rights reserved.',
};
