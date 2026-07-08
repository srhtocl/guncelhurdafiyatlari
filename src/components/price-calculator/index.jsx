"use client";
import React, { useState, useEffect } from 'react';
import { getPriceBySlug } from '@/services/price-methods';
import { FaCalculator, FaMoneyBillWave } from 'react-icons/fa';

const PriceCalculator = ({ slug }) => {
    const [priceData, setPriceData] = useState(null);
    const [selectedSubtype, setSelectedSubtype] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchPrices = async () => {
            if (!slug) return;
            try {
                const data = await getPriceBySlug(slug);
                setPriceData(data);
                if (data?.subtypes?.length > 0) {
                    setSelectedSubtype(data.subtypes[0].name);
                }
            } catch (error) {
                console.error("Error fetching prices for calculator:", error);
            }
        };
        fetchPrices();
    }, [slug]);

    const calculatePrice = () => {
        if (!selectedSubtype || !weight || !priceData) return;

        const subtype = priceData.subtypes.find(s => s.name === selectedSubtype);
        if (!subtype) return;

        // Ortalama fiyatı baz alıyoruz: (Min + Max) / 2
        const avgPrice = (parseFloat(subtype.priceMin) + parseFloat(subtype.priceMax || subtype.priceMin)) / 2;
        const total = avgPrice * parseFloat(weight);

        setResult({
            total: total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            price: avgPrice.toFixed(2)
        });
    };

    if (!priceData || !priceData.subtypes) return null;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-100 mt-8">
            <div className="flex items-center mb-6">
                <div className="bg-blue-600 p-3 rounded-full text-white mr-4 shadow-md">
                    <FaCalculator size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Hurda Değeri Hesapla</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hurda Türü</label>
                    <select
                        value={selectedSubtype}
                        onChange={(e) => setSelectedSubtype(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    >
                        {priceData.subtypes.map((subtype, index) => (
                            <option key={index} value={subtype.name}>
                                {subtype.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahmini Ağırlık (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Örn: 100"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    />
                </div>
            </div>

            <button
                onClick={calculatePrice}
                className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md active:transform active:scale-95"
            >
                HESAPLA
            </button>

            {result && (
                <div className="mt-6 bg-white p-4 rounded-lg border border-green-200 shadow-sm animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Birim Fiyat (Ort.)</p>
                            <p className="font-semibold text-gray-700">{result.price} ₺ / kg</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tahmini Tutar</p>
                            <p className="text-2xl font-bold text-green-600 flex items-center justify-end">
                                <FaMoneyBillWave className="mr-2" />
                                {result.total} ₺
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        * Bu hesaplama ortalama fiyatlar üzerinden yapılmıştır. Kesin fiyat için bizimle iletişime geçiniz.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PriceCalculator;
