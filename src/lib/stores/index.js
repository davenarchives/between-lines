/**
 * Svelte 5 stores for application state
 * 
 * Using Svelte 5's $state rune for reactive state management.
 * Export functions to get/set values for use in components.
 */

import { writable } from 'svelte/store';

// Loading state for async operations
export const isLoading = writable(false);

// Error state for displaying error messages
export const errorMessage = writable(null);

// Current letter being viewed (for the View page)
export const currentLetter = writable(null);
