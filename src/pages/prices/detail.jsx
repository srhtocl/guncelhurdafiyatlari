import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PriceTable from '@/component/price-table';
import PriceChart from '@/component/price-chart';
import PriceCalculator from '@/component/price-calculator';
import SEO from '@/component/seo';
import { getPricePageData } from "@/services/price-methods";
import { FaRecycle, FaChartLine } from 'react-icons/fa';

const PriceDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [priceData, setPriceData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(false);
            try {
                if (!slug) return;
                const { price, history } = await getPricePageData(slug);
                setPriceData(price);
                setHistoryData(history);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !priceData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Aradığınız hurda fiyatı bulunamadı.</h2>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Anasayfaya Dön
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <SEO
                title={`Güncel ${priceData.title} Fiyatları - Hurda Fiyatları`}
                description={`${priceData.title} hurda fiyatları. Güncel piyasa verileri ve analizler.`}
            />

            {/* Hero Section - No Image */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 h-[300px] mb-12 overflow-hidden flex flex-col justify-center items-center text-center px-4">
                {/* Abstract Background Elements */}
                <FaRecycle className="absolute text-white opacity-5 text-[400px] -right-20 -bottom-20 rotate-12 pointer-events-none" />
                <FaChartLine className="absolute text-green-500 opacity-5 text-[300px] -left-20 -top-20 -rotate-12 pointer-events-none" />

                <div className="relative max-w-4xl mx-auto z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold mb-4 border border-green-500/30">
                        Güncel Piyasa Verileri
                    </span>
                    <h1 className="text-4xl font-extrabold text-white sm:text-6xl drop-shadow-2xl mb-6">
                        {priceData.title}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Anlık {priceData.title.toLowerCase()} kg fiyatları, detaylı analizler ve piyasa grafikleri.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Data Sections */}
                <PriceTable slug={slug} data={priceData} />
                <PriceChart slug={slug} data={historyData} currentSubtypes={priceData?.subtypes} />
                <PriceCalculator slug={slug} />

                {/* Info Card - Text Only */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                                <FaRecycle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{priceData.title} Satışı Hakkında</h3>
                        </div>

                        <div className="prose prose-lg text-gray-600 max-w-none">
                            <p className="mb-4">
                                {priceData.title} hurdalarınız yerinde ve değerinde nakit olarak alınır.
                                Profesyonel ekibimiz ve geniş araç filomuzla hizmetinizdeyiz.
                                Sektördeki deneyimimizle size en doğru fiyatlamayı sunuyoruz.
                            </p>
                            <p className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500 text-gray-700 italic">
                                Yüksek tonajlı hurda satışlarınız için özel fiyat teklifi alabilirsiniz.
                                Bize ulaşarak güncel piyasa koşulları hakkında detaylı bilgi edinebilirsiniz.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button onClick={() => navigate('/iletisim')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                                Fiyat Teklifi Al
                            </button>
                            <button onClick={() => navigate('/iletisim')} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                                İletişime Geç
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceDetail;
