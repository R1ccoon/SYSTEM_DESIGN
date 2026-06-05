import { sendMessage, checkHealth, analyzeDocument } from './api.js';
import { addMessage, showTypingIndicator, removeTypingIndicator, setMode, showError } from './ui.js';

let currentMode = 'consult';
let messages = [];

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const modeSelect = document.getElementById('mode-select');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');

// Initialize
async function init() {
  const health = await checkHealth();
  if (health.status !== 'ok') {
    showError('Сервер не доступен. Убедитесь, что backend запущен.');
  } else {
    addMessage(chatContainer, `🤖 Здравствуйте! Я LegalAssist AI. Чем могу помочь? Режим: ${getModeName(currentMode)}`);
  }
  
  // Event listeners
  sendButton.addEventListener('click', sendMessageHandler);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  });
  
  modeSelect.addEventListener('change', (e) => {
    currentMode = e.target.value;
    addMessage(chatContainer, `ℹ️ Режим изменен на: ${getModeName(currentMode)}`, false);
  });
  
  uploadButton.addEventListener('click', uploadFileHandler);
}

function getModeName(mode) {
  const modes = {
    consult: 'Консультация',
    doc: 'Документы',
    search: 'Поиск информации'
  };
  return modes[mode] || mode;
}

async function sendMessageHandler() {
  const content = messageInput.value.trim();
  if (!content) return;
  
  // Add user message
  addMessage(chatContainer, content, true);
  messages.push({ role: 'user', content });
  messageInput.value = '';
  
  // Show typing indicator
  const indicator = showTypingIndicator(chatContainer);
  
  try {
    const response = await sendMessage([{ role: 'user', content }], currentMode);
    removeTypingIndicator();
    
    addMessage(chatContainer, response.message.content, false);
    messages.push({ role: 'assistant', content: response.message.content });
  } catch (error) {
    removeTypingIndicator();
    showError(error.message);
    addMessage(chatContainer, 'Извините, произошла ошибка. Попробуйте позже.', false);
  }
}

async function uploadFileHandler() {
  const file = fileInput.files[0];
  if (!file) {
    showError('Пожалуйста, выберите файл');
    return;
  }
  
  addMessage(chatContainer, `📄 Загружен файл: ${file.name}`, false);
  const indicator = showTypingIndicator(chatContainer);
  
  try {
    const result = await analyzeDocument(file, currentMode);
    removeTypingIndicator();
    addMessage(chatContainer, `📋 Анализ документа:\n\n${result.analysis}`, false);
  } catch (error) {
    removeTypingIndicator();
    showError(error.message);
  }
  
  fileInput.value = '';
}

// Start app
init();