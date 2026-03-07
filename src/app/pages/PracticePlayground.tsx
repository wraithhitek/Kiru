import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FeatureLayout } from '../components/FeatureLayout';
import { 
  Play, 
  Square, 
  Save, 
  Download, 
  Upload, 
  Timer, 
  Trophy, 
  Code2, 
  Zap,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { ProgressTracker } from '../utils/progressTracker';
import { CodeSnippetManager } from '../utils/codeSnippetManager';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  language: string;
  starterCode: string;
  expectedOutput?: string;
  testCases?: Array<{ input: string; output: string }>;
}

export default function PracticePlayground() {
  const [code, setCode] = useState('// Welcome to Practice Playground!\n// Write your code here and click Run to execute\n\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isChallenge, setIsChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedSessions, setSavedSessions] = useState<Array<{id: string, name: string, code: string, language: string}>>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const challenges: Challenge[] = [
    {
      id: 'fizzbuzz',
      title: 'FizzBuzz Challenge',
      description: 'Print numbers 1-100, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz"',
      difficulty: 'easy',
      timeLimit: 10,
      language: 'javascript',
      starterCode: '// FizzBuzz Challenge\n// Print numbers 1-100 with the FizzBuzz rules\n\nfor (let i = 1; i <= 100; i++) {\n  // Your code here\n}',
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz'
    },
    {
      id: 'palindrome',
      title: 'Palindrome Checker',
      description: 'Create a function that checks if a string is a palindrome (reads the same forwards and backwards)',
      difficulty: 'medium',
      timeLimit: 15,
      language: 'javascript',
      starterCode: '// Palindrome Checker\n// Create a function that returns true if the string is a palindrome\n\nfunction isPalindrome(str) {\n  // Your code here\n}\n\n// Test cases\nconsole.log(isPalindrome("racecar")); // should return true\nconsole.log(isPalindrome("hello")); // should return false'
    },
    {
      id: 'fibonacci',
      title: 'Fibonacci Sequence',
      description: 'Generate the first n numbers in the Fibonacci sequence',
      difficulty: 'medium',
      timeLimit: 20,
      language: 'javascript',
      starterCode: '// Fibonacci Sequence\n// Generate the first n Fibonacci numbers\n\nfunction fibonacci(n) {\n  // Your code here\n}\n\n// Test\nconsole.log(fibonacci(10)); // Should output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]'
    },
    {
      id: 'array-sum',
      title: 'Array Sum Challenge',
      description: 'Find two numbers in an array that add up to a target sum',
      difficulty: 'hard',
      timeLimit: 25,
      language: 'javascript',
      starterCode: '// Two Sum Problem\n// Find two numbers that add up to target\n\nfunction twoSum(nums, target) {\n  // Return indices of the two numbers\n  // Your code here\n}\n\n// Test\nconst nums = [2, 7, 11, 15];\nconst target = 9;\nconsole.log(twoSum(nums, target)); // Should return [0, 1]'
    }
  ];

  useEffect(() => {
    loadSavedSessions();
  }, []);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleChallengeEnd();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimerActive]);

  const loadSavedSessions = () => {
    const sessions = localStorage.getItem('practicePlaygroundSessions');
    if (sessions) {
      setSavedSessions(JSON.parse(sessions));
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      if (language === 'javascript') {
        await runJavaScript();
      } else if (language === 'python') {
        await runPython();
      } else if (language === 'html') {
        runHTML();
      }

      // Track activity
      ProgressTracker.trackActivity('debug_error', { 
        language: language,
        duration: 2 
      });

    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runJavaScript = async () => {
    return new Promise((resolve) => {
      const originalLog = console.log;
      const originalError = console.error;
      let output = '';

      // Capture console output
      console.log = (...args) => {
        output += args.join(' ') + '\n';
      };

      console.error = (...args) => {
        output += 'Error: ' + args.join(' ') + '\n';
      };

      try {
        // Create a safe execution environment
        const func = new Function(code);
        func();
        setOutput(output || 'Code executed successfully (no output)');
      } catch (error) {
        setOutput(`Error: ${error}`);
      } finally {
        // Restore original console methods
        console.log = originalLog;
        console.error = originalError;
        resolve(void 0);
      }
    });
  };

  const runPython = async () => {
    // For Python, we'll simulate execution since we can't run Python in browser
    // In a real implementation, you'd use Pyodide or a backend service
    setOutput('Python execution simulated.\nNote: Full Python support requires backend integration.');
  };

  const runHTML = () => {
    setShowPreview(true);
    setOutput('HTML preview updated');
  };

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setIsChallenge(true);
    setCode(challenge.starterCode);
    setLanguage(challenge.language);
    setTimeLeft(challenge.timeLimit * 60); // Convert to seconds
    setIsTimerActive(true);
    setOutput(`Challenge started: ${challenge.title}\nTime limit: ${challenge.timeLimit} minutes`);
  };

  const handleChallengeEnd = () => {
    setIsTimerActive(false);
    if (currentChallenge) {
      setOutput(prev => prev + '\n\n⏰ Time\'s up! Challenge completed.');
      
      // Track challenge completion
      ProgressTracker.trackActivity('quiz_completed', { 
        topic: currentChallenge.title,
        score: timeLeft > 0 ? 100 : 50, // Full score if completed in time
        duration: currentChallenge.timeLimit 
      });
    }
  };

  const exitChallenge = () => {
    setIsChallenge(false);
    setCurrentChallenge(null);
    setIsTimerActive(false);
    setTimeLeft(0);
    setCode('// Welcome back to Practice Playground!\n\nconsole.log("Hello, World!");');
    setOutput('');
  };

  const saveSession = () => {
    const sessionName = prompt('Enter a name for this session:');
    if (sessionName) {
      const newSession = {
        id: Date.now().toString(),
        name: sessionName,
        code,
        language
      };
      
      const updatedSessions = [...savedSessions, newSession];
      setSavedSessions(updatedSessions);
      localStorage.setItem('practicePlaygroundSessions', JSON.stringify(updatedSessions));
      
      // Also save as code snippet
      CodeSnippetManager.autoSaveFromAI(code, `Practice session: ${sessionName}`, 'debug_error', language);
    }
  };

  const loadSession = (session: any) => {
    setCode(session.code);
    setLanguage(session.language);
    setOutput(`Loaded session: ${session.name}`);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = savedSessions.filter(s => s.id !== sessionId);
    setSavedSessions(updatedSessions);
    localStorage.setItem('practicePlaygroundSessions', JSON.stringify(updatedSessions));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <FeatureLayout
      title="Practice Playground"
      description="Code, run, and challenge yourself in a live environment"
      icon={<Code2 className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={isChallenge}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
              </select>

              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Code
                  </>
                )}
              </button>

              {!isChallenge && (
                <>
                  <button
                    onClick={saveSession}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>

                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      showPreview 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-secondary border border-border hover:border-purple-500/50'
                    }`}
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    Preview
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isChallenge && currentChallenge && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                    <Timer className="w-4 h-4" />
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                  </div>
                  <button
                    onClick={exitChallenge}
                    className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-1"
                  >
                    <Square className="w-3 h-3" />
                    Exit
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-secondary border border-border hover:border-blue-500/50 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </Card>

        {/* Challenge Banner */}
        {isChallenge && currentChallenge && (
          <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-lg">{currentChallenge.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(currentChallenge.difficulty)}`}>
                    {currentChallenge.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{currentChallenge.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Time Limit</p>
                <p className="font-semibold">{currentChallenge.timeLimit} minutes</p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Editor Area */}
        <div className={`grid gap-6 ${isFullscreen ? 'fixed inset-4 z-50 bg-background' : showPreview && language === 'html' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Code Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Code Editor</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Lines: {code.split('\n').length}
                </span>
              </div>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </Card>

          {/* HTML Preview */}
          {showPreview && language === 'html' && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Preview</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={code}
                  className="w-full h-96 bg-white"
                  title="HTML Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Output Console */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Output Console</h3>
            <button
              onClick={() => setOutput('')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
          
          <div 
            ref={outputRef}
            className="bg-secondary rounded-lg p-4 font-mono text-sm min-h-32 max-h-64 overflow-y-auto whitespace-pre-wrap"
          >
            {output || 'Output will appear here...'}
          </div>
        </Card>

        {/* Challenges Section */}
        {!isChallenge && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold">Coding Challenges</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-border hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => startChallenge(challenge)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {challenge.timeLimit}m
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {challenge.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Saved Sessions */}
        {!isChallenge && savedSessions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Saved Sessions</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {savedSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-lg border border-border hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{session.name}</h4>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{session.language}</p>
                  <button
                    onClick={() => loadSession(session)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </FeatureLayout>
  );
}