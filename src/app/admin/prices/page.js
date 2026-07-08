"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPrices, deletePrice, updatePriceOrders } from '@/services/price-methods';
import { FaPlus, FaEdit, FaTrash, FaBars } from 'react-icons/fa';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
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

const SortableRow = ({ id, price, index, onDelete, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr ref={setNodeRef} style={style} className="hover:bg-gray-50 bg-white">
            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 cursor-grab" {...attributes} {...listeners}>
                <div className="flex items-center">
                    <FaBars className="text-gray-400 mr-2" />
                    {index + 1}
                </div>
            </td>
            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{price.title}</div>
            </td>
            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {price.subtypes ? price.subtypes.length : 0}
            </td>
            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onEdit(price.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    title="Düzenle"
                >
                    <FaEdit size={18} />
                </button>
                <button
                    onClick={() => onDelete(price.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Sil"
                >
                    <FaTrash size={18} />
                </button>
            </td>
        </tr>
    );
};

const AdminPriceList = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const data = await getPrices();
            setPrices(data);
        } catch (error) {
            console.error("Error fetching prices:", error);
            toast.error("Fiyatlar yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu fiyat kategorisini silmek istediğinizden emin misiniz?")) {
            try {
                await deletePrice(id);
                setPrices(prices.filter(price => price.id !== id));
                toast.success("Kategori silindi.");
            } catch (error) {
                console.error("Error deleting price:", error);
                toast.error("Silme işlemi sırasında bir hata oluştu.");
            }
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPrices((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index + 1
                }));

                updatePriceOrders(updates).catch(err => {
                    console.error("Failed to update order:", err);
                    toast.error("Sıralama güncellenemedi.");
                    fetchPrices();
                });

                return newItems;
            });
        }
    };

    if (loading) {
        return <div className="text-center py-10">Yükleniyor...</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Fiyat Yönetimi</h1>
                <Link href="/admin" className="text-blue-500 hover:underline">&larr; Panele Dön</Link>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sıra</th>
                                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alt Tür Sayısı</th>
                                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <SortableContext
                                items={prices.map(p => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {prices.map((price, index) => (
                                    <SortableRow
                                        key={price.id}
                                        id={price.id}
                                        price={price}
                                        index={index}
                                        onEdit={(id) => router.push(`/admin/prices/edit/${id}`)}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                            {prices.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Henüz fiyat kategorisi eklenmemiş.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </DndContext>
            </div>

            <Link
                href="/admin/prices/new"
                className="w-full py-4 mt-6 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2 font-medium text-lg"
            >
                <FaPlus /> Yeni Kategori Ekle
            </Link>

            <p className="text-sm text-gray-500 mt-4 text-center">
                <FaBars className="inline mr-1" /> Sıralamayı değiştirmek için satır başındaki ikonu sürükleyin.
            </p>
        </div>
    );
};

export default AdminPriceList;
