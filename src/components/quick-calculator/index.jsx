"use client";
import React, { useState, useEffect } from 'react';
import { getPrices } from '@/services/price-methods';
import { FaCalculator, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const QuickCalculator = () => {
    const [prices, setPrices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await getPrices();
                setPrices(data);
                if (data.length > 0) setSelectedCategory(data[0].id);
            } catch (error) {
                console.error("Fiyatlar yüklenemedi", error);
            }
        };
        fetchPrices();
    }, []);

    const handleCalculate = (e) => {
        e.preventDefault();
        const category = prices.find(p => p.id === selectedCategory);
        if (!category || !weight) return;

        // Basit hesap: İlk alt türün ortalama fiyatını baz alalım
        const subtype = category.subtypes?.[0];
        if (!subtype) return;

        const avgPrice = (parseFloat(subtype.priceMin) + parseFloat(subtype.priceMax || subtype.priceMin)) / 2;
        const total = avgPrice * parseFloat(weight);
        setResult(total);
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-auto md:mx-0 text-left">
            <div className="flex items-center gap-3 mb-4 text-white">
                <div className="p-2 bg-blue-500 rounded-lg">
                    <FaCalculator />
                </div>
                <h3 className="font-bold text-lg">Hızlı Hesapla</h3>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                    <label className="block text-blue-200 text-xs mb-1">Hurda Türü</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setResult(null); }}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 option:bg-gray-800"
                    >
                        {prices.map(p => (
                            <option key={p.id} value={p.id} className="text-gray-900">{p.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-blue-200 text-xs mb-1">Kilo (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => { setWeight(e.target.value); setResult(null); }}
                        placeholder="Örn: 100"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="pt-2">
                    {result !== null ? (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center animate-fadeIn">
                            <span className="block text-green-300 text-sm">Tahmini Kazanç</span>
                            <span className="text-2xl font-bold text-white">{result.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            Hesapla <FaChevronRight size={12} />
                        </button>
                    )}
                </div>

                {result !== null && (
                    <button
                        type="button"
                        onClick={() => router.push(`/hurda-${prices.find(p => p.id === selectedCategory)?.slug}-fiyatlari`)}
                        className="w-full text-blue-200 text-xs hover:text-white underline text-center"
                    >
                        Detaylı Tabloyu Gör
                    </button>
                )}
            </form>
        </div>
    );
};

export default QuickCalculator;
