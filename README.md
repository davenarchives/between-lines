<div align="center">
  <img src="static/images/logo.png" alt="logo" width="120" height="auto" />
  <br/>
  <br/>

  # BETWEEN LINES

  **FOR THINGS WORTH SAYING**

  <br/>

  ![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

  <br/>

  <p>
    A modern, feature-rich platform for creating and exchanging digital letters with beautiful themes and a premium UI/UX experience.
  </p>
</div>

## 📖 Project Overview

**Between Lines** is a digital sanctuary for thoughtful communication. In an era of instant messaging, it provides a space for deliberate, meaningful connection. Users can craft personalized digital letters, choosing from various envelope aesthetics and letter themes, and share them via unique links to create a memorable reading experience for the recipient.

## ✨ Features

- **🎨 Customizable Themes**
  - **Envelopes**: Choose from Red, Pink, Green, and Blue styles.
  - **Stationery**: Write on Sticky Notes, Lined Paper, Pastel sheets, or Minimalist cards.
  
- **🎵 Atmospheric Experience**
  - **Spotify Integration**: Attach a song to your letter to set the mood for the reader.
  - **Immersive UI**: Enjoy smooth animations for opening envelopes, unfolding letters, and page navigation.

- **🔗 Seamless Sharing**
  - Generate unique, secure links for your recipients.
  - **Rich Link Previews**: Optimized with Server-Side Rendering (SSR) to display beautiful Open Graph previews when shared on platforms like Discord, Messenger, or Twitter.

## 🏗️ Architecture

The application is built for performance and user experience using a modern serverless architecture:

- **Frontend**: Built with **SvelteKit** (Svelte 5), leveraging its powerful component system and transitions.
- **Rendering**: Hybrid approach using **SSR** (Server-Side Rendering) for dynamic meta tags and **CSR** (Client-Side Rendering) for the interactive letter experience.
- **Backend & Storage**: **Firebase** provides real-time database capabilities (Firestore) and secure file storage.
- **Deployment**: Optimized for serverless deployment (e.g., Vercel), ensuring low latency and high availability.

## 🛠️ Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) & [SvelteKit](https://kit.svelte.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: Vanilla CSS & TailwindCSS
- **Database**: Firebase Firestore
- **Authentication/Storage**: Firebase SDK



---

## 📸 Screenshots

### Desktop View

<div align="center">
  <img src="static/screenshots/image-12.png" alt="Dashboard" width="100%" style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  <p><b>Dashboard</b></p>
</div>

<br/>

<table style="width:100%; text-align:center;">
  <tr>
    <td style="width:50%;">
      <img src="static/screenshots/image-6.png" alt="Letter Preview" width="100%" />
      <br/>
      <b>Letter Preview</b>
    </td>
    <td style="width:50%;">
      <img src="static/screenshots/image-8.png" alt="Writing Experience" width="100%" />
      <br/>
      <b>Writing Experience</b>
    </td>
  </tr>
  <tr>
    <td style="width:50%;">
      <img src="static/screenshots/image-7.png" alt="Envelope Selection" width="100%" />
      <br/>
      <b>Envelope Selection</b>
    </td>
    <td style="width:50%;">
      <img src="static/screenshots/image-9.png" alt="Opening Animation" width="100%" />
      <br/>
      <b>Opening Animation</b>
    </td>
  </tr>
  <tr>
    <td style="width:50%;">
      <img src="static/screenshots/image-10.png" alt="Theme Gallery" width="100%" />
      <br/>
      <b>Theme Gallery</b>
    </td>
    <td style="width:50%;">
      <img src="static/screenshots/image-11.png" alt="Responsive View" width="100%" />
      <br/>
      <b>Responsive View</b>
    </td>
  </tr>
</table>

### Mobile Experience

<table style="width:100%; text-align:center;">
  <tr>
    <td style="width:33%;">
      <img src="static/screenshots/mobileview.png" alt="Mobile Dashboard" width="100%" />
      <br/>
      <b>Dashboard</b>
    </td>
    <td style="width:33%;">
      <img src="static/screenshots/mobileviewpreview1.png" alt="Mobile Preview" width="100%" />
      <br/>
      <b>Preview</b>
    </td>
    <td style="width:33%;">
      <img src="static/screenshots/mobileviewoutput2.png" alt="Mobile Letter" width="100%" />
      <br/>
      <b>Letter View</b>
    </td>
  </tr>
</table>

## 📄 License

This project is open source and available under the [MIT License](LICENSE).