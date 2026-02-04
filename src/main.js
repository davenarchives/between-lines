/**
 * Main Entry Point
 * 
 * Initializes the Svelte 5 application using the new mount API.
 */

import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

// Initialize Svelte 5 app using mount()
const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
