import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Type, Download, Zap, Palette } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Elevate Your <span className="gradient-text">Visuals</span>
                    </h1>
                    <p className="hero-subtitle">
                        Create professional text backdrops and overlays in seconds.
                        Smart depth detection, gradient effects, and premium typography.
                    </p>
                    <Link to="/editor" className="cta-button">
                        Launch Editor <Zap size={20} />
                    </Link>
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    <div className="feature-icon"><Layers /></div>
                    <h3>Smart Depth</h3>
                    <p>AI-powered subject detection places text seamlessly behind your subject.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Palette /></div>
                    <h3>Gradient Text</h3>
                    <p>Create stunning gradient effects with custom angles and color stops.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Type /></div>
                    <h3>Premium Type</h3>
                    <p>Curated typography with advanced blend modes and opacity controls.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Download /></div>
                    <h3>Instant Export</h3>
                    <p>Save as high-quality PNG or copy directly to your clipboard.</p>
                </div>
            </section>
        </div>
    );
};
