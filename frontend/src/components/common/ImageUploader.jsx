import { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../../utils/adminApi';

export default function ImageUploader({ value, onChange, label = 'Upload Image' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setLoading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const safeId = label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  return (
    <div>
      {label && <label className="block text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-1">{label}</label>}
      
      {value ? (
        <div className="relative rounded-xl overflow-hidden group border border-gray-200 dark:border-white/10 h-32 w-full bg-black/5">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center hover:border-gold dark:hover:border-gold/50 cursor-pointer transition-colors relative bg-white dark:bg-white/5 h-32 flex flex-col items-center justify-center"
          onClick={() => document.getElementById(`file-upload-${safeId}`).click()}
        >
          <input
            id={`file-upload-${safeId}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-gold" style={{ color: '#D4AF37' }} />
              <span className="text-xs text-gray-500 dark:text-white/40">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="w-6 h-6 text-gray-400 dark:text-white/30" />
              <span className="text-xs text-gray-500 dark:text-white/50">
                Drag & drop or <span className="text-gold font-semibold" style={{ color: '#D4AF37' }}>browse</span>
              </span>
              <span className="text-[10px] text-gray-400 dark:text-white/30">PNG, JPG, WEBP up to 5MB</span>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
