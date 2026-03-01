# Kiru AI - India's AI Learning Platform

An AI-powered learning platform designed for developers to master programming through interactive features like AI tutoring, code explanation, debugging assistance, and more.

## Features

- **Ask AI Tutor** - Get instant help with programming concepts using the Socratic method
- **Code Explainer** - Understand code snippets and analyze entire files with AI-powered explanations
- **Debug Error** - Fix code problems with intelligent debugging assistance
- **Simplify Docs** - Break down complex documentation into digestible content
- **Project Generator** - Generate complete project structures with best practices
- **Quiz Master** - Test your knowledge with interactive AI-generated quizzes
- **User Dashboard** - Track your learning journey with personalized progress tracking

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI + Custom Components
- **Build Tool**: Vite 6

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Radix UI)
│   │   ├── FeatureLayout.tsx
│   │   ├── KiruLogo.tsx
│   │   └── Navigation.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx    # Landing page
│   │   ├── UserDashboard.tsx # User-specific dashboard
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   └── [feature pages]
│   ├── App.tsx
│   └── routes.ts
├── styles/
│   ├── theme.css           # Dark theme with blue-orange gradients
│   ├── tailwind.css
│   └── fonts.css
└── main.tsx
```

## Design System

- **Theme**: Dark mode with Sarvam.ai-inspired aesthetic
- **Colors**: Blue-orange gradient primary, dark backgrounds (#0A0A0A)
- **Typography**: System fonts with serif headings
- **Animations**: Smooth, optimized transitions (reduced motion support)

## Authentication

Currently uses localStorage for demo purposes:
- User data stored in `kiruUser` key
- Authentication status in `isAuthenticated` key
- **Note**: This is for demonstration only. Implement proper backend authentication for production.

## Routes

- `/` - Landing page
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/dashboard` - User dashboard (protected)
- `/ask-ai-tutor` - AI Tutor feature
- `/explain-code` - Code Explainer feature
- `/debug-error` - Debug Error feature
- `/simplify-docs` - Simplify Docs feature
- `/project-generator` - Project Generator feature
- `/quiz-master` - Quiz Master feature

## Development Notes

- All feature pages use mock data/simulated AI responses
- UI is fully responsive and optimized for performance
- Animations are GPU-accelerated with reduced-motion support
- Clean, minimal codebase with no unused dependencies