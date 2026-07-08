import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import MainMenu from './main-menu';
import ShareButton from '@/component/share-buttons';
import { getPrices } from '@/services/price-methods';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prices, setPrices] = useState([]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await getPrices();
                setPrices(data);
            } catch (error) {
                console.error("Header fiyatları yüklenemedi:", error);
            }
        };
        fetchPrices();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-50 sticky top-0 z-[100] backdrop-blur-sm bg-white/90">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Brand / Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-green-500 text-white p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                        <FaRecycle className="text-2xl" />
                    </div>
                    <span className="text-xl font-bold text-gray-600 tracking-tight group-hover:text-green-600 transition-colors">
                        Hurda Fiyatları
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="font-medium text-gray-500 hover:text-green-600 transition-colors">
                        Anasayfa
                    </Link>

                    <div className="relative group">
                        <button className="flex items-center gap-1 font-medium text-gray-500 hover:text-green-600 transition-colors py-2">
                            <span>Hurda Fiyatları</span>
                            <FaChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-200" />
                        </button>

                        {/* Desktop Dropdown */}
                        <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-lg border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="p-2 flex flex-col gap-1">
                                {prices.length > 0 ? (
                                    prices.map((price) => (
                                        <Link
                                            key={price.id}
                                            to={`/${price.slug}`}
                                            className="block px-4 py-2 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-600 text-sm font-medium"
                                        >
                                            {price.title}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-xs text-gray-400">Yükleniyor...</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link to="/hizmetlerimiz" className="font-medium text-gray-500 hover:text-green-600 transition-colors">
                        Hizmetlerimiz
                    </Link>
                    <Link to="/blog" className="font-medium text-gray-500 hover:text-green-600 transition-colors">
                        Blog
                    </Link>
                    <Link to="/iletisim" className="font-medium text-gray-500 hover:text-green-600 transition-colors">
                        Bize Ulaşın
                    </Link>
                    <div className="border-l pl-4 border-gray-200">
                        <ShareButton />
                    </div>
                </nav>

                {/* Main Menu Component (Mobile) */}
                <AnimatePresence>
                    {isOpen && <MainMenu onClose={() => setIsOpen(false)} />}
                </AnimatePresence>

                <div className="flex items-center gap-2 md:hidden">
                    <ShareButton />
                    {/* Mobile Menu Button */}
                    <button
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
