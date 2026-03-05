import { useState } from 'react';
import { motion } from 'motion/react';
import { Accessibility } from 'lucide-react';
import { AccessibilityPanel } from './AccessibilityPanel';

export const AccessibilityButton = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl flex items-center justify-center z-40 hover:shadow-blue-500/50 transition-shadow"
        title="Accessibility Features"
        aria-label="Open accessibility features"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AccessibilityPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
};
