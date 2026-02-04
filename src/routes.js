/**
 * Routes Configuration
 * 
 * Defines the application routes and their components.
 * Using svelte-routing for client-side navigation.
 */

import Create from './pages/Create.svelte';
import View from './pages/View.svelte';

/**
 * Route definitions
 * Each route has a path pattern and its corresponding component
 */
export const routes = [
    {
        path: '/',
        component: Create,
        name: 'create'
    },
    {
        path: '/l/:id',
        component: View,
        name: 'view'
    }
];

export default routes;
