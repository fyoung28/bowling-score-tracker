# Bowling Score Tracker

A web application for tracking bowling scores and visualizing improvement over time.

## Features

- Track scores for multiple players
- Record scores frame by frame
- Visualize improvement over time with graphs
- Share scores with friends
- Free to use and host

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB Atlas
- Hosting: Vercel (Frontend) & Render (Backend)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Add necessary environment variables (see .env.example files)

4. Start the development servers:
   ```bash
   # Start frontend (in frontend directory)
   npm start

   # Start backend (in backend directory)
   npm run dev
   ```

## Contributing

Feel free to submit issues and enhancement requests! 