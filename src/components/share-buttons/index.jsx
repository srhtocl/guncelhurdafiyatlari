import React from 'react';
import { FaShareAlt } from 'react-icons/fa';

const ShareButton = () => {
    const handleShare = async () => {
        const shareData = {
            title: document.title,
            text: 'Güncel hurda fiyatlarını inceleyin!',
            url: window.location.href,
        };

        // Web Share API (HTTPS required)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
            aria-label="Paylaş"
            title="Paylaş"
        >
            <FaShareAlt size={20} />
        </button>
    );
};

export default ShareButton;
