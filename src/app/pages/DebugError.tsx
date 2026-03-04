import { FeatureLayout } from "../components/FeatureLayout";
import { FormattedText } from "../components/FormattedText";
import { Bug, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function DebugError() {
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [solution, setSolution] = useState<any>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  
  const exampleError = `TypeError: 'int' object is not subscriptable`;
  const exampleCode = `numbers = [1, 2, 3, 4, 5]
result = numbers[2]
value = result[0]  # Error here
print(value)`;
  
  const handleDebug = async () => {
    if (!errorMessage.trim()) return;
    
    setIsDebugging(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/debug-error`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorMessage: errorMessage,
          code: code || null
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setSolution({ issue: 'Error', explanation: data.error, fix: '', correctedCode: '' });
      } else {
        // Parse the AI response into structured format
        setSolution({ 
          raw: data.solution,
          issue: data.solution,
          explanation: '',
          fix: '',
          correctedCode: ''
        });
        
        // Save code snippet to database if code was provided
        if (code.trim()) {
          await saveCodeSnippet(code, data.solution, 'debug_error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setSolution({ issue: 'Failed to debug', explanation: 'Please try again.', fix: '', correctedCode: '' });
    } finally {
      setIsDebugging(false);
    }
  };

  const saveCodeSnippet = async (codeText: string, solutionText: string, feature: string) => {
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
          explanation: solutionText,
          language,
          feature
        }),
      });

      console.log('Debug code snippet saved successfully');
    } catch (error) {
      console.error('Error saving debug code snippet:', error);
    }
  };
  
  return (
    <FeatureLayout
      title="Debug Error"
      subtitle="Get instant help fixing your code problems"
      icon={<Bug className="w-8 h-8 text-white" strokeWidth={1.5} />}
      gradientClass="bg-gradient-to-br from-orange-500 to-red-500"
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h3 
              className="text-sm text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Error Message
            </h3>
            
            <textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Paste your error message here..."
              className="w-full h-32 p-4 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm resize-none"
              style={{ fontFamily: 'monospace' }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h3 
              className="text-sm text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Your Code (Optional)
            </h3>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the problematic code here..."
              className="w-full h-32 p-4 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm resize-none"
              style={{ fontFamily: 'monospace' }}
            />
          </motion.div>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDebug}
            disabled={isDebugging}
            className="px-8 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 text-white shadow-lg disabled:opacity-50 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
          >
            {isDebugging ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Bug className="w-5 h-5" />
                </motion.div>
                Debugging...
              </>
            ) : (
              <>
                <Bug className="w-5 h-5" />
                Debug Error
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setErrorMessage(exampleError);
              setCode(exampleCode);
            }}
            className="px-6 py-3 rounded-xl border border-border hover:border-blue-500/50 transition-colors text-foreground"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Try Example
          </motion.button>
        </div>
        
        {/* Solution Section */}
        {solution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <div className="text-foreground leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
              <FormattedText content={solution.raw || solution.issue} />
            </div>
          </motion.div>
        )}
      </div>
    </FeatureLayout>
  );
}
