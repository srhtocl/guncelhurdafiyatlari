import React, { useState, useEffect } from 'react';
import PriceTable from '@/component/price-table';
import PriceChart from '@/component/price-chart';
import PriceCalculator from '@/component/price-calculator';
import SEO from '@/component/seo';
import { getPricePageData } from "@/services/price-methods";

const heroImage = "https://picsum.photos/1200/400";
const detailImage = "https://picsum.photos/600/400";

const AluminyumFiyatlari = () => {
    const [priceData, setPriceData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { price, history } = await getPricePageData("aluminyum");
                setPriceData(price);
                setHistoryData(history);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <SEO
                title="Güncel Hurda Alüminyum Fiyatları"
                description="Araiş, jant, profil ve sert hurda alüminyum fiyatları. Günlük güncellenen hurda alüminyum piyasası."
            />

            {/* Hero Section */}
            <div className="relative bg-gray-900 h-[300px] mb-12">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={heroImage}
                        alt="Hurda Alüminyum Sahası"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl drop-shadow-lg">
                        Hurda Alüminyum Fiyatları
                    </h1>
                    <p className="mt-4 text-xl text-gray-200 drop-shadow-md max-w-2xl mx-auto">
                        Güncel hurda alüminyum kg fiyatları ve piyasa analizi.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Data Sections */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <PriceTable slug="aluminyum" data={priceData} />
                        <PriceChart slug="aluminyum" data={historyData} currentSubtypes={priceData?.subtypes} />
                        <PriceCalculator slug="aluminyum" />
                    </>
                )}

                <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="relative h-64 md:h-auto">
                            <img
                                src={detailImage}
                                alt="Hurda Alüminyum Detay"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Alüminyum Geri Dönüşümü</h3>
                            <div className="prose text-gray-600">
                                <p className="mb-4">
                                    Alüminyum hurdalarınız adresinizden hassas kantarlarla tartılarak alınır.
                                    Ödemeleriniz anında nakit veya havale ile yapılır.
                                </p>
                                <p>
                                    Endüstriyel ve evsel alüminyum atıklarınız için en rekabetçi fiyatları sunuyoruz.
                                    Detaylı bilgi ve fiyat teklifi için bize ulaşın.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AluminyumFiyatlari;
