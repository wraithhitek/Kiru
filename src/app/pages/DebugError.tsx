import { FeatureLayout } from "../components/FeatureLayout";
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
  
  const handleDebug = () => {
    if (!errorMessage.trim() && !code.trim()) return;
    
    setIsDebugging(true);
    setTimeout(() => {
      setSolution({
        issue: "You're trying to use index notation on an integer",
        explanation: "The variable 'result' contains a single integer (3), not a list. You cannot use bracket notation [0] on integers.",
        fix: "Remove the [0] from result, or ensure result is a list/array",
        correctedCode: `numbers = [1, 2, 3, 4, 5]
result = numbers[2]  # This is just the number 3
print(result)  # Simply print the value`
      });
      setIsDebugging(false);
    }, 1500);
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
            className="bg-card rounded-2xl border border-border p-6 space-y-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                  Issue Identified
                </h4>
                <p className="text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                  {solution.issue}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1 flex-shrink-0">
                <span className="text-blue-400 text-sm font-bold">?</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                  Explanation
                </h4>
                <p className="text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                  {solution.explanation}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                  How to Fix
                </h4>
                <p className="text-foreground mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
                  {solution.fix}
                </p>
                <div className="p-4 bg-secondary rounded-xl">
                  <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                    {solution.correctedCode}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </FeatureLayout>
  );
}
