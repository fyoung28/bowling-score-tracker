const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://bowling-score-tracker-backend.onrender.com'  // Your Render backend URL
    : 'http://localhost:5001'
};

export default config; 