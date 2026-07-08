"use client";
import React, { useState, useEffect } from 'react';
import { getPrices } from '@/services/price-methods';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const PriceTicker = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await getPrices();
                // Opsiyonel: Sadece ana kategorileri veya belirli ürünleri filtreleyebiliriz
                // Şimdilik hepsini gösterelim
                setPrices(data);
            } catch (error) {
                console.error("Ticker fiyatları yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    if (loading || prices.length === 0) return null;

    // Rastgele trend iconu (Demo amaçlı - Gerçek veride geçmişle kıyaslanmalı)
    const getRandomTrend = () => {
        const r = Math.random();
        if (r > 0.6) return <FaArrowUp className="text-green-400 text-xs ml-1" />;
        if (r > 0.3) return <FaArrowDown className="text-red-400 text-xs ml-1" />;
        return <FaMinus className="text-gray-400 text-xs ml-1" />;
    };

    return (
        <div className="bg-gray-900 text-white overflow-hidden py-3 border-b border-gray-800 relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

            <div className="animate-marquee whitespace-nowrap flex items-center">
                {/* Sonsuz döngü efekti için listeyi iki kere yazıyoruz */}
                {[...prices, ...prices].map((price, index) => (
                    <div key={`${price.id}-${index}`} className="inline-flex items-center mx-6">
                        <span className="font-bold text-gray-300 text-sm">{price.title}:</span>
                        <span className="ml-2 font-mono text-white text-sm">
                            {price.subtypes && price.subtypes[0]
                                ? `${price.subtypes[0].priceMin} - ${price.subtypes[0].priceMax || price.subtypes[0].priceMin} ₺`
                                : 'Fiyat Sorunuz'}
                        </span>
                        {/* Gerçek trend verisi gelene kadar demo */}
                        {getRandomTrend()}
                    </div>
                ))}
            </div>

            {/* Tailwind Config'de 'marquee' animasyonu yoksa style olarak ekleyelim */}
        </div>
    );
};

export default PriceTicker;
