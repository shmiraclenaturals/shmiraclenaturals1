import React, { useState, useMemo, useEffect } from 'react';
import { SOAP_VARIANTS, CATEGORIES, SoapVariant, StoreCategoryItem, matchesProductCategory } from './data/soaps';
import { SH_MIRACLE_PRODUCTS, MIRACLE_VOICEOVER_SCRIPT, MiracleProduct, VoiceoverScript } from './data/shMiracleProducts';
import { SiteConfig, DEFAULT_SITE_CONFIG } from './data/siteConfig';
import { saveVideoBlobToDB, loadVideoBlobUrlFromDB, deleteVideoFromDB, clearAllVideosFromDB } from './utils/videoStorage';
import { Navbar, CurrentPageView } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutUsSection } from './components/AboutUsSection';
import { CustomerServiceSection } from './components/CustomerServiceSection';
import { SoapCard } from './components/SoapCard';
import { SkinQuizModal } from './components/SkinQuizModal';
import { CompareDrawer } from './components/CompareDrawer';
import { CartOrderModal, CartItem } from './components/CartOrderModal';
import { AdminPanelModal, ADMIN_CATEGORY_OPTIONS } from './components/AdminPanelModal';
import { AiAgentWidget } from './components/AiAgentWidget';
import { Footer } from './components/Footer';
import { Sparkles, Home, Search } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [langMode, setLangMode] = useState<'ur' | 'en' | 'bi'>('en');
  const [currentPageView, setCurrentPageView] = useState<CurrentPageView>('home');

  // Dynamic Product State with LocalStorage Persistence
  const [soapsList, setSoapsList] = useState<SoapVariant[]>(() => {
    const saved = localStorage.getItem('sufi_soaps_custom');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SOAP_VARIANTS;
  });

  const [miracleList, setMiracleList] = useState<MiracleProduct[]>(() => {
    const saved = localStorage.getItem('sh_miracle_custom');
    if (saved) {
      try {
        const parsed: MiracleProduct[] = JSON.parse(saved);
        return parsed.map((m) => {
          if (m.id === 'miracle-shampoo' && m.category === 'hair') {
            return { ...m, category: 'shampoos' };
          }
          if (m.id === 'miracle-hair-oil' && m.category === 'hair') {
            return { ...m, category: 'oils' };
          }
          return m;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return SH_MIRACLE_PRODUCTS;
  });

  // Dynamic Categories State with LocalStorage Persistence
  const [customCategories, setCustomCategories] = useState<StoreCategoryItem[]>(() => {
    const saved = localStorage.getItem('sufi_custom_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ADMIN_CATEGORY_OPTIONS;
  });

  useEffect(() => {
    localStorage.setItem('sufi_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  // Dynamic Entire Website CMS Configuration State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('sh_miracle_site_config_v1');
    if (saved) {
      try {
        return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SITE_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('sh_miracle_site_config_v1', JSON.stringify(siteConfig));
  }, [siteConfig]);

  // Brand Story Voiceover & Videos State (Part 1, Part 2, Part 3)
  const [voiceoverScripts, setVoiceoverScripts] = useState<VoiceoverScript[]>(() => {
    const saved = localStorage.getItem('sh_miracle_voiceover_scripts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return MIRACLE_VOICEOVER_SCRIPT;
  });

  // Load any uploaded video files from IndexedDB for Part 1, Part 2, and Part 3
  useEffect(() => {
    let isMounted = true;
    async function hydrateUploadedVideos() {
      const blobUrls: Record<number, string | null> = {};
      for (const part of [1, 2, 3]) {
        blobUrls[part] = await loadVideoBlobUrlFromDB(part);
      }
      if (!isMounted) return;
      setVoiceoverScripts((prev) =>
        prev.map((s) => {
          const dbUrl = blobUrls[s.part];
          if (dbUrl) {
            return { ...s, videoUrl: dbUrl };
          }
          return s;
        })
      );
    }
    hydrateUploadedVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to LocalStorage whenever products or scripts update
  useEffect(() => {
    localStorage.setItem('sufi_soaps_custom', JSON.stringify(soapsList));
  }, [soapsList]);

  useEffect(() => {
    localStorage.setItem('sh_miracle_custom', JSON.stringify(miracleList));
  }, [miracleList]);

  useEffect(() => {
    // Persist non-blob URLs and script text to localStorage (blob videos are persisted in IndexedDB)
    const serializable = voiceoverScripts.map((s) => ({
      ...s,
      videoUrl: s.videoUrl && s.videoUrl.startsWith('blob:') ? undefined : s.videoUrl,
    }));
    localStorage.setItem('sh_miracle_voiceover_scripts', JSON.stringify(serializable));
  }, [voiceoverScripts]);

  // Shop WhatsApp Number State (Default set to 03301285975)
  const [shopNumber, setShopNumber] = useState<string>(() => {
    const saved = localStorage.getItem('sufi_shop_whatsapp');
    if (!saved || saved === '03237894220' || saved === '923000000000') {
      return '03301285975';
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('sufi_shop_whatsapp', shopNumber);
  }, [shopNumber]);

  // Shop Email State (Default set to sufinatural1@gmail.com)
  const [shopEmail, setShopEmail] = useState<string>(() => {
    const saved = localStorage.getItem('sufi_shop_email');
    if (!saved || saved === 'info@sufinaturalsoaps.com' || saved === 'swfyswfyyqwb@gmail.com') {
      return 'sufinatural1@gmail.com';
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('sufi_shop_email', shopEmail);
  }, [shopEmail]);

  // Modals & Drawers
  const [selectedSoap, setSelectedSoap] = useState<SoapVariant | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Discreet admin panel shortcuts: Ctrl+Shift+A or Alt+A or URL ?admin=true / #admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (((e.ctrlKey || e.metaKey || e.altKey) && (e.key === 'a' || e.key === 'A') && e.shiftKey) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Check URL params (?admin=1 or #admin)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('admin') === '1' || searchParams.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    } catch (err) {
      console.error(err);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Compare State
  const [comparedSoapIds, setComparedSoapIds] = useState<number[]>([]);

  // Product Admin Actions
  const handleUpdateSoap = (updatedSoap: SoapVariant) => {
    setSoapsList(prev => prev.map(s => (s.id === updatedSoap.id ? updatedSoap : s)));
  };

  const handleUpdateMiracleProduct = (updatedMiracle: MiracleProduct) => {
    setMiracleList(prev => prev.map(m => (m.id === updatedMiracle.id ? updatedMiracle : m)));
  };

  // Voiceover & Video Handlers (Part 1, Part 2, Part 3)
  const handleUpdateVoiceoverScript = (updatedScript: VoiceoverScript) => {
    setVoiceoverScripts((prev) =>
      prev.map((s) => (s.part === updatedScript.part ? updatedScript : s))
    );
  };

  const handleUploadPartVideoFile = async (partNumber: number, file: File) => {
    const blobUrl = await saveVideoBlobToDB(partNumber, file);
    setVoiceoverScripts((prev) =>
      prev.map((s) => (s.part === partNumber ? { ...s, videoUrl: blobUrl } : s))
    );
  };

  const handleRemovePartVideo = async (partNumber: number) => {
    await deleteVideoFromDB(partNumber);
    setVoiceoverScripts((prev) =>
      prev.map((s) => (s.part === partNumber ? { ...s, videoUrl: undefined } : s))
    );
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('sufi_soaps_custom');
    localStorage.removeItem('sh_miracle_custom');
    localStorage.removeItem('sh_miracle_voiceover_scripts');
    localStorage.removeItem('sufi_custom_categories');
    localStorage.removeItem('sh_miracle_site_config_v1');
    clearAllVideosFromDB();
    setSoapsList(SOAP_VARIANTS);
    setMiracleList(SH_MIRACLE_PRODUCTS);
    setVoiceoverScripts(MIRACLE_VOICEOVER_SCRIPT);
    setCustomCategories(ADMIN_CATEGORY_OPTIONS);
    setSiteConfig(DEFAULT_SITE_CONFIG);
  };

  const handleAddCategory = (newCat: StoreCategoryItem) => {
    setCustomCategories((prev) => {
      if (prev.some((c) => c.id === newCat.id)) return prev;
      return [...prev, newCat];
    });
  };

  const handleDeleteCategory = (catId: string) => {
    setCustomCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const handleAddNewProduct = (newProd: SoapVariant) => {
    setSoapsList(prev => [newProd, ...prev]);
  };

  const handleDeleteSoap = (soapId: number) => {
    setSoapsList(prev => prev.filter(s => s.id !== soapId));
  };

  const handleDeleteMiracleProduct = (id: string) => {
    setMiracleList(prev => prev.filter(m => m.id !== id));
  };

  // Helper to convert MiracleProduct to SoapVariant interface for unified display
  const convertMiracleToSoap = (m: MiracleProduct): SoapVariant => {
    const numericId = Math.abs(m.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) + 500;
    
    let deptCategory = m.category || 'skincare';
    if (!m.category) {
      if (m.id.includes('shampoo')) deptCategory = 'shampoos';
      else if (m.id.includes('oil')) deptCategory = 'oils';
      else if (m.id.includes('soap')) deptCategory = 'soaps';
      else deptCategory = 'skincare';
    }

    return {
      id: numericId,
      slug: m.id,
      nameUrdu: m.nameUrdu,
      nameEnglish: m.nameEnglish,
      shortBenefitUrdu: m.descriptionUrdu.slice(0, 80) + '...',
      shortBenefitEnglish: m.descriptionEnglish.slice(0, 90) + '...',
      fullBenefitUrdu: m.descriptionUrdu,
      fullBenefitEnglish: m.descriptionEnglish,
      emoji: m.emoji,
      badge: m.badgeEnglish,
      badgeUrdu: m.badgeUrdu,
      skinTypesUrdu: ['تمام اقسام کی جلد اور بال'],
      skinTypesEnglish: ['All Skin & Hair Types'],
      keyIngredientsUrdu: m.keyIngredientsUrdu,
      keyIngredientsEnglish: m.keyIngredientsEnglish,
      category: deptCategory as any,
      accentColor: m.accentColor,
      bgGradient: m.bgGradient,
      pricePkr: m.pricePkr,
      weightGrams: 100,
      howToUseUrdu: 'روزانہ معمول کے مطابق استعمال کریں۔',
      howToUseEnglish: 'Apply daily as directed for best organic results.',
      imageUrl: m.imageUrl,
      featuredInPrompt: false,
    };
  };

  // Unified list of all products for catalog display
  const allDisplayableProducts: SoapVariant[] = useMemo(() => {
    const convertedMiracles = miracleList.map(convertMiracleToSoap);
    return [...soapsList, ...convertedMiracles];
  }, [soapsList, miracleList]);

  // Strict, unified Category Filter Logic (matches exact selected category)
  const filteredSoaps = useMemo(() => {
    return allDisplayableProducts.filter((product) => {
      if (!matchesProductCategory(product, activeCategory)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          product.nameEnglish.toLowerCase().includes(q) ||
          product.nameUrdu.toLowerCase().includes(q) ||
          product.shortBenefitEnglish.toLowerCase().includes(q) ||
          product.shortBenefitUrdu.toLowerCase().includes(q) ||
          product.fullBenefitEnglish.toLowerCase().includes(q) ||
          product.keyIngredientsEnglish.some((ing) => ing.toLowerCase().includes(q)) ||
          product.skinTypesEnglish.some((st) => st.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [allDisplayableProducts, activeCategory, searchQuery]);

  // Cart Actions
  const handleAddToCart = (soap: SoapVariant, qty = 1, openCheckout = false) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.soap.id === soap.id);
      if (existing) {
        return prev.map((item) =>
          item.soap.id === soap.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prev, { soap, quantity: qty }];
      }
    });

    if (openCheckout) {
      setSelectedSoap(null);
      setIsCartOpen(true);
    }
  };

  const handleUpdateQuantity = (soapId: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(soapId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.soap.id === soapId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveFromCart = (soapId: number) => {
    setCartItems((prev) => prev.filter((item) => item.soap.id !== soapId));
  };

  // Compare Actions
  const handleToggleCompare = (soap: SoapVariant) => {
    setComparedSoapIds((prev) => {
      if (prev.includes(soap.id)) {
        return prev.filter((id) => id !== soap.id);
      } else {
        if (prev.length >= 3) {
          return [...prev.slice(1), soap.id];
        }
        return [...prev, soap.id];
      }
    });
  };

  const comparedSoaps = useMemo(() => {
    return soapsList.filter((s) => comparedSoapIds.includes(s.id));
  }, [soapsList, comparedSoapIds]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Open Dedicated Product Page
  const handleOpenProductPage = (soap: SoapVariant) => {
    setSelectedSoap(soap);
    setCurrentPageView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Products Catalog Page
  const handleNavigateToProducts = (cat?: string) => {
    if (cat) setActiveCategory(cat);
    setCurrentPageView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Miracle Product Cart Handler -> Opens Dedicated Product Page
  const handleAddMiracleProductToCart = (item: { id: string; nameUrdu: string; nameEnglish: string; pricePkr: number; emoji: string }) => {
    const numericId = Math.abs(item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) + 500;
    const existingDisplayable = allDisplayableProducts.find((p) => p.id === numericId || p.slug === item.id);
    if (existingDisplayable) {
      handleOpenProductPage(existingDisplayable);
      return;
    }
    const convertedSoap: SoapVariant = {
      id: numericId,
      slug: item.id,
      nameUrdu: item.nameUrdu,
      nameEnglish: item.nameEnglish,
      shortBenefitUrdu: 'SH Miracle 100% خالص ہربل پروڈکٹ',
      shortBenefitEnglish: 'SH Miracle 100% Organic Herbal Product',
      fullBenefitUrdu: `${item.nameUrdu} - قدرتی جڑی بوٹیوں سے تیار کردہ خالص فارمولیشن۔`,
      fullBenefitEnglish: `${item.nameEnglish} - Handcrafted with pure herbs and cold-pressed natural oils.`,
      emoji: item.emoji,
      badge: 'SH Miracle Range',
      badgeUrdu: 'میریکل رینج',
      skinTypesUrdu: ['تمام اقسام کی جلد اور بال'],
      skinTypesEnglish: ['All Skin & Hair Types'],
      keyIngredientsUrdu: ['خالص جڑی بوٹیاں اور قدرتی تیل'],
      keyIngredientsEnglish: ['Pure Organic Native Herbs'],
      category: 'brightening',
      accentColor: '#15803d',
      bgGradient: 'from-emerald-900/10 via-amber-800/5 to-transparent',
      pricePkr: item.pricePkr,
      weightGrams: 100,
      howToUseUrdu: 'روزانہ معمول کے مطابق استعمال کریں۔',
      howToUseEnglish: 'Apply daily as directed.'
    };
    handleOpenProductPage(convertedSoap);
  };

  const activePrimary = siteConfig.primaryColor || '#00368B';
  const activeAccent = siteConfig.accentColor || '#fab528';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {activePrimary.toLowerCase() !== '#00368b' && (
        <style>{`
          .bg-\\[\\#00368B\\] { background-color: ${activePrimary} !important; }
          .text-\\[\\#00368B\\] { color: ${activePrimary} !important; }
          .border-\\[\\#00368B\\] { border-color: ${activePrimary} !important; }
          .hover\\:bg-\\[\\#00368B\\]:hover { background-color: ${activePrimary} !important; }
          .hover\\:border-\\[\\#00368B\\]:hover { border-color: ${activePrimary} !important; }
          .from-\\[\\#002868\\], .via-\\[\\#00368B\\], .to-\\[\\#0a4da8\\], .from-\\[\\#002259\\]\\/95, .via-\\[\\#00368B\\]\\/85 {
            --tw-gradient-from: ${activePrimary} !important;
            --tw-gradient-via: ${activePrimary} !important;
            --tw-gradient-to: ${activePrimary}dd !important;
          }
          .bg-\\[\\#fab528\\] { background-color: ${activeAccent} !important; }
          .text-\\[\\#fab528\\] { color: ${activeAccent} !important; }
        `}</style>
      )}
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentPageView}
        setCurrentView={setCurrentPageView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        langMode={langMode}
        setLangMode={setLangMode}
        openQuiz={() => setIsQuizOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        compareCount={comparedSoapIds.length}
        openCompare={() => setIsCompareOpen(true)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={customCategories}
        shopNumber={shopNumber}
        siteConfig={siteConfig}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPageView === 'about' ? (
          <AboutUsSection
            langMode={langMode}
            onNavigateToShop={() => handleNavigateToProducts('all')}
            shopNumber={shopNumber}
            siteConfig={siteConfig}
          />
        ) : currentPageView === 'service' ? (
          <CustomerServiceSection
            langMode={langMode}
            shopNumber={shopNumber}
            shopEmail={shopEmail}
            onNavigateToShop={() => handleNavigateToProducts('all')}
            siteConfig={siteConfig}
          />
        ) : currentPageView === 'product-detail' && selectedSoap ? (
          <ProductDetailPage
            soap={selectedSoap}
            allProducts={allDisplayableProducts}
            onBackToProducts={() => handleNavigateToProducts()}
            onBackToHome={() => {
              setCurrentPageView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleOpenProductPage}
            onOrderNow={(s, qty) => handleAddToCart(s, qty, true)}
            isInCart={cartItems.some((i) => i.soap.id === selectedSoap.id)}
            onToggleCompare={handleToggleCompare}
            comparedSoapIds={comparedSoapIds}
            langMode={langMode}
          />
        ) : currentPageView === 'products' ? (
          /* DEDICATED PRODUCTS CATALOG PAGE (dhamart.pk / Farmart Style) */
          <div className="bg-[#f4f6f9] min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-300">
              
              {/* Top White Header Card with Breadcrumb & Search */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                
                {/* Breadcrumb & Back to Home */}
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPageView('home')}
                      className="hover:text-[#00368B] flex items-center gap-1 font-semibold"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>{langMode === 'ur' ? 'ہوم پیج' : 'Home'}</span>
                    </button>
                    <span>/</span>
                    <span className="text-[#00368B] font-bold">
                      {langMode === 'ur' ? 'تمام پروڈکٹس کیٹلاگ' : 'All Products Catalog'}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPageView('home')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#00368B] text-slate-700 hover:text-white font-bold transition-colors"
                  >
                    {langMode === 'ur' ? '← واپس ہوم پیج' : '← Back to Home'}
                  </button>
                </div>

                {/* Title & Quick Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                      <span>{langMode === 'ur' ? 'تمام ہربل مصنوعات کا کیٹلاگ' : 'Shop All Organic Products'}</span>
                      <span className="text-xs bg-blue-50 text-[#00368B] px-3 py-1 rounded-full border border-blue-200 font-bold">
                        {filteredSoaps.length} {langMode === 'ur' ? 'مصنوعات' : 'Items'}
                      </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 pt-1">
                      {langMode === 'ur' 
                        ? 'کسی بھی پروڈکٹ پر کلک کریں تاکہ اس کا مکمل تفصیلی پیج کھل جائے'
                        : 'Click any product card to open its full Product Detail Page and place your COD order.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Direct Category Dropdown Selector */}
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="px-3.5 py-2.5 text-xs font-extrabold text-slate-900 bg-blue-50/70 rounded-xl border-2 border-[#00368B] focus:outline-none cursor-pointer"
                    >
                      {[
                        { id: 'all', labelEn: '🛍️ All Categories', labelUr: '🛍️ تمام کیٹیگریز' },
                        { id: 'soaps', labelEn: '🧼 Herbal Soaps', labelUr: '🧼 ہربل صابن' },
                        { id: 'shampoos', labelEn: '🧴 Shampoos', labelUr: '🧴 شیمپوز' },
                        { id: 'oils', labelEn: '🌿 Hair Oils', labelUr: '🌿 ہیئر آئل' },
                        { id: 'skincare', labelEn: '✨ Skincare', labelUr: '✨ سکن کیئر' },
                        ...customCategories
                          .filter((c) => !['all', 'soaps', 'shampoos', 'oils', 'skincare'].includes(c.id))
                          .map((c) => ({
                            id: c.id,
                            labelEn: `${c.icon} ${c.labelEnglish.split('(')[0].trim()}`,
                            labelUr: `${c.icon} ${c.labelUrdu}`,
                          })),
                      ].map((cat) => {
                        const count = allDisplayableProducts.filter((p) => matchesProductCategory(p, cat.id)).length;
                        return (
                          <option key={cat.id} value={cat.id}>
                            {langMode === 'ur' ? cat.labelUr : cat.labelEn} ({count})
                          </option>
                        );
                      })}
                    </select>

                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={langMode === 'ur' ? 'پروڈکٹ تلاش کریں...' : 'Search soaps, shampoos, oils...'}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00368B]"
                      />
                    </div>

                    <button
                      onClick={() => setIsQuizOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#fab528] hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{langMode === 'ur' ? 'سکن ٹیسٹ' : 'Skin Quiz'}</span>
                    </button>
                  </div>
                </div>

                {/* Department & Concern Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
                  {[
                    { id: 'all', labelEn: '🛍️ All Products', labelUr: '🛍️ تمام مصنوعات' },
                    { id: 'soaps', labelEn: '🧼 Herbal Soaps', labelUr: '🧼 ہربل صابن' },
                    { id: 'shampoos', labelEn: '🧴 Shampoos', labelUr: '🧴 شیمپوز' },
                    { id: 'oils', labelEn: '🌿 Hair Oils', labelUr: '🌿 ہیئر آئل' },
                    { id: 'skincare', labelEn: '✨ Skincare', labelUr: '✨ سکن کیئر' },
                    ...customCategories
                      .filter((c) => !['all', 'soaps', 'shampoos', 'oils', 'skincare'].includes(c.id))
                      .map((c) => ({
                        id: c.id,
                        labelEn: `${c.icon} ${c.labelEnglish.split('(')[0].trim()}`,
                        labelUr: `${c.icon} ${c.labelUrdu}`,
                      })),
                  ].map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const count = allDisplayableProducts.filter((p) => matchesProductCategory(p, cat.id)).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#00368B] text-white border-[#00368B] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {langMode === 'ur' ? cat.labelUr : cat.labelEn} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Result Feedback */}
              {searchQuery && (
                <div className="flex items-center justify-between bg-blue-50 p-3.5 rounded-2xl border border-blue-200 text-xs text-[#00368B]">
                  <span>
                    {langMode === 'ur' ? 'تلاش کے نتائج برائے:' : 'Search results for:'} <strong>"{searchQuery}"</strong> ({filteredSoaps.length} {langMode === 'ur' ? 'پراڈکٹس ملے' : 'products found'})
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#00368B] hover:underline font-bold"
                  >
                    {langMode === 'ur' ? 'تلاش ختم کریں' : 'Clear search'}
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {filteredSoaps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredSoaps.map((soap) => (
                    <SoapCard
                      key={soap.id}
                      soap={soap}
                      langMode={langMode}
                      onSelect={(s) => handleOpenProductPage(s)}
                      onAddToCart={(s) => handleOpenProductPage(s)}
                      isInCart={cartItems.some((item) => item.soap.id === soap.id)}
                      onToggleCompare={(s) => handleToggleCompare(s)}
                      isCompared={comparedSoapIds.includes(soap.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto">
                    🔍
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {langMode === 'ur' ? 'کوئی پروڈکٹ نہیں ملا' : 'No products found'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {langMode === 'ur' 
                      ? 'براہ کرم کوئی دوسرا لفظ تلاش کریں یا کیٹیگری فلٹر ختم کریں۔' 
                      : 'Please try searching for another term or reset your category filter.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-5 py-2.5 bg-[#00368B] text-white font-bold rounded-xl text-xs"
                  >
                    {langMode === 'ur' ? 'تمام مصنوعات دکھائیں' : 'Show All Products'}
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* DEDICATED HOME PAGE */
          <HomePage
            langMode={langMode}
            allProducts={allDisplayableProducts}
            miracleProducts={miracleList}
            voiceoverScripts={voiceoverScripts}
            siteConfig={siteConfig}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            categories={customCategories}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onNavigateToProducts={handleNavigateToProducts}
            onNavigateToAbout={() => {
              setCurrentPageView('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToService={() => {
              setCurrentPageView('service');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleOpenProductPage}
            onSelectMiracleProduct={handleAddMiracleProductToCart}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            cartItems={cartItems}
            onToggleCompare={handleToggleCompare}
            comparedSoapIds={comparedSoapIds}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        shopPhone={shopNumber}
        shopEmail={shopEmail}
        onOpenAdmin={() => setIsAdminOpen(true)}
        langMode={langMode}
        onNavigateView={(view) => setCurrentPageView(view)}
        siteConfig={siteConfig}
      />

      {/* Modals and Drawers */}
      <SkinQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectSoap={(soap) => handleOpenProductPage(soap)}
        langMode={langMode}
      />

      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedSoaps={comparedSoaps}
        onRemove={(id) => setComparedSoapIds((prev) => prev.filter((i) => i !== id))}
        onClear={() => setComparedSoapIds([])}
        onSelectSoap={(soap) => handleOpenProductPage(soap)}
        langMode={langMode}
      />

      <CartOrderModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
        shopNumber={shopNumber}
        langMode={langMode}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        soaps={soapsList}
        miracleProducts={miracleList}
        categories={customCategories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        siteConfig={siteConfig}
        onUpdateSiteConfig={setSiteConfig}
        voiceoverScripts={voiceoverScripts}
        onUpdateVoiceoverScript={handleUpdateVoiceoverScript}
        onUploadPartVideoFile={handleUploadPartVideoFile}
        onRemovePartVideo={handleRemovePartVideo}
        onUpdateSoap={handleUpdateSoap}
        onUpdateMiracleProduct={handleUpdateMiracleProduct}
        onResetDefaults={handleResetDefaults}
        onAddNewProduct={handleAddNewProduct}
        onDeleteSoap={handleDeleteSoap}
        onDeleteMiracleProduct={handleDeleteMiracleProduct}
        shopNumber={shopNumber}
        onUpdateShopNumber={(num) => setShopNumber(num)}
        shopEmail={shopEmail}
        onUpdateShopEmail={(email) => setShopEmail(email)}
        langMode={langMode}
      />

      {/* 24/7 AI Sales Agent & WhatsApp Order Assistant */}
      <AiAgentWidget
        soaps={soapsList}
        miracleProducts={miracleList}
        langMode={langMode}
        shopNumber={shopNumber}
        onUpdateShopNumber={(num) => setShopNumber(num)}
      />

    </div>
  );
}
