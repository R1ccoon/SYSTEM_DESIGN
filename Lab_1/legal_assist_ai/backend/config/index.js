require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3',
  isDev: process.env.NODE_ENV !== 'production'
};