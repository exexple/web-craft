// Firebase Configuration - Compat version for normal <script> tags

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
firebase.initializeApp(firebaseConfig);

// Global Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Firestore collection names
const collections = {
  services: "services",
  projects: "projects",
  bookings: "bookings",
  inquiries: "inquiries",
  reviews: "reviews",
  settings: "settings",
  admins: "admins"
};

// Helper: add document
async function addDocument(collectionName, data) {
  try {
    const docRef = await db.collection(collections[collectionName]).add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

// Helper: get documents
async function getDocuments(collectionName) {
  try {
    const querySnapshot = await db.collection(collections[collectionName]).get();
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

// Helper: delete document
async function deleteDocument(collectionName, docId) {
  try {
    await db.collection(collections[collectionName]).doc(docId).delete();
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

// Helper: update document
async function updateDocument(collectionName, docId, data) {
  try {
    await db.collection(collections[collectionName]).doc(docId).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}
