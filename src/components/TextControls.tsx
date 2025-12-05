import React from 'react';
import './TextControls.css';

export interface TextConfig {
    text: string;
    fontSize: number;
    color: string;
    opacity: number;
    x: number;
    y: number;
    blendMode: GlobalCompositeOperation;
    isGradient: boolean;
    gradientStart: string;
    gradientEnd: string;
    gradientAngle: number;
    depth: number; // 0 = Front, 100 = Back
    isUppercase: boolean;
}

interface TextControlsProps {
    config: TextConfig;
    onChange: (config: TextConfig) => void;
}

export const TextControls: React.FC<TextControlsProps> = ({ config, onChange }) => {
    const handleChange = (key: keyof TextConfig, value: any) => {
        onChange({ ...config, [key]: value });
    };

    return (
        <div className="text-controls">
            <h3>Text Settings</h3>

            <div className="control-group">
                <label>Text Content</label>
                <textarea
                    value={config.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    placeholder="Enter backdrop text..."
                    rows={3}
                />
            </div>

            <div className="control-group">
                <label>
                    <input
                        type="checkbox"
                        checked={config.isUppercase}
                        onChange={(e) => handleChange('isUppercase', e.target.checked)}
                    />
                    Uppercase
                </label>
            </div>

            <div className="control-group">
                <label>Font Size ({config.fontSize}px)</label>
                <input
                    type="range"
                    min="20"
                    max="400"
                    value={config.fontSize}
                    onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    <input
                        type="checkbox"
                        checked={config.isGradient}
                        onChange={(e) => handleChange('isGradient', e.target.checked)}
                    />
                    Enable Gradient
                </label>
            </div>

            {!config.isGradient ? (
                <div className="control-group">
                    <label>Color</label>
                    <input
                        type="color"
                        value={config.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                    />
                </div>
            ) : (
                <>
                    <div className="control-group">
                        <label>Start Color</label>
                        <input
                            type="color"
                            value={config.gradientStart}
                            onChange={(e) => handleChange('gradientStart', e.target.value)}
                        />
                    </div>
                    <div className="control-group">
                        <label>End Color</label>
                        <input
                            type="color"
                            value={config.gradientEnd}
                            onChange={(e) => handleChange('gradientEnd', e.target.value)}
                        />
                    </div>
                    <div className="control-group">
                        <label>Angle ({config.gradientAngle}°)</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={config.gradientAngle}
                            onChange={(e) => handleChange('gradientAngle', Number(e.target.value))}
                        />
                    </div>
                </>
            )}

            <div className="control-group">
                <label>
                    Text Depth ({config.depth}%)
                    <span className="label-hint">
                        {config.depth === 0 ? ' (Front)' : config.depth === 100 ? ' (Back)' : ' (In Between)'}
                    </span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.depth}
                    onChange={(e) => handleChange('depth', Number(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>Opacity ({Math.round(config.opacity * 100)}%)</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.opacity}
                    onChange={(e) => handleChange('opacity', Number(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>Blend Mode</label>
                <select
                    value={config.blendMode}
                    onChange={(e) => handleChange('blendMode', e.target.value)}
                >
                    <option value="source-over">Normal</option>
                    <option value="multiply">Multiply</option>
                    <option value="screen">Screen</option>
                    <option value="overlay">Overlay</option>
                    <option value="darken">Darken</option>
                    <option value="lighten">Lighten</option>
                    <option value="color-dodge">Color Dodge</option>
                    <option value="color-burn">Color Burn</option>
                    <option value="hard-light">Hard Light</option>
                    <option value="soft-light">Soft Light</option>
                    <option value="difference">Difference</option>
                    <option value="exclusion">Exclusion</option>
                </select>
            </div>

            <div className="control-group position-controls">
                <label>Position</label>
                <div className="xy-inputs">
                    <div>
                        <span>X:</span>
                        <input
                            type="number"
                            value={config.x}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <span>Y:</span>
                        <input
                            type="number"
                            value={config.y}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
