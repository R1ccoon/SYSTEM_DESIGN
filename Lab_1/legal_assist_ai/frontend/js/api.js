const API_BASE = 'http://localhost:3001/api/chat';

export async function sendMessage(messages, mode = 'consult') {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, mode })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка сервера');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: 'Сервер не доступен' };
  }
}

export async function analyzeDocument(file, mode = 'doc') {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('mode', mode);
  
  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка анализа документа');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Document analysis error:', error);
    throw error;
  }
}