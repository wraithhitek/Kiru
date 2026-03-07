# 🔌 API Documentation

## 🌐 **Base URL**
```
https://your-api-id.execute-api.ap-southeast-2.amazonaws.com
```

## 🤖 **AI Features**

### **AI Tutor**
Interactive AI tutoring with Socratic method.

**Endpoint:** `POST /api/ai-tutor`

**Request:**
```json
{
  "question": "What is a function in Python?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous question"
    },
    {
      "role": "assistant", 
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "answer": "🎯 **Problem Analysis**: You asked about functions in Python...",
  "model": "Educational Response System",
  "feature": "AI Tutor",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### **Code Explainer**
Detailed code analysis and explanation.

**Endpoint:** `POST /api/code-explainer`

**Request:**
```json
{
  "code": "def hello_world():\n    print('Hello, World!')",
  "language": "python",
  "explanationLevel": "detailed"
}
```

**Response:**
```json
{
  "explanation": "🎯 **Code Analysis**: Analyzing your python code...",
  "model": "Code Analysis System",
  "feature": "Code Explainer",
  "language": "python"
}
```

---

### **Debug Error**
Smart error debugging assistance.

**Endpoint:** `POST /api/debug-error`

**Request:**
```json
{
  "errorMessage": "NameError: name 'x' is not defined",
  "code": "print(x)",
  "language": "python",
  "stackTrace": "Traceback (most recent call last)...",
  "context": "I was trying to print a variable"
}
```

**Response:**
```json
{
  "solution": "🎯 **Error Analysis**: Debugging your python issue...",
  "model": "Debug Assistant",
  "feature": "Debug Error",
  "language": "python"
}
```

---

### **Quiz Master**
Dynamic quiz generation for any topic.

**Endpoint:** `POST /api/quiz-master`

**Request:**
```json
{
  "topic": "JavaScript Functions",
  "difficulty": "medium",
  "questionCount": 5
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "What is a function in JavaScript?",
      "options": [
        "A) A reusable block of code",
        "B) A variable",
        "C) A loop",
        "D) A condition"
      ],
      "correct": 0,
      "explanation": "Functions are reusable blocks of code..."
    }
  ],
  "model": "Quiz Generator",
  "feature": "Quiz Master",
  "topic": "JavaScript Functions",
  "difficulty": "medium",
  "count": 5
}
```

---

### **Project Generator**
Complete project scaffolding and templates.

**Endpoint:** `POST /api/project-generator`

**Request:**
```json
{
  "projectType": "Web Application",
  "technology": "javascript",
  "complexity": "medium",
  "features": ["authentication", "database"],
  "description": "A simple todo app"
}
```

**Response:**
```json
{
  "project": "# Web Application Project - javascript\n\n## Project Overview...",
  "model": "Project Generator",
  "feature": "Project Generator",
  "projectType": "Web Application",
  "technology": "javascript",
  "complexity": "medium"
}
```

---

### **Simplify Docs**
Documentation simplification for better understanding.

**Endpoint:** `POST /api/simplify-docs`

**Request:**
```json
{
  "documentText": "Complex technical documentation...",
  "simplificationLevel": "beginner"
}
```

**Response:**
```json
{
  "simplifiedText": "📄 **Simplified Documentation**\n\n**Simple explanation**...",
  "model": "Document Simplifier",
  "feature": "Simplify Docs",
  "simplificationLevel": "beginner",
  "originalLength": 1000,
  "simplifiedLength": 800
}
```

---

### **Sign Language**
Text to sign language conversion.

**Endpoint:** `POST /api/sign-language`

**Request:**
```json
{
  "text": "Hello, how are you?"
}
```

**Response:**
```json
{
  "text": "Hello, how are you?",
  "signInstructions": [
    {
      "word": "hello",
      "sign": "HELLO",
      "handShape": "open hand",
      "movement": "wave near face",
      "location": "near face",
      "duration": 1000
    }
  ],
  "totalDuration": 5000,
  "timestamp": 1640995200000
}
```

## 🔐 **Authentication**

### **Forgot Password**
Password reset functionality.

**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset instructions sent to your email",
  "tempPassword": "abc12345"
}
```

## 💾 **Data Management**

### **Save Conversation**
Save user conversations to database.

**Endpoint:** `POST /api/conversations/save`

**Request:**
```json
{
  "userId": 123,
  "messages": [
    {
      "role": "user",
      "content": "What is Python?"
    },
    {
      "role": "assistant",
      "content": "Python is a programming language..."
    }
  ],
  "topic": "Python Basics"
}
```

**Response:**
```json
{
  "message": "Conversation saved successfully",
  "conversationId": 456
}
```

## 🚨 **Error Responses**

### **400 Bad Request**
```json
{
  "error": "Question is required and must be a string",
  "received": "undefined"
}
```

### **500 Internal Server Error**
```json
{
  "error": "Failed to get AI tutor response",
  "details": "Connection timeout"
}
```

## 📊 **Rate Limits**

- **100 requests per 15 minutes** per IP address
- **Rate limit headers** included in responses:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## 🔒 **CORS Policy**

- **Allowed Origins**: `*` (configure for production)
- **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Allowed Headers**: `Content-Type, Authorization`

## 📝 **Request/Response Format**

### **Content Type**
- **Request**: `application/json`
- **Response**: `application/json`

### **Common Headers**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🧪 **Testing Examples**

### **cURL Examples**

**AI Tutor:**
```bash
curl -X POST https://your-api-url/api/ai-tutor \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is a function in Python?",
    "conversationHistory": []
  }'
```

**Code Explainer:**
```bash
curl -X POST https://your-api-url/api/code-explainer \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello(): print(\"Hello World\")",
    "language": "python"
  }'
```

**Quiz Master:**
```bash
curl -X POST https://your-api-url/api/quiz-master \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "JavaScript",
    "difficulty": "medium",
    "questionCount": 3
  }'
```

### **JavaScript Examples**

```javascript
// AI Tutor
const response = await fetch('/api/ai-tutor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: 'What is a function in Python?',
    conversationHistory: []
  })
});

const data = await response.json();
console.log(data.answer);
```

## 🔍 **Monitoring**

### **Health Check**
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### **Metrics Available**
- Request count per endpoint
- Response times
- Error rates
- Active users
- Database connection status

## 📚 **SDK/Client Libraries**

### **JavaScript/TypeScript**
```javascript
import { KiruAPI } from '@kiru/api-client';

const api = new KiruAPI({
  baseURL: 'https://your-api-url',
  timeout: 30000
});

// AI Tutor
const response = await api.aiTutor.ask({
  question: 'What is a function?'
});

// Code Explainer
const explanation = await api.codeExplainer.explain({
  code: 'def hello(): print("Hello")',
  language: 'python'
});
```

## 🔄 **Webhooks**

### **User Activity Webhook**
Receive notifications when users complete activities.

**URL:** Your webhook endpoint
**Method:** `POST`
**Payload:**
```json
{
  "event": "activity_completed",
  "userId": 123,
  "activity": "quiz_completed",
  "data": {
    "topic": "JavaScript",
    "score": 85,
    "timeSpent": 300
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```