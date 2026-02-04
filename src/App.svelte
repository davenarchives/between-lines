<!--
  App.svelte
  
  Root application component with simple hash-based routing.
  Compatible with Svelte 5.
-->

<script>
  import { onMount } from 'svelte';
  import Create from './pages/Create.svelte';
  import View from './pages/View.svelte';
  
  // Reactive state for current route
  let currentRoute = $state({ page: 'create', id: null });
  
  /**
   * Parse the current hash and update the route
   */
  function parseRoute() {
    const hash = window.location.hash.slice(1) || '/';
    
    // Match /l/:id pattern for viewing letters
    const viewMatch = hash.match(/^\/l\/(.+)$/);
    
    if (viewMatch) {
      currentRoute = { page: 'view', id: viewMatch[1] };
    } else {
      currentRoute = { page: 'create', id: null };
    }
  }
  
  onMount(() => {
    // Parse initial route
    parseRoute();
    
    // Listen for hash changes
    window.addEventListener('hashchange', parseRoute);
    
    return () => {
      window.removeEventListener('hashchange', parseRoute);
    };
  });
</script>

<div class="app">
  {#if currentRoute.page === 'view' && currentRoute.id}
    <View id={currentRoute.id} />
  {:else}
    <Create />
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
  }
</style>
