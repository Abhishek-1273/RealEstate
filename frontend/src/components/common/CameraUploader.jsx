import { useState, useRef, useEffect } from 'react';
import { Camera, UploadCloud, X, Loader2, Video, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage } from '../../utils/adminApi';

export default function CameraUploader({ values = [], onChange, maxImages = 5 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Webcam state
  const [showWebcam, setShowWebcam] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Stop camera stream on unmount or toggle
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleUploadFile = async (file) => {
    if (!file) return;
    if (values.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onChange([...values, url]);
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const removeImage = (indexToRemove) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  // Start Webcam
  const startCamera = async () => {
    setCameraError('');
    setShowWebcam(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please check permissions or use file upload.');
      setShowWebcam(false);
    }
  };

  // Stop Webcam
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowWebcam(false);
  };

  // Capture Photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video frame
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to Blob/File and upload
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `captured-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          stopCamera();
          await handleUploadFile(file);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleCameraClick = () => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      document.getElementById('native-camera-input').click();
    } else {
      if (showWebcam) {
        stopCamera();
      } else {
        startCamera();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gallery / File Picker */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-picker-input').click()}
          className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center hover:border-gold dark:hover:border-gold/50 cursor-pointer transition-all duration-300 bg-white dark:bg-white/5 flex flex-col items-center justify-center min-h-[140px]"
        >
          <input
            id="file-picker-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-gray-400 dark:text-white/30 mb-2" />
          <span className="text-xs font-bold text-navy dark:text-white">
            Upload from Gallery
          </span>
          <span className="text-[10px] text-gray-400 dark:text-cream/40 mt-1">
            Drag & drop or browse image files
          </span>
        </div>

        {/* Live Camera Capture Button */}
        <div
          onClick={handleCameraClick}
          className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center hover:border-gold dark:hover:border-gold/50 cursor-pointer transition-all duration-300 bg-white dark:bg-white/5 flex flex-col items-center justify-center min-h-[140px]"
        >
          <Camera className="w-8 h-8 text-gray-400 dark:text-white/30 mb-2" />
          <span className="text-xs font-bold text-navy dark:text-white">
            Take Live Photo
          </span>
          <span className="text-[10px] text-gray-400 dark:text-cream/40 mt-1">
            Capture using laptop or phone camera
          </span>
        </div>
      </div>

      {/* Hidden Mobile Native Camera Trigger */}
      {/* Triggered indirectly if user is on mobile browser */}
      <div className="hidden">
        <input
          id="native-camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
      </div>

      {/* Live Webcam Stream UI */}
      <AnimatePresence>
        {showWebcam && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-black shadow-2xl p-4 flex flex-col items-center"
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-950">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Overlays */}
              <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-xl" />
              <div className="absolute top-4 left-4 bg-red-500 text-white text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md animate-pulse">
                Live Camera
              </div>
            </div>

            {/* Webcam Actions */}
            <div className="flex gap-4 mt-4 w-full justify-center">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-navy bg-gradient-to-r from-gold to-gold-light hover:opacity-95 shadow-md active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
              >
                <Camera className="w-4 h-4 text-navy" /> Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all"
              >
                <StopCircle className="w-4 h-4" /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden canvas for snapshot rasterization */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Uploading Spinner */}
      {uploading && (
        <div className="flex items-center justify-center gap-3 py-4 text-xs font-semibold text-gold">
          <Loader2 className="w-5 h-5 animate-spin text-gold" style={{ color: '#D4AF37' }} />
          <span>Uploading and optimizing image...</span>
        </div>
      )}

      {/* Error Notices */}
      {(error || cameraError) && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
          {error || cameraError}
        </div>
      )}

      {/* Uploaded Gallery Preview */}
      {values.length > 0 && (
        <div>
          <h4 className="text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-3">
            Uploaded Photos ({values.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {values.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 dark:border-white/10 bg-black/5"
              >
                <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
