
<div align="center">
  <br />
  <p>
    <a href="https://ecoguard.app"><img src="https://raw.githubusercontent.com/firebase/studio-images/main/EcoGuard/ecoguard-logo-animation.svg" width="200" alt="EcoGuard Logo Animation" /></a>
  </p>
  <br />
  <p>
    <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge" alt="build" /></a>
    <a href="#"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="license" /></a>
    <a href="https://twitter.com/firebase"><img src="https://img.shields.io/twitter/follow/firebase?style=for-the-badge&logo=twitter" alt="twitter" /></a>
  </p>
</div>

---

## 🌲 About EcoGuard

**EcoGuard** is a comprehensive, AI-powered application designed to combat illegal logging through real-time monitoring and streamlined incident management. It equips forest rangers and administrators with the tools they need to protect our vital forest ecosystems. The platform provides instant alerts, detailed incident tracking, and data-driven insights to enable swift and effective responses.

> This project was built with **[Firebase Studio](https://studio.firebase.google.com)**, an AI-powered development environment for building and deploying full-stack web applications.

---

## ✨ Features

EcoGuard offers a robust suite of features tailored for two primary user roles: **Rangers** on the ground and **Administrators** overseeing operations.

| Feature                 | Ranger                                                               | Administrator                                                          | Status      |
| ----------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------- |
| **Real-time Alerts**    | 📲 Receive push notifications for high-confidence incidents.         | 📊 View a live dashboard of all incoming incidents.                    | ✅ Complete  |
| **Incident Dashboard**  | 📋 View, filter, and acknowledge incidents.                          | 🎛️ Full CRUD control over all incidents, users, and devices.         | ✅ Complete  |
| **Interactive Map**     | 🗺️ See incident locations with color-coded status pins.              | 🌍 View a heatmap of high-risk areas and all device locations.         | ✅ Complete  |
| **Incident Details**    | 📝 Add investigation notes and upload photographic evidence.         | 📜 Access complete event history and sensor logs for any incident.   | ✅ Complete  |
| **AI Confidence Score** | N/A                                                                  | 🤖 Utilize a Genkit AI tool to analyze incident confidence levels.    | ✅ Complete  |
| **User Management**     | ⚙️ Manage personal profile settings.                                | 👥 Add, edit, and remove user accounts for rangers and other admins.   | ✅ Complete  |
| **Theme Customization** | N/A                                                                  | 🎨 Customize the application's color scheme.                           | ✅ Complete  |

---

## 🛠️ Tech Stack

This project is built on a modern, robust, and scalable technology stack:

-   **[Next.js](https://nextjs.org/)** - React framework for server-side rendering and static site generation.
-   **[Firebase](https://firebase.google.com/)** - Backend platform for authentication, database (Firestore), and storage.
-   **[Genkit (from Firebase)](https://firebase.google.com/docs/genkit)** - AI toolkit for building production-ready AI-powered features.
-   **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework for rapid UI development.
-   **[ShadCN UI](https://ui.shadcn.com/)** - A collection of beautifully designed, accessible UI components.
-   **[TypeScript](https://www.typescriptlang.org/)** - Statically typed superset of JavaScript.
-   **[Netlify](https://www.netlify.com/)** - Platform for deploying and hosting the frontend application.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/ecoguard.git
    cd ecoguard
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Firebase project configuration. You can get this from the Firebase Console.
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## ☁️ Deployment

This application is configured for easy deployment on **Netlify**.

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  **Create a new site** on Netlify and connect it to your repository.
3.  **Configure build settings:** Netlify should automatically detect that this is a Next.js project and configure the build settings correctly using the `netlify.toml` file.
4.  **Add Environment Variables:** In your Netlify site dashboard, go to `Site settings > Build & deploy > Environment` and add the same Firebase environment variables from your `.env` file.
5.  **Deploy!** Trigger a new deploy. Your site will be live in a few minutes.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ by Shreyan S</p>
</div>
