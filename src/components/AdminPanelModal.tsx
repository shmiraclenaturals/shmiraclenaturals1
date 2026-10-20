import React, { useState } from 'react';
import { SoapVariant, StoreCategoryItem, matchesProductCategory } from '../data/soaps';
import { MiracleProduct, VoiceoverScript, MIRACLE_VOICEOVER_SCRIPT } from '../data/shMiracleProducts';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../data/siteConfig';
import { WordPressProductEditor, WPProductFormValues } from './WordPressProductEditor';
import {
  Edit3,
  Save,
  RotateCcw,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Package,
  Upload,
  Camera,
  RefreshCw,
  Video,
  Eye,
  Layers,
  Globe,
  Palette,
  PhoneCall,
  Mail,
  MapPin,
  Zap,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  soaps: SoapVariant[];
  miracleProducts: MiracleProduct[];
  categories?: StoreCategoryItem[];
  onAddCategory?: (newCat: StoreCategoryItem) => void;
  onDeleteCategory?: (catId: string) => void;
  siteConfig?: SiteConfig;
  onUpdateSiteConfig?: (newConfig: SiteConfig) => void;
  voiceoverScripts?: VoiceoverScript[];
  onUpdateVoiceoverScript?: (updatedScript: VoiceoverScript) => void;
  onUploadPartVideoFile?: (partNumber: number, file: File) => Promise<void>;
  onRemovePartVideo?: (partNumber: number) => Promise<void>;
  onUpdateSoap: (updatedSoap: SoapVariant) => void;
  onUpdateMiracleProduct: (updatedMiracle: MiracleProduct) => void;
  onResetDefaults: () => void;
  onAddNewProduct: (newProd: SoapVariant) => void;
  onDeleteSoap?: (soapId: number) => void;
  onDeleteMiracleProduct?: (id: string) => void;
  shopNumber?: string;
  onUpdateShopNumber?: (num: string) => void;
  shopEmail?: string;
  onUpdateShopEmail?: (email: string) => void;
  langMode?: 'ur' | 'en' | 'bi';
}

export type ProductType = 'soap' | 'miracle';

export interface UnifiedProductItem {
  id: string | number;
  originalId: string | number;
  type: ProductType;
  nameEnglish: string;
  nameUrdu: string;
  pricePkr: number;
  imageUrl?: string;
  emoji: string;
  category: string;
  badge: string;
  badgeUrdu: string;
  shortBenefitEnglish: string;
  shortBenefitUrdu: string;
  fullBenefitEnglish?: string;
  fullBenefitUrdu?: string;
  sizeOrWeight: string;
}

type AdminTab = 'live-website' | 'all-products' | 'add-product' | 'edit-product' | 'categories' | 'brand-videos';

// Default comprehensive category options for products
export const ADMIN_CATEGORY_OPTIONS: StoreCategoryItem[] = [
  { id: 'brightening', labelEnglish: 'Skin Brightening & Glow', labelUrdu: 'رنگ گورا اور نکھار (وائٹننگ)', icon: '✨' },
  { id: 'acne', labelEnglish: 'Anti-Acne & Neem Care', labelUrdu: 'کیل مہاسے اور نیم کیئر', icon: '🍃' },
  { id: 'moisture', labelEnglish: 'Deep Moisture & Winter Care', labelUrdu: 'خشکی اور گہری نمی', icon: '💧' },
  { id: 'detox', labelEnglish: 'Charcoal & Pore Detox', labelUrdu: 'گہری صفائی اور تیل کنٹرول', icon: '🌑' },
  { id: 'soothing', labelEnglish: 'Refreshing & Floral Soothing', labelUrdu: 'سکون اور ٹھنڈک', icon: '🌸' },
  { id: 'soaps', labelEnglish: 'Herbal Soaps Department', labelUrdu: 'ہربل صابن (Soaps)', icon: '🧼' },
  { id: 'shampoos', labelEnglish: 'Miracle Shampoos', labelUrdu: 'ہربل شیمپوز (Shampoos)', icon: '🧴' },
  { id: 'oils', labelEnglish: 'Herbal Hair Oils', labelUrdu: 'ہیئر آئل اور تیل (Hair Oils)', icon: '🌿' },
  { id: 'hair', labelEnglish: 'Hair Care Range', labelUrdu: 'ہیئر کیئر رینج', icon: '💆‍♀️' },
  { id: 'skincare', labelEnglish: 'Skincare & Creams', labelUrdu: 'سکن کیئر اور کریم', icon: '✨' },
  { id: 'spray', labelEnglish: 'Rose Water & Facial Sprays', labelUrdu: 'عرق گلاب سپرے', icon: '🌹' },
];

const THEME_PRESETS = [
  { name: 'Dhamart Blue (ڈیفالٹ بلیو)', primary: '#00368B', accent: '#fab528' },
  { name: 'Organic Green (آرگینک گرین)', primary: '#065f46', accent: '#fab528' },
  { name: 'Royal Black & Gold (بلیک گولڈ)', primary: '#18181b', accent: '#f59e0b' },
  { name: 'Crimson Mart (ریڈ مارٹ)', primary: '#991b1b', accent: '#fbbf24' },
  { name: 'Royal Purple (رائل پرپل)', primary: '#4c1d95', accent: '#facc15' },
];

// Compress and convert image file to optimized Base64 Data URL
const processUploadedImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('براہ کرم درست تصویر (JPG, PNG, WebP) سلیکٹ کریں'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('تصویر لوڈ کرنے میں مسئلہ آیا'));
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  soaps,
  miracleProducts,
  categories,
  onAddCategory,
  onDeleteCategory,
  siteConfig = DEFAULT_SITE_CONFIG,
  onUpdateSiteConfig,
  voiceoverScripts = MIRACLE_VOICEOVER_SCRIPT,
  onUpdateVoiceoverScript,
  onUploadPartVideoFile,
  onRemovePartVideo,
  onUpdateSoap,
  onUpdateMiracleProduct,
  onResetDefaults,
  onAddNewProduct,
  onDeleteSoap,
  onDeleteMiracleProduct,
  shopNumber = '03301285975',
  onUpdateShopNumber,
  shopEmail = 'sufinatural1@gmail.com',
  onUpdateShopEmail,
}) => {
  // Default directly to LIVE VISUAL WEBSITE EDITOR so the user sees the whole website!
  const [activeTab, setActiveTab] = useState<AdminTab>('live-website');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');
  const [uploadingVideoPart, setUploadingVideoPart] = useState<number | null>(null);
  const [videoUrlInputs, setVideoUrlInputs] = useState<Record<number, string>>({});

  // WordPress-style Edit Product state
  const [editingItem, setEditingItem] = useState<UnifiedProductItem | null>(null);

  // Add New Product state
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdNameUrdu, setNewProdNameUrdu] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(250);
  const [newProdWeight, setNewProdWeight] = useState<number>(100);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<string>('brightening');
  const [newProdBenefitEn, setNewProdBenefitEn] = useState('');
  const [newProdBenefitUrdu, setNewProdBenefitUrdu] = useState('');

  // New Category Form state
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameUr, setNewCatNameUr] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🌿');

  if (!isOpen) return null;

  const primaryColor = siteConfig.primaryColor || '#00368B';
  const accentColor = siteConfig.accentColor || '#fab528';

  const showToast = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  // Helper to update siteConfig easily
  const updateSite = (patch: Partial<SiteConfig>) => {
    if (onUpdateSiteConfig) {
      onUpdateSiteConfig({ ...siteConfig, ...patch });
    }
  };

  // Merge built-in category options with any custom categories (deduplicated by id)
  const allCategoryOptions: StoreCategoryItem[] = Array.from(
    new Map(
      [
        ...ADMIN_CATEGORY_OPTIONS,
        ...(categories || []).filter((c) => c.id !== 'all'),
      ].map((c) => [c.id, c])
    ).values()
  );

  // Unified products list (20 Soaps + 8 SH Miracle items)
  const unifiedProducts: UnifiedProductItem[] = [
    ...soaps.map((s) => ({
      id: `soap-${s.id}`,
      originalId: s.id,
      type: 'soap' as ProductType,
      nameEnglish: s.nameEnglish,
      nameUrdu: s.nameUrdu,
      pricePkr: s.pricePkr,
      imageUrl: s.imageUrl,
      emoji: s.emoji,
      category: s.category,
      badge: s.badge,
      badgeUrdu: s.badgeUrdu,
      shortBenefitEnglish: s.shortBenefitEnglish,
      shortBenefitUrdu: s.shortBenefitUrdu,
      fullBenefitEnglish: s.fullBenefitEnglish,
      fullBenefitUrdu: s.fullBenefitUrdu,
      sizeOrWeight: `${s.weightGrams}g Bar`,
    })),
    ...miracleProducts.map((m) => ({
      id: `miracle-${m.id}`,
      originalId: m.id,
      type: 'miracle' as ProductType,
      nameEnglish: m.nameEnglish,
      nameUrdu: m.nameUrdu,
      pricePkr: m.pricePkr,
      imageUrl: m.imageUrl,
      emoji: m.emoji,
      category: m.category,
      badge: m.badgeEnglish,
      badgeUrdu: m.badgeUrdu,
      shortBenefitEnglish: m.descriptionEnglish,
      shortBenefitUrdu: m.descriptionUrdu,
      fullBenefitEnglish: m.descriptionEnglish,
      fullBenefitUrdu: m.descriptionUrdu,
      sizeOrWeight: m.size,
    })),
  ];

  const filteredProducts = unifiedProducts.filter((item) => {
    if (!matchesProductCategory(item, deptFilter)) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.nameEnglish.toLowerCase().includes(q) ||
      item.nameUrdu.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.pricePkr.toString().includes(q)
    );
  });

  // Build unified category filter tabs with exact product counts
  const adminFilterTabs = [
    { id: 'all', label: '🛍️ تمام پروڈکٹس (All)' },
    { id: 'soaps', label: '🧼 ہربل صابن (Soaps)' },
    { id: 'shampoos', label: '🧴 شیمپوز (Shampoos)' },
    { id: 'oils', label: '🌿 ہیئر آئل (Hair Oils)' },
    ...allCategoryOptions
      .filter((c) => !['all', 'soaps', 'shampoos', 'oils'].includes(c.id))
      .map((c) => ({
        id: c.id,
        label: `${c.icon} ${c.labelUrdu}`,
      })),
  ].map((tab) => ({
    ...tab,
    count: unifiedProducts.filter((p) => matchesProductCategory(p, tab.id)).length,
  }));

  // Direct Image Upload on any Product Card
  const handleDirectCardImageUpload = async (item: UnifiedProductItem, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processUploadedImageFile(file);
      if (item.type === 'soap') {
        const orig = soaps.find((s) => s.id === item.originalId);
        if (orig) {
          onUpdateSoap({ ...orig, imageUrl: dataUrl });
          showToast(`✅ "${item.nameEnglish}" کی تصویر بدل دی گئی!`);
        }
      } else {
        const orig = miracleProducts.find((m) => m.id === item.originalId);
        if (orig) {
          onUpdateMiracleProduct({ ...orig, imageUrl: dataUrl });
          showToast(`✅ "${item.nameEnglish}" کی تصویر بدل دی گئی!`);
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Error uploading image');
    } finally {
      e.target.value = '';
    }
  };

  // Direct Inline Update of a Product (Name, Price, Category, Benefits/Details)
  const handleInlineProductUpdate = (
    item: UnifiedProductItem,
    patch: {
      nameEnglish?: string;
      nameUrdu?: string;
      pricePkr?: number;
      category?: string;
      benefitEnglish?: string;
      benefitUrdu?: string;
    }
  ) => {
    if (item.type === 'soap') {
      const orig = soaps.find((s) => s.id === item.originalId);
      if (orig) {
        onUpdateSoap({
          ...orig,
          nameEnglish: patch.nameEnglish !== undefined ? patch.nameEnglish : orig.nameEnglish,
          nameUrdu: patch.nameUrdu !== undefined ? patch.nameUrdu : orig.nameUrdu,
          pricePkr: patch.pricePkr !== undefined ? Number(patch.pricePkr) : orig.pricePkr,
          category: patch.category !== undefined ? patch.category : orig.category,
          shortBenefitEnglish:
            patch.benefitEnglish !== undefined ? patch.benefitEnglish : orig.shortBenefitEnglish,
          fullBenefitEnglish:
            patch.benefitEnglish !== undefined ? patch.benefitEnglish : orig.fullBenefitEnglish,
          shortBenefitUrdu:
            patch.benefitUrdu !== undefined ? patch.benefitUrdu : orig.shortBenefitUrdu,
          fullBenefitUrdu:
            patch.benefitUrdu !== undefined ? patch.benefitUrdu : orig.fullBenefitUrdu,
        });
      }
    } else {
      const orig = miracleProducts.find((m) => m.id === item.originalId);
      if (orig) {
        onUpdateMiracleProduct({
          ...orig,
          nameEnglish: patch.nameEnglish !== undefined ? patch.nameEnglish : orig.nameEnglish,
          nameUrdu: patch.nameUrdu !== undefined ? patch.nameUrdu : orig.nameUrdu,
          pricePkr: patch.pricePkr !== undefined ? Number(patch.pricePkr) : orig.pricePkr,
          category: patch.category !== undefined ? patch.category : orig.category,
          descriptionEnglish:
            patch.benefitEnglish !== undefined ? patch.benefitEnglish : orig.descriptionEnglish,
          descriptionUrdu:
            patch.benefitUrdu !== undefined ? patch.benefitUrdu : orig.descriptionUrdu,
        });
      }
    }
  };

  // Save Full Edited Product via WordPress Editor
  const handleSaveWPProductEdit = (wpValues: WPProductFormValues) => {
    if (!editingItem) return;

    if (editingItem.type === 'soap') {
      const orig = soaps.find((s) => s.id === editingItem.originalId);
      if (orig) {
        onUpdateSoap({
          ...orig,
          nameEnglish: wpValues.nameEnglish,
          nameUrdu: wpValues.nameUrdu || wpValues.nameEnglish,
          category: wpValues.category,
          pricePkr: Number(wpValues.pricePkr) || orig.pricePkr,
          imageUrl: wpValues.imageUrl || undefined,
          shortBenefitEnglish: wpValues.benefitEnglish || orig.shortBenefitEnglish,
          shortBenefitUrdu: wpValues.benefitUrdu || orig.shortBenefitUrdu,
          fullBenefitEnglish: wpValues.benefitEnglish || orig.fullBenefitEnglish,
          fullBenefitUrdu: wpValues.benefitUrdu || orig.fullBenefitUrdu,
          badge: wpValues.badge || orig.badge,
        });
      }
    } else {
      const orig = miracleProducts.find((m) => m.id === editingItem.originalId);
      if (orig) {
        onUpdateMiracleProduct({
          ...orig,
          nameEnglish: wpValues.nameEnglish,
          nameUrdu: wpValues.nameUrdu || wpValues.nameEnglish,
          category: wpValues.category,
          pricePkr: Number(wpValues.pricePkr) || orig.pricePkr,
          imageUrl: wpValues.imageUrl || undefined,
          descriptionEnglish: wpValues.benefitEnglish || orig.descriptionEnglish,
          descriptionUrdu: wpValues.benefitUrdu || orig.descriptionUrdu,
          badgeEnglish: wpValues.badge || orig.badgeEnglish,
          size: wpValues.sizeOrWeight || orig.size,
        });
      }
    }

    showToast(`✅ پروڈکٹ اپڈیٹ ہو گیا: ${wpValues.nameEnglish}`);
    setEditingItem(null);
    setActiveTab('all-products');
  };

  // Publish New Product via WordPress Editor
  const handlePublishWPNewProduct = (wpValues: WPProductFormValues) => {
    if (!wpValues.nameEnglish.trim() && !wpValues.nameUrdu.trim()) return;

    const parsedWeight = parseInt(wpValues.sizeOrWeight, 10) || 100;
    const created: SoapVariant = {
      id: Date.now(),
      slug: `custom-${Date.now()}`,
      nameUrdu: wpValues.nameUrdu.trim() || wpValues.nameEnglish.trim(),
      nameEnglish: wpValues.nameEnglish.trim() || wpValues.nameUrdu.trim(),
      shortBenefitUrdu: wpValues.benefitUrdu.trim() || wpValues.benefitEnglish.trim() || '100% خالص ہربل فارمولا',
      shortBenefitEnglish: wpValues.benefitEnglish.trim() || wpValues.benefitUrdu.trim() || '100% Pure Organic Herbal Formula',
      fullBenefitUrdu: wpValues.benefitUrdu.trim() || 'قدرتی جڑی بوٹیوں اور کولڈ پریسڈ تیلوں سے تیار کردہ خالص پروڈکٹ۔',
      fullBenefitEnglish: wpValues.benefitEnglish.trim() || 'Freshly handcrafted with pure organic native herbs and cold-pressed botanical oils.',
      emoji: '🌿',
      badge: wpValues.badge || '100% Pure Herbal',
      badgeUrdu: '100% خالص ہربل',
      skinTypesUrdu: ['تمام اقسام کی جلد'],
      skinTypesEnglish: ['All Skin Types'],
      keyIngredientsUrdu: ['خالص جڑی بوٹیاں اور قدرتی تیل'],
      keyIngredientsEnglish: ['Pure Botanical Extracts & Natural Oils'],
      category: wpValues.category || 'soaps',
      accentColor: primaryColor,
      bgGradient: 'from-blue-900/10 via-amber-800/5 to-transparent',
      pricePkr: Number(wpValues.pricePkr) || 250,
      weightGrams: parsedWeight,
      howToUseUrdu: 'روزانہ چہرے اور جسم پر استعمال کریں۔',
      howToUseEnglish: 'Apply daily over wet skin, massage gently, and rinse.',
      imageUrl: wpValues.imageUrl.trim() || undefined,
    };

    onAddNewProduct(created);
    showToast('🎉 نیا پروڈکٹ کامیابی سے ویب سائٹ پر پبلش ہو گیا!');
    setActiveTab('all-products');
  };

  // Create New Custom Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameEn.trim() && !newCatNameUr.trim()) return;
    const baseName = newCatNameEn.trim() || newCatNameUr.trim();
    const id =
      baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '') || `cat_${Date.now()}`;

    const newCat: StoreCategoryItem = {
      id,
      labelEnglish: newCatNameEn.trim() || newCatNameUr.trim(),
      labelUrdu: newCatNameUr.trim() || newCatNameEn.trim(),
      icon: newCatIcon.trim() || '🌿',
    };

    if (onAddCategory) {
      onAddCategory(newCat);
    }
    setNewCatNameEn('');
    setNewCatNameUr('');
    showToast(`🗂️ نئی کیٹیگری بن گئی: "${newCat.labelUrdu}"!`);
  };

  // Handle Part 1, 2, 3 Video Upload
  const handlePartVideoFileSelect = async (partNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadPartVideoFile) return;

    setUploadingVideoPart(partNumber);
    try {
      await onUploadPartVideoFile(partNumber, file);
      showToast(`🎬 پارٹ ${partNumber} کی ویڈیو اپلوڈ اور سیو ہو گئی!`);
    } catch (err: any) {
      showToast(err?.message || `Error uploading Part ${partNumber} video`);
    } finally {
      setUploadingVideoPart(null);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#eef2f6] text-slate-800 overflow-y-auto animate-in fade-in duration-200">
      
      {/* =====================================================================
          TOP ADMIN STUDIO BAR (Super Simple, Clean Urdu + English Controls)
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b-2 border-[#fab528]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-sm"
              style={{ backgroundColor: accentColor, color: '#0f172a' }}
            >
              🛠️
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>ویب سائٹ اور پروڈکٹ کسٹمائزر (Live Website Customizer)</span>
              </h1>
              <p className="text-[11px] text-amber-300 font-medium">
                نیچے اپنی پوری ویب سائٹ دیکھیں — جس تصویر، نام، قیمت یا بینر کو بدلنا ہو اس پر کلک کریں!
              </p>
            </div>
          </div>

          {/* Center: 4 Simple Main Mode Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('live-website')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'live-website'
                  ? 'bg-[#fab528] text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>🌐 پوری ویب سائٹ ایڈٹ کریں (Full Website)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all-products')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all-products'
                  ? 'bg-[#fab528] text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>📦 صرف پروڈکٹس ({unifiedProducts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setActiveTab('add-product');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'add-product' || activeTab === 'edit-product'
                  ? 'bg-[#fab528] text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>➕ نیا پروڈکٹ ایڈ کریں (WordPress Editor)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#fab528] text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>🗂️ کیٹیگریز ({allCategoryOptions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('brand-videos')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'brand-videos'
                  ? 'bg-[#fab528] text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>🎬 ویڈیوز (Part 1, 2, 3)</span>
            </button>
          </div>

          {/* Right: Save & Exit to Live Site + Hide Admin button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                showToast('✅ تمام تبدیلیاں سیو ہو گئیں!');
                setTimeout(() => onClose(), 350);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>✅ سیو کریں اور لائیو دیکھیں</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Hide Admin Panel"
            >
              <X className="w-4 h-4" />
              <span>✖ بند کریں (Hide)</span>
            </button>
          </div>
        </div>

        {/* Sub-Bar: 1-Click Website Color Theme Picker */}
        <div className="bg-slate-800/90 border-t border-slate-700 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>ویب سائٹ کا رنگ (Theme Color):</span>
              </span>
              {THEME_PRESETS.map((preset) => {
                const isSelected = primaryColor.toLowerCase() === preset.primary.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      updateSite({ primaryColor: preset.primary, accentColor: preset.accent });
                      showToast(`🎨 ویب سائٹ کا کلر "${preset.name}" سیٹ ہو گیا!`);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-950 border-amber-400 shadow-xs'
                        : 'bg-slate-900/70 text-slate-200 border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full inline-block border border-white/40"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span>{preset.name}</span>
                  </button>
                );
              })}

              {/* Custom Color Input */}
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-600 text-[11px] font-bold cursor-pointer">
                <span>اپنی مرضی کا کلر:</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => updateSite({ primaryColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                onResetDefaults();
                showToast('🔄 پوری ویب سائٹ اور پروڈکٹس اصلی حالت (Default) میں واپس آ گئے!');
              }}
              className="text-[11px] font-bold text-rose-300 hover:text-rose-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ری سیٹ (Reset Default)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {savedSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-2xl border-2 border-white animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* =====================================================================
          WORDPRESS EDIT PRODUCT PAGE (Opens when editing any existing product)
      ===================================================================== */}
      {activeTab === 'edit-product' && editingItem && (
        <WordPressProductEditor
          mode="edit"
          initialValues={{
            nameEnglish: editingItem.nameEnglish,
            nameUrdu: editingItem.nameUrdu,
            pricePkr: editingItem.pricePkr,
            category: editingItem.category,
            benefitUrdu: editingItem.fullBenefitUrdu || editingItem.shortBenefitUrdu,
            benefitEnglish: editingItem.fullBenefitEnglish || editingItem.shortBenefitEnglish,
            imageUrl: editingItem.imageUrl || '',
            sizeOrWeight: editingItem.sizeOrWeight,
            badge: editingItem.badge,
            tags: '100% Organic, Herbal, SH Miracle',
          }}
          categories={allCategoryOptions}
          onSave={handleSaveWPProductEdit}
          onCancel={() => {
            setEditingItem(null);
            setActiveTab('all-products');
          }}
          onDelete={() => {
            if (editingItem.type === 'soap' && onDeleteSoap) {
              onDeleteSoap(Number(editingItem.originalId));
            } else if (editingItem.type === 'miracle' && onDeleteMiracleProduct) {
              onDeleteMiracleProduct(String(editingItem.originalId));
            }
            showToast(`🗑️ "${editingItem.nameEnglish}" ڈیلیٹ کر دیا گیا`);
            setEditingItem(null);
            setActiveTab('all-products');
          }}
          onAddCategory={onAddCategory}
          onUploadImageFile={processUploadedImageFile}
          onNavigateTab={(tab) => {
            setEditingItem(null);
            setActiveTab(tab);
          }}
          onCloseAdmin={onClose}
        />
      )}

      {/* =====================================================================
          TAB 1 (DEFAULT): LIVE VISUAL WEBSITE CUSTOMIZER
          Shows the ACTUAL WEBSITE visually so the user can edit everything in-place!
      ===================================================================== */}
      {activeTab === 'live-website' && (
        <div className="pb-16 space-y-8">
          
          {/* =================================================================
              LIVE WEBSITE HEADER (Edit Logo, Store Name, Tagline, Phone in-place!)
          ================================================================= */}
          <div className="bg-white shadow-md border-b border-slate-200">
            
            {/* Top Utility Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                  <span className="px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-black text-[10px] shrink-0">
                    ✏️ ٹاپ لائن ایڈٹ کریں:
                  </span>
                  <input
                    type="text"
                    value={siteConfig.topBarAnnouncementEn}
                    onChange={(e) =>
                      updateSite({
                        topBarAnnouncementEn: e.target.value,
                        topBarAnnouncementUr: e.target.value,
                      })
                    }
                    className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00368B]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">ڈیلیوری ٹیکسٹ:</span>
                  <input
                    type="text"
                    value={siteConfig.deliveryLocationTextEn}
                    onChange={(e) =>
                      updateSite({
                        deliveryLocationTextEn: e.target.value,
                        deliveryLocationTextUr: e.target.value,
                      })
                    }
                    className="w-44 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Middle Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
              
              {/* Left: Editable Logo + Editable Brand Name & Tagline */}
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold shadow-md overflow-hidden border-2 border-amber-400"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {siteConfig.logoImageUrl ? (
                      <img src={siteConfig.logoImageUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-serif font-black" style={{ color: accentColor }}>
                        {siteConfig.logoText || 'SH'}
                      </span>
                    )}
                  </div>
                  <label
                    className="mt-1.5 px-2.5 py-1 rounded-lg bg-[#fab528] hover:bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    title="لوگو کی تصویر اپلوڈ کریں"
                  >
                    <Camera className="w-3 h-3" />
                    <span>لوگو بدلیں</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const dataUrl = await processUploadedImageFile(file);
                        updateSite({ logoImageUrl: dataUrl });
                        showToast('✅ نیا لوگو اپلوڈ ہو گیا!');
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">ویب سائٹ کا نام:</span>
                    <input
                      type="text"
                      value={siteConfig.storeName}
                      onChange={(e) => updateSite({ storeName: e.target.value })}
                      className="px-3 py-1 rounded-xl border-2 border-dashed border-blue-300 focus:border-[#00368B] bg-blue-50/40 text-lg sm:text-xl font-black text-[#00368B] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">سب ٹائٹل:</span>
                    <input
                      type="text"
                      value={siteConfig.storeTaglineEn}
                      onChange={(e) =>
                        updateSite({
                          storeTaglineEn: e.target.value,
                          storeTaglineUr: e.target.value,
                        })
                      }
                      className="px-3 py-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs font-bold text-emerald-700 w-64 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Editable WhatsApp Helpline & Email directly in Header */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">
                      ✏️ واٹس ایپ آرڈر نمبر:
                    </label>
                    <input
                      type="text"
                      value={shopNumber}
                      onChange={(e) => onUpdateShopNumber && onUpdateShopNumber(e.target.value)}
                      className="w-36 px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-mono font-black text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#00368B] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">
                      ✏️ آفیشل ای میل:
                    </label>
                    <input
                      type="text"
                      value={shopEmail}
                      onChange={(e) => onUpdateShopEmail && onUpdateShopEmail(e.target.value)}
                      className="w-48 px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Bar Preview (Interactive Category Selector!) */}
            <div className="px-4 py-2.5 text-white" style={{ backgroundColor: primaryColor }}>
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <select
                    value={deptFilter}
                    onChange={(e) => {
                      setDeptFilter(e.target.value);
                      document.getElementById('admin-live-products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg font-extrabold text-slate-950 cursor-pointer focus:outline-none"
                    style={{ backgroundColor: accentColor }}
                  >
                    {adminFilterTabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>
                        {tab.label} ({tab.count})
                      </option>
                    ))}
                  </select>

                  {adminFilterTabs.slice(0, 6).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setDeptFilter(tab.id);
                        document.getElementById('admin-live-products-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                        deptFilter === tab.id
                          ? 'bg-white text-slate-950 font-black shadow-xs'
                          : 'hover:bg-white/15 text-white'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
                <span className="text-amber-300 hidden xl:inline">
                  👆 اوپر سے جو کیٹیگری سلیکٹ کریں گے وہی پروڈکٹس نیچے کھل جائیں گے
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              LIVE WEBSITE HERO BANNER + 2 RIGHT SIDE PROMO CARDS
              (Edit Photos, Titles, Subtitles & Prices directly on the Banners!)
          ================================================================= */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 bg-amber-200/80 px-3 py-1 rounded-lg">
                👇 مین ہیرو بینر اور سائیڈ کارڈز — تصویر یا لکھائی بدلنے کے لیے ڈبے میں لکھیں:
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Main Hero Banner (8 Cols) */}
              <div
                className="lg:col-span-8 relative rounded-3xl overflow-hidden text-white shadow-lg min-h-[420px] flex flex-col justify-between p-6 sm:p-10 border-4 border-white"
                style={{ backgroundColor: primaryColor }}
              >
                <img
                  src={siteConfig.heroBgImageUrl}
                  alt="Hero Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-25"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}F0, ${primaryColor}CC, transparent)`,
                  }}
                />

                {/* Top Right Photo Upload Button on Hero Banner */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300">✏️ اوپر والا چھوٹا بیج:</span>
                    <input
                      type="text"
                      value={siteConfig.heroBadgeEn}
                      onChange={(e) =>
                        updateSite({
                          heroBadgeEn: e.target.value,
                          heroBadgeUr: e.target.value,
                        })
                      }
                      className="px-3 py-1 rounded-full font-extrabold text-xs text-slate-950 focus:outline-none"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>

                  <label className="px-4 py-2 rounded-xl bg-[#fab528] hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg">
                    <Camera className="w-4 h-4" />
                    <span>📷 ہیرو بینر کی تصویر بدلیں (Upload Photo)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const dataUrl = await processUploadedImageFile(file);
                        updateSite({ heroBgImageUrl: dataUrl });
                        showToast('✅ ہیرو بینر کی تصویر اپڈیٹ ہو گئی!');
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Center Editable Hero Heading & Subtitle */}
                <div className="relative z-10 space-y-4 my-auto py-4">
                  <div>
                    <label className="text-[11px] font-bold text-amber-300 block mb-1">
                      ✏️ مین ہیرو ہیڈنگ (بڑی سرخی یہاں لکھیں):
                    </label>
                    <textarea
                      rows={2}
                      value={siteConfig.heroTitleEn}
                      onChange={(e) =>
                        updateSite({
                          heroTitleEn: e.target.value,
                          heroTitleUr: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-2xl bg-black/30 hover:bg-black/40 focus:bg-black/60 border-2 border-dashed border-white/40 focus:border-[#fab528] text-2xl sm:text-3xl font-black text-white leading-tight focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-amber-300 block mb-1">
                      ✏️ ہیرو تفصیل (چھوٹی لائن یہاں لکھیں):
                    </label>
                    <textarea
                      rows={2}
                      value={siteConfig.heroSubtitleEn}
                      onChange={(e) =>
                        updateSite({
                          heroSubtitleEn: e.target.value,
                          heroSubtitleUr: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl bg-black/30 hover:bg-black/40 focus:bg-black/60 border border-dashed border-white/30 focus:border-[#fab528] text-xs sm:text-sm text-blue-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bottom Editable Price & Button */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 font-bold">✏️ ابتدائی قیمت:</span>
                    <input
                      type="text"
                      value={siteConfig.heroStartingPrice}
                      onChange={(e) => updateSite({ heroStartingPrice: e.target.value })}
                      className="w-32 px-3 py-1.5 rounded-xl bg-black/40 border border-amber-400 text-xl font-black text-[#fab528] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 font-bold">✏️ بٹن کا نام:</span>
                    <input
                      type="text"
                      value={siteConfig.heroPrimaryBtnEn}
                      onChange={(e) =>
                        updateSite({
                          heroPrimaryBtnEn: e.target.value,
                          heroPrimaryBtnUr: e.target.value,
                        })
                      }
                      className="px-4 py-2 rounded-xl font-extrabold text-xs text-slate-950 focus:outline-none"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Right 2 Stacked Promo Cards (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                
                {/* Top Right Promo Card */}
                <div className="flex-1 relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 flex flex-col justify-between shadow-md border-4 border-white">
                  <img
                    src={siteConfig.topRightPromo.imageUrl}
                    alt="Top Promo"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/70 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={siteConfig.topRightPromo.badgeEn}
                      onChange={(e) =>
                        updateSite({
                          topRightPromo: {
                            ...siteConfig.topRightPromo,
                            badgeEn: e.target.value,
                            badgeUr: e.target.value,
                          },
                        })
                      }
                      className="w-32 px-2.5 py-0.5 rounded bg-[#fab528] text-slate-950 font-extrabold text-[10px]"
                    />

                    <label className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-950 font-extrabold text-[10px] flex items-center gap-1 cursor-pointer shadow">
                      <Camera className="w-3 h-3" />
                      <span>📷 تصویر بدلیں</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await processUploadedImageFile(file);
                          updateSite({
                            topRightPromo: { ...siteConfig.topRightPromo, imageUrl: dataUrl },
                          });
                          showToast('✅ اوپر والے سائیڈ کارڈ کی تصویر بدل گئی!');
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="relative z-10 space-y-2 my-2">
                    <input
                      type="text"
                      value={siteConfig.topRightPromo.titleEn}
                      onChange={(e) =>
                        updateSite({
                          topRightPromo: {
                            ...siteConfig.topRightPromo,
                            titleEn: e.target.value,
                            titleUr: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1 rounded-lg bg-black/35 border border-dashed border-white/40 text-base font-black text-white"
                    />
                    <input
                      type="text"
                      value={siteConfig.topRightPromo.subtitleEn}
                      onChange={(e) =>
                        updateSite({
                          topRightPromo: {
                            ...siteConfig.topRightPromo,
                            subtitleEn: e.target.value,
                            subtitleUr: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1 rounded-lg bg-black/35 border border-dashed border-white/30 text-xs text-emerald-100"
                    />
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-200">قیمت:</span>
                      <input
                        type="text"
                        value={siteConfig.topRightPromo.priceText}
                        onChange={(e) =>
                          updateSite({
                            topRightPromo: { ...siteConfig.topRightPromo, priceText: e.target.value },
                          })
                        }
                        className="w-24 px-2 py-0.5 rounded bg-black/40 border border-amber-400 text-sm font-black text-[#fab528]"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300">✏️ سائیڈ کارڈ 1</span>
                  </div>
                </div>

                {/* Bottom Right Promo Card */}
                <div className="flex-1 relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-stone-900 text-white p-5 flex flex-col justify-between shadow-md border-4 border-white">
                  <img
                    src={siteConfig.bottomRightPromo.imageUrl}
                    alt="Bottom Promo"
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={siteConfig.bottomRightPromo.badgeEn}
                      onChange={(e) =>
                        updateSite({
                          bottomRightPromo: {
                            ...siteConfig.bottomRightPromo,
                            badgeEn: e.target.value,
                            badgeUr: e.target.value,
                          },
                        })
                      }
                      className="w-32 px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-extrabold text-[10px]"
                    />

                    <label className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-950 font-extrabold text-[10px] flex items-center gap-1 cursor-pointer shadow">
                      <Camera className="w-3 h-3" />
                      <span>📷 تصویر بدلیں</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await processUploadedImageFile(file);
                          updateSite({
                            bottomRightPromo: { ...siteConfig.bottomRightPromo, imageUrl: dataUrl },
                          });
                          showToast('✅ نیچے والے سائیڈ کارڈ کی تصویر بدل گئی!');
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="relative z-10 space-y-2 my-2">
                    <input
                      type="text"
                      value={siteConfig.bottomRightPromo.titleEn}
                      onChange={(e) =>
                        updateSite({
                          bottomRightPromo: {
                            ...siteConfig.bottomRightPromo,
                            titleEn: e.target.value,
                            titleUr: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1 rounded-lg bg-black/35 border border-dashed border-white/40 text-base font-black text-white"
                    />
                    <input
                      type="text"
                      value={siteConfig.bottomRightPromo.subtitleEn}
                      onChange={(e) =>
                        updateSite({
                          bottomRightPromo: {
                            ...siteConfig.bottomRightPromo,
                            subtitleEn: e.target.value,
                            subtitleUr: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1 rounded-lg bg-black/35 border border-dashed border-white/30 text-xs text-amber-100"
                    />
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-amber-200">قیمت:</span>
                      <input
                        type="text"
                        value={siteConfig.bottomRightPromo.priceText}
                        onChange={(e) =>
                          updateSite({
                            bottomRightPromo: { ...siteConfig.bottomRightPromo, priceText: e.target.value },
                          })
                        }
                        className="w-28 px-2 py-0.5 rounded bg-black/40 border border-amber-400 text-sm font-black text-[#fab528]"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300">✏️ سائیڈ کارڈ 2</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =================================================================
              LIVE 4 SERVICE GUARANTEE BADGES (Editable in-place!)
          ================================================================= */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {siteConfig.trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {idx === 0 ? <Truck className="w-5 h-5" /> : idx === 1 ? <ShieldCheck className="w-5 h-5" /> : idx === 2 ? <RefreshCw className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1 flex-1">
                    <input
                      type="text"
                      value={badge.titleEn}
                      onChange={(e) => {
                        const updated = [...siteConfig.trustBadges] as typeof siteConfig.trustBadges;
                        updated[idx] = { ...updated[idx], titleEn: e.target.value, titleUr: e.target.value };
                        updateSite({ trustBadges: updated });
                      }}
                      className="w-full px-2 py-0.5 rounded border border-slate-300 bg-white font-bold text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      value={badge.subtitle}
                      onChange={(e) => {
                        const updated = [...siteConfig.trustBadges] as typeof siteConfig.trustBadges;
                        updated[idx] = { ...updated[idx], subtitle: e.target.value };
                        updateSite({ trustBadges: updated });
                      }}
                      className="w-full px-2 py-0.5 rounded border border-slate-200 bg-white text-[11px] text-slate-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================================
              LIVE 3 MID-PAGE PROMO BANNERS (Editable in-place!)
          ================================================================= */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
            <span className="text-xs font-black text-slate-700 bg-amber-200/80 px-3 py-1 rounded-lg inline-block">
              👇 ہوم پیج کے 3 درمیانی آفر بینرز (ان کے اندر کلک کر کے نام یا قیمت بدلیں):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {siteConfig.midBanners.map((banner, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl bg-gradient-to-r ${banner.bgGradient || 'from-[#00368B] to-blue-800'} text-white p-5 flex items-center justify-between shadow-md border-2 border-white`}
                >
                  <div className="space-y-2 flex-1 pr-3">
                    <input
                      type="text"
                      value={banner.badge}
                      onChange={(e) => {
                        const updated = [...siteConfig.midBanners] as typeof siteConfig.midBanners;
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        updateSite({ midBanners: updated });
                      }}
                      className="w-28 text-[10px] font-bold uppercase bg-[#fab528] text-slate-950 px-2 py-0.5 rounded"
                    />
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => {
                        const updated = [...siteConfig.midBanners] as typeof siteConfig.midBanners;
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        updateSite({ midBanners: updated });
                      }}
                      className="w-full px-2 py-1 rounded bg-black/30 border border-dashed border-white/40 text-base font-black text-white"
                    />
                    <input
                      type="text"
                      value={banner.subtitle}
                      onChange={(e) => {
                        const updated = [...siteConfig.midBanners] as typeof siteConfig.midBanners;
                        updated[idx] = { ...updated[idx], subtitle: e.target.value };
                        updateSite({ midBanners: updated });
                      }}
                      className="w-full px-2 py-0.5 rounded bg-black/25 border border-dashed border-white/25 text-xs text-blue-100"
                    />
                    <input
                      type="text"
                      value={banner.priceText}
                      onChange={(e) => {
                        const updated = [...siteConfig.midBanners] as typeof siteConfig.midBanners;
                        updated[idx] = { ...updated[idx], priceText: e.target.value };
                        updateSite({ midBanners: updated });
                      }}
                      className="w-36 px-2 py-0.5 rounded bg-black/40 border border-amber-400 text-xs font-extrabold text-[#fab528]"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="text"
                      value={banner.emoji}
                      onChange={(e) => {
                        const updated = [...siteConfig.midBanners] as typeof siteConfig.midBanners;
                        updated[idx] = { ...updated[idx], emoji: e.target.value };
                        updateSite({ midBanners: updated });
                      }}
                      className="w-14 h-14 text-3xl text-center rounded-xl bg-black/25 border border-white/30"
                    />
                    <span className="text-[10px] text-white/80">آئیکن</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================================
              LIVE PRODUCTS SECTION ON WEBSITE (Edit Any Product Photo, Name, Price, Category!)
          ================================================================= */}
          <section id="admin-live-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
              
              {/* Top Section Header + Category Dropdown + Add Product Button */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#fab528] fill-current" />
                    <span className="text-xs font-extrabold text-[#00368B] uppercase">
                      ✏️ پروڈکٹس سیکشن — جو کیٹیگری سلیکٹ کریں گے صرف وہی پروڈکٹس سامنے آئیں گے ({filteredProducts.length} دکھائے جا رہے ہیں)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={siteConfig.soapsSectionHeadingEn}
                    onChange={(e) =>
                      updateSite({
                        soapsSectionHeadingEn: e.target.value,
                        soapsSectionHeadingUr: e.target.value,
                      })
                    }
                    className="w-full max-w-xl px-3 py-1.5 rounded-xl border-2 border-dashed border-slate-300 text-xl sm:text-2xl font-black text-slate-900"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Direct Category Selector Dropdown */}
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border-2 border-[#00368B] bg-blue-50/70 text-xs font-extrabold text-slate-900 cursor-pointer focus:outline-none"
                  >
                    {adminFilterTabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>
                        {tab.label} ({tab.count})
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="پروڈکٹ تلاش کریں..."
                      className="pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold w-48 sm:w-56"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (deptFilter !== 'all') {
                        setNewProdCategory(deptFilter);
                      }
                      setActiveTab('add-product');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ نیا پروڈکٹ ایڈ کریں</span>
                  </button>
                </div>
              </div>

              {/* Department / Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {adminFilterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDeptFilter(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                      deptFilter === tab.id
                        ? 'bg-[#00368B] text-white border-[#00368B] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* 4-Column Product Grid (Exact Website Look with Inline Edit Controls!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#00368B] shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                  >
                    {/* 1. Top Full Image + Direct Upload Button */}
                    <div className="relative h-52 bg-slate-100 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.nameEnglish} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center text-5xl">
                          {item.emoji}
                        </div>
                      )}

                      <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-[#00368B]/95 hover:bg-[#fab528] text-white hover:text-slate-950 font-extrabold text-[11px] flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        <span>📷 تصویر بدلیں</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDirectCardImageUpload(item, e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* 2. Editable Name, Category, Price & LARGE Product Detail Box */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1">
                            پروڈکٹ کا نام (English):
                          </label>
                          <input
                            type="text"
                            value={item.nameEnglish}
                            onChange={(e) => handleInlineProductUpdate(item, { nameEnglish: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-black text-slate-900 focus:border-[#00368B] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1">
                            اردو نام:
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={item.nameUrdu}
                            onChange={(e) => handleInlineProductUpdate(item, { nameUrdu: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-bold text-emerald-900 font-urdu focus:border-[#00368B] focus:outline-none"
                          />
                        </div>

                        {/* Category Selector */}
                        <div>
                          <label className="text-xs font-extrabold text-[#00368B] block mb-1">
                            🗂️ کیٹیگری (Category):
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) => {
                              handleInlineProductUpdate(item, { category: e.target.value });
                              showToast(`🗂️ کیٹیگری بدل دی گئی!`);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-blue-50/80 border-2 border-blue-300 text-xs sm:text-sm font-extrabold text-slate-900 cursor-pointer"
                          >
                            {allCategoryOptions.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.labelUrdu} ({cat.labelEnglish})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price Input */}
                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1">
                            💰 قیمت (Price Rs.):
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-slate-500">Rs.</span>
                            <input
                              type="number"
                              value={item.pricePkr}
                              onChange={(e) =>
                                handleInlineProductUpdate(item, { pricePkr: Number(e.target.value) })
                              }
                              className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-300 font-black text-base text-[#00368B]"
                            />
                          </div>
                        </div>

                        {/* Large Readable Product Details / Benefits Box right on Card */}
                        <div className="bg-amber-50/50 p-2.5 rounded-xl border-2 border-amber-200/80 space-y-2">
                          <label className="text-xs font-black text-slate-800 block">
                            📝 پروڈکٹ کی تفصیل / فوائد (اردو):
                          </label>
                          <textarea
                            rows={4}
                            dir="rtl"
                            value={item.fullBenefitUrdu || item.shortBenefitUrdu}
                            onChange={(e) =>
                              handleInlineProductUpdate(item, { benefitUrdu: e.target.value })
                            }
                            className="w-full min-h-[100px] p-2.5 rounded-xl border-2 border-slate-300 focus:border-[#00368B] bg-white text-sm font-bold text-slate-900 leading-relaxed font-urdu focus:outline-none resize-y"
                          />
                          <label className="text-xs font-black text-slate-800 block pt-1">
                            📝 Product Details (English):
                          </label>
                          <textarea
                            rows={3}
                            value={item.fullBenefitEnglish || item.shortBenefitEnglish}
                            onChange={(e) =>
                              handleInlineProductUpdate(item, { benefitEnglish: e.target.value })
                            }
                            className="w-full min-h-[90px] p-2.5 rounded-xl border-2 border-slate-300 focus:border-[#00368B] bg-white text-sm font-semibold text-slate-900 leading-relaxed focus:outline-none resize-y"
                          />
                        </div>
                      </div>

                      {/* Bottom Full Edit & Delete Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setActiveTab('edit-product');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#00368B] hover:bg-blue-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#fab528]" />
                          <span>ورڈ پریس ایڈیٹر میں کھولیں (WordPress Edit)</span>
                        </button>

                        {((item.type === 'soap' && onDeleteSoap) ||
                          (item.type === 'miracle' && onDeleteMiracleProduct)) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (item.type === 'soap' && onDeleteSoap) {
                                onDeleteSoap(Number(item.originalId));
                                showToast(`🗑️ "${item.nameEnglish}" ڈیلیٹ کر دیا گیا`);
                              } else if (item.type === 'miracle' && onDeleteMiracleProduct) {
                                onDeleteMiracleProduct(String(item.originalId));
                                showToast(`🗑️ "${item.nameEnglish}" ڈیلیٹ کر دیا گیا`);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================================
              LIVE BRAND VIDEOS SECTION (Part 1, Part 2, Part 3 on the Website!)
          ================================================================= */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-extrabold text-[#00368B] uppercase">
                    🎬 ویب سائٹ کا ویڈیو سیکشن (Part 1, Part 2, Part 3)
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    SH Miracle Brand Story Videos — تینوں پارٹس کی ویڈیوز یہاں اپلوڈ کریں
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {voiceoverScripts.map((script) => {
                  const isUploadingThisPart = uploadingVideoPart === script.part;
                  return (
                    <div
                      key={script.part}
                      className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-slate-950 flex items-center justify-center">
                        {script.videoUrl ? (
                          <video src={script.videoUrl} controls className="w-full h-full object-contain bg-black" />
                        ) : (
                          <div className="text-center p-4 space-y-1">
                            <Video className="w-10 h-10 text-amber-400 mx-auto" />
                            <p className="text-xs font-bold text-white">Part 0{script.part} (کوئی ویڈیو نہیں لگی)</p>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#fab528] text-slate-950 font-black text-xs">
                          Part 0{script.part}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="flex-1 py-2.5 px-3 rounded-xl bg-[#00368B] hover:bg-[#fab528] text-white hover:text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>
                              {isUploadingThisPart
                                ? 'اپلوڈ ہو رہی ہے...'
                                : `📹 پارٹ ${script.part} کی ویڈیو اپلوڈ کریں`}
                            </span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handlePartVideoFileSelect(script.part, e)}
                              className="hidden"
                              disabled={isUploadingThisPart}
                            />
                          </label>

                          {script.videoUrl && onRemovePartVideo && (
                            <button
                              type="button"
                              onClick={async () => {
                                await onRemovePartVideo(script.part);
                                showToast(`🗑️ پارٹ ${script.part} کی ویڈیو ہٹا دی گئی`);
                              }}
                              className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <textarea
                          rows={2}
                          dir="rtl"
                          value={script.audioUrdu}
                          onChange={(e) =>
                            onUpdateVoiceoverScript &&
                            onUpdateVoiceoverScript({ ...script, audioUrdu: e.target.value })
                          }
                          placeholder="وائس اوور ٹیکسٹ (اردو)..."
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-urdu"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================================
              LIVE WEBSITE FOOTER (Edit Footer Banner, About Text, Address & Copyright!)
          ================================================================= */}
          <footer className="bg-white border-t-2 border-slate-200 mt-8">
            <div className="py-6 px-4 sm:px-6 lg:px-8 text-white" style={{ backgroundColor: primaryColor }}>
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-2 flex-1 w-full">
                  <span className="text-[11px] font-bold text-amber-300 block">
                    ✏️ فوٹر کی اوپر والی ہیڈنگ (Footer Top Banner):
                  </span>
                  <input
                    type="text"
                    value={siteConfig.footerBannerTitleEn}
                    onChange={(e) =>
                      updateSite({
                        footerBannerTitleEn: e.target.value,
                        footerBannerTitleUr: e.target.value,
                      })
                    }
                    className="w-full max-w-xl px-3 py-1.5 rounded-xl bg-black/30 border border-dashed border-white/40 text-lg font-black text-white"
                  />
                </div>
                <div className="px-5 py-3 rounded-xl bg-[#fab528] text-slate-950 font-black text-xs">
                  WhatsApp: {shopNumber}
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#00368B] block">
                  ✏️ فوٹر میں اسٹور کا تعارف (Footer About Text):
                </label>
                <textarea
                  rows={3}
                  value={siteConfig.footerAboutEn}
                  onChange={(e) =>
                    updateSite({
                      footerAboutEn: e.target.value,
                      footerAboutUr: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#00368B] block">
                  ✏️ ڈیلیوری ایڈریس اور اوقاتِ کار:
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00368B] shrink-0" />
                  <input
                    type="text"
                    value={siteConfig.footerAddress}
                    onChange={(e) => updateSite({ footerAddress: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={shopNumber}
                    onChange={(e) => onUpdateShopNumber && onUpdateShopNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#00368B] block">
                  ✏️ کاپی رائٹ لائن (Copyright Text):
                </label>
                <input
                  type="text"
                  value={siteConfig.footerCopyright}
                  onChange={(e) => updateSite({ footerCopyright: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    showToast('✅ پوری ویب سائٹ کی تبدیلیاں سیو ہو گئیں!');
                    setTimeout(() => onClose(), 400);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
                >
                  <Save className="w-4 h-4" />
                  <span>✅ سب سیو کریں اور ویب سائٹ دیکھیں</span>
                </button>
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* =====================================================================
          TAB 2: ALL PRODUCTS ONLY (Clean Grid with Category Selector & Pills!)
      ===================================================================== */}
      {activeTab === 'all-products' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  📦 تمام پروڈکٹس لسٹ ({filteredProducts.length} / {unifiedProducts.length} Products)
                </h2>
                <p className="text-xs text-slate-500">
                  کیٹیگری سلیکٹ کریں تاکہ صرف اسی کیٹیگری کے پروڈکٹس سامنے آئیں — یا کارڈ پر تصویر، نام، کیٹیگری اور قیمت تبدیل کریں
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border-2 border-[#00368B] bg-blue-50/70 text-xs font-extrabold text-slate-900 cursor-pointer focus:outline-none"
                >
                  {adminFilterTabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label} ({tab.count})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="پروڈکٹ تلاش کریں..."
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs w-56"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (deptFilter !== 'all') {
                      setNewProdCategory(deptFilter);
                    }
                    setActiveTab('add-product');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ نیا پروڈکٹ ایڈ کریں</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills in All Products Tab */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
              {adminFilterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDeptFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                    deptFilter === tab.id
                      ? 'bg-[#00368B] text-white border-[#00368B] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#00368B] shadow-2xs flex flex-col overflow-hidden"
              >
                <div className="relative h-52 bg-slate-100 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.nameEnglish} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{item.emoji}</span>
                  )}
                  <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-[#00368B] hover:bg-[#fab528] text-white hover:text-slate-950 font-extrabold text-[11px] flex items-center gap-1.5 shadow-lg cursor-pointer">
                    <Camera className="w-3.5 h-3.5" />
                    <span>📷 تصویر بدلیں</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectCardImageUpload(item, e)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-xs font-extrabold text-slate-600 block mb-1">پروڈکٹ کا نام (English):</label>
                      <input
                        type="text"
                        value={item.nameEnglish}
                        onChange={(e) => handleInlineProductUpdate(item, { nameEnglish: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-black text-slate-900 focus:border-[#00368B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-slate-600 block mb-1">اردو نام:</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={item.nameUrdu}
                        onChange={(e) => handleInlineProductUpdate(item, { nameUrdu: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-bold text-emerald-900 font-urdu focus:border-[#00368B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-[#00368B] block mb-1">🗂️ کیٹیگری:</label>
                      <select
                        value={item.category}
                        onChange={(e) => handleInlineProductUpdate(item, { category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-blue-50 border-2 border-blue-200 text-xs sm:text-sm font-extrabold text-slate-900 cursor-pointer"
                      >
                        {allCategoryOptions.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.labelUrdu} ({cat.labelEnglish})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slate-500">Rs.</span>
                      <input
                        type="number"
                        value={item.pricePkr}
                        onChange={(e) => handleInlineProductUpdate(item, { pricePkr: Number(e.target.value) })}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-300 font-black text-base text-[#00368B]"
                      />
                    </div>

                    {/* Large Readable Product Detail / Benefit Box */}
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border-2 border-amber-200/80 space-y-2">
                      <label className="text-xs font-black text-slate-800 block">
                        📝 پروڈکٹ کی تفصیل / فوائد (اردو):
                      </label>
                      <textarea
                        rows={4}
                        dir="rtl"
                        value={item.fullBenefitUrdu || item.shortBenefitUrdu}
                        onChange={(e) => handleInlineProductUpdate(item, { benefitUrdu: e.target.value })}
                        className="w-full min-h-[100px] p-2.5 rounded-xl border-2 border-slate-300 focus:border-[#00368B] bg-white text-sm font-bold text-slate-900 leading-relaxed font-urdu focus:outline-none resize-y"
                      />
                      <label className="text-xs font-black text-slate-800 block pt-1">
                        📝 Product Details (English):
                      </label>
                      <textarea
                        rows={3}
                        value={item.fullBenefitEnglish || item.shortBenefitEnglish}
                        onChange={(e) => handleInlineProductUpdate(item, { benefitEnglish: e.target.value })}
                        className="w-full min-h-[90px] p-2.5 rounded-xl border-2 border-slate-300 focus:border-[#00368B] bg-white text-sm font-semibold text-slate-900 leading-relaxed focus:outline-none resize-y"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setActiveTab('edit-product');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#00368B] hover:bg-blue-900 text-white font-extrabold text-xs cursor-pointer shadow-xs"
                    >
                      ✏️ ورڈ پریس ایڈیٹر میں کھولیں (WordPress Edit)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* =====================================================================
          TAB 3: ADD NEW PRODUCT (Exact WordPress Admin Add Product Page!)
      ===================================================================== */}
      {activeTab === 'add-product' && (
        <WordPressProductEditor
          mode="add"
          initialValues={{
            nameEnglish: '',
            nameUrdu: '',
            pricePkr: 250,
            category: deptFilter !== 'all' ? deptFilter : 'soaps',
            benefitUrdu: '',
            benefitEnglish: '',
            imageUrl: '',
            sizeOrWeight: '100g Bar',
            badge: '100% Pure Herbal',
            tags: '100% Organic, Herbal, SH Miracle',
          }}
          categories={allCategoryOptions}
          onSave={handlePublishWPNewProduct}
          onCancel={() => setActiveTab('all-products')}
          onAddCategory={onAddCategory}
          onUploadImageFile={processUploadedImageFile}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onCloseAdmin={onClose}
        />
      )}

      {/* =====================================================================
          TAB 4: CATEGORIES MANAGER
      ===================================================================== */}
      {activeTab === 'categories' && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <form
              onSubmit={handleCreateCategory}
              className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 h-fit"
            >
              <h3 className="text-lg font-black text-slate-900">
                ➕ نئی کیٹیگری بنائیں (Add Category)
              </h3>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">کیٹیگری کا نام (English):</label>
                <input
                  type="text"
                  value={newCatNameEn}
                  onChange={(e) => setNewCatNameEn(e.target.value)}
                  placeholder="e.g. Winter Care"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">کیٹیگری کا نام (اردو):</label>
                <input
                  type="text"
                  dir="rtl"
                  value={newCatNameUr}
                  onChange={(e) => setNewCatNameUr(e.target.value)}
                  placeholder="مثلاً: ونٹر کیئر"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-urdu"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">آئیکن (Emoji):</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-24 px-3.5 py-2 rounded-xl border border-slate-300 text-center text-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#00368B] hover:bg-blue-900 text-white font-black text-xs cursor-pointer"
              >
                + کیٹیگری شامل کریں
              </button>
            </form>

            <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  🗂️ موجودہ کیٹیگریز ({allCategoryOptions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  کسی بھی کیٹیگری پر کلک کریں تاکہ اس کیٹیگری کے تمام پروڈکٹس فورا سامنے آ جائیں
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allCategoryOptions.map((cat) => {
                  const isCustom = !ADMIN_CATEGORY_OPTIONS.some((d) => d.id === cat.id);
                  const count = unifiedProducts.filter((p) => matchesProductCategory(p, cat.id)).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setDeptFilter(cat.id);
                        setActiveTab('all-products');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-[#00368B] flex items-center justify-between cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <div className="text-xs font-black text-slate-900 group-hover:text-[#00368B]">
                            {cat.labelUrdu}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {cat.labelEnglish} • <strong className="text-[#00368B]">{count} پروڈکٹس</strong>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-[#00368B] text-white text-[10px] font-bold">
                          پروڈکٹس دیکھیں
                        </span>
                        {isCustom && onDeleteCategory && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCategory(cat.id);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          TAB 5: PART 1, 2, 3 VIDEOS
      ===================================================================== */}
      {activeTab === 'brand-videos' && (
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
            <h2 className="text-xl font-black text-slate-900">
              🎬 پارٹ 1، پارٹ 2 اور پارٹ 3 ویڈیوز (Brand Story Videos)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              اپنے موبائل یا کمپیوٹر سے ویڈیو اپلوڈ کریں یا یوٹیوب / ویڈیو لنک پیسٹ کریں
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {voiceoverScripts.map((script) => {
                const isUploadingThisPart = uploadingVideoPart === script.part;
                const urlInputValue =
                  videoUrlInputs[script.part] !== undefined
                    ? videoUrlInputs[script.part]
                    : script.videoUrl && !script.videoUrl.startsWith('blob:')
                    ? script.videoUrl
                    : '';

                return (
                  <div
                    key={script.part}
                    className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-52 bg-slate-950 flex items-center justify-center">
                      {script.videoUrl ? (
                        <video src={script.videoUrl} controls className="w-full h-full object-contain bg-black" />
                      ) : (
                        <div className="text-center p-4 space-y-1">
                          <Video className="w-10 h-10 text-amber-400 mx-auto" />
                          <p className="text-xs font-bold text-white">Part 0{script.part}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <label className="w-full py-3 px-4 rounded-xl bg-[#00368B] hover:bg-[#fab528] text-white hover:text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>
                          {isUploadingThisPart
                            ? 'اپلوڈ ہو رہی ہے...'
                            : `📹 پارٹ ${script.part} کی ویڈیو اپلوڈ کریں`}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handlePartVideoFileSelect(script.part, e)}
                          className="hidden"
                          disabled={isUploadingThisPart}
                        />
                      </label>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={urlInputValue}
                          onChange={(e) =>
                            setVideoUrlInputs((prev) => ({
                              ...prev,
                              [script.part]: e.target.value,
                            }))
                          }
                          placeholder="یا ویڈیو لنک پیسٹ کریں..."
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!onUpdateVoiceoverScript) return;
                            const trimmed = (videoUrlInputs[script.part] ?? '').trim();
                            onUpdateVoiceoverScript({
                              ...script,
                              videoUrl: trimmed || undefined,
                            });
                            showToast(`✅ پارٹ ${script.part} کا ویڈیو لنک سیو ہو گیا!`);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#00368B] text-white font-bold text-xs cursor-pointer"
                        >
                          سیو
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

    </div>
  );
};
