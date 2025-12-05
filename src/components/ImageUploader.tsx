import React, { useCallback } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                onImageUpload(files[0]);
            }
        },
        [onImageUpload]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onImageUpload(files[0]);
        }
    };

    return (
        <div
            className="image-uploader"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                id="file-input"
                className="file-input"
            />
            <label htmlFor="file-input" className="upload-label">
                <div className="upload-icon">📁</div>
                <p>Drag & Drop or Click to Upload Image</p>
            </label>
        </div>
    );
};
