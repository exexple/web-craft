// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// Your Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2yOhm5-17kHeF2GI3C8pcKBCkX06Lhtw",
  authDomain: "web-craft-f38cb.firebaseapp.com",
  projectId: "web-craft-f38cb",
  storageBucket: "web-craft-f38cb.firebasestorage.app",
  messagingSenderId: "545761457079",
  appId: "1:545761457079:web:4a9f911158b03622ab6e32",
  measurementId: "G-8N6E6F07ZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firestore Collections
export const collections = {
    services: collection(db, "services"),
    projects: collection(db, "projects"),
    bookings: collection(db, "bookings"),
    inquiries: collection(db, "inquiries"),
    reviews: collection(db, "reviews"),
    settings: collection(db, "settings")
};

// Helper Functions
export async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collections[collectionName], {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef;
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
}

export async function getDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collections[collectionName]);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
    }
}

export async function deleteDocument(collectionName, docId) {
    try {
        await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}

export async function updateDocument(collectionName, docId, data) {
    try {
        await updateDoc(doc(db, collectionName, docId), {
            ...data,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

export async function uploadFile(storagePath, file) {
    try {
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}
