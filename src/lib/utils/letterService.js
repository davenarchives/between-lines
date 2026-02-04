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
 * @param {Omit<Letter, "id" | "createdAt" | "audioUrl">} letterData - The letter data
 * @param {Omit<Letter, "id" | "createdAt" | "audioUrl" | "opened">} letterData - The letter data
 * @param {File|null} audioFile - Optional audio file to attach
 * @returns {Promise<string>} - The document ID of the created letter
 */
export async function createLetter(letterData, audioFile = null) {
    let audioUrl = null;

    // If there's an audio file, upload it to Firebase Storage
    if (audioFile) {
        const storageRef = ref(storage, `audio/${Date.now()}_${audioFile.name}`);
        await uploadBytes(storageRef, audioFile);
        audioUrl = await getDownloadURL(storageRef);
    }

    // Create the letter document in Firestore
    const letterRef = await addDoc(collection(db, 'letters'), {
        title: letterData.title || 'Untitled',
        body: letterData.body,
        recipientName: letterData.recipientName || null,
        envelopeTheme: letterData.envelopeTheme || 'envelope-red',
        letterTheme: letterData.letterTheme || 'letter-sticky',
        musicUrl: letterData.musicUrl || null,
        audioUrl: audioUrl,
        createdAt: new Date().toISOString(),
        opened: false
    });

    return letterRef.id;
}

/**
 * @typedef {Object} Letter
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string|null} recipientName
 * @property {string} envelopeTheme
 * @property {string} letterTheme
 * @property {string|null} musicUrl
 * @property {string|null} audioUrl
 * @property {Date} createdAt
 */

/**
 * Retrieves a letter by its ID
 * @param {string} id - The letter ID
 * @returns {Promise<Letter|null>} - The letter data or null if not found
 */
export async function getLetter(id) {
    const docRef = doc(db, "letters", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return /** @type {Letter} */ ({
            id: docSnap.id,
            ...data,
            createdAt: new Date(data.createdAt),
        });
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
