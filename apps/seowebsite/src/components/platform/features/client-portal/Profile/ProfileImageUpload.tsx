import { useState, useRef } from 'react';
import { Camera, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/platform/mobile/api';

interface ProfileImageUploadProps {
  userId: string;
  currentImage?: string;
  userName: string;
  onImageUpdate?: (imageUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

export function ProfileImageUpload({ 
  userId, 
  currentImage, 
  userName, 
  onImageUpdate,
  size = 'md',
  editable = true
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-32 h-32 text-5xl'
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const result = await api.uploadProfileImage(userId, formData);
      
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        onImageUpdate?.(result.imageUrl);
        toast.success('Profile image updated!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block">
      <motion.div
        whileHover={editable ? { scale: 1.02 } : {}}
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${
          editable ? 'cursor-pointer' : ''
        }`}
        onClick={handleClick}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center">
            {initials}
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </motion.div>

      {editable && !isUploading && (
        <button
          onClick={handleClick}
          className={`absolute bottom-0 right-0 ${
            size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-9 h-9'
          } bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors`}
        >
          <Camera className={`${
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          } text-white`} />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}



