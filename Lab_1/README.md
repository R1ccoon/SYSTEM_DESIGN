# ⚖️ LegalAssist AI

Автоматизированный юридический помощник на базе **Ollama** (локальная LLM — никаких API-ключей и облачных зависимостей).

---

## Структура проекта

```
legalassist-ai/
├── backend/
│   ├── config/
│   │   ├── index.js
│   │   └── prompts.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── chat.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   └── ui.js
│   └── index.html
├── .gitignore
└── README.md
```

---

## Быстрый старт

### 1. Установить и запустить Ollama

```bash
# Установка (Linux / macOS)
curl -fsSL https://ollama.com/install.sh | sh

# Скачать модель (выберите одну)
ollama pull llama3       # рекомендуется (8B)
ollama pull mistral      # альтернатива
ollama pull gemma2       # лёгкая

# Ollama запустится автоматически на http://localhost:11434

# Запустить модель повторно
ollama serve
```

### 2. Настроить backend

```bash
cd backend
npm install
cp .env.example .env
# Убедитесь, что в .env указана правильная модель
```

### 3. Запустить backend

```bash
npm run dev # → http://localhost:3001
```

### 4. Открыть фронтенд

```bash
# Вариант A — VS Code Live Server:
# правой кнопкой на frontend/index.html → Open with Live Server

# Вариант B — через npx:
npx serve frontend   # → http://localhost:3000
```

---

## API Endpoints

| Метод | URL                 | Описание                                 |
| ----- | ------------------- | ---------------------------------------- |
| GET   | `/api/chat/health`  | Статус Ollama + список доступных моделей |
| POST  | `/api/chat`         | Отправить сообщение (JSON)               |
| POST  | `/api/chat/analyze` | Загрузить документ (multipart/form-data) |

### POST /api/chat

```json
{
  "messages": [
    { "role": "user", "content": "Что делать при незаконном увольнении?" }
  ],
  "mode": "consult"
}
```

Режимы: `consult` | `doc` | `search`

---

## Поддерживаемые модели Ollama

| Модель     | Команда               | Размер  | Качество |
| ---------- | --------------------- | ------- | -------- |
| LLaMA 3 8B | `ollama pull llama3`  | ~4.7 GB | ⭐⭐⭐⭐ |
| Mistral 7B | `ollama pull mistral` | ~4.1 GB | ⭐⭐⭐⭐ |
| Gemma 2 9B | `ollama pull gemma2`  | ~5.4 GB | ⭐⭐⭐⭐ |
| Qwen 2 7B  | `ollama pull qwen2`   | ~4.4 GB | ⭐⭐⭐   |

Сменить модель: в `.env` укажите `OLLAMA_MODEL=mistral`

---

## Деплой

### Сервер с Ollama (VPS)

```bash
# На VPS установить Ollama и скачать модель
ollama pull llama3

# Клонировать репозиторий
git clone https://github.com/ВАШ_ЛОГИН/legalassist-ai.git
cd legalassist-ai/backend
npm install --production
cp .env.example .env
# В .env: OLLAMA_HOST=http://localhost:11434, NODE_ENV=production
npm start

# Nginx: проксировать / на порт 3001, /frontend — статика
```

---

## Технологии

| Слой     | Стек                                                  |
| -------- | ----------------------------------------------------- |
| Backend  | Node.js, Express, multer, express-rate-limit          |
| LLM      | Ollama (локальная модель — llama3 / mistral / gemma2) |
| Frontend | Vanilla JS (ES Modules), HTML5, CSS3                  |

---

> Сервис предоставляет информацию справочного характера и не является заменой квалифицированной юридической помощи.
