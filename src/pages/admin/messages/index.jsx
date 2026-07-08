import React, { useEffect, useState } from 'react';
import { getMessages, deleteMessage } from '@/services/contact-methods';
import { FaEnvelope, FaPhone, FaCalendarAlt, FaArrowLeft, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await getMessages();
            setMessages(data);
        } catch (error) {
            console.error("Error loading messages:", error);
            toast.error("Mesajlar yüklenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
            try {
                await deleteMessage(id);
                setMessages(messages.filter(msg => msg.id !== id));
                toast.success("Mesaj silindi");
            } catch (error) {
                console.error("Error deleting message:", error);
                toast.error("Mesaj silinirken hata oluştu");
            }
        }
    };

    const getWhatsappLink = (phone, name) => {
        if (!phone) return '#';
        // Remove all non-numeric characters
        let cleanPhone = phone.replace(/\D/g, '');
        // Remove leading 0 if exists
        if (cleanPhone.startsWith('0')) {
            cleanPhone = cleanPhone.substring(1);
        }
        // Add TR country code if not present (assuming most numbers are TR)
        if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) {
            cleanPhone = '90' + cleanPhone;
        }

        const text = encodeURIComponent(`Merhaba ${name}, hurda fiyatları sitemizden gönderdiğiniz mesaj için teşekkürler.`);
        return `https://wa.me/${cleanPhone}?text=${text}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Mesajlar yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link to="/admin" className="mr-4 text-gray-600 hover:text-gray-900">
                        <FaArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Gelen Mesajlar</h1>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {messages.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Henüz hiç mesaj yok.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gönderen</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesaj</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {messages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="mr-2 text-gray-400" />
                                                    {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleString('tr-TR') : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 flex flex-col space-y-1">
                                                    <div className="flex items-center">
                                                        <FaEnvelope className="mr-2 text-gray-400" size={12} />
                                                        {msg.email || '-'}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaPhone className="mr-2 text-gray-400" size={12} />
                                                        {msg.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-md break-words">{msg.message}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <a
                                                        href={getWhatsappLink(msg.phone, msg.name)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                        title="WhatsApp ile Cevapla"
                                                    >
                                                        <FaWhatsapp size={20} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(msg.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Mesajı Sil"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
