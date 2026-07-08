import React from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaRecycle, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <>
            {/* Desktop Footer */}
            <footer className="hidden md:block bg-gray-50 border-t border-gray-100 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-green-500 text-white p-2 rounded-lg">
                                    <FaRecycle className="text-xl" />
                                </div>
                                <span className="text-xl font-bold text-gray-700">Hurda Fiyatları</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Türkiye'nin her yerinden tonaj fark etmeksizin hurdalarınızı değerinde, yerinde ve nakit alıyoruz.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaFacebook size={20} /></a>
                                <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><FaInstagram size={20} /></a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FaTwitter size={20} /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">Hızlı Bağlantılar</h3>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Anasayfa</Link></li>
                                <li><Link href="/hizmetlerimiz" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Hizmetlerimiz</Link></li>
                                <li><Link href="/blog" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Blog</Link></li>
                                <li><Link href="/iletisim" className="text-gray-500 hover:text-green-600 text-sm transition-colors">İletişim</Link></li>
                            </ul>
                        </div>

                        {/* Prices */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">Hurda Fiyatları</h3>
                            <ul className="space-y-2">
                                <li><Link href="/hurda-demir-fiyatlari" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Demir Fiyatları</Link></li>
                                <li><Link href="/hurda-bakir-fiyatlari" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Bakır Fiyatları</Link></li>
                                <li><Link href="/hurda-aluminyum-fiyatlari" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Alüminyum Fiyatları</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">İletişim</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-500 text-sm">
                                    <FaMapMarkerAlt className="mt-1 text-green-500 shrink-0" />
                                    <span>Firuzköy Mahallesi, Hasan Önal Caddesi, Avcılar / İstanbul</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-500 text-sm">
                                    <FaPhone className="text-green-500 shrink-0" />
                                    <a href="tel:+905376646837" className="hover:text-green-600 transition-colors">+90 537 664 68 37</a>
                                </li>
                                <li className="flex items-center gap-3 text-gray-500 text-sm">
                                    <FaWhatsapp className="text-green-500 shrink-0" />
                                    <a href="https://wa.me/905376646837" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">WhatsApp Hattı</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} Hurda Fiyatları. Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Mobile Sticky Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white text-gray-600 z-40 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="grid grid-cols-3 h-16">
                    <a
                        href="https://wa.me/905376646837"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1 hover:bg-green-50 hover:text-green-600 transition-colors border-r border-gray-100"
                    >
                        <FaWhatsapp size={20} className="text-green-500" />
                        <span className="text-xs font-medium">WhatsApp</span>
                    </a>

                    <a
                        href="tel:+905376646837"
                        className="flex flex-col items-center justify-center gap-1 hover:bg-green-50 hover:text-green-600 transition-colors border-r border-gray-100"
                    >
                        <FaPhone size={20} className="rotate-90 text-green-500" />
                        <span className="text-xs font-medium">Telefon</span>
                    </a>

                    <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                        <FaMapMarkerAlt size={20} className="text-green-500" />
                        <span className="text-xs font-medium">Konum</span>
                    </a>
                </div>
                {/* Safe area for iPhone home indicator */}
                <div className="h-safe-area-bottom bg-white"></div>
            </div>
        </>
    );
};

export default Footer;
