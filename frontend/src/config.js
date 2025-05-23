const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://bowling-score-tracker-backend.onrender.com'
    : 'http://localhost:5001'
};

export default config; 