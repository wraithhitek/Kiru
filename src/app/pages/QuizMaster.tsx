import { FeatureLayout } from "../components/FeatureLayout";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function QuizMaster() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  
  const topics = [
    { id: 'python-basics', name: 'Python Basics', icon: '🐍' },
    { id: 'web-dev', name: 'Web Development', icon: '🌐' },
    { id: 'algorithms', name: 'Algorithms', icon: '🧩' },
    { id: 'databases', name: 'Databases', icon: '🗄️' }
  ];
  
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  
  const questions: Question[] = [
    {
      question: "What is the output of: print(type([]))?",
      options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"],
      correct: 1,
      explanation: "The square brackets [] create a list in Python. The type() function returns <class 'list'>."
    },
    {
      question: "Which of the following is mutable in Python?",
      options: ["tuple", "string", "list", "integer"],
      correct: 2,
      explanation: "Lists are mutable, meaning their contents can be changed after creation. Tuples, strings, and integers are immutable."
    },
    {
      question: "What does the 'enumerate()' function do?",
      options: [
        "Counts items in a list",
        "Returns index and value pairs",
        "Sorts a list",
        "Reverses a list"
      ],
      correct: 1,
      explanation: "enumerate() returns an iterator of tuples containing indices and their corresponding values from the iterable."
    }
  ];
  
  const handleStartQuiz = () => {
    if (!topic || !difficulty) return;
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };
  
  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizStarted(false);
    }
  };
  
  return (
    <FeatureLayout
      title="Quiz Master"
      subtitle="Test your knowledge with interactive quizzes"
      icon={<Award className="w-8 h-8 text-white" strokeWidth={1.5} />}
      gradientClass="bg-gradient-to-br from-orange-500 to-red-500"
    >
      {!quizStarted ? (
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <h3 
              className="text-sm text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Select Topic
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {topics.map((t, idx) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTopic(t.id)}
                  className={`p-4 rounded-xl transition-all ${
                    topic === t.id
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-secondary hover:bg-orange-500/10 text-foreground'
                  }`}
                >
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                    {t.name}
                  </div>
                </motion.button>
              ))}
            </div>
            
            <h3 
              className="text-sm text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Difficulty Level
            </h3>
            
            <div className="flex gap-3 mb-8">
              {difficulties.map((d, idx) => (
                <motion.button
                  key={d}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                    difficulty === d
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-secondary hover:bg-orange-500/10 text-foreground'
                  }`}
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                >
                  {d}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartQuiz}
              disabled={!topic || !difficulty}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
            >
              <Award className="w-6 h-6" />
              Start Quiz
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-orange-500" style={{ fontFamily: 'var(--font-sans)' }}>
                Score: {score}/{questions.length}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
          
          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <h3 
              className="text-2xl mb-8 text-foreground"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
            >
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === questions[currentQuestion].correct;
                const showResult = showExplanation;
                
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={!showExplanation ? { x: 4 } : {}}
                    onClick={() => !showExplanation && handleAnswer(idx)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 ${
                      showResult
                        ? isCorrect
                          ? 'bg-emerald-500/20 border-2 border-emerald-500'
                          : isSelected
                          ? 'bg-red-500/20 border-2 border-red-500'
                          : 'bg-secondary border border-border'
                        : isSelected
                        ? 'bg-orange-500/20 border-2 border-orange-500'
                        : 'bg-secondary border border-border hover:border-orange-500/50'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      showResult
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-500'
                          : isSelected
                          ? 'border-red-500 bg-red-500'
                          : 'border-muted-foreground'
                        : isSelected
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-muted-foreground'
                    }`}>
                      {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                    </span>
                    {option}
                  </motion.button>
                );
              })}
            </div>
            
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/50 mb-6"
              >
                <h4 className="text-sm font-semibold text-blue-400 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                  Explanation
                </h4>
                <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                  {questions[currentQuestion].explanation}
                </p>
              </motion.div>
            )}
            
            {showExplanation && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </FeatureLayout>
  );
}
