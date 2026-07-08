import React from 'react';
import Link from 'next/link';
import { getPostBySlug, getPost } from '@/services/blog-methods';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    try {
        let post = await getPostBySlug(slug).catch(() => null);
        if (!post) {
            post = await getPost(slug).catch(() => null);
        }
        if (post) {
            return {
                title: `${post.title} - Hurda Fiyatları Blog`,
                description: post.excerpt || post.content.substring(0, 150),
            }
        }
    } catch (e) {}
    
    return { title: 'Yazı Bulunamadı' };
}

export default async function BlogDetail({ params }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    let post = null;
    let error = null;

    try {
        post = await getPostBySlug(slug).catch(() => null);
        if (!post) {
            post = await getPost(slug).catch(() => null);
        }
        if (!post) {
            error = "Yazı bulunamadı.";
        }
    } catch (err) {
        console.error("Error fetching post:", err);
        error = "Yazı yüklenirken bir hata oluştu.";
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-xl text-red-600 mb-4">{error}</div>
                <Link href="/blog" className="text-blue-600 hover:underline">
                    Blog listesine dön
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 md:p-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Blog Listesine Dön
                    </Link>

                    <div className="flex items-center text-sm text-gray-500 mb-6">
                        <FaCalendarAlt className="mr-2" />
                        {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : 'Tarih yok'}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                        {post.content}
                    </div>
                </div>
            </article>
        </div>
    );
}
