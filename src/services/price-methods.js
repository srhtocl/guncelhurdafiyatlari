import {
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    serverTimestamp,
    query,
    orderBy,
    where,
    limit,
    writeBatch
} from "firebase/firestore";
import { db, priceCollectionRef, priceHistoryCollectionRef } from "./firebase-config";

// Fiyat sıralamasını toplu güncelle
export const updatePriceOrders = async (items) => {
    try {
        const batch = writeBatch(db);

        items.forEach((item) => {
            const docRef = doc(db, "prices", item.id);
            batch.update(docRef, { order: item.order });
        });

        await batch.commit();
    } catch (error) {
        console.error("Error updating price orders:", error);
        throw error;
    }
};

// Tüm fiyat kategorilerini getir
export const getPrices = async () => {
    try {
        const q = query(priceCollectionRef, orderBy("order", "asc"));
        const data = await getDocs(q);
        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Error fetching prices:", error);
        throw error;
    }
};

// Slug ile fiyat kategorisini getir
export const getPriceBySlug = async (slug) => {
    try {
        const q = query(priceCollectionRef, where("slug", "==", slug), limit(1));
        const data = await getDocs(q);
        if (!data.empty) {
            const doc = data.docs[0];
            return { ...doc.data(), id: doc.id };
        } else {
            throw new Error("Price category not found");
        }
    } catch (error) {
        console.error("Error fetching price category by slug:", error);
        throw error;
    }
};

// Tek bir fiyat kategorisini getir
export const getPrice = async (id) => {
    try {
        const priceDoc = doc(db, "prices", id);
        const data = await getDoc(priceDoc);
        if (data.exists()) {
            return { ...data.data(), id: data.id };
        } else {
            throw new Error("Price category not found");
        }
    } catch (error) {
        console.error("Error fetching price category:", error);
        throw error;
    }
};

// Yeni fiyat kategorisi ekle
export const addPrice = async (priceData) => {
    try {
        await addDoc(priceCollectionRef, {
            ...priceData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding price category:", error);
        throw error;
    }
};

// Fiyat kategorisini güncelle
export const updatePrice = async (id, updatedData) => {
    try {
        const priceDoc = doc(db, "prices", id);
        await updateDoc(priceDoc, {
            ...updatedData,
            updatedAt: serverTimestamp()
        });

        // Geçmişe kaydet
        await addPriceHistory({ ...updatedData, id });
    } catch (error) {
        console.error("Error updating price category:", error);
        throw error;
    }
};

// Fiyat kategorisini sil
export const deletePrice = async (id) => {
    try {
        const priceDoc = doc(db, "prices", id);
        await deleteDoc(priceDoc);
    } catch (error) {
        console.error("Error deleting price category:", error);
        throw error;
    }
};
// Fiyat geçmişi ekle
export const addPriceHistory = async (priceData) => {
    try {
        await addDoc(priceHistoryCollectionRef, {
            categoryId: priceData.id,
            slug: priceData.slug,
            subtypes: priceData.subtypes,
            date: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding price history:", error);
        // Geçmiş ekleme hatası ana akışı bozmamalı, sadece logluyoruz.
    }
};
// Fiyat geçmişini getir
export const getPriceHistory = async (slug) => {
    try {
        const q = query(
            priceHistoryCollectionRef,
            where("slug", "==", slug),
            orderBy("date", "asc")
        );
        const data = await getDocs(q);
        return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Error fetching price history:", error);
        return [];
    }
};

// Sayfa için gerekli tüm verileri getir (Composite Call)
export const getPricePageData = async (slug) => {
    try {
        const [price, history] = await Promise.all([
            getPriceBySlug(slug),
            getPriceHistory(slug)
        ]);
        return { price, history };
    } catch (error) {
        console.error(`Error fetching page data for ${slug}:`, error);
        throw error;
    }
};
