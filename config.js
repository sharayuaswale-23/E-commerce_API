require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI || MONGO_URI,
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key'
};