"use client";
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthProvider';
import { logout } from '@/services/user-methods';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error("Çıkış yaparken hata oluştu:", error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    if (!user) return null; // Koruma

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Paneli</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        Çıkış Yap
                    </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-blue-700">
                        Hoş geldiniz, <span className="font-semibold">{user?.email}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">Fiyat Yönetimi</h2>
                        <p className="text-gray-600 mb-4">Hurda fiyatlarını güncelleyin ve yönetin. (Yapay Zeka Destekli)</p>
                        <Link href="/admin/prices" className="text-blue-500 hover:text-blue-700 font-medium">Yönet &rarr;</Link>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">Blog Yazıları</h2>
                        <p className="text-gray-600 mb-4">Yeni blog yazıları ekleyin veya düzenleyin.</p>
                        <Link href="/admin/blog" className="text-blue-500 hover:text-blue-700 font-medium">Yönet &rarr;</Link>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">Gelen Mesajlar</h2>
                        <p className="text-gray-600 mb-4">İletişim formundan gelen mesajları okuyun.</p>
                        <Link href="/admin/messages" className="text-blue-500 hover:text-blue-700 font-medium">Mesajları Gör &rarr;</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
