# Complaint Management System

This is a comprehensive portal for a complaint management system. The application serves two distinct roles:
1.  **Admin Portal (Web):** A powerful, desktop-first interface for administrators to manage, track, and analyze all user-submitted complaints.
2.  **User Portal (Mobile):** A streamlined, mobile-first experience for users to submit new complaints and track the status of their existing submissions.

The system uses the Google Gemini API for intelligent, automatic classification of new complaints and Firebase for a real-time backend.

---

## Access & Roles

The application is designed with a clear separation of concerns based on user roles.

### 👑 Admin Portal (Web Interface)

-   **Intended Device:** Desktop or tablet browsers.
-   **Access:** Log in with an admin account (e.g., `admin@example.com`).
-   **Purpose:** Provides a full suite of tools for complaint management, including an analytics dashboard, a filterable list of all complaints, and the ability to assign tasks and update statuses.

### 👤 User Portal (Mobile Interface)

-   **Intended Device:** Mobile phones.
-   **Access:** Log in with a user account (e.g., `user@example.com`) on a mobile device or by using browser developer tools to simulate one.
-   **Purpose:** Offers a focused experience for end-users. They can quickly submit a new complaint (optionally with their GPS location) and view the status of their past submissions. Access from a desktop browser is intentionally blocked to guide users to the intended mobile experience.

---

## Features

### Admin Role (Web)
-   **Analytics Dashboard:** View key metrics like total complaints, open issues, and high-urgency tickets. Visualize data with charts for complaints by category and urgency.
-   **Real-Time Complaint List:** See all submitted complaints in a filterable and sortable table.
-   **Advanced Filtering:** Filter complaints by Status, Urgency, or Assigned Admin.
-   **Status & Assignment Management:** Update the status of a complaint or assign it to an admin directly from the list.
-   **Create Complaints:** Admins can submit new complaints on behalf of users.

### User Role (Mobile)
-   **Personal Dashboard:** View a clean list of all complaints you have submitted.
-   **Submit New Complaints:** Easily create a new complaint through a simple modal.
-   **Attach GPS Location:** Optionally add your current geographical location to a complaint for better context.
-   **Real-Time Status Tracking:** See the latest status of your complaints as they are processed by admins.

### Core Technology
-   **Real-Time Backend:** Uses Firebase (Firestore and Authentication) for a persistent, real-time backend.
-   **AI-Powered Classification:** New complaints are automatically analyzed by the Google Gemini API to determine their urgency and category, enabling faster routing.
-   **Role-Based Access Control:** A unified application that intelligently presents different views based on user role and device type.

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

Follow these instructions to get the project up and running on your local machine.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   [npm](https://www.npmjs.com/) or another package manager
-   [Git](https://git-scm.com/)

### 2. Clone & Install

```bash
# Clone the repository
git clone YOUR_REPOSITORY_URL
cd name-of-the-project

# Install dependencies
npm install
```

### 3. Set Up Environment Variables

1.  **Create `.env` file:** In the project root, create a file named `.env`.
2.  **Add Your Keys:** Populate the `.env` file with your credentials from Google AI Studio and your Firebase project.

    ```env
    # Google Gemini API Key
    # Get one from Google AI Studio: https://aistudio.google.com/app/apikey
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE

    # Firebase Project Configuration
    # From Project Settings > General > Your apps > Web app > SDK setup
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_APP_ID
    ```
    **Note:** The `VITE_` prefix is required by Vite to expose these variables to the application.

### 4. Set Up Firebase

1.  **Enable Authentication:** In your Firebase console, go to **Authentication** > **Sign-in method** and enable **Email/Password**.

2.  **Create Test Users:** Go to the **Users** tab and add two users:
    -   `admin@example.com` (password: `password`)
    -   `user@example.com` (password: `password`)

3.  **Set Up Firestore:** Go to **Firestore Database**, create a new database, and start in **test mode**.

4.  **Configure Firestore Security Rules:** Your database is locked down by default. To allow the app to work, go to the **Rules** tab in Firestore and replace the contents with the following to allow access for any authenticated user:

    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow read and write access only for authenticated users
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
    Click **Publish**. For production, you should implement more granular security rules.

### 5. Run the Application

Start the local development server.

```bash
npm run dev
```

Open `http://localhost:5173` (or the URL provided) in your browser.

---

## How to Test

### Testing the Admin Portal

1.  Open the application in a desktop browser.
2.  Log in with the credentials:
    -   **Email:** `admin@example.com`
    -   **Password:** `password`
3.  You should see the full-featured admin dashboard.

### Testing the User Portal

1.  Open the application in a desktop browser.
2.  **Open Developer Tools:** Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Opt+I` (Mac).
3.  **Enable Device Simulation:** Click the "Toggle device toolbar" icon (it looks like a phone and tablet). This will switch the view to a mobile device emulator. Select a device like "iPhone 12 Pro" from the dropdown.
4.  **Refresh the page** while in device simulation mode.
5.  Log in with the credentials:
    -   **Email:** `user@example.com`
    -   **Password:** `password`
6.  You should see the mobile-optimized user dashboard. If you toggle device simulation off and refresh, you will see the "Blocked" screen.