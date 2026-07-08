"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPriceHistory } from '@/services/price-methods';

const PriceChart = ({ slug, data, currentSubtypes }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(!data);

    useEffect(() => {
        const formatData = (rawData) => {
            // Helper to find ID by name for legacy data
            const findIdByName = (name) => {
                if (!currentSubtypes) return name; // Fallback to name if no current reference
                const found = currentSubtypes.find(s => s.name === name);
                return found ? found.id : name; // Use found ID, or keep name as key if orphaned
            };

            return rawData.map(item => {
                const date = item.date?.seconds ? new Date(item.date.seconds * 1000).toLocaleDateString('tr-TR') : '';
                const prices = {};

                if (item.subtypes) {
                    item.subtypes.forEach(sub => {
                        const avgPrice = (parseFloat(sub.priceMin) + parseFloat(sub.priceMax || sub.priceMin)) / 2;

                        // KEY LOGIC: Use ID if present, else try to map Name -> ID, else use Name
                        let key = sub.id;
                        if (!key) {
                            key = findIdByName(sub.name);
                        }

                        prices[key] = parseFloat(avgPrice.toFixed(2));
                    });
                }

                return {
                    date,
                    ...prices
                };
            });
        };

        if (data) {
            setHistoryData(formatData(data));
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const rawData = await getPriceHistory(slug);
                setHistoryData(formatData(rawData));
            } catch (error) {
                console.error("Error loading chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [slug, data, currentSubtypes]);

    if (loading) return <div className="text-center py-4 text-gray-500">Grafik yükleniyor...</div>;

    if (historyData.length < 2) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Fiyat Değişim Grafiği</h3>
                <p className="text-gray-500">Grafiğin oluşması için henüz yeterli veri yok. Fiyatlar güncellendikçe grafik burada belirecektir.</p>
                {historyData.length > 0 && <p className="text-xs text-gray-400 mt-2">(Şu an {historyData.length} veri noktası var, en az 2 gerekiyor)</p>}
            </div>
        );
    }

    // Determine all unique keys (IDs or Names) present in history
    const allKeys = new Set();
    historyData.forEach(item => {
        Object.keys(item).forEach(key => {
            if (key !== 'date') {
                allKeys.add(key);
            }
        });
    });
    const keys = Array.from(allKeys);
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    // Helper to get display name for a key (ID)
    const getDisplayName = (key) => {
        if (!currentSubtypes) return key;
        const found = currentSubtypes.find(s => s.id === key);
        // If found, show current name. If not (orphaned legacy name), show key itself.
        return found ? found.name : key;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Fiyat Değişim Grafiği (Son 30 Gün)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={historyData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="date" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} unit="₺" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            itemStyle={{ fontSize: '12px' }}
                            formatter={(value, name) => [value, getDisplayName(name)]}
                            labelStyle={{ color: '#374151', marginBottom: '0.5rem' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => getDisplayName(value)}
                        />
                        {keys.map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                name={key} // Used by Legend if formatter fails, but formatter handles it
                                stroke={colors[index % colors.length]}
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">* Fiyatlar ortalama değerler üzerinden hesaplanmıştır.</p>
        </div>
    );
};

export default PriceChart;
