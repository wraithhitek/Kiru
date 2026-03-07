# 🚀 Kiru Backend - AWS Lambda Functions

## 📁 **Structure**
```
backend/
├── lambda-ai-tutor.mjs              # AI tutoring with Socratic method
├── lambda-code-explainer.mjs        # Code analysis and explanation
├── lambda-debug-error.mjs           # Error debugging assistance
├── lambda-quiz-master.mjs           # Dynamic quiz generation
├── lambda-project-generator.mjs     # Project scaffolding
├── lambda-simplify-docs.mjs         # Documentation simplification
├── lambda-text-to-sign-bedrock.mjs  # Sign language conversion
├── lambda-forgot-password.mjs       # Password reset
├── lambda-save-conversation.mjs     # Save user conversations
└── lambda-ai-tutor-bulletproof.mjs  # Enhanced AI tutor (development)
```

## 🔧 **Deployment**

### **1. Create Lambda Functions**
For each `.mjs` file:
1. Go to AWS Lambda Console
2. Create function with Node.js 20.x runtime
3. Set timeout to 60 seconds
4. Set memory to 512 MB
5. Copy and paste the code
6. Deploy

### **2. Set Environment Variables**
```bash
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PASSWORD=your-secure-password
AWS_REGION=ap-southeast-2
JWT_SECRET=your-jwt-secret-key
```

### **3. Configure IAM Permissions**
Each Lambda needs:
- `AWSLambdaBasicExecutionRole`
- `AmazonRDSDataFullAccess`
- `AmazonBedrockFullAccess`

### **4. API Gateway Routes**
```
POST /api/ai-tutor           → lambda-ai-tutor
POST /api/code-explainer     → lambda-code-explainer
POST /api/debug-error        → lambda-debug-error
POST /api/quiz-master        → lambda-quiz-master
POST /api/project-generator  → lambda-project-generator
POST /api/simplify-docs      → lambda-simplify-docs
POST /api/sign-language      → lambda-text-to-sign-bedrock
POST /api/auth/forgot        → lambda-forgot-password
POST /api/conversations      → lambda-save-conversation
```

## 🗄️ **Database Schema**
```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic VARCHAR(255),
    messages JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 **Testing**
Use these test events in Lambda console:

**AI Tutor:**
```json
{
  "httpMethod": "POST",
  "body": "{\"question\": \"What is a function in Python?\"}"
}
```

**Code Explainer:**
```json
{
  "httpMethod": "POST",
  "body": "{\"code\": \"def hello(): print('Hello')\", \"language\": \"python\"}"
}
```