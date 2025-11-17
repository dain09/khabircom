
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
    className?: string;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, className = 'h-64' }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File | undefined) => {
        setError(null); // Reset error on new selection
        if (!file) return;

        if (ALLOWED_TYPES.includes(file.type)) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            onImageSelect(file);
        } else {
            setError('الصيغة دي مش مدعومة. ارفع صورة PNG, JPG, أو WEBP.');
            onImageSelect(null);
        }
    }, [onImageSelect]);


    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(event.target.files?.[0]);
    }, [handleFileSelect]);

    const handleRemoveImage = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        onImageSelect(null);
        setError(null); // Reset error on removal
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [preview, onImageSelect]);

    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleFileSelect(event.dataTransfer.files?.[0]);
    }, [handleFileSelect]);

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className="w-full">
            <label 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 ${
                    error 
                    ? 'border-red-500' 
                    : preview 
                    ? 'border-primary' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${className}`}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="معاينة الصورة" className="object-contain h-full w-full rounded-lg p-2" />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                            aria-label="إزالة الصورة"
                        >
                            <X size={18} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">دوس هنا عشان ترفع صورة</span><br/> أو اسحبها وحطها هنا</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP</p>
                    </div>
                )}
                <input 
                    ref={fileInputRef} 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    accept={ALLOWED_TYPES.join(',')} 
                    onChange={handleFileChange} 
                />
            </label>
            {error && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};
