import React from 'react';
import Link from 'next/link';
import PriceTable from '@/components/price-table';
import PriceChart from '@/components/price-chart';
import PriceCalculator from '@/components/price-calculator';
import { getPricePageData } from "@/services/price-methods";
import { FaRecycle, FaChartLine } from 'react-icons/fa';

export async function generateMetadata({ params }) {
    // Next.js 15 requires params to be awaited
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    try {
        const { price } = await getPricePageData(slug);
        if (!price) {
            return { title: 'Sayfa Bulunamadı - Hurda Fiyatları' };
        }
        return {
            title: `Güncel ${price.title} Fiyatları - Hurda Fiyatları`,
            description: `${price.title} hurda fiyatları. Güncel piyasa verileri ve analizler.`,
        }
    } catch (error) {
        return { title: 'Hurda Fiyatları' };
    }
}

export default async function PriceDetail({ params }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    let priceData = null;
    let historyData = [];

    try {
        const data = await getPricePageData(slug);
        priceData = data.price;
        historyData = data.history;
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }

    if (!priceData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Aradığınız hurda fiyatı bulunamadı.</h2>
                <Link
                    href="/"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                    Anasayfaya Dön
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
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
                            <Link href="/iletisim" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-block">
                                Fiyat Teklifi Al
                            </Link>
                            <Link href="/iletisim" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium inline-block">
                                İletişime Geç
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
