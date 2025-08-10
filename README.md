# WhatsApp Web Clone - Webhook Interface

A full-stack application that simulates the WhatsApp Web interface by processing and displaying chat conversations from webhook data. The interface shows chats neatly, supports real-time updates via WebSockets, and allows for sending new messages for demonstration purposes.

### **Live Demo URL:**
**[https://whatsapp-web-clone-zeta.vercel.app/](https://whatsapp-web-clone-zeta.vercel.app/)**



## ## Features

* **WhatsApp-Like UI**: A clean, responsive, and mobile-friendly interface that mimics the look and feel of WhatsApp Web.
* **Webhook Data Processing**: Backend endpoint to process incoming webhook payloads for new messages and message status updates (sent, delivered, read).
* **Grouped Conversations**: The UI neatly groups all messages into conversations based on the user.
* **Real-Time Updates**: Built with **Socket.IO** to provide real-time updates. New messages and status changes appear instantly without needing a page refresh.
* **Message Status Indicators**: Displays ✔️ (sent), ✔️✔️ (delivered), and blue ✔️✔️ (read) status indicators for outgoing messages.
* **Send Messages**: A "Send Message" input box that saves new messages to the database and updates the UI in real-time.
* **Secure Webhook**: The webhook endpoint is secured using **Signature Verification** to ensure payloads are authentic.
* **Efficient Data Loading**: Implemented API **pagination** to efficiently load message history, making the app scalable for long conversations.
* **Centralized State Management**: Uses **Zustand** on the frontend for clean, simple, and scalable state management.

---

## ## Tech Stack

* **Backend**: Node.js, Express.js, MongoDB (Atlas), Mongoose, Socket.IO, `dotenv`
* **Frontend**: React (with Vite), Zustand, Tailwind CSS, Axios, `socket.io-client`
* **Deployment**: Backend on Render, Frontend on Vercel

---

## ## Local Setup and Installation

### ### Prerequisites
* Node.js (v18+ or v20+ LTS recommended)
* `pnpm` (or `npm`/`yarn`)
* MongoDB Atlas account

### ### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>/backend
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the `backend` directory and add the following variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    APP_SECRET=your_meta_app_secret
    PORT=5000
    ```

4.  **Seed the database (Optional):**
    To populate your database with the sample data, run the seed script:
    ```bash
    pnpm seed
    # or npm run seed
    ```

5.  **Start the server:**
    ```bash
    pnpm start
    # or npm start
    ```
    The backend server will be running on `http://localhost:5000`.

### ### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the `frontend` directory and add the backend URL:
    ```
    VITE_BACKEND_URL=http://localhost:5000
    ```

4.  **Start the development server:**
    ```bash
    pnpm dev
    # or npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173` (or another port if 5173 is busy).

---
## ## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/webhook` | Secured endpoint to receive webhook events from Meta for messages & statuses. |
| `GET` | `/api/conversations` | Fetches a list of all unique conversations, grouped by user. |
| `GET` | `/api/messages/:wa_id` | Fetches all messages for a specific conversation with pagination support. |
| `POST` | `/api/send` | Sends a new message from the UI and saves it to the database. |

---
## ## Deployment

This project is deployed as two separate services:

* The **backend** is deployed as a **Web Service** on **Render**, with environment variables for the database URI and app secret configured in the Render dashboard.
* The **frontend** is deployed as a static site on **Vercel**, with the `VITE_BACKEND_URL` environment variable pointing to the live backend URL on Render.
## Usage Instructions

1. **Viewing Conversations**: The left panel displays all conversations with the most recent at the top
2. **Selecting a Conversation**: Click on any conversation to view the message history in the chat window
3. **Sending Messages**: Type your message in the input field at the bottom of the chat window and press Enter or click Send
4. **Searching Conversations**: Use the search bar at the top to filter conversations by name or message content
5. **Message Status**: Sent messages show different indicators for sent, delivered, and read statuses
6. **Real-time Updates**: New messages appear instantly without refreshing the page
7. **Responsive Design**: The app works on both desktop and mobile devices with an adaptive layout
## Environment Variables

### Backend (.env file in backend directory)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend (.env file in frontend directory)
```env
VITE_BACKEND_URL=http://localhost:5000
```

Make sure to replace `your_mongodb_connection_string` with your actual MongoDB connection string.
## Conclusion

This WhatsApp Web Clone demonstrates a modern full-stack application with real-time communication capabilities. It showcases the integration of React with Vite for a fast frontend experience, Node.js with Express for a robust backend, MongoDB for data persistence, and Socket.IO for real-time features.

The application provides a responsive user interface that works across devices and simulates the core functionality of WhatsApp Web, including real-time messaging, status updates, and conversation management.

Feel free to explore the codebase and extend the functionality as needed for your own projects.