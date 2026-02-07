<!--
  Landing Page / Hero
  Route: /
-->

<div class="hero-page">
    <div class="hero-content">
        <a href="/" aria-label="Go to home">
            <img src="/logo.png" alt="Between Lines" class="hero-logo" />
        </a>
        <p class="hero-tagline">For things worth saying.</p>
        <a href="/create" class="cta-button">
            Send a letter
            <i class="fa-solid fa-paper-plane plane-icon"></i>
        </a>
    </div>
</div>

<style>
    .hero-page {
        min-height: 100vh;
        background: linear-gradient(
            135deg,
            #3986d0 0%,
            #4c9aae 50%,
            #659883 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .hero-content {
        text-align: center;
        max-width: 600px;
        animation: fadeIn 1s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero-logo {
        max-width: 650px;
        width: 100%;
        height: auto;
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
        margin-bottom: 3rem;
        animation: floatIn 1.2s ease-out;
    }

    @keyframes floatIn {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero-tagline {
        font-family: "Caveat", cursive;
        font-size: 2.5rem;
        font-style: italic;
        color: white;
        margin-bottom: 3rem;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 2.5rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, #5ddfc9, #4ac9c3);
        border: none;
        border-radius: 50px;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.2),
            0 1px 3px rgba(255, 255, 255, 0.3) inset;
        animation: slideUp 1s 0.3s ease-out backwards;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .cta-button:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow:
            0 8px 25px rgba(0, 0, 0, 0.3),
            0 1px 3px rgba(255, 255, 255, 0.4) inset;
    }

    .cta-button:active {
        transform: translateY(-1px) scale(1.02);
    }

    .plane-icon {
        font-size: 1.25rem;
        transition: transform 0.3s ease;
    }

    .cta-button:hover .plane-icon {
        transform: translateX(4px) translateY(-4px);
    }

    /* Responsive */
    @media (max-width: 640px) {
        .hero-logo {
            max-width: 350px;
        }

        .hero-tagline {
            font-size: 1.5rem;
            margin-bottom: 2rem;
        }

        .cta-button {
            padding: 0.875rem 2rem;
            font-size: 1.125rem;
        }
    }

    @media (max-width: 480px) {
        .hero-page {
            padding: 1.5rem 1rem;
        }

        .hero-logo {
            max-width: 280px;
            margin-bottom: 2rem;
        }

        .hero-tagline {
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
        }

        .cta-button {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            gap: 0.5rem;
        }

        .plane-icon {
            font-size: 1rem;
        }
    }
</style>
