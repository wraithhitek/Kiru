import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Accessibility, Mic, MicOff, X, Volume2, VolumeX, Type, Maximize2, Minimize2 } from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setCaptions(prev => [...prev.slice(-4), finalTranscript.trim()]);
          setCurrentCaption('');
        } else {
          setCurrentCaption(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Restart if no speech detected
          if (isListening) {
            recognitionRef.current?.start();
          }
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearCaptions = () => {
    setCaptions([]);
    setCurrentCaption('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
        className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4'} bg-card border-2 border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden`}
        style={{ 
          width: isExpanded ? 'auto' : '400px',
          height: isExpanded ? 'auto' : '500px'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Accessibility Features</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sign Language Avatar Section */}
          {showAvatar && (
            <div className="p-4 border-b border-border bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Sign Language Avatar</h4>
                <button
                  onClick={() => setShowAvatar(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Hide
                </button>
              </div>
              <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center border border-border">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Accessibility className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sign language avatar will appear here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Feature in development)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Live Captions Section */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">Live Captions</h4>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Size:</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground w-8">{fontSize}px</span>
              </div>
            </div>

            {/* Captions Display */}
            <div 
              className="flex-1 bg-black/40 rounded-xl p-4 overflow-y-auto mb-3 border border-border"
              style={{ fontSize: `${fontSize}px` }}
            >
              {captions.length === 0 && !currentCaption && (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  {isListening ? 'Listening for speech...' : 'Click the microphone to start live captions'}
                </div>
              )}
              
              <div className="space-y-2">
                {captions.map((caption, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-foreground leading-relaxed"
                  >
                    {caption}
                  </motion.div>
                ))}
                {currentCaption && (
                  <div className="text-blue-400 leading-relaxed italic">
                    {currentCaption}
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Listening
                  </>
                )}
              </button>
              
              {captions.length > 0 && (
                <button
                  onClick={clearCaptions}
                  className="px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                  title="Clear captions"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 Tip: Use Chrome or Edge for best speech recognition results
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
