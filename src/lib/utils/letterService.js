/**
 * Letter Service
 * 
 * Handles interaction with FirebaseFirestore and Storage.
 */

import { db, storage } from "../firebase.js";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Creates a new letter
 * @param {Object} letterData - The letter data (title, body, recipientName)
 * @param {File|null} audioFile - Optional audio file to attach
 * @returns {Promise<string>} - The document ID of the created letter
 */
export async function createLetter(letterData, audioFile = null) {
    let audioUrl = null;

    // 1. Upload audio file if it exists
    if (audioFile) {
        // Create a unique reference including timestamp
        const timestamp = Date.now();
        const storageRef = ref(storage, `audio/${timestamp}_${audioFile.name}`);

        const snapshot = await uploadBytes(storageRef, audioFile);
        audioUrl = await getDownloadURL(snapshot.ref);
    }

    // 2. Save letter document to Firestore
    const docRef = await addDoc(collection(db, "letters"), {
        title: letterData.title,
        body: letterData.body,
        recipientName: letterData.recipientName || null,
        audioUrl: audioUrl,
        createdAt: new Date().toISOString(),
    });

    return docRef.id;
}

/**
 * Retrieves a letter by its ID
 * @param {string} id - The letter ID
 * @returns {Promise<Object|null>} - The letter data or null if not found
 */
export async function getLetter(id) {
    const docRef = doc(db, "letters", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: new Date(data.createdAt),
        };
    }

    return null;
}

/**
 * Generates a shareable URL for a letter
 * @param {string} id - The letter document ID
 * @returns {string} - The full shareable URL
 */
export function generateShareableUrl(id) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/l/${id}`;
}
