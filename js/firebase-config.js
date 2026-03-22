// Firebase Configuration - Compat version used with CDN scripts

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

// Initialize Firebase (global `firebase` comes from *-compat.js scripts)
firebase.initializeApp(firebaseConfig);

// Global handles used by admin.js and (optionally) forms.js
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Optional pre-defined collection references
const collections = {
  services: db.collection("services"),
  projects: db.collection("projects"),
  bookings: db.collection("bookings"),
  inquiries: db.collection("inquiries"),
  reviews: db.collection("reviews"),
  settings: db.collection("settings")
};

// Helper: add document
async function addDocument(collectionName, data) {
  const colRef = collections[collectionName] || db.collection(collectionName);
  const now = firebase.firestore.FieldValue.serverTimestamp();
  try {
    const docRef = await colRef.add({
      ...data,
      createdAt: now,
      updatedAt: now
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

// Helper: get all documents in a collection
async function getDocuments(collectionName) {
  const colRef = collections[collectionName] || db.collection(collectionName);
  try {
    const snapshot = await colRef.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

// Helper: delete a document
async function deleteDocument(collectionName, docId) {
  try {
    await db.collection(collectionName).doc(docId).delete();
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

// Helper: update a document
async function updateDocument(collectionName, docId, data) {
  try {
    await db.collection(collectionName).doc(docId).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

// Helper: upload file to Storage and get URL
async function uploadFile(storagePath, file) {
  try {
    const storageRef = storage.ref(storagePath);
    await storageRef.put(file);
    return await storageRef.getDownloadURL();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
