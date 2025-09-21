# Complaint Management System

This is a comprehensive web portal for a complaint management system, designed for both administrators and users. Admins can view, assign, update, and analyze all user complaints in real-time. The system uses the Google Gemini API to automatically classify new complaints by urgency and category. Users can submit their own complaints and track their status.

---

## Features

### Admin Role
-   **Analytics Dashboard:** View key metrics like total complaints, open issues, and high-urgency tickets. Visualize data with charts for complaints by category and urgency.
-   **Real-Time Complaint List:** See all submitted complaints in a filterable and sortable table.
-   **Advanced Filtering:** Filter complaints by Status, Urgency, or Assigned Admin.
-   **Status & Assignment Management:** Update the status of a complaint or assign it to an admin directly from the list.
-   **Create Complaints:** Admins can submit new complaints on behalf of users.

### User Role
-   **Personal Dashboard:** View a clean list of all complaints you have submitted.
-   **Submit New Complaints:** Easily create a new complaint through a simple modal.
-   **Attach GPS Location:** Optionally add your current geographical location to a complaint for better context.
-   **Real-Time Status Tracking:** See the latest status of your complaints as they are processed by admins.

### Core Technology
-   **Real-Time Backend:** Uses Firebase (Firestore and Authentication) for a persistent, real-time backend.
-   **AI-Powered Classification:** New complaints are automatically analyzed by the Google Gemini API to determine their urgency and category, enabling faster routing.
-   **Role-Based Access Control:** A unified interface that intelligently presents different views and capabilities based on whether you are logged in as a User or an Admin.

---

## Tech Stack

-   **Frontend:** React 18, TypeScript, Vite
-   **Backend:** Firebase (Firestore, Authentication)
-   **Styling:** Tailwind CSS
-   **AI Model:** Google Gemini API (`@google/genai`)
-   **Charts:** Recharts
-   **Icons:** Heroicons
-   **Date Formatting:** date-fns

---

## Getting Started: Running Locally

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

Make sure you have the following software installed on your laptop:
-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Git](https://git-scm.com/)

### 2. Clone the Repository

Open your terminal, navigate to where you want to store the project, and clone the repository.

```bash
# Replace YOUR_REPOSITORY_URL with the actual URL from GitHub
git clone YOUR_REPOSITORY_URL
cd name-of-the-project
```

### 3. Install Dependencies

Install all the necessary project dependencies using npm.

```bash
npm install
```

### 4. Set Up Environment Variables

The application requires API keys for both Google Gemini and Firebase.

1.  **Create an Environment File:** In the root directory of the project, create a new file named `.env`.

2.  **Add Your Keys:** Open the `.env` file and add the following lines, replacing the placeholder values with your actual credentials.

    ```env
    # Google Gemini API Key
    # Get one from Google AI Studio: https://aistudio.google.com/app/apikey
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE

    # Firebase Project Configuration
    # Create a project at https://console.firebase.google.com/
    # Go to Project Settings > General > Your apps > Web app > SDK setup and configuration
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_APP_ID
    ```
    **Note:** The `VITE_` prefix is required by the Vite build tool to expose these variables to the application.

### 5. Set Up Firebase

1.  **Enable Authentication:** In your Firebase project console, go to **Authentication** -> **Sign-in method** and enable the **Email/Password** provider.

2.  **Create Test Users:** Go to the **Users** tab in the Authentication section and add the following two users so you can log in:
    -   `admin@example.com` (password: `password`)
    -   `user@example.com` (password: `password`)

3.  **Set Up Firestore:** Go to **Firestore Database** and create a new database. Start in **test mode** for easy setup (you can secure it later with security rules).

### 6. Run the Application

You are all set! Start the local development server with the following command:

```bash
npm run dev
```

Your terminal will display a message indicating that the server is running, usually on `http://localhost:5173`. Open this URL in your web browser to see the application.
