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
-   **AI-Powered Classification:** New complaints are automatically analyzed by the Google Gemini API to determine their urgency and category, enabling faster routing.
-   **Role-Based Access Control:** A unified interface that intelligently presents different views and capabilities based on whether you are logged in as a User or an Admin.

---

## Tech Stack

-   **Frontend:** React 18, TypeScript, Vite
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

### 4. Set Up Your API Key

The application requires a Google Gemini API key to power its AI classification features.

1.  **Get an API Key:** Create your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

2.  **Create an Environment File:** In the root directory of the project, create a new file named `.env`.

3.  **Add the Key:** Open the `.env` file and add the following line, replacing `YOUR_API_KEY_HERE` with the key you just obtained.

    ```
    VITE_API_KEY=YOUR_API_KEY_HERE
    ```
    **Note:** The `VITE_` prefix is required by the Vite build tool to expose the variable to the application.

### 5. Run the Application

You are all set! Start the local development server with the following command:

```bash
npm run dev
```

Your terminal will display a message indicating that the server is running, usually on `http://localhost:5173`. Open this URL in your web browser to see the application.

---

## How to Use

The application has mock authentication set up with two predefined roles. Use the following credentials on the login screen:

-   **Admin Access:**
    -   **Email:** `admin@example.com`
    -   **Password:** `password`

-   **User Access:**
    -   **Email:** `user@example.com`
    -   **Password:** `password`
