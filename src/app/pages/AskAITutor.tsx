import { FeatureLayout } from "../components/FeatureLayout";
import { FormattedText } from "../components/FormattedText";
import { MessageCircle, Send, Trash2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ProgressTracker } from "../utils/progressTracker";
import { CodeSnippetManager } from "../utils/codeSnippetManager";

export default function AskAITutor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI tutor. I\'m here to help you understand concepts using the Socratic method. What would you like to learn about today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Listen for voice input from accessibility panel
  useEffect(() => {
    const handleVoiceInput = (event: any) => {
      setInput(event.detail);
    };
    
    window.addEventListener('voiceInput', handleVoiceInput);
    return () => window.removeEventListener('voiceInput', handleVoiceInput);
  }, []);
  
  const exampleQuestions = [
    "What is a function in Python?",
    "How do loops work?",
    "Explain list comprehension",
    "What is object-oriented programming?"
  ];
  
  const detectLanguageFromQuestion = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('python') || lowerQuestion.includes('py')) return 'python';
    if (lowerQuestion.includes('javascript') || lowerQuestion.includes('js')) return 'javascript';
    if (lowerQuestion.includes('react')) return 'react';
    if (lowerQuestion.includes('html')) return 'html';
    if (lowerQuestion.includes('css')) return 'css';
    if (lowerQuestion.includes('java') && !lowerQuestion.includes('javascript')) return 'java';
    if (lowerQuestion.includes('c++') || lowerQuestion.includes('cpp')) return 'cpp';
    return 'general';
  };
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get conversation history (last 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
          conversationHistory: conversationHistory
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      } else {
        // Simple message handling - no complex enhancements for now
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer || 'No response received'
        }]);
        
        // Track activity for progress - detect language from question
        const language = detectLanguageFromQuestion(userMessage);
        ProgressTracker.trackActivity('ai_tutor', { 
          topic: userMessage.substring(0, 50),
          language: language,
          duration: 5
        });
        
        // Auto-save as snippet if response contains code
        if (data.answer && typeof data.answer === 'string') {
          const codeMatch = data.answer.match(/```[\s\S]*?```/g);
          if (codeMatch && codeMatch.length > 0) {
            // Extract code from markdown code blocks
            const codeContent = codeMatch.map(block => 
              block.replace(/```\w*\n?/, '').replace(/```$/, '')
            ).join('\n\n');
            
            if (codeContent.trim().length > 20) {
              CodeSnippetManager.autoSaveFromAI(
                codeContent.trim(), 
                data.answer, 
                'ai_tutor', 
                language
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearConversation = () => {
    if (confirm('Are you sure you want to clear this conversation?')) {
      setMessages([
        { role: 'assistant', content: 'Hello! I\'m your AI tutor. I\'m here to help you understand concepts using the Socratic method. What would you like to learn about today?' }
      ]);
    }
  };

  const handleSaveConversation = async () => {
    try {
      // Save to localStorage for now
      const timestamp = new Date().toISOString();
      const savedConversations = JSON.parse(localStorage.getItem('savedConversations') || '[]');
      
      savedConversations.push({
        id: Date.now(),
        messages: messages,
        topic: 'AI Tutor Session',
        timestamp: timestamp
      });
      
      localStorage.setItem('savedConversations', JSON.stringify(savedConversations));
      alert('Conversation saved locally!');
    } catch (error) {
      console.error('Error saving conversation:', error);
      alert('Failed to save conversation');
    }
  };
  
  return (
    <FeatureLayout
      title="Ask AI Tutor"
      subtitle="Learn through guided questioning using the Socratic method"
      icon={<MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />}
      gradientClass="bg-gradient-to-br from-blue-500 to-orange-500"
    >
      <div className="grid grid-cols-[1fr_300px] gap-6">
        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-6 flex flex-col"
          style={{ height: '600px' }}
        >
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold">Conversation</h3>
            <div className="flex gap-2">
              <button
                onClick={handleSaveConversation}
                className="p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
                title="Save conversation"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearConversation}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-orange-500 text-white' 
                      : 'bg-secondary text-foreground'
                  }`}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <FormattedText content={msg.content} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 text-white shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.div>
        
        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 
            className="text-sm text-muted-foreground mb-3"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Example Questions
          </h3>
          {exampleQuestions.map((question, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              onClick={() => setInput(question)}
              className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-blue-500/50 transition-all"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {question}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </FeatureLayout>
  );
}
