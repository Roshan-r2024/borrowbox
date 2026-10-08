# Borrow Box

Borrow Box is a responsive public marketplace where people can list items for permanent sale or for rent.

## Technology

- Static HTML, CSS, jQuery, and JavaScript frontend
- Node.js and Express backend
- MongoDB with Mongoose for accounts, listings, borrow requests, chats, and notifications

The frontend does **not** use React, JSX, Vite, or a React build step. Express serves the pages directly from `public/`.

## Run locally

1. Install Node.js (LTS) and configure a MongoDB database.
2. Create `server/.env` locally (do not commit it) and add:

   `MONGO_URI=your_mongodb_connection_string`

3. Install backend dependencies:

   ```bash
   cd server
   npm install
   cd ..
   ```

4. Start Borrow Box from the project root:

   ```bash
   npm start
   ```

5. Open `http://localhost:5000`.

Demo listings are included in the frontend so the marketplace can show sample items when the API/database is unavailable. Login/signup and marketplace operations that use the API require the backend; persistent accounts/listings require MongoDB.

## Main features

- Get Started, login, and signup
- Browse listings and view item details
- List an item for permanent sale or rent
- Track your own listings and profile
- Borrow/rental requests, chat, and seller history
- Light/dark theme
- Responsive desktop and mobile layout

Never commit `server/.env`, credentials, or database connection strings.
