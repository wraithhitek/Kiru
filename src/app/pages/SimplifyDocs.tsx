import { FeatureLayout } from "../components/FeatureLayout";
import { FileText, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function SimplifyDocs() {
  const [docUrl, setDocUrl] = useState('');
  const [simplified, setSimplified] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  
  const handleSimplify = () => {
    if (!docUrl.trim()) return;
    
    setIsSimplifying(true);
    setTimeout(() => {
      setSimplified(`# Python List Comprehension - Simplified

## What is it?
A concise way to create lists in Python using a single line of code.

## Basic Syntax
\`\`\`python
new_list = [expression for item in iterable if condition]
\`\`\`

## Simple Example
Instead of:
\`\`\`python
squares = []
for x in range(10):
    squares.append(x**2)
\`\`\`

You can write:
\`\`\`python
squares = [x**2 for x in range(10)]
\`\`\`

## Key Points
✅ More readable and concise
✅ Generally faster than loops
✅ Can include conditional filtering
✅ Works with any iterable (lists, tuples, strings, etc.)

## When to Use
- Creating new lists from existing ones
- Filtering data
- Transforming data

## When NOT to Use
- Complex logic (use regular loops)
- When readability suffers
- Side effects needed (use regular loops)`);
      setIsSimplifying(false);
    }, 1500);
  };
  
  return (
    <FeatureLayout
      title="Simplify Docs"
      subtitle="Break down complex documentation into digestible content"
      icon={<FileText className="w-8 h-8 text-white" strokeWidth={1.5} />}
      gradientClass="bg-gradient-to-br from-blue-500 to-purple-500"
    >
      <div className="grid grid-cols-[400px_1fr] gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <h3 
            className="text-sm text-muted-foreground mb-4"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Documentation Source
          </h3>
          
          <input
            type="text"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="Paste documentation URL..."
            className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-4"
            style={{ fontFamily: 'var(--font-sans)' }}
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSimplify}
            disabled={isSimplifying}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
          >
            {isSimplifying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Simplifying...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Simplify Documentation
              </>
            )}
          </motion.button>
          
          <div className="border-t border-border pt-4">
            <h4 
              className="text-sm text-muted-foreground mb-3"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
            >
              Try These Topics
            </h4>
            <div className="space-y-2">
              {[
                'Python List Comprehension',
                'React useEffect Hook',
                'JavaScript Promises',
                'CSS Grid Layout'
              ].map((topic, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ x: 4 }}
                  onClick={() => setDocUrl(`https://docs.example.com/${topic.toLowerCase().replace(/\s/g, '-')}`)}
                  className="w-full text-left px-4 py-2 rounded-lg bg-secondary hover:bg-blue-500/10 transition-colors text-sm text-foreground"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Simplified Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <h3 
            className="text-sm text-muted-foreground mb-4"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Simplified Content
          </h3>
          
          <div className="prose prose-sm max-w-none">
            {simplified ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="whitespace-pre-wrap text-foreground leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  {simplified}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Enter a documentation URL to get started
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </FeatureLayout>
  );
}
