const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const chatRoutes = require('./routes/chat');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/chat', chatRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
    console.log(`🚀 LegalAssist AI Server running on http://localhost:${config.port}`);
    console.log(`📡 Ollama host: ${config.ollamaHost}`);
    console.log(`🤖 Model: ${config.model}`);
});