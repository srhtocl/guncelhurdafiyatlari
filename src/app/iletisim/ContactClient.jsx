"use client";
import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { sendMessage } from '@/services/contact-methods';
import toast from 'react-hot-toast';

const ContactClient = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const loadingToast = toast.loading('Mesajınız gönderiliyor...');

        try {
            await sendMessage(formData);
            toast.dismiss(loadingToast);
            toast.success('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
            setSuccess(true);
            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            setError("Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        İletişime Geçin
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Hurda satışı, fiyat teklifi veya diğer sorularınız için bize ulaşın.
                        Size yardımcı olmaktan memnuniyet duyarız.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <FaPhone size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Telefon</h3>
                            </div>
                            <p className="text-gray-600 mb-4">7/24 Bizi arayabilirsiniz.</p>
                            <a href="tel:05376646837" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                0537 664 68 37
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-green-100 p-3 rounded-full text-green-600">
                                    <FaWhatsapp size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">WhatsApp</h3>
                            </div>
                            <p className="text-gray-600 mb-4">Fotoğraf gönderin, anında fiyat alın.</p>
                            <a
                                href="https://api.whatsapp.com/send?phone=+905376646837&text=Merhaba,%20hurda%20fiyat%C4%B1%20almak%20istiyorum."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                            >
                                WhatsApp'tan Yaz
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-orange-500"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                    <FaMapMarkerAlt size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Adres</h3>
                            </div>
                            <p className="text-gray-600">
                                Firuzköy Mahallesi, Hasan Önal Caddesi<br />
                                Avcılar / İstanbul
                            </p>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 md:p-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Bize Yazın</h2>
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
                            >
                                <p className="font-bold">Mesajınız Gönderildi!</p>
                                <p>En kısa sürede size dönüş yapacağız.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-4 text-sm underline hover:text-green-800"
                                >
                                    Yeni Mesaj Gönder
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Adınız Soyadınız</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Adınız Soyadınız"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numaranız</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="05XX XXX XX XX"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresiniz</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="ornek@email.com"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                                    <textarea
                                        rows="5"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Mesajınızı buraya yazın..."
                                        required
                                        disabled={loading}
                                    ></textarea>
                                </div>
                                {error && <div className="text-red-600 text-sm">{error}</div>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Gönderiliyor...' : <><FaPaperPlane /> Mesajı Gönder</>}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden h-96"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.650490013086!2d28.71487531541336!3d40.99042997930263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa0f4b2b9d6d7%3A0x2c5e5b5b5b5b5b5b!2sFiruzk%C3%B6y%2C%20Avc%C4%B1lar%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1629789000000!5m2!1str!2str"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Google Maps"
                    ></iframe>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactClient;
