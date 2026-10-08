# Borrow Box

Borrow Box is a responsive public marketplace where people can list items for permanent sale or for rent.

## Technology

- HTML5, CSS3, Bootstrap-friendly responsive styling, jQuery, and JavaScript frontend
- Node.js and Express backend
- MongoDB with Mongoose for accounts, listings, borrow requests, chats, and notifications

The frontend is a **static HTML/CSS/JavaScript app**. It does not use React, JSX, Vite, or a React build step.

## Run locally

1. Install Node.js (LTS) and MongoDB, or configure a MongoDB connection string.
2. From the project root, install backend dependencies:

   `npm install`

3. Create `server/.env` locally (do not commit it) and set:

   `MONGO_URI=your_mongodb_connection_string`

4. Start the app:

   `npm start`

5. Open `http://localhost:5000`.

The Express server serves the pages from `public/`. Demo listings are available in the frontend if the API/database is unavailable.

## Main features

- Get Started, login, and signup
- Browse listings and view item details
- List an item for sale or rent
- Track your own listings and profile
- Borrow/rental requests, chat, and seller history
- Light/dark theme
- Responsive layout for desktop and mobile

Never commit `server/.env`, credentials, or database connection strings.
