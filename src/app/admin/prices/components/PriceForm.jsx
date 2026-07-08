"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addPrice, getPrice, updatePrice } from '@/services/price-methods';
import { FaPlus, FaTrash, FaBars, FaMinus, FaChevronDown, FaChevronUp, FaRobot, FaTimes, FaCheck } from 'react-icons/fa';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

const SortableSubtype = ({ subtype, index, onChange, onRemove, isOpen, onToggle }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: subtype.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handlePriceAdjust = (field, amount) => {
        const currentValue = parseFloat(subtype[field]) || 0;
        const newValue = (currentValue + amount).toFixed(2);
        const finalValue = parseFloat(newValue) < 0 ? 0 : newValue;
        onChange(index, field, finalValue);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg border shadow-sm mb-3 overflow-hidden touch-manipulation transition-colors ${subtype.isAiAdded ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}`}
        >
            <div className="flex items-center p-3 bg-gray-50 border-b border-gray-100 gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        value={subtype.name}
                        onChange={(e) => onChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                        placeholder="Tür Adı (Örn: DKP)"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {subtype.isAiAdded && <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full"><FaRobot className="inline mr-1"/>AI</span>}
                    <button
                        type="button"
                        onClick={onToggle}
                        className="p-2 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
                        title={isOpen ? "Kapat" : "Aç"}
                    >
                        {isOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                    </button>
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md"
                    >
                        <FaBars size={20} />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="p-4 space-y-4 bg-white animate-fadeIn">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase">Min Fiyat (TL)</label>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => handlePriceAdjust('priceMin', -0.5)}
                                    className="bg-red-50 text-red-600 w-10 h-10 flex items-center justify-center rounded-l-lg hover:bg-red-100 active:bg-red-200 border border-r-0 border-red-100"
                                >
                                    <FaMinus size={12} />
                                </button>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={subtype.priceMin}
                                    onChange={(e) => onChange(index, 'priceMin', e.target.value)}
                                    required
                                    className="w-full h-10 border border-gray-300 text-center text-lg font-bold text-gray-700 focus:z-10 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                                <button
                                    type="button"
                                    onClick={() => handlePriceAdjust('priceMin', 0.5)}
                                    className="bg-green-50 text-green-600 w-10 h-10 flex items-center justify-center rounded-r-lg hover:bg-green-100 active:bg-green-200 border border-l-0 border-green-100"
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase">Max Fiyat (TL)</label>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => handlePriceAdjust('priceMax', -0.5)}
                                    className="bg-red-50 text-red-600 w-10 h-10 flex items-center justify-center rounded-l-lg hover:bg-red-100 active:bg-red-200 border border-r-0 border-red-100"
                                >
                                    <FaMinus size={12} />
                                </button>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={subtype.priceMax}
                                    onChange={(e) => onChange(index, 'priceMax', e.target.value)}
                                    className="w-full h-10 border border-gray-300 text-center text-lg font-bold text-gray-700 focus:z-10 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                                <button
                                    type="button"
                                    onClick={() => handlePriceAdjust('priceMax', 0.5)}
                                    className="bg-green-50 text-green-600 w-10 h-10 flex items-center justify-center rounded-r-lg hover:bg-green-100 active:bg-green-200 border border-l-0 border-green-100"
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                        >
                            <FaTrash size={14} /> Bu Türü Sil
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function PriceForm({ id = null }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        order: 0,
        subtypes: []
    });
    const [expandedIndex, setExpandedIndex] = useState(-1);

    // AI Modal States
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiUrls, setAiUrls] = useState('https://www.ornek-rakip.com/fiyatlar');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResults, setAiResults] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    useEffect(() => {
        if (id) {
            fetchPrice();
        }
    }, [id]);

    const fetchPrice = async () => {
        setLoading(true);
        try {
            const data = await getPrice(id);
            const subtypesWithIds = (data.subtypes || []).map(s => ({
                ...s,
                id: s.id || Math.random().toString(36).substr(2, 9),
                unit: 'kg'
            }));

            setFormData({
                title: data.title,
                slug: data.slug || '',
                order: data.order || 0,
                subtypes: subtypesWithIds
            });
        } catch (error) {
            console.error("Error fetching price:", error);
            alert("Kategori yüklenirken bir hata oluştu.");
            router.push('/admin/prices');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubtypeChange = (index, field, value) => {
        const newSubtypes = [...formData.subtypes];
        newSubtypes[index] = { ...newSubtypes[index], [field]: value };
        setFormData(prev => ({ ...prev, subtypes: newSubtypes }));
    };

    const addSubtype = () => {
        setFormData(prev => ({
            ...prev,
            subtypes: [
                ...prev.subtypes,
                {
                    id: Date.now().toString(),
                    name: '',
                    priceMin: '',
                    priceMax: '',
                    unit: 'kg'
                }
            ]
        }));
        setExpandedIndex(formData.subtypes.length);
    };

    const removeSubtype = (index) => {
        const newSubtypes = formData.subtypes.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, subtypes: newSubtypes }));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.subtypes.findIndex((item) => item.id === active.id);
                const newIndex = prev.subtypes.findIndex((item) => item.id === over.id);
                return { ...prev, subtypes: arrayMove(prev.subtypes, oldIndex, newIndex) };
            });
        }
    };

    const scrapeWithAI = async () => {
        if(!aiUrls.trim()) return toast.error("Lütfen taranacak URL girin.");
        if(!formData.title) return toast.error("Lütfen önce kategori başlığını girin (Örn: Demir Hurda)");

        setAiLoading(true);
        setAiResults(null);
        try {
            const urls = aiUrls.split(',').map(u => u.trim()).filter(Boolean);
            let allResults = [];
            
            for(let url of urls) {
                const res = await fetch('/api/scrape-prices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, type: formData.title })
                });
                const data = await res.json();
                if(data.success && Array.isArray(data.data)) {
                    allResults = [...allResults, ...data.data];
                } else if(data.error) {
                    toast.error(url + " tarama hatası: " + data.error);
                }
            }
            
            // Eşleştirme algoritması
            const matchResults = allResults.map(scraped => {
                const scrapedNameLower = scraped.subtype.toLowerCase();
                const existingIndex = formData.subtypes.findIndex(s => {
                    const sNameLower = s.name.toLowerCase();
                    return sNameLower.includes(scrapedNameLower) || scrapedNameLower.includes(sNameLower);
                });
                
                return {
                    ...scraped,
                    isNew: existingIndex === -1,
                    existingIndex: existingIndex,
                    selected: true,
                    originalPrice: existingIndex !== -1 ? formData.subtypes[existingIndex].priceMin : 0
                };
            });
            
            setAiResults(matchResults);
            toast.success("AI Analizi tamamlandı!");
        } catch(err) {
            toast.error("Tarama başarısız oldu.");
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    const applyAiResults = () => {
        const newSubtypesList = [...formData.subtypes];
        
        aiResults.forEach(res => {
            if(!res.selected) return;
            
            const price = parseFloat(res.price).toFixed(2);
            
            if(res.isNew) {
                // Yeni Ekle
                newSubtypesList.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    name: res.subtype,
                    priceMin: price,
                    priceMax: price,
                    unit: 'kg',
                    isAiAdded: true
                });
            } else if(res.existingIndex !== -1) {
                // Mevcudu Güncelle
                newSubtypesList[res.existingIndex].priceMin = price;
                newSubtypesList[res.existingIndex].priceMax = price; // Veya fark ekle
                newSubtypesList[res.existingIndex].isAiAdded = true;
            }
        });
        
        setFormData(prev => ({...prev, subtypes: newSubtypesList}));
        setIsAiModalOpen(false);
        setAiResults(null);
        toast.success("Veriler forma aktarıldı. Kaydetmeyi unutmayın!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loadingToast = toast.loading('Kayıt işlemi yapılıyor...');

        try {
            // Remove temp fields like isAiAdded
            const dataToSave = {
                ...formData,
                subtypes: formData.subtypes.map(s => {
                    const cleanSubtype = { ...s, unit: 'kg' };
                    delete cleanSubtype.isAiAdded;
                    return cleanSubtype;
                })
            };

            if (id) {
                await updatePrice(id, dataToSave);
                toast.dismiss(loadingToast);
                toast.success('Kategori başarıyla güncellendi.');
            } else {
                await addPrice(dataToSave);
                toast.dismiss(loadingToast);
                toast.success('Yeni kategori başarıyla eklendi.');
            }
            setTimeout(() => router.push('/admin/prices'), 1000);
        } catch (error) {
            console.error("Error saving price:", error);
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
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4 md:p-8 relative">
                
                {/* AI Asistan Butonu */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8">
                    <button 
                        onClick={() => setIsAiModalOpen(true)}
                        type="button"
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <FaRobot size={20} /> AI ile Otomatik Güncelle
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-6 pr-48">
                    {id ? 'Fiyat Kategorisini Düzenle' : 'Yeni Fiyat Kategorisi Ekle'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Başlığı</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Örn: Demir Hurda"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL (Slug)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Örn: demir"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 py-2">
                            <h2 className="text-lg font-semibold text-gray-700">Alt Türler</h2>
                        </div>

                        <div className="space-y-2">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={formData.subtypes.map(s => s.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {formData.subtypes.map((subtype, index) => (
                                        <SortableSubtype
                                            key={subtype.id}
                                            subtype={subtype}
                                            index={index}
                                            onChange={handleSubtypeChange}
                                            onRemove={removeSubtype}
                                            isOpen={expandedIndex === index}
                                            onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>

                            {formData.subtypes.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-gray-500">Henüz alt tür eklenmemiş.</p>
                                    <p className="text-sm text-gray-400 mt-1">"Ekle" butonuna basarak başlayın.</p>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={addSubtype}
                                className="w-full py-3 mt-4 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                            >
                                <FaPlus /> Yeni Alt Tür Ekle
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white p-4 -mx-4 md:mx-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/prices')}
                            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-blue-200"
                        >
                            {loading ? '...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>

            {/* AI Modal */}
            {isAiModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2"><FaRobot size={24}/> AI Fiyat Asistanı</h3>
                            <button onClick={() => setIsAiModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><FaTimes size={20}/></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <p className="text-gray-600 mb-4">Rakip sitelerin URL'lerini girin, Gemini AI sizin için fiyatları bulup karşılaştırsın. (URL'leri virgülle ayırın)</p>
                            
                            <textarea 
                                value={aiUrls}
                                onChange={e => setAiUrls(e.target.value)}
                                className="w-full border-2 border-purple-100 rounded-xl p-4 focus:border-purple-500 focus:ring-0 outline-none"
                                rows="3"
                                placeholder="https://ornek1.com, https://ornek2.com"
                            />

                            <button 
                                type="button"
                                onClick={scrapeWithAI}
                                disabled={aiLoading}
                                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {aiLoading ? 'Sihir Yapılıyor... Lütfen Bekleyin' : 'Taramayı Başlat'}
                            </button>

                            {/* Sonuç Tablosu */}
                            {aiResults && (
                                <div className="mt-8 animate-fadeIn">
                                    <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Analiz Sonuçları ({aiResults.length} kayıt)</h4>
                                    
                                    {aiResults.length === 0 ? (
                                        <div className="p-4 bg-orange-50 text-orange-700 rounded-lg">Fiyat bilgisi bulunamadı veya anlaşılamadı.</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {aiResults.map((res, idx) => (
                                                <label key={idx} className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-purple-50 rounded-lg cursor-pointer border border-transparent hover:border-purple-200 transition-colors">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={res.selected}
                                                        onChange={() => {
                                                            const newRes = [...aiResults];
                                                            newRes[idx].selected = !newRes[idx].selected;
                                                            setAiResults(newRes);
                                                        }}
                                                        className="w-5 h-5 text-purple-600 rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-gray-800">{res.subtype}</div>
                                                        <div className="text-sm">
                                                            {res.isNew ? (
                                                                <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs font-bold">YENİ TÜR</span>
                                                            ) : (
                                                                <span className="text-gray-500 text-xs">Mevcut Fiyat: {res.originalPrice} TL</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-purple-700 text-lg">{res.price} TL</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {aiResults && aiResults.length > 0 && (
                            <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button onClick={() => setIsAiModalOpen(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">İptal</button>
                                <button onClick={applyAiResults} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2">
                                    <FaCheck /> Seçilenleri Forma Aktar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
