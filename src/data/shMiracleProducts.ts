export interface MiracleProduct {
  id: string;
  nameUrdu: string;
  nameEnglish: string;
  category: string;
  badgeUrdu: string;
  badgeEnglish: string;
  pricePkr: number;
  size: string;
  descriptionUrdu: string;
  descriptionEnglish: string;
  keyIngredientsUrdu: string[];
  keyIngredientsEnglish: string[];
  featuresUrdu: string[];
  featuresEnglish: string[];
  emoji: string;
  accentColor: string;
  bgGradient: string;
  popular?: boolean;
  imageUrl?: string;
}

export const SH_MIRACLE_PRODUCTS: MiracleProduct[] = [
  {
    id: 'miracle-shampoo',
    nameUrdu: 'ایس ایچ میریکل ہربل شیمپو',
    nameEnglish: 'SH Miracle Herbal Shampoo',
    category: 'shampoos',
    badgeUrdu: '18 قدرتی جڑی بوٹیاں',
    badgeEnglish: '18 Herbs Formula',
    pricePkr: 550,
    size: '250ml',
    descriptionUrdu: '18 قدرتی جڑی بوٹیوں سے تیار کردہ۔ کیمیکل، سلفیٹ اور پیرابین سے 100% پاک۔ گرتے بالوں کو روکے، خشکی سکری کا خاتمہ کرے اور بالوں کو گھنا لمبا بنائے۔',
    descriptionEnglish: 'Enriched with 18 pure natural herbs. Free from harmful Sulphates, Parabens, and Silicones. Restores hair thickness, controls hair fall, and prevents dandruff.',
    keyIngredientsUrdu: ['آملہ', 'ریٹھا', 'شیکاکائی', 'برہمی', 'ایلو ویرا عرق', 'بھنگرا'],
    keyIngredientsEnglish: ['Amla', 'Reetha', 'Shikakai', 'Bhringraj', 'Aloe Vera Extract', 'Brahmi'],
    featuresUrdu: [
      'پیرابین سے مکمل پاک',
      'سلفیٹ سے پاک فارمولیشن',
      'سلیکون سے پاک قدرتی صفائی',
      'بالوں کا گرنا فوری کنٹرول'
    ],
    featuresEnglish: [
      '100% Paraben Free',
      'Sulphate Free Formulation',
      'Silicone Free Natural Cleanse',
      'Controls Excessive Hair Fall'
    ],
    emoji: '🧴',
    accentColor: '#15803d',
    bgGradient: 'from-emerald-950/20 via-emerald-900/10 to-amber-950/10',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'miracle-hair-oil',
    nameUrdu: 'ایس ایچ میریکل ڈراپس ہیئر آئل',
    nameEnglish: 'SH Miracle Drops Hair Oil',
    category: 'oils',
    badgeUrdu: '18 جڑی بوٹیاں + 15 قدرتی تیل',
    badgeEnglish: '18 Herbs + 15 Oils',
    pricePkr: 650,
    size: '120ml',
    descriptionUrdu: '18 نایاب جڑی بوٹیاں اور 15 خالص کولڈ پریسڈ تیلوں کا طلسماتی مرکب۔ بالوں کی جڑوں کو مضبوط بنائے، گنج پن دور کرے اور نئے بالوں کی افزائش کرے۔',
    descriptionEnglish: 'A powerful miracle elixir combining 18 cold-pressed herbs and 15 vital natural carrier oils. Nourishes scalp, stimulates hair follicles, and combats premature greying.',
    keyIngredientsUrdu: ['زیتون کا تیل', 'بادام کا تیل', 'کلونجی کا تیل', 'ناریل تیل', 'ارنڈی (کیسٹر) آئل', 'آملہ'],
    keyIngredientsEnglish: ['Olive Oil', 'Almond Oil', 'Black Seed Oil', 'Coconut Oil', 'Castor Oil', 'Amla Extract'],
    featuresUrdu: [
      '18 خالص جڑی بوٹیاں',
      '15 قدرتی کولڈ پریسڈ تیل',
      'نئے بالوں کی افزائش میں مددگار',
      'سر کی خشکی اور خارش سے نجات'
    ],
    featuresEnglish: [
      '18 Organic Cold-Pressed Herbs',
      '15 Natural Plant Oils',
      'Promotes Hair Growth',
      'Deep Scalp Nourishment'
    ],
    emoji: '🌿',
    accentColor: '#b45309',
    bgGradient: 'from-amber-950/20 via-amber-900/10 to-emerald-950/10',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1608248597309-843864070a92?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'miracle-rose-water',
    nameUrdu: 'ایس ایچ میریکل خالص عرق گلاب سپرے',
    nameEnglish: 'SH Miracle Pure Rose Water Spray',
    category: 'spray',
    badgeUrdu: '100% کشیدہ دیسی گلاب',
    badgeEnglish: '100% Pure Steam Distilled',
    pricePkr: 280,
    size: '120ml Spray',
    descriptionUrdu: '100% خالص کشیدہ دیسی گلاب کا عرق۔ چہرے پر فوری تازگی لائے، مسام بند کرے، قدرتی پی ایچ متوازن کرے اور میک اپ فکسر کے طور پر استعمال کریں۔',
    descriptionEnglish: '100% Pure Steam Distilled Rose Water Spray. Instantly hydrates skin, minimizes pores, balances pH level, and serves as an ideal natural facial toner.',
    keyIngredientsUrdu: ['خالص دیسی گلاب کا کشیدہ عرق', 'مصفٰی پانی'],
    keyIngredientsEnglish: ['Pure Desi Rose Distillate', 'Purified Aqua'],
    featuresUrdu: [
      'قدرتی فیشل ٹونر',
      'فوری تازگی اور گلو',
      'کھلے مساموں کو سکیڑے',
      'کوئی مصنوعی خوشبو یا کیمیکل نہیں'
    ],
    featuresEnglish: [
      'Natural Skin Toner',
      'Instant Refreshment Spray',
      'Pore Tightening Action',
      'No Artificial Fragrance'
    ],
    emoji: '🌸',
    accentColor: '#be123c',
    bgGradient: 'from-rose-950/20 via-rose-900/10 to-amber-950/10',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'miracle-glycerin',
    nameUrdu: 'ایس ایچ میریکل خالص ویجیٹیبل گلیسرین',
    nameEnglish: 'SH Miracle Pure Vegetable Glycerin',
    category: 'skincare',
    badgeUrdu: '100% نباتاتی خالص',
    badgeEnglish: '100% Vegetable Pure',
    pricePkr: 220,
    size: '100ml',
    descriptionUrdu: '100% خالص سبزیوں سے حاصل کردہ گلیسرین۔ شدید خشک جلد، پھٹی ایڑیوں، ہونٹوں اور گھٹنوں کی سیاہی و خشکی دور کرنے کے لیے بے مثال۔',
    descriptionEnglish: 'Pure vegetable glycerin that deeply locks in atmospheric hydration. Perfect for dry skin, cracked heels, chapped lips, and DIY home remedies.',
    keyIngredientsUrdu: ['100% خالص سبزیاتی گلیسرین'],
    keyIngredientsEnglish: ['100% Pure Vegetable Glycerin'],
    featuresUrdu: [
      'نمی کو جلد میں قید کرے',
      'پھٹی ایڑیوں کا بہترین علاج',
      'عرق گلاب کے ساتھ بہترین امتزاج',
      'تمام جلد کے لیے محفوظ'
    ],
    featuresEnglish: [
      'Deep Moisture Lock',
      'Heals Cracked Heels & Lips',
      'Blends Perfectly with Rose Water',
      'Safe for All Skin Types'
    ],
    emoji: '💧',
    accentColor: '#0369a1',
    bgGradient: 'from-sky-950/20 via-sky-900/10 to-emerald-950/10',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'miracle-multani-mitti',
    nameUrdu: 'ایس ایچ میریکل آرگینک ملتانی مٹی',
    nameEnglish: 'SH Miracle Organic Multani Mitti Jar',
    category: 'skincare',
    badgeUrdu: '100% خالص پتھر والی پسی مٹی',
    badgeEnglish: '100% Natural Fuller Earth',
    pricePkr: 180,
    size: '150g Jar',
    descriptionUrdu: 'چہرے کے اضافی تیل، کیل مہاسوں اور بلیک ہیڈز کو جڑ سے ختم کرنے والی خالص ملتانی مٹی کا باریک فیس پیک پاؤڈر۔',
    descriptionEnglish: '100% Natural Fuller s Earth clay powder. Pulls out deep-seated impurities, absorbs excess oils, prevents acne breakouts, and leaves skin smooth and refreshed.',
    keyIngredientsUrdu: ['100% خالص آرگینک ملتانی مٹی پاؤڈر'],
    keyIngredientsEnglish: ['100% Pure Organic Fuller Earth Clay'],
    featuresUrdu: [
      'چہرے سے اضافی تیل جذب کرے',
      'دانوں اور پھنسیوں سے نجات',
      'بہترین قدرتی فیس پیک',
      '100% کیمیکل سے پاک'
    ],
    featuresEnglish: [
      'Absorbs Excess Facial Oil',
      'Prevents Pimple Outbreaks',
      'Ideal Natural Face Pack',
      '100% Chemical-Free Clay'
    ],
    emoji: '🏺',
    accentColor: '#854d0e',
    bgGradient: 'from-amber-950/20 via-stone-900/10 to-emerald-950/10',
    imageUrl: 'https://images.unsplash.com/photo-1567928257065-f14977977d31?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'miracle-coffee-rice-soap',
    nameUrdu: 'ایس ایچ میریکل کافی اینڈ رائس صابن',
    nameEnglish: 'SH Miracle Coffee & Rice Soap',
    category: 'soaps',
    badgeUrdu: 'ہربل سکربر صابن',
    badgeEnglish: 'Brightening Scrub Soap',
    pricePkr: 250,
    size: '100g Bar',
    descriptionUrdu: 'کافی اور چاول کے دانوں سے تیار کردہ ہربل سکربر صابن، جو چہرے سے چھائیاں اور ڈیڈ سکن ہٹا کر صاف شفاف نکھار دیتا ہے۔',
    descriptionEnglish: 'Enriched with coffee grounds and rice powder. Gently exfoliates dead cells, smooths rough texture, and imparts a healthy natural glow.',
    keyIngredientsUrdu: ['آرگینک کافی پاؤڈر', 'چاول کا سفوف', 'وٹامن ای', 'قدرتی صابن بیس'],
    keyIngredientsEnglish: ['Organic Coffee Grounds', 'Rice Extract', 'Vitamin E', 'Organic Soap Base'],
    featuresUrdu: [
      'مردہ جلد کا قدرتی خاتمہ',
      'رنگت یکساں اور چمکدار',
      'روزانہ استعمال کے لیے محفوظ',
      'خالص ہربل ترکیب'
    ],
    featuresEnglish: [
      'Gentle Exfoliator',
      'Evens Skin Tone',
      'Suitable for Daily Use',
      'Herbal Recipe'
    ],
    emoji: '☕',
    accentColor: '#78350f',
    bgGradient: 'from-amber-950/20 via-amber-900/10 to-emerald-950/10',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'miracle-skin-white-soap',
    nameUrdu: 'ایس ایچ میریکل سکن وائٹ بیوٹی صابن',
    nameEnglish: 'SH Miracle Skin White Beauty Soap',
    category: 'soaps',
    badgeUrdu: 'شہد اور بادام فارمولا',
    badgeEnglish: 'Honey & Almond Formula',
    pricePkr: 260,
    size: '100g Bar',
    descriptionUrdu: 'قدرتی شہد، بادام اور ایلو ویرا سے لبریز۔ جلد کو وٹامنز فراہم کر کے خشک جلد میں نمی کی چمک اور نرمی پیدا کرے۔',
    descriptionEnglish: 'Infused with natural Honey, Almond Oil, and Aloe Vera. Feeds the skin with vitamins, locks in essential hydration, and reveals soft, glowing skin.',
    keyIngredientsUrdu: ['خالص شہد', 'بادام کا تیل', 'ایلو ویرا جیل', 'جڑی بوٹیوں کے عرق'],
    keyIngredientsEnglish: ['Pure Honey', 'Almond Oil', 'Aloe Vera Gel', 'Herbal Extracts'],
    featuresUrdu: [
      'خشک جلد کے لیے گہری نمی',
      'قدرتی چمکدار نکھار',
      'بادام اور شہد کی بھرپور غذائیت',
      'نرم و ملائم احساس'
    ],
    featuresEnglish: [
      'Rich Moisture for Dry Skin',
      'Natural Radiant Glow',
      'Deep Almond & Honey Nutrition',
      'Soft Silky Touch'
    ],
    emoji: '🧼',
    accentColor: '#d97706',
    bgGradient: 'from-amber-950/20 via-amber-800/10 to-emerald-950/10',
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'miracle-white-pearl-cream',
    nameUrdu: 'ایس ایچ میریکل وائٹ پرل ہربل بیوٹی کریم',
    nameEnglish: 'SH Miracle White Pearl Herbal Beauty Cream',
    category: 'skincare',
    badgeUrdu: 'پرل گلو فارمولا (No Mercury)',
    badgeEnglish: 'Pearl Glow Formula',
    pricePkr: 450,
    size: '50g Jar',
    descriptionUrdu: 'خالص جڑی بوٹیوں، زعفران اور موتیوں کے جوہر سے تیار کردہ۔ کیمیکل یا سٹیرائڈ سے مکمل پاک، داغ دھبے اور چھائیاں دور کر کے قدرتی سفید موتیوں جیسی چمک لائے۔',
    descriptionEnglish: 'Formulated with herbal extracts, Saffron, and Pearl essence. Fades dark spots, evens out hyperpigmentation, and imparts a bright, luminous complexion without chemicals.',
    keyIngredientsUrdu: ['زعفران', 'پرل ایکسٹریکٹ', 'وٹامن بی 3', 'ایلو ویرا عرق', 'بادام کا تیل'],
    keyIngredientsEnglish: ['Saffron', 'Pearl Extract', 'Vitamin B3', 'Aloe Vera Extract', 'Almond Oil'],
    featuresUrdu: [
      'سیاہ داغ اور چھائیاں دور کرے',
      'قدرتی موتیوں جیسی چمک',
      'سٹیرائڈ اور مرکری سے 100% پاک',
      'رات کے وقت لگانے کی نائٹ کریم'
    ],
    featuresEnglish: [
      'Fades Blemishes & Dark Spots',
      'Luminous Natural Pearl Glow',
      '100% Free from Harmful Steroids',
      'Ideal Night Repair Cream'
    ],
    emoji: '✨',
    accentColor: '#c026d3',
    bgGradient: 'from-fuchsia-950/20 via-pink-900/10 to-amber-950/10',
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80'
  }
];

export interface VoiceoverScript {
  part: number;
  visualUrdu: string;
  visualEnglish: string;
  audioUrdu: string;
  audioEnglish: string;
  speaker: string;
  highlightCategory?: string;
  badge: string;
  videoUrl?: string;
}

export const MIRACLE_VOICEOVER_SCRIPT: VoiceoverScript[] = [
  {
    part: 1,
    visualUrdu: 'قدرتی پودوں، پتوں، ایلو ویرا اور تازہ جڑی بوٹیوں کا دلکش منظر۔',
    visualEnglish: 'Beautiful close-ups of fresh herbal plants, flowers, leaves, Aloe Vera, Neem, and pure natural ingredients.',
    audioUrdu: 'کیا آپ نے کبھی سوچا ہے کہ ہماری ہر پروڈکٹ کے نام کے ساتھ لفظ Miracle کیوں لکھا ہوتا ہے؟',
    audioEnglish: 'Have you ever wondered why the word "Miracle" is written with every single product of ours?',
    speaker: 'وائس اوور (Voiceover)',
    badge: 'تعارف'
  },
  {
    part: 2,
    visualUrdu: 'ایس ایچ میریکل کی مصنوعات کا وقار کے ساتھ سامنے آنا۔',
    visualEnglish: 'Scenic concept of herbal formulation, followed by SH Miracle products appearing gracefully one by one.',
    audioUrdu: 'میریکل کا مطلب ہے معجزہ! ہم نے یہ نام صرف اچھا لگنے کے لیے نہیں رکھا، بلکہ اس کے پیچھے قدرت اور 100 فیصد خالص ہربل اجزاء پر ہمارا اٹوٹ یقین ہے۔',
    audioEnglish: 'Miracle means miraculous... We did not choose this name just because it sounds pleasant. Behind it lies our unshakeable belief faith in the power of Nature and 100% pure herbal ingredients.',
    speaker: 'وائس اوور (Voiceover)',
    highlightCategory: 'brand-philosophy',
    badge: 'برانڈ وژن'
  },
  {
    part: 3,
    visualUrdu: 'صابنوں کے فائدے، 18 جڑی بوٹیوں والا شیمپو اور خالص عرق گلاب۔',
    visualEnglish: 'Showcase of individual soap benefits, shampoo 18-herbs power, and rose water hydration.',
    audioUrdu: 'ہمارا ہر صابن اور پروڈکٹ ہاتھوں سے خالص کولڈ پریسڈ تیلوں اور دیسی بوٹیوں سے تیار کی جاتی ہے تاکہ آپ کی جلد اور بالوں کو کیمیکل کے بغیر مکمل قدرتی نکھار مل سکے!',
    audioEnglish: 'Every soap and product of ours is handcrafted with pure cold-pressed oils and native herbs to give your skin and hair complete protection and genuine natural radiance!',
    speaker: 'وائس اوور (Voiceover)',
    badge: 'خالص معیار'
  }
];
