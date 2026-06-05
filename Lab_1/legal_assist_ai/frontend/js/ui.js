export function addMessage(container, message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = message;
  
  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = new Date().toLocaleTimeString();
  
  messageDiv.appendChild(content);
  messageDiv.appendChild(time);
  container.appendChild(messageDiv);
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
  return messageDiv;
}

export function showTypingIndicator(container) {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.id = 'typing-indicator';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    indicator.appendChild(dot);
  }
  
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
  return indicator;
}

export function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

export function setMode(selectElement, mode) {
  selectElement.value = mode;
}

export function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = `❌ ${message}`;
  
  const container = document.querySelector('.chat-container');
  container.appendChild(errorDiv);
  
  setTimeout(() => errorDiv.remove(), 5000);
}