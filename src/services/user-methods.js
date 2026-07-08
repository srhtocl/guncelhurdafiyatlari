import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase-config";

export const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
    return await signOut(auth);
};
