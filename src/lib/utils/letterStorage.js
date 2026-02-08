/**
 * Letter History Storage Utilities
 * Manages letter links in browser localStorage with automatic 7-day expiration
 */

const STORAGE_KEY = 'betweenLinesHistory';
const EXPIRATION_DAYS = 7;

/**
 * @typedef {Object} LetterHistoryItem
 * @property {string} id
 * @property {string} link
 * @property {string} recipientName
 * @property {number} createdAt
 * @property {number} expiresAt
 */

/**
 * Save a new letter to history
 * @param {string} letterId - Unique letter ID
 * @param {string} link - Full URL to the letter
 * @param {string} recipientName - Name of the recipient
 */
export function saveLetterToHistory(letterId, link, recipientName) {
    try {
        const history = getLetterHistory();

        // Check if letter already exists
        const existingIndex = history.findIndex(item => item.id === letterId);
        if (existingIndex !== -1) {
            return; // Don't add duplicates
        }

        const now = Date.now();
        const expiresAt = now + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000);

        const newLetter = {
            id: letterId,
            link,
            recipientName,
            createdAt: now,
            expiresAt
        };

        // Add to beginning of array (newest first)
        history.unshift(newLetter);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save letter to history:', error);
    }
}

/**
 * Get all letters from history (auto-removes expired entries)
 * @returns {LetterHistoryItem[]} Array of letter objects
 */
export function getLetterHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }

        /** @type {LetterHistoryItem[]} */
        const history = JSON.parse(stored);

        // Filter out expired letters
        const now = Date.now();
        const validHistory = history.filter(item => item.expiresAt > now);

        // Update storage if any were removed
        if (validHistory.length !== history.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validHistory));
        }

        return validHistory;
    } catch (error) {
        console.error('Failed to get letter history:', error);
        return [];
    }
}

/**
 * Delete a specific letter from history
 * @param {string} letterId - ID of the letter to delete
 */
export function deleteLetterFromHistory(letterId) {
    try {
        const history = getLetterHistory();
        const filtered = history.filter(item => item.id !== letterId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete letter from history:', error);
    }
}

/**
 * Clear all letter history
 */
export function clearHistory() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}

/**
 * Get count of letters in history
 * @returns {number} Number of letters
 */
export function getHistoryCount() {
    return getLetterHistory().length;
}
