import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getPrices } from '@/services/price-methods';

const MainMenu = ({ onClose }) => {
    const [isPricesOpen, setIsPricesOpen] = useState(false);
    const [prices, setPrices] = useState([]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await getPrices();
                setPrices(data);
            } catch (error) {
                console.error("Menü fiyatları yüklenemedi:", error);
            }
        };
        fetchPrices();
    }, []);

    // Main menu animation variants
    const menuVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    // Submenu animation variants
    const submenuVariants = {
        closed: { height: 0, opacity: 0, overflow: 'hidden' },
        open: { height: 'auto', opacity: 1, overflow: 'hidden' },
    };

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[100] bg-gray-100 text-gray-800 flex flex-col h-screen overflow-y-auto font-sans"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {/* Header with Close Button */}
            <div className="p-4 flex items-center justify-between bg-gray-100 shadow-sm z-10 relative border-b border-gray-200">
                <span className="font-bold text-xl text-gray-800">Menü</span>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100"
                >
                    <FaTimes size={24} />
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                <Link
                    to="/"
                    onClick={onClose}
                    className="p-4 rounded-xl font-semibold text-gray-700 bg-white shadow-sm border border-gray-200 hover:border-green-500 hover:text-green-600 transition-all text-left"
                >
                    Anasayfa
                </Link>

                {/* Dropdown for Hurda Fiyatları */}
                <div className="flex flex-col">
                    <button
                        onClick={() => setIsPricesOpen(!isPricesOpen)}
                        className="p-4 rounded-xl font-semibold text-gray-700 bg-white shadow-sm border border-gray-200 hover:border-green-500 hover:text-green-600 transition-all flex justify-between items-center w-full text-left"
                    >
                        <span>Hurda Fiyatları</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${isPricesOpen ? 'rotate-180 bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            <FaChevronDown size={10} />
                        </div>
                    </button>

                    {/* Submenu items */}
                    <AnimatePresence>
                        {isPricesOpen && (
                            <motion.div
                                className="ml-4 mt-1 border-l-2 border-green-50 pl-2 space-y-1"
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={submenuVariants}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                {prices.length > 0 ? (
                                    prices.map((price) => (
                                        <Link
                                            key={price.id}
                                            to={`/${price.slug}`}
                                            onClick={onClose}
                                            className="block p-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-green-600 font-medium"
                                        >
                                            {price.title}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-3 text-gray-400 text-sm">Yükleniyor...</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Link
                    to="/hizmetlerimiz"
                    onClick={onClose}
                    className="p-4 rounded-xl font-semibold text-gray-700 bg-white shadow-sm border border-gray-200 hover:border-green-500 hover:text-green-600 transition-all text-left"
                >
                    Hizmetlerimiz
                </Link>

                <Link
                    to="/blog"
                    onClick={onClose}
                    className="p-4 rounded-xl font-semibold text-gray-700 bg-white shadow-sm border border-gray-200 hover:border-green-500 hover:text-green-600 transition-all text-left"
                >
                    Blog
                </Link>

                <Link
                    to="/iletisim"
                    onClick={onClose}
                    className="p-4 rounded-xl font-semibold text-gray-700 bg-white shadow-sm border border-gray-200 hover:border-green-500 hover:text-green-600 transition-all text-left"
                >
                    Bize Ulaşın
                </Link>
            </nav>
        </motion.div>,
        document.body
    );
};

export default MainMenu;
