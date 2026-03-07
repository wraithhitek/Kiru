import { FeatureLayout } from "../components/FeatureLayout";
import { FormattedText } from "../components/FormattedText";
import { CodeEditor } from "../components/CodeEditor";
import { Code2, Sparkles, FileCode, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { ProgressTracker } from "../utils/progressTracker";

export default function ExplainCode() {
  const [activeTab, setActiveTab] = useState<'snippet' | 'file'>('snippet');
  
  // Snippet state
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  
  // File analysis state
  const [selectedFile, setSelectedFile] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const detectLanguageFromCode = (code: string): string => {
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) return 'python';
    if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
    if (code.includes('React') || code.includes('useState') || code.includes('useEffect')) return 'react';
    if (code.includes('public class') || code.includes('System.out')) return 'java';
    if (code.includes('#include') || code.includes('cout')) return 'cpp';
    if (code.includes('<html>') || code.includes('<div>')) return 'html';
    if (code.includes('display:') || code.includes('color:')) return 'css';
    return 'general';
  };
  
  const exampleCode = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`;

  const files = [
    'app.py',
    'utils.py',
    'database.py',
    'api_routes.py'
  ];
  
  const handleExplain = async () => {
    if (!code.trim()) return;
    
    setIsExplaining(true);
    
    try {
      console.log('API URL:', import.meta.env.VITE_API_URL);
      console.log('Calling API...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/explain-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          userId: null
        })
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        setExplanation('Error: ' + data.error);
      } else {
        setExplanation(data.explanation);
        
        // Track activity for progress
        const language = detectLanguageFromCode(code);
        ProgressTracker.trackActivity('code_explainer', { 
          language: language,
          duration: 3 
        });
        
        // Save code snippet to database
        await saveCodeSnippet(code, data.explanation, 'code_explainer');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setExplanation('Failed to explain code. Check console for details.');
    } finally {
      setIsExplaining(false);
    }
  };

  const saveCodeSnippet = async (codeText: string, explanationText: string, feature: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('kiruUser') || '{}');
      if (!user.id) return;

      // Detect language from code (simple detection)
      let language = 'text';
      if (codeText.includes('def ') || codeText.includes('import ')) language = 'python';
      else if (codeText.includes('function ') || codeText.includes('const ')) language = 'javascript';
      else if (codeText.includes('public class') || codeText.includes('System.out')) language = 'java';
      else if (codeText.includes('#include') || codeText.includes('int main')) language = 'c++';

      await fetch(`${import.meta.env.VITE_API_URL}/api/progress/snippet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          code: codeText,
          explanation: explanationText,
          language,
          feature
        }),
      });

      console.log('Code snippet saved successfully');
    } catch (error) {
      console.error('Error saving code snippet:', error);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile && !uploadedFile) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const fileName = uploadedFile ? uploadedFile.name : selectedFile;
      setAnalysis({
        overview: `This is a ${fileName} file that contains application logic and functionality.`,
        components: [
          { name: "Main Logic", description: "Core functionality and business logic implementation" },
          { name: "Helper Functions", description: "Utility functions for data processing and validation" },
          { name: "Configuration", description: "Settings and configuration parameters" },
          { name: "Error Handling", description: "Exception handling and error recovery mechanisms" }
        ],
        dependencies: uploadedFile ? ['Detected from uploaded file'] : ['Flask', 'SQLAlchemy', 'python-dotenv', 'Flask-CORS'],
        complexity: 'Medium',
        suggestions: [
          "Consider adding more comments for better code documentation",
          "Implement unit tests for critical functions",
          "Review error handling for edge cases"
        ]
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('File is too large. Maximum size is 1MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setUploadedFile({
          name: file.name,
          content: content
        });
        setSelectedFile(''); // Clear selected file from list
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      
      reader.readAsText(file);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <FeatureLayout
      title="Code Explainer"
      subtitle="Understand code snippets and analyze entire files"
      icon={<Code2 className="w-8 h-8 text-white" strokeWidth={1.5} />}
      gradientClass="bg-gradient-to-br from-blue-500 to-purple-500"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('snippet')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'snippet'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code2 className="w-5 h-5" />
          Explain Snippet
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'file'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileCode className="w-5 h-5" />
          Analyze File
        </button>
      </div>

      {/* Snippet Tab Content */}
      {activeTab === 'snippet' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Code Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h3 
              className="text-sm text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Paste Your Code
            </h3>
            
            <CodeEditor
              value={code}
              onChange={setCode}
              placeholder="Paste your code snippet here..."
              allowFileUpload={true}
            />
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleExplain}
                disabled={isExplaining}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
              >
                {isExplaining ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Explain Code
                  </>
                )}
              </button>
              
              <button
                onClick={() => setCode(exampleCode)}
                className="px-6 py-3 rounded-xl border border-border hover:border-blue-500/50 transition-colors text-foreground"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Try Example
              </button>
            </div>
          </motion.div>
          
          {/* Explanation Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h3 
              className="text-sm text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Explanation
            </h3>
            
            <div 
              className="h-[400px] overflow-y-auto"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {explanation ? (
                <div className="text-foreground leading-relaxed">
                  <FormattedText content={explanation} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Paste your code and click "Explain Code" to get started
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* File Analysis Tab Content */}
      {activeTab === 'file' && (
        <div className="grid grid-cols-[300px_1fr] gap-6">
          {/* File Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 
                className="text-sm text-muted-foreground mb-4"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
              >
                Select File
              </h3>
              
              <div className="space-y-2 mb-4">
                {uploadedFile && (
                  <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-red-400 hover:text-red-300"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedFile(file);
                      setUploadedFile(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedFile === file && !uploadedFile
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-secondary hover:bg-blue-500/10 text-foreground'
                    }`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {file}
                  </button>
                ))}
              </div>
              
              <label className="w-full px-4 py-2 rounded-xl border-2 border-dashed border-border hover:border-blue-500/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground">
                <Upload className="w-4 h-4" />
                Upload Your File
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".py,.js,.ts,.tsx,.jsx,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.sql,.html,.css,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={(!selectedFile && !uploadedFile) || isAnalyzing}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
            >
              {isAnalyzing ? (
                <>
                  <FileCode className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileCode className="w-5 h-5" />
                  Analyze File
                </>
              )}
            </button>
          </motion.div>
          
          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            {analysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                    Overview
                  </h3>
                  <p className="text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                    {analysis.overview}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
                    Key Components
                  </h3>
                  <div className="space-y-3">
                    {analysis.components.map((comp: any, idx: number) => (
                      <div key={idx} className="p-4 bg-secondary rounded-xl">
                        <h4 className="font-medium mb-1 text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                          {comp.name}
                        </h4>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                          {comp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                    Dependencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.dependencies.map((dep: string, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-secondary rounded-full text-sm text-foreground"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                    Suggestions for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                        <span className="text-blue-400 mt-1">💡</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Select a file and click "Analyze File" to get started
              </div>
            )}
          </motion.div>
        </div>
      )}
    </FeatureLayout>
  );
}
