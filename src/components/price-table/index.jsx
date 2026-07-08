"use client";
import React, { useEffect, useState } from 'react';
import { getPriceBySlug } from '@/services/price-methods';
import { FaExclamationCircle, FaCalendarAlt } from 'react-icons/fa';

const PriceTable = ({ slug, data }) => {
    const [priceData, setPriceData] = useState(data || null);
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (data) {
            setPriceData(data);
            setLoading(false);
            return;
        }

        const fetchPriceData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedData = await getPriceBySlug(slug);
                setPriceData(fetchedData);
            } catch (err) {
                console.error("Error fetching price data:", err);
                setError("Fiyat bilgileri yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPriceData();
        }
    }, [slug, data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <div className="text-gray-600">Tablo Yükleniyor...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg text-center">
                <FaExclamationCircle className="text-red-500 text-3xl mb-2" />
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    if (!priceData) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Last Updated Header inside Table Component */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-end items-center">
                <div className="flex items-center text-gray-500 text-xs">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                        Son Güncelleme: {priceData.updatedAt?.seconds ? new Date(priceData.updatedAt.seconds * 1000).toLocaleDateString('tr-TR') : 'Tarih yok'}
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Hurda Türü
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Fiyat Aralığı
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Birim
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {priceData.subtypes && priceData.subtypes.map((subtype, index) => (
                            <tr key={index} className="hover:bg-blue-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {subtype.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                    {subtype.priceMin} TL - {subtype.priceMax} TL
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {subtype.unit}
                                </td>
                            </tr>
                        ))}
                        {(!priceData.subtypes || priceData.subtypes.length === 0) && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    Bu kategori için henüz fiyat girilmemiş.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PriceTable;
