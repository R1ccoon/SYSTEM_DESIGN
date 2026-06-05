const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const prompts = require('../config/prompts');

const upload = multer({ storage: multer.memoryStorage() });

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: 'Слишком много запросов, попробуйте позже'
});

router.use(limiter);

// Health check
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${config.ollamaHost}/api/tags`);
    const models = await response.json();
    
    res.json({
      status: 'ok',
      ollama: response.ok ? 'connected' : 'error',
      models: models.models?.map(m => m.name) || [],
      currentModel: config.model
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Ollama не доступен',
      error: error.message
    });
  }
});

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { messages, mode = 'consult' } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    
    const lastMessage = messages[messages.length - 1];
    const prompt = prompts[mode] + lastMessage.content;
    
    const response = await fetch(`${config.ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }
    
    const data = await response.json();
    
    res.json({
      message: {
        role: 'assistant',
        content: data.response
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: true,
      message: 'Ошибка при генерации ответа',
      details: error.message
    });
  }
});

// Document analysis
router.post('/analyze', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const content = req.file.buffer.toString('utf-8');
    const mode = req.body.mode || 'doc';
    
    const prompt = `${prompts[mode]}\n\nДокумент:\n${content}\n\nАнализ:`;
    
    const response = await fetch(`${config.ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.5,
          max_tokens: 3000
        }
      })
    });
    
    const data = await response.json();
    
    res.json({
      analysis: data.response,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: true,
      message: 'Ошибка при анализе документа'
    });
  }
});

module.exports = router;