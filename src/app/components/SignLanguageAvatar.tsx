import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Accessibility, Loader2 } from 'lucide-react';
import { signLanguageService, SignInstruction } from '../utils/signLanguageService';

interface SignLanguageAvatarProps {
  text: string;
  isEnabled: boolean;
  className?: string;
}

export const SignLanguageAvatar: React.FC<SignLanguageAvatarProps> = ({ 
  text, 
  isEnabled,
  className = '' 
}) => {
  const [signs, setSigns] = useState<SignInstruction[]>([]);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled || !text || text.length < 3) {
      setSigns([]);
      return;
    }

    const fetchSigns = async () => {
      setIsLoading(true);
      setError(null);
      
      const result = await signLanguageService.getSignInstructions(text);
      
      if (result) {
        setSigns(result.signInstructions);
        setCurrentSignIndex(0);
      } else {
        setError('Failed to load sign language');
      }
      
      setIsLoading(false);
    };

    // Debounce: wait 1 second after text stops changing
    const timer = setTimeout(fetchSigns, 1000);
    return () => clearTimeout(timer);
  }, [text, isEnabled]);

  useEffect(() => {
    if (signs.length === 0) return;

    const currentSign = signs[currentSignIndex];
    if (!currentSign) return;

    const timer = setTimeout(() => {
      setCurrentSignIndex((prev) => (prev + 1) % signs.length);
    }, currentSign.duration);

    return () => clearTimeout(timer);
  }, [signs, currentSignIndex]);

  if (!isEnabled) return null;

  const currentSign = signs[currentSignIndex];

  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-border overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading signs...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Avatar Display */}
        {!isLoading && !error && signs.length > 0 && currentSign && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
            {/* Avatar Icon (placeholder for 3D model) */}
            <motion.div
              key={currentSignIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-2xl">
                <Accessibility className="w-16 h-16 text-white" />
              </div>
              
              {/* Hand shape indicator */}
              <motion.div
                animate={{
                  rotate: currentSign.movement.includes('wave') ? [0, 15, -15, 0] : 0,
                  y: currentSign.movement.includes('up') ? [-10, 0] : 
                     currentSign.movement.includes('down') ? [10, 0] : 0,
                }}
                transition={{ duration: currentSign.duration / 1000, repeat: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-6xl">👋</div>
              </motion.div>
            </motion.div>

            {/* Sign Information */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSignIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center space-y-2"
              >
                <h3 className="text-2xl font-bold text-foreground">
                  {currentSign.sign}
                </h3>
                <p className="text-sm text-muted-foreground">
                  "{currentSign.word}"
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <p className="text-muted-foreground">Hand Shape</p>
                    <p className="text-foreground font-medium">{currentSign.handShape}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <p className="text-muted-foreground">Location</p>
                    <p className="text-foreground font-medium">{currentSign.location}</p>
                  </div>
                </div>
                
                <div className="bg-secondary/50 rounded-lg p-2 mt-2">
                  <p className="text-muted-foreground text-xs">Movement</p>
                  <p className="text-foreground font-medium text-sm">{currentSign.movement}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicator */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Sign {currentSignIndex + 1} of {signs.length}</span>
                <span>{Math.round((currentSignIndex / signs.length) * 100)}%</span>
              </div>
              <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentSignIndex + 1) / signs.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && signs.length === 0 && text && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <Accessibility className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Waiting for text to translate...
              </p>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!text && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <Accessibility className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Sign language translation will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
