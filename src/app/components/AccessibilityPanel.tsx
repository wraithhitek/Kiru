import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Accessibility, Mic, MicOff, X, Volume2, VolumeX, Type, Maximize2, Minimize2, Eye } from 'lucide-react';
import { ttsManager } from '../utils/textToSpeech';
import { SignLanguageAvatar } from './SignLanguageAvatar';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [signLanguageEnabled, setSignLanguageEnabled] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    // Listen for new text content to translate to sign language
    if (!signLanguageEnabled) return;

    const handleNewContent = (event: any) => {
      if (event.detail && typeof event.detail === 'string') {
        setCurrentText(event.detail);
      }
    };

    window.addEventListener('newAIResponse', handleNewContent);
    return () => window.removeEventListener('newAIResponse', handleNewContent);
  }, [signLanguageEnabled]);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        
        // Dispatch custom event with voice input
        window.dispatchEvent(new CustomEvent('voiceInput', { detail: transcript }));
        
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
      setVoiceInput('');
    }
  };

  const toggleTextToSpeech = () => {
    const newState = !textToSpeech;
    setTextToSpeech(newState);
    
    if (newState) {
      ttsManager.enable();
      ttsManager.speak('Text to speech enabled. Click on any text to hear it read aloud.');
    } else {
      ttsManager.disable();
    }
    
    // Dispatch event to notify all components
    window.dispatchEvent(new CustomEvent('toggleTTS', { detail: newState }));
  };

  const adjustGlobalFontSize = (size: number) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size}px`;
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
          height: isExpanded ? 'auto' : 'auto',
          maxHeight: isExpanded ? 'none' : '600px'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Accessibility Settings</h3>
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
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Voice Input Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold">Voice Input</h4>
                <p className="text-xs text-muted-foreground">
                  Speak to fill input fields on any page
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleListening}
              className={`w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Listening... Click to stop
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Click to speak
                </>
              )}
            </button>

            {voiceInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              >
                <p className="text-sm text-blue-400">You said: "{voiceInput}"</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Input sent to active field
                </p>
              </motion.div>
            )}
            
            <div className="mt-3 p-2 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 Works in: AI Tutor, Project Generator, Debug Error, Simplify Docs, Quiz Master
              </p>
            </div>
          </div>

          {/* Text-to-Speech Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Text-to-Speech</h4>
                <p className="text-xs text-muted-foreground">Hear AI responses read aloud</p>
              </div>
              <button
                onClick={toggleTextToSpeech}
                className={`p-3 rounded-xl transition-all ${
                  textToSpeech
                    ? 'bg-blue-500 text-white'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {textToSpeech ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-semibold mb-3">Visual Settings</h4>
            
            {/* Font Size */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-muted-foreground">Text Size</label>
                <span className="text-sm font-medium">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="20"
                value={fontSize}
                onChange={(e) => adjustGlobalFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">High Contrast Mode</label>
                <p className="text-xs text-muted-foreground">Increase text visibility</p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-3 rounded-xl transition-all ${
                  highContrast
                    ? 'bg-blue-500 text-white'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sign Language Avatar Section */}
          {showAvatar && (
            <div className="p-4 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold">Sign Language Avatar</h4>
                  <p className="text-xs text-muted-foreground">
                    {signLanguageEnabled ? 'Active' : 'Click to enable'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSignLanguageEnabled(!signLanguageEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      signLanguageEnabled
                        ? 'bg-blue-500 text-white'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    title={signLanguageEnabled ? 'Disable sign language' : 'Enable sign language'}
                  >
                    <Accessibility className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowAvatar(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Hide
                  </button>
                </div>
              </div>
              
              <SignLanguageAvatar
                text={currentText}
                isEnabled={signLanguageEnabled}
                className="h-64"
              />
              
              {signLanguageEnabled && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder="Type text to see sign language..."
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 Voice input works best in Chrome or Edge browsers
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
