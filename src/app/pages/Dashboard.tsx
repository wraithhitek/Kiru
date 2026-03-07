import { Navigation } from "../components/Navigation";
import { motion } from "motion/react";
import { Sparkles, Code2, Zap, Globe, MessageCircle, Bug, FileText, FolderPlus, Award, Target, BookOpen, Play } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ 
      fontFamily: 'var(--font-sans)' 
    }}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">AI-Powered Learning Platform</span>
            </motion.div>
            
            <h1 className="text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                India's AI Learning
              </span>
              <br />
              <span className="text-foreground">Platform</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Master programming with AI-powered tutoring. Built for developers, by developers. 
              Learn faster, code better, ship confidently.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 rounded-lg font-medium text-lg bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg shadow-blue-500/25"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-lg font-medium text-lg bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors"
              >
                View Features
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              AI-Powered Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore our comprehensive suite of learning tools
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Learning Path",
                description: "Track your progress with personalized roadmaps and daily goals",
                to: "/learning-path",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Code Snippets",
                description: "Your personal code knowledge base with smart organization",
                to: "/code-snippets",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Play className="w-8 h-8" />,
                title: "Practice Playground",
                description: "Code, run, and challenge yourself in a live environment",
                to: "/practice-playground",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Ask AI Tutor",
                description: "Get instant help with programming concepts using the Socratic method",
                to: "/ask-ai-tutor",
                gradient: "from-blue-500 to-orange-500"
              },
              {
                icon: <Code2 className="w-8 h-8" />,
                title: "Code Explainer",
                description: "Understand code snippets and analyze entire files with AI-powered explanations",
                to: "/explain-code",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Bug className="w-8 h-8" />,
                title: "Debug Error",
                description: "Fix your code problems with intelligent debugging assistance",
                to: "/debug-error",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Simplify Docs",
                description: "Break down complex documentation into digestible content",
                to: "/simplify-docs",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: <FolderPlus className="w-8 h-8" />,
                title: "Project Generator",
                description: "Generate complete project structures with best practices",
                to: "/project-generator",
                gradient: "from-cyan-500 to-blue-500"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Quiz Master",
                description: "Test your knowledge with interactive AI-generated quizzes",
                to: "/quiz-master",
                gradient: "from-amber-500 to-orange-500"
              }
            ].map((feature, index) => (
              <Link key={index} to={feature.to}>
                <div className="relative group cursor-pointer h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="relative p-8 rounded-2xl bg-card border border-border hover:border-blue-500/50 transition-colors h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-1">{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Original Features Section */}
      <section id="tools" className="relative py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Built for Scale
            </h2>
            <p className="text-xl text-muted-foreground">
              Enterprise-grade AI tools for every developer
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                icon: <Code2 className="w-8 h-8" />,
                title: "Code Intelligence",
                description: "AI-powered code explanation and debugging across all major languages"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Answers",
                description: "Get real-time help from our AI tutor trained on latest documentation"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Built in India",
                description: "Sovereign platform designed for Indian developers and enterprises"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                <div className="relative p-8 rounded-2xl bg-card border border-border">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/20 to-orange-500/20 border border-white/10 p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-orange-500/5" />
            <div className="relative">
              <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
                Start Learning Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of developers mastering their craft with AI-powered learning
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-10 py-5 rounded-lg font-medium text-lg bg-white text-black shadow-xl"
              >
                Begin Your Journey
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
