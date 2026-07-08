import { addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { messageCollectionRef, db } from "./firebase-config";

export const sendMessage = async (messageData) => {
    try {
        await addDoc(messageCollectionRef, {
            ...messageData,
            createdAt: serverTimestamp(),
            status: 'unread'
        });
        return true;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const getMessages = async () => {
    try {
        const q = query(messageCollectionRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

export const deleteMessage = async (id) => {
    try {
        const docRef = doc(db, "messages", id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};
