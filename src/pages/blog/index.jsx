import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '@/services/blog-methods';
import { FaCalendarAlt, FaArrowRight, FaChartLine } from 'react-icons/fa';
import SEO from '@/component/seo';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Blog - Sektörel Haberler"
                description="Hurda sektörü ile ilgili en güncel haberler, analizler ve piyasa yorumları."
            />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Blog & Haberler
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Sektörden en son haberler, analizler ve uzman görüşleri.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                                <FaChartLine className="text-4xl text-blue-300 group-hover:text-blue-500 transition-colors transform group-hover:scale-110 duration-300" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <FaCalendarAlt className="mr-2" />
                                    {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : 'Tarih yok'}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                                    {post.content}
                                </p>
                                <Link
                                    to={`/blog/${post.slug || post.id}`}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                    Devamını Oku <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Henüz hiç blog yazısı eklenmemiş.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
