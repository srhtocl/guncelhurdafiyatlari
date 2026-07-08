import {
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    serverTimestamp,
    query,
    where,
    limit
} from "firebase/firestore";
import { db, postCollectionRef } from "./firebase-config";

// Slug ile blog yazısını getir
export const getPostBySlug = async (slug) => {
    try {
        const q = query(postCollectionRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { ...doc.data(), id: doc.id };
        } else {
            throw new Error("Post not found");
        }
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        throw error;
    }
};

// Tüm blog yazılarını getir
export const getPosts = async () => {
    try {
        const data = await getDocs(postCollectionRef);
        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};

// Tek bir blog yazısını getir
export const getPost = async (id) => {
    try {
        const postDoc = doc(db, "post", id);
        const data = await getDoc(postDoc);
        if (data.exists()) {
            return { ...data.data(), id: data.id };
        } else {
            throw new Error("Post not found");
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

// Yeni blog yazısı ekle
export const addPost = async (post) => {
    try {
        await addDoc(postCollectionRef, {
            ...post,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding post:", error);
        throw error;
    }
};

// Blog yazısını güncelle
export const updatePost = async (id, updatedPost) => {
    try {
        const postDoc = doc(db, "post", id);
        await updateDoc(postDoc, {
            ...updatedPost,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};

// Blog yazısını sil
export const deletePost = async (id) => {
    try {
        const postDoc = doc(db, "post", id);
        await deleteDoc(postDoc);
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};
