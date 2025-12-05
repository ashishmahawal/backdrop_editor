import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title = 'Backdrop Editor - Professional Image Text Overlay',
    description = 'Create professional text backdrops and overlays in seconds with AI-powered depth detection.',
    image = 'https://ashishmahawal.github.io/backdrop_editor/vite.svg', // Ideally replace with a real OG image
    url = 'https://ashishmahawal.github.io/backdrop_editor/',
    type = 'website',
}) => {
    const fullTitle = title === 'Backdrop Editor - Professional Image Text Overlay'
        ? title
        : `${title} | Backdrop Editor`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description} />
            <link rel="canonical" href={url} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};
