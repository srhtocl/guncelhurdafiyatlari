import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addPrice, getPrice, updatePrice } from '@/services/price-methods';
import { FaPlus, FaTrash, FaBars, FaMinus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
        // Ensure non-negative
        const finalValue = parseFloat(newValue) < 0 ? 0 : newValue;
        onChange(index, field, finalValue);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3 overflow-hidden touch-manipulation"
        >
            {/* Header / Summary Row */}
            <div className="flex items-center p-3 bg-gray-50 border-b border-gray-100 gap-3">

                {/* Name Input - Always visible */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={subtype.name}
                        onChange={(e) => onChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tür Adı (Örn: DKP)"
                        onClick={(e) => e.stopPropagation()} // Prevent accordion toggle when clicking input
                    />
                </div>

                {/* Controls: Toggle & Drag */}
                <div className="flex items-center gap-2">
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

            {/* Expanded Content: Prices & Delete */}
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

const AdminPriceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        order: 0,
        subtypes: []
    });
    const [expandedIndex, setExpandedIndex] = useState(-1);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
            // Press delay 250ms, tolerance of 5px of movement
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
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
            // Ensure every subtype has a unique ID for drag and drop
            const subtypesWithIds = (data.subtypes || []).map(s => ({
                ...s,
                id: s.id || Math.random().toString(36).substr(2, 9),
                unit: 'kg' // Ensure default unit
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
            navigate('/admin/prices');
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

    const handleSubtypeChange = (index, field, value) => {
        const newSubtypes = [...formData.subtypes];
        newSubtypes[index] = {
            ...newSubtypes[index],
            [field]: value
        };
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
                    unit: 'kg' // Default unit
                }
            ]
        }));
        // Auto-expand the newly added item (last index)
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
                return {
                    ...prev,
                    subtypes: arrayMove(prev.subtypes, oldIndex, newIndex)
                };
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loadingToast = toast.loading('Kayıt işlemi yapılıyor...');

        try {
            // Ensure unit is kg before saving, just in case
            const dataToSave = {
                ...formData,
                subtypes: formData.subtypes.map(s => ({ ...s, unit: 'kg' }))
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
            setTimeout(() => navigate('/admin/prices'), 1000);
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
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4 md:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {id ? 'Fiyat Kategorisini Düzenle' : 'Yeni Fiyat Kategorisi Ekle'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Category Info - Compact Grid */}
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

                            {/* Add Button - Moved to Bottom */}
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
                            onClick={() => navigate('/admin/prices')}
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
        </div>
    );
};
export default AdminPriceForm;
