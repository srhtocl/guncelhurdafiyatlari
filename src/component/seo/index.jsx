import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, keywords, canonicalUrl }) => {
    const defaultTitle = "Hurda Fiyatları - Güncel Hurda Borsası";
    const defaultDescription = "Güncel hurda demir, bakır, alüminyum, sarı, krom ve kablo fiyatları. Anlık hurda borsası takibi.";
    const defaultKeywords = "hurda fiyatları, güncel hurda fiyatları, hurda demir, hurda bakır, hurda alüminyum";

    const siteUrl = "https://bereketlimetal.online";
    const canonical = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`) : window.location.href;

    return (
        <Helmet>
            <title>{title ? `${title} | Hurda Fiyatları` : defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={canonical} />

            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical} />
        </Helmet>
    );
};

export default SEO;
