import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addPost, getPost, updatePost } from '@/services/blog-methods';
import toast from 'react-hot-toast';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const data = await getPost(id);
            setFormData({
                title: data.title,
                slug: data.slug || '',
                content: data.content,
                imageUrl: data.imageUrl || ''
            });
        } catch (error) {
            console.error("Error fetching post:", error);
            alert("Yazı yüklenirken bir hata oluştu.");
            navigate('/admin/blog');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loadingToast = toast.loading('Yazı kaydediliyor...');

        try {
            if (id) {
                await updatePost(id, formData);
                toast.dismiss(loadingToast);
                toast.success('Yazı başarıyla güncellendi.');
            } else {
                await addPost(formData);
                toast.dismiss(loadingToast);
                toast.success('Yeni yazı başarıyla eklendi.');
            }
            setTimeout(() => navigate('/admin/blog'), 1000);
        } catch (error) {
            console.error("Error saving post:", error);
            toast.dismiss(loadingToast);
            toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div className="text-center py-10">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {id ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Yazı başlığı"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Adresi (Slug)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ornek-yazi-adresi"
                            />
                            <button
                                type="button"
                                onClick={generateSlug}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                            >
                                Başlıktan Oluştur
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Yazının URL'de görünecek kısmı. Örn: /blog/hurda-fiyatlari</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL (İsteğe bağlı)</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows="10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Yazı içeriği..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/blog')}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogForm;
