import React, { useState } from 'react';
import { StoreCategoryItem } from '../data/soaps';
import {
  Camera,
  ChevronUp,
  ChevronDown,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Maximize2,
  Pin,
  Eye,
  Calendar,
  Check,
  Image as ImageIcon,
  LayoutDashboard,
  FileText,
  Film,
  Layers,
  Settings,
  Plus,
  Globe,
  X,
} from 'lucide-react';

export interface WPProductFormValues {
  nameEnglish: string;
  nameUrdu: string;
  pricePkr: number;
  category: string;
  benefitUrdu: string;
  benefitEnglish: string;
  imageUrl: string;
  sizeOrWeight: string;
  badge: string;
  tags: string;
}

interface WordPressProductEditorProps {
  mode: 'add' | 'edit';
  initialValues: WPProductFormValues;
  categories: StoreCategoryItem[];
  onSave: (values: WPProductFormValues) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onAddCategory?: (newCat: StoreCategoryItem) => void;
  onUploadImageFile: (file: File) => Promise<string>;
  onNavigateTab?: (tab: 'live-website' | 'all-products' | 'add-product' | 'categories' | 'brand-videos') => void;
  onCloseAdmin?: () => void;
}

export const WordPressProductEditor: React.FC<WordPressProductEditorProps> = ({
  mode,
  initialValues,
  categories,
  onSave,
  onCancel,
  onDelete,
  onAddCategory,
  onUploadImageFile,
  onNavigateTab,
  onCloseAdmin,
}) => {
  const [values, setValues] = useState<WPProductFormValues>(initialValues);
  const [editorTab, setEditorTab] = useState<'visual' | 'text'>('visual');
  const [catTab, setCatTab] = useState<'all' | 'most'>('all');
  const [showAddCatInline, setShowAddCatInline] = useState(false);
  const [inlineCatNameEn, setInlineCatNameEn] = useState('');
  const [inlineCatNameUr, setInlineCatNameUr] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [customFields, setCustomFields] = useState<{ id: string; name: string; value: string }[]>([
    { id: 'cf-1', name: 'Weight / Size (وزن / سائز)', value: initialValues.sizeOrWeight || '100g Bar' },
    { id: 'cf-2', name: 'Product Badge (پروڈکٹ بیج)', value: initialValues.badge || '100% Pure Herbal' },
  ]);
  const [newCfName, setNewCfName] = useState('');
  const [newCfValue, setNewCfValue] = useState('');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [customSlug, setCustomSlug] = useState(
    (initialValues.nameEnglish || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  );

  // Sync when initialValues change
  React.useEffect(() => {
    setValues(initialValues);
    setCustomSlug(
      (initialValues.nameEnglish || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    );
    setCustomFields([
      { id: 'cf-1', name: 'Weight / Size (وزن / سائز)', value: initialValues.sizeOrWeight || '100g Bar' },
      { id: 'cf-2', name: 'Product Badge (پروڈکٹ بیج)', value: initialValues.badge || '100% Pure Herbal' },
    ]);
  }, [initialValues]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await onUploadImageFile(file);
      setValues((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightField = customFields.find((f) => f.id === 'cf-1');
    const badgeField = customFields.find((f) => f.id === 'cf-2');
    onSave({
      ...values,
      sizeOrWeight: weightField ? weightField.value : values.sizeOrWeight,
      badge: badgeField ? badgeField.value : values.badge,
    });
  };

  const handleCreateInlineCategory = () => {
    if (!inlineCatNameEn.trim() && !inlineCatNameUr.trim()) return;
    const base = inlineCatNameEn.trim() || inlineCatNameUr.trim();
    const id =
      base
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '') || `cat_${Date.now()}`;
    const created: StoreCategoryItem = {
      id,
      labelEnglish: inlineCatNameEn.trim() || inlineCatNameUr.trim(),
      labelUrdu: inlineCatNameUr.trim() || inlineCatNameEn.trim(),
      icon: '🌿',
    };
    if (onAddCategory) {
      onAddCategory(created);
    }
    setValues((prev) => ({ ...prev, category: id }));
    setInlineCatNameEn('');
    setInlineCatNameUr('');
    setShowAddCatInline(false);
  };

  const wordCount = (values.benefitUrdu + ' ' + values.benefitEnglish)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="bg-[#f0f0f1] min-h-screen text-[#1d2327] font-sans flex flex-col">
      {/* =====================================================================
          1. AUTHENTIC WORDPRESS TOP ADMIN BAR (#1d2327)
      ===================================================================== */}
      <div className="bg-[#1d2327] text-[#c3c4c7] h-9 px-3 flex items-center justify-between text-xs select-none border-b border-black/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center text-[11px] font-serif">
              W
            </span>
            <span>SH Miracle WordPress Admin</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('live-website')}
            className="hover:text-[#72aee6] flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visit Website</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('add-product')}
            className="hover:text-[#72aee6] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span>Howdy, Admin</span>
          <button
            type="button"
            onClick={onCloseAdmin || onCancel}
            className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="Hide Admin Panel"
          >
            <X className="w-3 h-3" />
            <span>Hide Admin (بند کریں)</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. WORDPRESS BODY: LEFT DARK SIDEBAR + MAIN EDITOR CANVAS
      ===================================================================== */}
      <div className="flex flex-1">
        {/* Classic WordPress Left Dark Sidebar */}
        <aside className="hidden md:flex flex-col w-44 bg-[#1d2327] text-[#f0f0f1] shrink-0 select-none">
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('live-website')}
            className="px-3 py-2.5 flex items-center gap-2.5 text-xs text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer text-left"
          >
            <LayoutDashboard className="w-4 h-4 text-[#a7aaad]" />
            <span>Dashboard</span>
          </button>

          {/* Active Section: Products / Posts */}
          <div>
            <div className="px-3 py-2.5 bg-[#2271b1] text-white font-semibold text-xs flex items-center gap-2.5">
              <Pin className="w-4 h-4" />
              <span>Products / Posts</span>
            </div>
            <div className="bg-[#2c3338] py-1.5 space-y-0.5 text-xs">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('all-products')}
                className="w-full px-4 py-1.5 text-left text-[#c3c4c7] hover:text-white cursor-pointer"
              >
                All Products
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('add-product')}
                className="w-full px-4 py-1.5 text-left text-white font-bold cursor-pointer flex items-center justify-between"
              >
                <span>{mode === 'edit' ? 'Edit Product' : 'Add New'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('categories')}
                className="w-full px-4 py-1.5 text-left text-[#c3c4c7] hover:text-white cursor-pointer"
              >
                Categories
              </button>
              <button
                type="button"
                className="w-full px-4 py-1.5 text-left text-[#c3c4c7] hover:text-white cursor-pointer"
              >
                Tags
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('brand-videos')}
            className="px-3 py-2.5 flex items-center gap-2.5 text-xs text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer text-left"
          >
            <Film className="w-4 h-4 text-[#a7aaad]" />
            <span>Media / Videos</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('live-website')}
            className="px-3 py-2.5 flex items-center gap-2.5 text-xs text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer text-left"
          >
            <FileText className="w-4 h-4 text-[#a7aaad]" />
            <span>Pages (Live Site)</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('categories')}
            className="px-3 py-2.5 flex items-center gap-2.5 text-xs text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer text-left"
          >
            <Layers className="w-4 h-4 text-[#a7aaad]" />
            <span>Categories</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('live-website')}
            className="px-3 py-2.5 flex items-center gap-2.5 text-xs text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6] cursor-pointer text-left"
          >
            <Settings className="w-4 h-4 text-[#a7aaad]" />
            <span>Settings</span>
          </button>
        </aside>

        {/* Main WordPress Content Canvas */}
        <form onSubmit={handleSubmit} className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="max-w-[1380px] mx-auto space-y-4">
            {/* Screen Options & Help tabs at top-right (just like screenshot) */}
            <div className="flex justify-end gap-2 -mt-4 mb-1">
              <span className="px-3 py-1 bg-white border border-t-0 border-[#c3c4c7] text-[11px] text-[#50575e] rounded-b-xs shadow-2xs flex items-center gap-1">
                Screen Options <ChevronDown className="w-3 h-3" />
              </span>
              <span className="px-3 py-1 bg-white border border-t-0 border-[#c3c4c7] text-[11px] text-[#50575e] rounded-b-xs shadow-2xs flex items-center gap-1">
                Help <ChevronDown className="w-3 h-3" />
              </span>
            </div>

            {/* Top WordPress Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-normal text-[#1d2327]">
                  {mode === 'edit'
                    ? 'Edit Product (پروڈکٹ ایڈٹ کریں)'
                    : 'Add New Product (نیا پروڈکٹ ایڈ کریں)'}
                </h1>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] bg-[#f6f7f7] hover:bg-white rounded-xs cursor-pointer"
                  >
                    ← Back to All Products
                  </button>
                )}
              </div>
              <span className="text-xs text-[#50575e] font-medium">
                WordPress Classic Product Editor — بالکل آپ کے بھیجے گئے ڈیزائن کے مطابق
              </span>
            </div>

            {/* Classic WordPress 2-Column Layout: Left Main Editor (8 cols) + Right Meta Sidebar (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* =================================================================
                  LEFT MAIN COLUMN (Title, Permalink, Add Media, Editor, Price & Custom Fields)
              ================================================================= */}
              <div className="lg:col-span-8 space-y-4">
                {/* 1. Title Input Boxes (English & Urdu) */}
                <div className="space-y-2.5">
                  <div>
                    <input
                      type="text"
                      value={values.nameEnglish}
                      onChange={(e) => {
                        setValues({ ...values, nameEnglish: e.target.value });
                        if (!isEditingSlug) {
                          setCustomSlug(
                            (e.target.value || 'new-product')
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                          );
                        }
                      }}
                      placeholder="Enter product title here (پروڈکٹ کا انگلش نام یہاں لکھیں)..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#8c8f94] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] text-xl font-semibold text-[#1d2327] rounded-xs shadow-2xs focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      dir="rtl"
                      value={values.nameUrdu}
                      onChange={(e) => setValues({ ...values, nameUrdu: e.target.value })}
                      placeholder="پروڈکٹ کا اردو نام یہاں لکھیں (مثلاً: کافی اور چاول گلو صابن)..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#8c8f94] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] text-lg font-bold text-emerald-950 font-urdu rounded-xs shadow-2xs focus:outline-none"
                    />
                  </div>

                  {/* Permalink Bar (Exact WordPress look from screenshot) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#50575e] pt-0.5">
                    <span className="font-semibold">Permalink:</span>
                    <span className="text-[#2271b1] underline cursor-pointer">
                      https://shmiracle.pk/?product=
                      {isEditingSlug ? (
                        <input
                          type="text"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value)}
                          className="ml-1 px-1.5 py-0.5 bg-white border border-[#8c8f94] text-[#1d2327] text-xs"
                        />
                      ) : (
                        <strong>{customSlug}</strong>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingSlug(!isEditingSlug)}
                      className="px-2.5 py-1 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-[11px] cursor-pointer"
                    >
                      {isEditingSlug ? 'OK' : 'Change Permalink Structure'}
                    </button>
                  </div>
                </div>

                {/* 2. Add Media Button + Visual/Text Tabs + Classic TinyMCE Editor Box */}
                <div>
                  {/* Top Bar: Add Media on Left, Visual | Text Tabs on Right */}
                  <div className="flex items-end justify-between mb-[-1px]">
                    <div className="flex items-center gap-2 pb-1.5">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs font-semibold cursor-pointer shadow-2xs">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Add Media (تصویر اپلوڈ کریں)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {values.imageUrl && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> تصویر سلیکٹڈ ہے
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setEditorTab('visual')}
                        className={`px-3.5 py-1.5 text-xs border border-[#c3c4c7] cursor-pointer ${
                          editorTab === 'visual'
                            ? 'bg-[#f6f7f7] text-[#1d2327] font-semibold border-b-[#f6f7f7]'
                            : 'bg-[#dcdcde] text-[#50575e] hover:bg-[#f0f0f1]'
                        }`}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab('text')}
                        className={`px-3.5 py-1.5 text-xs border border-l-0 border-[#c3c4c7] cursor-pointer ${
                          editorTab === 'text'
                            ? 'bg-[#f6f7f7] text-[#1d2327] font-semibold border-b-[#f6f7f7]'
                            : 'bg-[#dcdcde] text-[#50575e] hover:bg-[#f0f0f1]'
                        }`}
                      >
                        Text
                      </button>
                    </div>
                  </div>

                  {/* Classic WordPress Editor Container */}
                  <div className="bg-white border border-[#c3c4c7] shadow-2xs">
                    {/* TinyMCE Toolbar (Exact match to screenshot) */}
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1">
                        <select className="px-2 py-1 bg-white border border-[#8c8f94] text-xs text-[#1d2327] rounded-xs mr-1">
                          <option>Paragraph</option>
                          <option>Heading 2</option>
                          <option>Heading 3</option>
                        </select>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Bulleted list"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Numbered list"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Blockquote"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Align left"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Align center"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Align right"
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:bg-[#dcdcde] rounded-xs text-[#50575e]"
                          title="Insert/edit link"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Maximize2 className="w-3.5 h-3.5 text-[#50575e]" />
                    </div>

                    {/* Large, Crystal-Clear Editor Textareas */}
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-xs font-extrabold text-[#1d2327] block mb-1.5">
                          📝 پروڈکٹ کی مکمل تفصیل اور فوائد (اردو میں — صاف اور بڑا بکس):
                        </label>
                        <textarea
                          rows={6}
                          dir="rtl"
                          value={values.benefitUrdu}
                          onChange={(e) => setValues({ ...values, benefitUrdu: e.target.value })}
                          placeholder="یہاں پروڈکٹ کے تمام فوائد اور تفصیل اردو میں لکھیں..."
                          className="w-full min-h-[160px] p-3.5 bg-white border border-[#8c8f94] focus:border-[#2271b1] text-base sm:text-lg font-bold text-[#1d2327] leading-loose font-urdu focus:outline-none resize-y"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-extrabold text-[#1d2327] block mb-1.5">
                          📝 Product Full Description & Benefits (English — Large Clear Box):
                        </label>
                        <textarea
                          rows={5}
                          value={values.benefitEnglish}
                          onChange={(e) => setValues({ ...values, benefitEnglish: e.target.value })}
                          placeholder="Write complete product benefits and details in English here..."
                          className="w-full min-h-[140px] p-3.5 bg-white border border-[#8c8f94] focus:border-[#2271b1] text-base sm:text-lg font-medium text-[#1d2327] leading-relaxed focus:outline-none resize-y"
                        />
                      </div>
                    </div>

                    {/* Editor Footer Bar (Word count + Last edited) */}
                    <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-3 py-1.5 flex items-center justify-between text-xs text-[#50575e]">
                      <span>Word count: {wordCount}</span>
                      <span>Last edited on {new Date().toLocaleDateString()} by admin</span>
                    </div>
                  </div>
                </div>

                {/* 3. Custom Fields Meta Box (Exact match to WordPress screenshot!) */}
                <div className="bg-white border border-[#c3c4c7] shadow-2xs">
                  <div className="px-4 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1d2327]">
                      Custom Fields (قیمت، وزن اور اضافی معلومات)
                    </h2>
                    <div className="flex items-center gap-1 text-[#50575e]">
                      <ChevronUp className="w-4 h-4" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-4 space-y-5">
                    {/* Existing Custom Fields Table */}
                    <div className="border border-[#c3c4c7]">
                      <div className="grid grid-cols-12 bg-[#f0f0f1] border-b border-[#c3c4c7] text-xs font-semibold text-[#1d2327] text-center py-2">
                        <div className="col-span-5">Name</div>
                        <div className="col-span-7">Value</div>
                      </div>

                      {/* Row 1: Price (PKR) */}
                      <div className="grid grid-cols-12 gap-3 p-3 border-b border-[#c3c4c7] items-start bg-amber-50/40">
                        <div className="col-span-12 sm:col-span-5 space-y-2">
                          <input
                            type="text"
                            readOnly
                            value="Price Rs. (پروڈکٹ کی قیمت)"
                            className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded-xs text-sm font-bold text-[#1d2327]"
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-7">
                          <input
                            type="number"
                            value={values.pricePkr}
                            onChange={(e) =>
                              setValues({ ...values, pricePkr: Number(e.target.value) })
                            }
                            className="w-full px-3.5 py-2 bg-white border-2 border-[#2271b1] rounded-xs text-lg font-black text-[#2271b1] focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      {/* Dynamic Custom Field Rows */}
                      {customFields.map((cf, index) => (
                        <div
                          key={cf.id}
                          className="grid grid-cols-12 gap-3 p-3 border-b border-[#c3c4c7] last:border-b-0 items-start"
                        >
                          <div className="col-span-12 sm:col-span-5 space-y-2">
                            <input
                              type="text"
                              value={cf.name}
                              onChange={(e) => {
                                const updated = [...customFields];
                                updated[index] = { ...updated[index], name: e.target.value };
                                setCustomFields(updated);
                              }}
                              className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded-xs text-sm text-[#1d2327]"
                            />
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomFields(customFields.filter((item) => item.id !== cf.id))
                                }
                                className="px-2.5 py-1 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="px-2.5 py-1 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs cursor-pointer"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                          <div className="col-span-12 sm:col-span-7">
                            <textarea
                              rows={2}
                              value={cf.value}
                              onChange={(e) => {
                                const updated = [...customFields];
                                updated[index] = { ...updated[index], value: e.target.value };
                                setCustomFields(updated);
                              }}
                              className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded-xs text-sm text-[#1d2327] resize-y"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Custom Field Section (Exact match to screenshot) */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-[#1d2327]">Add New Custom Field:</h3>
                      <div className="border border-[#c3c4c7]">
                        <div className="grid grid-cols-12 bg-[#f0f0f1] border-b border-[#c3c4c7] text-xs font-semibold text-[#1d2327] text-center py-2">
                          <div className="col-span-5">Name</div>
                          <div className="col-span-7">Value</div>
                        </div>
                        <div className="grid grid-cols-12 gap-3 p-3 items-start">
                          <div className="col-span-12 sm:col-span-5 space-y-2">
                            <input
                              type="text"
                              value={newCfName}
                              onChange={(e) => setNewCfName(e.target.value)}
                              placeholder="- Select -"
                              className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded-xs text-xs text-[#1d2327]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newCfName.trim()) return;
                                setCustomFields([
                                  ...customFields,
                                  { id: `cf-${Date.now()}`, name: newCfName, value: newCfValue },
                                ]);
                                setNewCfName('');
                                setNewCfValue('');
                              }}
                              className="px-2.5 py-1 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs cursor-pointer"
                            >
                              Enter new
                            </button>
                          </div>
                          <div className="col-span-12 sm:col-span-7">
                            <textarea
                              rows={2}
                              value={newCfValue}
                              onChange={(e) => setNewCfValue(e.target.value)}
                              placeholder="Text Area"
                              className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded-xs text-sm text-[#1d2327] resize-y"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCfName.trim()) return;
                          setCustomFields([
                            ...customFields,
                            { id: `cf-${Date.now()}`, name: newCfName, value: newCfValue },
                          ]);
                          setNewCfName('');
                          setNewCfValue('');
                        }}
                        className="px-3 py-1.5 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs cursor-pointer"
                      >
                        Add Custom Field
                      </button>
                      <p className="text-xs text-[#50575e] pt-1">
                        Custom fields can be used to add extra metadata to a product that you can{' '}
                        <span className="text-[#2271b1] underline">use in your theme</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================
                  RIGHT SIDEBAR COLUMN (Publish, Categories, Tags, Product Image)
              ================================================================= */}
              <div className="lg:col-span-4 space-y-4">
                {/* 1. PUBLISH META BOX (Exact match to screenshot) */}
                <div className="bg-white border border-[#c3c4c7] shadow-2xs">
                  <div className="px-3.5 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1d2327]">Publish</h2>
                    <div className="flex items-center gap-1 text-[#50575e]">
                      <ChevronUp className="w-4 h-4" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3 text-xs text-[#50575e]">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs cursor-pointer"
                      >
                        Preview Changes
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Pin className="w-3.5 h-3.5 text-[#8c8f94]" />
                        <span>
                          Status: <strong className="text-[#1d2327]">Published</strong>{' '}
                          <span className="text-[#2271b1] underline cursor-pointer">Edit</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-[#8c8f94]" />
                        <span>
                          Visibility: <strong className="text-[#1d2327]">Public</strong>{' '}
                          <span className="text-[#2271b1] underline cursor-pointer">Edit</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#8c8f94]" />
                        <span>
                          Published on: <strong className="text-[#1d2327]">Immediately</strong>{' '}
                          <span className="text-[#2271b1] underline cursor-pointer">Edit</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-3.5 py-3 flex items-center justify-between">
                    {onDelete ? (
                      <button
                        type="button"
                        onClick={onDelete}
                        className="text-xs text-[#b32d2e] hover:text-red-700 underline cursor-pointer"
                      >
                        Move to Trash
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setValues({
                            nameEnglish: '',
                            nameUrdu: '',
                            pricePkr: 250,
                            category: 'soaps',
                            benefitUrdu: '',
                            benefitEnglish: '',
                            imageUrl: '',
                            sizeOrWeight: '100g Bar',
                            badge: '100% Pure Herbal',
                            tags: '',
                          })
                        }
                        className="text-xs text-[#b32d2e] hover:text-red-700 underline cursor-pointer"
                      >
                        Move to Trash
                      </button>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold text-xs sm:text-sm rounded-xs shadow-2xs cursor-pointer transition-colors"
                    >
                      {mode === 'edit' ? 'Update (سیو کریں)' : 'Publish (پبلش کریں)'}
                    </button>
                  </div>
                </div>

                {/* 2. CATEGORIES META BOX (Exact WordPress Checkbox List + Add New Category) */}
                <div className="bg-white border border-[#c3c4c7] shadow-2xs">
                  <div className="px-3.5 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1d2327]">Categories</h2>
                    <div className="flex items-center gap-1 text-[#50575e]">
                      <ChevronUp className="w-4 h-4" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 text-xs border-b border-[#c3c4c7]">
                      <button
                        type="button"
                        onClick={() => setCatTab('all')}
                        className={`px-2.5 py-1 border border-b-0 rounded-t-xs cursor-pointer ${
                          catTab === 'all'
                            ? 'bg-white border-[#c3c4c7] text-[#1d2327] font-semibold -mb-[1px]'
                            : 'border-transparent text-[#2271b1]'
                        }`}
                      >
                        All Categories
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatTab('most')}
                        className={`px-2.5 py-1 border border-b-0 rounded-t-xs cursor-pointer ${
                          catTab === 'most'
                            ? 'bg-white border-[#c3c4c7] text-[#1d2327] font-semibold -mb-[1px]'
                            : 'border-transparent text-[#2271b1]'
                        }`}
                      >
                        Most Used
                      </button>
                    </div>

                    {/* Scrollable Checkboxes List */}
                    <div className="max-h-56 overflow-y-auto border border-[#c3c4c7] bg-white p-2.5 space-y-2">
                      {categories.map((cat) => {
                        const isChecked = values.category === cat.id;
                        return (
                          <label
                            key={cat.id}
                            onClick={() => setValues({ ...values, category: cat.id })}
                            className={`flex items-center gap-2.5 p-1.5 rounded-xs text-xs cursor-pointer select-none ${
                              isChecked
                                ? 'bg-blue-50 font-bold text-[#1d2327]'
                                : 'text-[#1d2327] hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => setValues({ ...values, category: cat.id })}
                              className="w-4 h-4 accent-[#2271b1] rounded-xs cursor-pointer"
                            />
                            <span>
                              {cat.icon} {cat.labelUrdu} ({cat.labelEnglish})
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {/* + Add New Category link */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowAddCatInline(!showAddCatInline)}
                        className="text-xs font-semibold text-[#2271b1] hover:text-[#135e96] underline cursor-pointer"
                      >
                        + Add New Category
                      </button>

                      {showAddCatInline && (
                        <div className="mt-2.5 p-3 bg-[#f6f7f7] border border-[#c3c4c7] space-y-2">
                          <input
                            type="text"
                            value={inlineCatNameEn}
                            onChange={(e) => setInlineCatNameEn(e.target.value)}
                            placeholder="Category Name (English)"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#8c8f94] text-xs"
                          />
                          <input
                            type="text"
                            dir="rtl"
                            value={inlineCatNameUr}
                            onChange={(e) => setInlineCatNameUr(e.target.value)}
                            placeholder="کیٹیگری کا اردو نام"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#8c8f94] text-xs font-urdu"
                          />
                          <button
                            type="button"
                            onClick={handleCreateInlineCategory}
                            className="px-3 py-1 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs font-semibold cursor-pointer"
                          >
                            Add New Category
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. TAGS META BOX (Exact match to screenshot) */}
                <div className="bg-white border border-[#c3c4c7] shadow-2xs">
                  <div className="px-3.5 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1d2327]">Tags</h2>
                    <div className="flex items-center gap-1 text-[#50575e]">
                      <ChevronUp className="w-4 h-4" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2.5 text-xs text-[#50575e]">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-[#8c8f94] rounded-xs text-xs text-[#1d2327]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!tagInput.trim()) return;
                          setValues((prev) => ({
                            ...prev,
                            tags: prev.tags ? `${prev.tags}, ${tagInput.trim()}` : tagInput.trim(),
                          }));
                          setTagInput('');
                        }}
                        className="px-3 py-1.5 bg-[#f6f7f7] hover:bg-white text-[#2271b1] border border-[#2271b1] rounded-xs text-xs cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <p>Separate tags with commas</p>
                    {values.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {values.tags.split(',').map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-[#f0f0f1] border border-[#c3c4c7] text-[#1d2327] rounded-xs text-[11px]"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          tags: '100% Organic, Herbal, Chemical Free, SH Miracle',
                        }))
                      }
                      className="text-[#2271b1] underline cursor-pointer block pt-1"
                    >
                      Choose from the most used tags
                    </button>
                  </div>
                </div>

                {/* 4. PRODUCT IMAGE (FEATURED IMAGE) META BOX */}
                <div className="bg-white border border-[#c3c4c7] shadow-2xs">
                  <div className="px-3.5 py-2.5 border-b border-[#c3c4c7] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#1d2327]">
                      Product Image (پروڈکٹ کی تصویر)
                    </h2>
                    <div className="flex items-center gap-1 text-[#50575e]">
                      <ChevronUp className="w-4 h-4" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3">
                    {values.imageUrl ? (
                      <div className="space-y-2">
                        <div className="relative h-48 bg-slate-100 border border-[#c3c4c7] flex items-center justify-center overflow-hidden">
                          <img
                            src={values.imageUrl}
                            alt="Product preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-[#2271b1] underline cursor-pointer font-semibold">
                            Replace product image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setValues({ ...values, imageUrl: '' })}
                            className="text-xs text-[#b32d2e] underline cursor-pointer"
                          >
                            Remove product image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="w-full h-36 border-2 border-dashed border-[#c3c4c7] hover:border-[#2271b1] bg-[#f6f7f7] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                          <ImageIcon className="w-8 h-8 text-[#50575e]" />
                          <span className="text-xs font-semibold text-[#2271b1] underline">
                            Set product image (تصویر سلیکٹ کریں)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    <input
                      type="text"
                      value={values.imageUrl}
                      onChange={(e) => setValues({ ...values, imageUrl: e.target.value })}
                      placeholder="Or paste Image URL here..."
                      className="w-full px-2.5 py-1.5 bg-white border border-[#8c8f94] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
