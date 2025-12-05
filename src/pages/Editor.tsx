import React, { useState, useRef } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { TextControls } from '../components/TextControls';
import type { TextConfig } from '../components/TextControls';
import { BackdropCanvas } from '../components/BackdropCanvas';
import type { BackdropCanvasHandle } from '../components/BackdropCanvas';

export const Editor: React.FC = () => {
    const canvasRef = useRef<BackdropCanvasHandle>(null);
    const [image, setImage] = useState<File | null>(null);
    const [textConfig, setTextConfig] = useState<TextConfig>({
        text: 'BACKDROP',
        fontSize: 80,
        color: '#ffffff',
        opacity: 0.8,
        x: 0,
        y: 0,
        blendMode: 'overlay',
        isGradient: false,
        gradientStart: '#ffffff',
        gradientEnd: '#000000',
        gradientAngle: 45,
        depth: 0
    });

    const handleSave = () => {
        canvasRef.current?.saveImage();
    };

    const handleCopy = () => {
        canvasRef.current?.copyImage();
    };

    return (
        <div className="editor-container">
            {!image ? (
                <div className="placeholder">
                    <ImageUploader onImageUpload={setImage} />
                </div>
            ) : (
                <div className="main-content">
                    <div className="editor-panel">
                        <div className="panel-header">
                            <h2>Controls</h2>
                            <div className="header-actions">
                                <button className="action-btn" onClick={handleCopy} title="Copy to Clipboard">📋</button>
                                <button className="action-btn" onClick={handleSave} title="Save Image">💾</button>
                                <button className="reset-btn" onClick={() => setImage(null)}>New</button>
                            </div>
                        </div>
                        <TextControls config={textConfig} onChange={setTextConfig} />
                    </div>
                    <div className="preview-panel">
                        <BackdropCanvas
                            ref={canvasRef}
                            image={image}
                            textConfig={textConfig}
                            onConfigChange={setTextConfig}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
