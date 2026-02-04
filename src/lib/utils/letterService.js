/**
 * Letter Service (Mock Version for Testing)
 * 
 * This version stores letters in localStorage instead of Firebase.
 * Replace with the Firebase version when ready to deploy.
 */

const STORAGE_KEY = 'between_lines_letters';

/**
 * Get all letters from localStorage
 */
function getStoredLetters() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

/**
 * Save letters to localStorage
 */
function saveLetters(letters) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}

/**
 * Generates a unique ID for letters
 */
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a new letter (stored in localStorage)
 * @param {Object} letterData - The letter data (title, body, recipientName)
 * @param {File|null} audioFile - Optional audio file to attach
 * @returns {Promise<string>} - The document ID of the created letter
 */
export async function createLetter(letterData, audioFile = null) {
    const letterId = generateUniqueId();
    let audioUrl = null;

    // Convert audio file to base64 for localStorage storage
    if (audioFile) {
        audioUrl = await fileToBase64(audioFile);
    }

    const letter = {
        id: letterId,
        title: letterData.title,
        body: letterData.body,
        recipientName: letterData.recipientName || null,
        audioUrl: audioUrl,
        createdAt: new Date().toISOString(),
    };

    // Store in localStorage
    const letters = getStoredLetters();
    letters[letterId] = letter;
    saveLetters(letters);

    return letterId;
}

/**
 * Convert a file to base64 string
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Retrieves a letter by its ID
 * @param {string} id - The letter ID
 * @returns {Promise<Object|null>} - The letter data or null if not found
 */
export async function getLetter(id) {
    const letters = getStoredLetters();
    const letter = letters[id];

    if (letter) {
        return {
            ...letter,
            createdAt: new Date(letter.createdAt),
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
