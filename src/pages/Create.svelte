<!--
  Create Page
  
  The main entry point for creating new letters.
  Route: /
  
  Features:
  - Simple header with app branding
  - Contains the LetterForm component
  - Clean, focused layout
-->

<script>
  import LetterForm from "../components/LetterForm.svelte";
</script>

<div class="create-page">
  <!-- Minimal header -->
  <header class="header">
    <h1 class="logo">Between Lines</h1>
    <p class="tagline">Write letters that feel like moments</p>
  </header>

  <!-- Main content area -->
  <main class="main">
    <LetterForm />
  </main>

  <!-- Footer -->
  <footer class="footer">
    <p>
      Your letters are stored securely and can only be accessed via their unique
      link.
    </p>
  </footer>
</div>

<style>
  .create-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 50%, #f5f3ff 100%);
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 2rem 1rem;
    text-align: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 500;
    color: #1f2937;
    letter-spacing: -0.025em;
  }

  .tagline {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .main {
    flex: 1;
    padding: 0 1rem 2rem;
  }

  .footer {
    padding: 1.5rem 1rem;
    text-align: center;
  }

  .footer p {
    font-size: 0.75rem;
    color: #9ca3af;
    max-width: 24rem;
    margin: 0 auto;
  }
</style>
