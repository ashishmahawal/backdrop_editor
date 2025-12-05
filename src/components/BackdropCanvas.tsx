import React, { useEffect, useRef, useState } from 'react';
import type { TextConfig } from './TextControls';
import './BackdropCanvas.css';
import { pipeline, env, RawImage } from '@xenova/transformers';

// Skip local model checks
env.allowLocalModels = false;
env.useBrowserCache = false;

interface BackdropCanvasProps {
    image: File | null;
    textConfig: TextConfig;
    onConfigChange?: (config: TextConfig) => void;
}

export interface BackdropCanvasHandle {
    saveImage: () => void;
    copyImage: () => Promise<void>;
}

export const BackdropCanvas = React.forwardRef<BackdropCanvasHandle, BackdropCanvasProps>(
    ({ image, textConfig, onConfigChange }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [isDragging, setIsDragging] = React.useState(false);
        const dragStartRef = useRef<{ x: number; y: number } | null>(null);
        const textPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

        // AI state
        const [depthMap, setDepthMap] = useState<RawImage | null>(null);
        const [isProcessing, setIsProcessing] = useState(false);
        const [processingMessage, setProcessingMessage] = useState('');
        const lastProcessedImageRef = useRef<string | null>(null);

        React.useImperativeHandle(ref, () => ({
            saveImage: () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const link = document.createElement('a');
                link.download = 'backdrop-image.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            },
            copyImage: async () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                try {
                    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
                    if (blob) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        alert('Image copied to clipboard!');
                    }
                } catch (err) {
                    console.error('Failed to copy image:', err);
                    alert('Failed to copy image');
                }
            }
        }));

        // Initialize position if not set
        useEffect(() => {
            if (canvasRef.current && (textConfig.x === 0 && textConfig.y === 0)) {
                const canvas = canvasRef.current;
                onConfigChange?.({
                    ...textConfig,
                    x: canvas.width / 2,
                    y: canvas.height / 2
                });
            }
        }, [canvasRef.current?.width, canvasRef.current?.height]);

        // Handle Depth Estimation
        useEffect(() => {
            if (!image) return;

            const imageId = image.name + image.lastModified;
            if (lastProcessedImageRef.current === imageId && depthMap) return;

            const processDepth = async () => {
                setIsProcessing(true);
                setProcessingMessage('Analyzing depth...');
                try {
                    const pipe = await pipeline('depth-estimation', 'Xenova/depth-anything-small-hf');
                    const url = URL.createObjectURL(image);
                    const output = await pipe(url) as { depth: RawImage };
                    setDepthMap(output.depth);
                    lastProcessedImageRef.current = imageId;
                } catch (error) {
                    console.error('Depth estimation failed:', error);
                } finally {
                    setIsProcessing(false);
                }
            };

            processDepth();
        }, [image]);

        // Reset state when image changes
        useEffect(() => {
            if (image) {
                const imageId = image.name + image.lastModified;
                if (lastProcessedImageRef.current !== imageId) {
                    setDepthMap(null);
                    lastProcessedImageRef.current = null;
                }
            }
        }, [image]);

        const draw = (overrideX?: number, overrideY?: number) => {
            if (!image || !canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            const img = new Image();
            img.src = URL.createObjectURL(image);

            img.onload = () => {
                // Set canvas dimensions to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 1. Draw original image (Background)
                ctx.drawImage(img, 0, 0);

                // 2. Prepare Text Layer
                const textCanvas = document.createElement('canvas');
                textCanvas.width = canvas.width;
                textCanvas.height = canvas.height;
                const textCtx = textCanvas.getContext('2d');
                if (!textCtx) return;

                textCtx.save();
                textCtx.globalCompositeOperation = textConfig.blendMode;
                textCtx.globalAlpha = textConfig.opacity;
                textCtx.font = `bold ${textConfig.fontSize}px 'Inter', sans-serif`;
                textCtx.textAlign = 'center';
                textCtx.textBaseline = 'middle';

                const x = overrideX ?? (textConfig.x || canvas.width / 2);
                const y = overrideY ?? (textConfig.y || canvas.height / 2);

                // Update ref only if not overriding (sync with props) or if overriding (sync with drag)
                textPosRef.current = { x, y };

                // Handle text transformation
                const textContent = textConfig.isUppercase ? textConfig.text.toUpperCase() : textConfig.text;
                const lines = textContent.split('\n');
                const lineHeight = textConfig.fontSize * 1.1; // 1.1 line height
                const totalHeight = lineHeight * lines.length;
                const startY = y - (totalHeight / 2) + (lineHeight / 2);

                lines.forEach((line, index) => {
                    const lineY = startY + (index * lineHeight);

                    if (textConfig.isGradient) {
                        const metrics = textCtx.measureText(line);
                        const textWidth = metrics.width;
                        const textHeight = textConfig.fontSize;
                        const angleRad = (textConfig.gradientAngle * Math.PI) / 180;
                        const halfWidth = textWidth / 2;
                        const halfHeight = textHeight / 2;

                        const gradient = textCtx.createLinearGradient(
                            x - halfWidth * Math.cos(angleRad),
                            lineY - halfHeight * Math.sin(angleRad),
                            x + halfWidth * Math.cos(angleRad),
                            lineY + halfHeight * Math.sin(angleRad)
                        );

                        gradient.addColorStop(0, textConfig.gradientStart);
                        gradient.addColorStop(1, textConfig.gradientEnd);
                        textCtx.fillStyle = gradient;
                    } else {
                        textCtx.fillStyle = textConfig.color;
                    }

                    textCtx.fillText(line, x, lineY);
                });
                textCtx.restore();

                // 3. Apply Depth Occlusion
                if (depthMap && textConfig.depth > 0) {
                    const textData = textCtx.getImageData(0, 0, canvas.width, canvas.height);
                    const depthCanvas = document.createElement('canvas');
                    depthCanvas.width = canvas.width;
                    depthCanvas.height = canvas.height;
                    const depthCtx = depthCanvas.getContext('2d');

                    const depthImg = depthMap.toCanvas();
                    depthCtx?.drawImage(depthImg, 0, 0, canvas.width, canvas.height);
                    const depthData = depthCtx?.getImageData(0, 0, canvas.width, canvas.height);

                    if (depthData) {
                        const threshold = 255 - (textConfig.depth * 2.55);
                        const pixels = textData.data;
                        const depthPixels = depthData.data;

                        for (let i = 0; i < pixels.length; i += 4) {
                            if (pixels[i + 3] === 0) continue;
                            const pixelDepth = depthPixels[i];
                            if (pixelDepth > threshold) {
                                pixels[i + 3] = 0;
                            }
                        }
                        textCtx.putImageData(textData, 0, 0);
                    }
                }

                // 4. Draw Final Text Layer
                ctx.drawImage(textCanvas, 0, 0);
            };
        };

        useEffect(() => {
            draw();
        }, [image, textConfig, depthMap]);

        const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return null;

            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        };

        const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
            // Prevent default behavior for touch events to avoid scrolling/zooming
            if ('touches' in e) {
                // e.preventDefault(); // Commented out as passive listeners might complain, relying on touch-action CSS
            }

            const coords = getCanvasCoordinates(e);
            if (!coords) return;

            const dist = Math.sqrt(
                Math.pow(coords.x - textPosRef.current.x, 2) +
                Math.pow(coords.y - textPosRef.current.y, 2)
            );

            if (dist < textConfig.fontSize * 2) {
                setIsDragging(true);
                dragStartRef.current = {
                    x: coords.x - textPosRef.current.x,
                    y: coords.y - textPosRef.current.y
                };
            }
        };

        const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
            if (!isDragging || !dragStartRef.current || !onConfigChange) return;
            e.preventDefault();

            const coords = getCanvasCoordinates(e);
            if (!coords) return;

            const newX = coords.x - dragStartRef.current.x;
            const newY = coords.y - dragStartRef.current.y;

            // Draw immediately with new coordinates
            requestAnimationFrame(() => draw(newX, newY));
        };

        const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
            if (!isDragging || !dragStartRef.current || !onConfigChange) return;

            // Finalize position
            const coords = getCanvasCoordinates(e);
            if (coords) {
                const newX = coords.x - dragStartRef.current.x;
                const newY = coords.y - dragStartRef.current.y;

                onConfigChange({
                    ...textConfig,
                    x: newX,
                    y: newY
                });
            }

            setIsDragging(false);
            dragStartRef.current = null;
        };

        if (!image) return null;

        return (
            <div className="backdrop-canvas-container" ref={containerRef}>
                {isProcessing && (
                    <div className="processing-overlay">
                        <div className="spinner"></div>
                        <p>{processingMessage}</p>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="backdrop-canvas"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                />
            </div>
        );
    }
);
