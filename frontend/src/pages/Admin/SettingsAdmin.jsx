import { useState, useEffect, useRef } from 'react';
import { useSiteSettings, getLogoInitials, renderBrandLogo } from '../../contexts/SettingsContext';

import { updateSettingsAdmin, uploadImage } from '../../utils/adminApi';
import { Loader2, Save, Globe, Eye, Image, PhoneCall, Share2, TrendingUp } from 'lucide-react';

const inputCls = "w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
const labelCls = "block text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-1.5";

export default function SettingsAdmin() {
  const { settings, refreshSettings } = useSiteSettings();
  const [form, setForm] = useState({ ...settings });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('branding');

  // Cropper states
  const [cropSrc, setCropSrc] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropImgRef = useRef(null);
  const [cropFileName, setCropFileName] = useState('');

  // Keep form in sync when context loads settings
  useEffect(() => {
    if (settings) {
      setForm({ ...settings });
    }
  }, [settings]);

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleNestedChange = (parentKey, key, val) => {
    setForm(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: val
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      handleChange('heroMobileImageUrl', url);
      setSuccess('Image uploaded and set as fallback successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropFileName(file.name);
    setCropZoom(1);
    setCropPos({ x: 0, y: 0 });

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
  };

  const closeCropper = () => {
    setCropSrc(null);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setCropPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const executeCrop = async () => {
    const img = cropImgRef.current;
    if (!img) return;

    setUploading(true);
    setError('');

    try {
      const canvas = document.createElement('canvas');
      const size = 500;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      // Clear with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Math for displaying image coordinates exactly as seen in 240x240 frame
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      const ratio = Math.min(240 / naturalW, 240 / naturalH);
      const fitW = naturalW * ratio;
      const fitH = naturalH * ratio;

      const initialX = (240 - fitW) / 2;
      const initialY = (240 - fitH) / 2;

      const displayLeft = initialX + cropPos.x - (fitW * (cropZoom - 1)) / 2;
      const displayTop = initialY + cropPos.y - (fitH * (cropZoom - 1)) / 2;
      const displayWidth = fitW * cropZoom;
      const displayHeight = fitH * cropZoom;

      const scale = size / 240;
      const canvasLeft = displayLeft * scale;
      const canvasTop = displayTop * scale;
      const canvasWidth = displayWidth * scale;
      const canvasHeight = displayHeight * scale;

      ctx.drawImage(img, canvasLeft, canvasTop, canvasWidth, canvasHeight);

      let fileType = 'image/jpeg';
      if (cropFileName.toLowerCase().endsWith('.png')) {
        fileType = 'image/png';
      }

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, fileType, 0.95));
      if (!blob) throw new Error('Canvas conversion failed');

      const croppedFile = new File([blob], cropFileName, { type: fileType });

      const url = await uploadImage(croppedFile);
      handleChange('logoIconImage', url);
      setCropSrc(null);
      setSuccess('Logo icon cropped and uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Crop/Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateSettingsAdmin(form);
      await refreshSettings();
      setSuccess('Website settings updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'branding', label: 'Branding & Logo', Icon: Globe },
    { id: 'banner', label: 'Hero Banner', Icon: Image },
    { id: 'contact', label: 'Contact Details', Icon: PhoneCall },
    { id: 'stats', label: 'Stats Strip', Icon: TrendingUp },
    { id: 'socials', label: 'Social Networks', Icon: Share2 },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-black text-navy dark:text-white">Website Settings</h1>
        <p className="text-sm text-ink-muted dark:text-white/50">Control global website parameters including logo, titles, backgrounds, and contacts.</p>
      </div>

      {/* Message Banners */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/10 pb-px">
        {tabs.map(t => {
          const ActiveIcon = t.Icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-gold text-gold dark:text-gold'
                  : 'border-transparent text-gray-400 dark:text-white/40 hover:text-navy dark:hover:text-white'
              }`}
            >
              <ActiveIcon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-navy border border-gray-100 dark:border-white/10 shadow-card space-y-6">
            
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-navy dark:text-white text-lg">Website Branding & Logo</h3>
                
                <div>
                  <label className={labelCls}>Logo Icon Image (Optional - Overrides Abbreviation Text)</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={form.logoIconImage || ''}
                      onChange={(e) => handleChange('logoIconImage', e.target.value)}
                      placeholder="Upload custom icon image or enter image URL"
                      className={`${inputCls} flex-1`}
                    />
                    <label className="shrink-0 flex items-center justify-center p-3 rounded-xl bg-gray-150 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 cursor-pointer transition-colors border border-dashed border-gray-300 dark:border-white/20">
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      ) : (
                        <Image className="w-4 h-4 text-gray-500 dark:text-white/60" />
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Logo Icon Text (Abbreviation)</label>
                    <input
                      type="text"
                      value={form.logoIconText || ''}
                      onChange={(e) => handleChange('logoIconText', e.target.value)}
                      placeholder="e.g. HR"
                      maxLength={3}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Logo Subtitle</label>
                    <input
                      type="text"
                      value={form.logoSubtitle || ''}
                      onChange={(e) => handleChange('logoSubtitle', e.target.value)}
                      placeholder="e.g. Luxury Real Estate · Pune"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Primary Logo Brand Name</label>
                    <input
                      type="text"
                      value={form.logoTextPrimary || ''}
                      onChange={(e) => handleChange('logoTextPrimary', e.target.value)}
                      placeholder="e.g. Hyper"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Secondary Logo Brand Name (Colored)</label>
                    <input
                      type="text"
                      value={form.logoTextSecondary || ''}
                      onChange={(e) => handleChange('logoTextSecondary', e.target.value)}
                      placeholder="e.g. Relestix"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'banner' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-navy dark:text-white text-lg">Main Hero Banner & Media</h3>

                <div>
                  <label className={labelCls}>Banner Top Tagline</label>
                  <input
                    type="text"
                    value={form.heroTagline || ''}
                    onChange={(e) => handleChange('heroTagline', e.target.value)}
                    placeholder="e.g. Pune's Premier NRI Property Platform"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-1">
                    <label className={labelCls}>Title Line 1</label>
                    <input
                      type="text"
                      value={form.heroTitleLine1 || ''}
                      onChange={(e) => handleChange('heroTitleLine1', e.target.value)}
                      placeholder="Pune's Finest"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelCls}>Title Line 2 Highlight</label>
                    <input
                      type="text"
                      value={form.heroTitleLine2Highlight || ''}
                      onChange={(e) => handleChange('heroTitleLine2Highlight', e.target.value)}
                      placeholder="Luxury Homes"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelCls}>Title Line 3</label>
                    <input
                      type="text"
                      value={form.heroTitleLine3 || ''}
                      onChange={(e) => handleChange('heroTitleLine3', e.target.value)}
                      placeholder="For NRIs"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description Paragraph</label>
                  <textarea
                    rows={3}
                    value={form.heroDescription || ''}
                    onChange={(e) => handleChange('heroDescription', e.target.value)}
                    placeholder="Brief intro block below the titles..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Background Video MP4/WebM URL</label>
                    <input
                      type="url"
                      value={form.heroVideoUrl || ''}
                      onChange={(e) => handleChange('heroVideoUrl', e.target.value)}
                      placeholder="Direct link to CDN MP4 video"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Mobile/Fallback Banner Image</label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={form.heroMobileImageUrl || ''}
                        onChange={(e) => handleChange('heroMobileImageUrl', e.target.value)}
                        placeholder="Image URL"
                        className={`${inputCls} flex-1`}
                      />
                      <label className="shrink-0 flex items-center justify-center p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 cursor-pointer transition-colors border border-dashed border-gray-300 dark:border-white/20">
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gold" />
                        ) : (
                          <Image className="w-4 h-4 text-gray-500 dark:text-white/60" />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-navy dark:text-white text-lg">Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Phone Line 1</label>
                    <input
                      type="text"
                      value={form.contactPhone1 || ''}
                      onChange={(e) => handleChange('contactPhone1', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={form.contactPhone2 || ''}
                      onChange={(e) => handleChange('contactPhone2', e.target.value)}
                      placeholder="+91 98765 43211"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-1">
                    <label className={labelCls}>Main Contact Email</label>
                    <input
                      type="email"
                      value={form.contactEmail1 || ''}
                      onChange={(e) => handleChange('contactEmail1', e.target.value)}
                      placeholder="hello@company.com"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelCls}>Secondary Email</label>
                    <input
                      type="email"
                      value={form.contactEmail2 || ''}
                      onChange={(e) => handleChange('contactEmail2', e.target.value)}
                      placeholder="careers@company.com"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelCls}>WhatsApp Mobile Number</label>
                    <input
                      type="text"
                      value={form.contactWhatsApp || ''}
                      onChange={(e) => handleChange('contactWhatsApp', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Office Address</label>
                  <input
                    type="text"
                    value={form.contactAddress || ''}
                    onChange={(e) => handleChange('contactAddress', e.target.value)}
                    placeholder="Full headquarters address"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Office Hours (Weekdays)</label>
                    <input
                      type="text"
                      value={form.contactOfficeHoursWeekdays || ''}
                      onChange={(e) => handleChange('contactOfficeHoursWeekdays', e.target.value)}
                      placeholder="e.g. Mon-Sat: 9:00 AM - 7:00 PM"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Office Hours (Sunday)</label>
                    <input
                      type="text"
                      value={form.contactOfficeHoursSunday || ''}
                      onChange={(e) => handleChange('contactOfficeHoursSunday', e.target.value)}
                      placeholder="e.g. Sunday: 10:00 AM - 4:00 PM"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-navy dark:text-white text-lg">Website Statistics Counters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Years of Market Expertise</label>
                    <input
                      type="number"
                      value={form.stats?.experience || 0}
                      onChange={(e) => handleNestedChange('stats', 'experience', parseInt(e.target.value) || 0)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Premium Properties sold</label>
                    <input
                      type="number"
                      value={form.stats?.propertiesSold || 0}
                      onChange={(e) => handleNestedChange('stats', 'propertiesSold', parseInt(e.target.value) || 0)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Happy Clients Served (%)</label>
                    <input
                      type="number"
                      value={form.stats?.happyClients || 0}
                      onChange={(e) => handleNestedChange('stats', 'happyClients', parseInt(e.target.value) || 0)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Total Deals Closed</label>
                    <input
                      type="number"
                      value={form.stats?.dealsClosed || 0}
                      onChange={(e) => handleNestedChange('stats', 'dealsClosed', parseInt(e.target.value) || 0)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'socials' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-navy dark:text-white text-lg">Social Media Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>LinkedIn URL</label>
                    <input
                      type="text"
                      value={form.socials?.linkedin || ''}
                      onChange={(e) => handleNestedChange('socials', 'linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Instagram URL</label>
                    <input
                      type="text"
                      value={form.socials?.instagram || ''}
                      onChange={(e) => handleNestedChange('socials', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Facebook URL</label>
                    <input
                      type="text"
                      value={form.socials?.facebook || ''}
                      onChange={(e) => handleNestedChange('socials', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Twitter / X URL</label>
                    <input
                      type="text"
                      value={form.socials?.twitter || ''}
                      onChange={(e) => handleNestedChange('socials', 'twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-150 dark:border-white/10">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all duration-200 hover:brightness-105 active:scale-95 disabled:opacity-60 cursor-pointer shadow-luxury"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Website Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-[#071A2F] text-white border border-white/10 shadow-luxury space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
              <Eye className="w-3.5 h-3.5" /> Brand Preview
            </div>
            
            {/* Logo Preview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #E5C17D 0%, #ECD7AA 50%, #C69D59 100%)' }}
              >
                {form.logoIconImage ? (
                  <img src={form.logoIconImage} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-navy font-display font-black text-sm">{getLogoInitials(form)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm tracking-tight text-white">
                  {renderBrandLogo(form, '#E5C17D')}
                </p>

                <p className="text-[8px] font-accent tracking-[0.2em] text-white/50 uppercase mt-0.5 truncate">
                  {form.logoSubtitle || ''}
                </p>
              </div>
            </div>

            {/* Banner Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] flex items-end p-4">
              <img
                src={form.heroMobileImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                alt="Banner preview"
                className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.4]"
              />
              <div className="relative z-10 space-y-2">
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80 font-accent uppercase tracking-widest">
                  {form.heroTagline || "PREMIER PLATFORM"}
                </span>
                <h4 className="font-display font-black text-lg leading-tight text-white">
                  {form.heroTitleLine1 || 'Pune\'s Finest'}{' '}
                  <span className="text-gold block">{form.heroTitleLine2Highlight || 'Luxury Homes'}</span>
                  {form.heroTitleLine3 || 'For NRIs'}
                </h4>
                <p className="text-[10px] text-white/60 leading-normal line-clamp-2">
                  {form.heroDescription || 'Description...'}
                </p>
              </div>
            </div>

            {/* Contact info Preview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-2">Footer Details</p>
              <p className="text-white/60 truncate"><strong>Phone:</strong> {form.contactPhone1}</p>
              <p className="text-white/60 truncate"><strong>Email:</strong> {form.contactEmail1}</p>
              <p className="text-white/60 text-wrap leading-relaxed"><strong>Address:</strong> {form.contactAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Logo Crop Modal */}
      {cropSrc && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="bg-[#0D1527] border border-white/10 rounded-[2rem] w-full max-w-sm p-6 text-white space-y-6 shadow-luxury">
            <div className="text-center">
              <h3 className="font-display font-bold text-base text-white">Adjust Logo Crop</h3>
              <p className="text-[11px] text-white/50 mt-1">Drag the logo inside the gold box, and use the slider to zoom.</p>
            </div>

            {/* Viewport Box */}
            <div className="flex justify-center">
              <div 
                className="w-60 h-60 relative overflow-hidden rounded-3xl border-2 border-gold bg-black/40 flex items-center justify-center select-none cursor-move touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <img
                  ref={cropImgRef}
                  src={cropSrc}
                  alt="Crop preview"
                  style={{
                    transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${cropZoom})`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-2 px-1">
              <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider">
                <span>Zoom Scale</span>
                <span>{Math.round(cropZoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={cropZoom}
                onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                className="w-full accent-gold bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeCropper}
                className="flex-1 py-3 text-xs font-bold rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeCrop}
                disabled={uploading}
                className="flex-1 py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-extrabold hover:brightness-105 transition-all shadow-luxury flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                  </>
                ) : (
                  'Apply Crop'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
