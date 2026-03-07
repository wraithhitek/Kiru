# 🎓 Kiru Frontend - React Application

## 🌟 **Features**
- **AI Tutor** - Interactive learning with Socratic method
- **Code Explainer** - Detailed code analysis
- **Debug Assistant** - Smart error solutions
- **Quiz Master** - Dynamic quiz generation
- **Learning Paths** - Structured courses with progress tracking
- **Code Snippets** - Save and organize code examples
- **Practice Playground** - Live coding environment
- **Accessibility** - Full screen reader and keyboard support

## 🛠️ **Tech Stack**
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## 🚀 **Development**

### **Install Dependencies**
```bash
npm install
```

### **Start Development Server**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

## 🔧 **Configuration**

### **Environment Variables (.env)**
```bash
VITE_API_URL=https://your-api-gateway-url.amazonaws.com
```

## 📁 **Project Structure**
```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (buttons, cards, etc.)
│   │   ├── AccessibilityButton.tsx
│   │   ├── AccessibilityPanel.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── FeatureLayout.tsx
│   │   ├── FormattedText.tsx
│   │   ├── GlobalTTS.tsx
│   │   ├── KiruLogo.tsx
│   │   ├── Navigation.tsx
│   │   ├── ReadableText.tsx
│   │   └── SignLanguageAvatar.tsx
│   │
│   ├── pages/               # Page components
│   │   ├── AskAITutor.tsx
│   │   ├── CodeSnippets.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DebugError.tsx
│   │   ├── ExplainCode.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── LearningPath.tsx
│   │   ├── PracticePlayground.tsx
│   │   ├── ProjectGenerator.tsx
│   │   ├── QuizMaster.tsx
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── SimplifyDocs.tsx
│   │   └── UserDashboard.tsx
│   │
│   ├── utils/               # Utility functions
│   │   ├── codeSnippetManager.ts
│   │   ├── progressTracker.ts
│   │   ├── signLanguageService.ts
│   │   └── textToSpeech.ts
│   │
│   ├── routes.ts            # Application routes
│   └── App.tsx              # Main app component
│
├── styles/                  # Global styles
│   ├── fonts.css
│   ├── index.css
│   ├── tailwind.css
│   └── theme.css
│
└── main.tsx                 # Entry point
```

## 🎨 **Styling**
- **Tailwind CSS** for utility-first styling
- **Custom CSS variables** for theming
- **Responsive design** for all screen sizes
- **Dark/light mode** support
- **High contrast** accessibility mode

## ♿ **Accessibility Features**
- **ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode
- **Text-to-speech** integration
- **Sign language** support
- **Focus management**

## 🔗 **API Integration**
All API calls go to the backend Lambda functions:
- `POST /api/ai-tutor` - AI tutoring
- `POST /api/code-explainer` - Code analysis
- `POST /api/debug-error` - Error debugging
- `POST /api/quiz-master` - Quiz generation
- `POST /api/project-generator` - Project scaffolding
- `POST /api/simplify-docs` - Documentation simplification

## 📱 **Responsive Design**
- **Mobile-first** approach
- **Tablet** optimized layouts
- **Desktop** full-featured experience
- **Touch-friendly** interactions

## 🧪 **Testing**
```bash
# Run tests (when implemented)
npm run test
```

## 🚀 **Deployment**
```bash
# Build for production
npm run build

# Deploy to your hosting platform
# (Netlify, Vercel, AWS S3, etc.)
```