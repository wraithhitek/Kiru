import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { ttsManager } from '../utils/textToSpeech';

interface ReadableTextProps {
  children: React.ReactNode;
  className?: string;
  autoRead?: boolean;
}

export const ReadableText: React.FC<ReadableTextProps> = ({ 
  children, 
  className = '',
  autoRead = false 
}) => {
  const [isReading, setIsReading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  useEffect(() => {
    // Listen for TTS toggle events
    const handleTTSToggle = (event: any) => {
      setTtsEnabled(event.detail);
    };

    window.addEventListener('toggleTTS', handleTTSToggle);
    return () => window.removeEventListener('toggleTTS', handleTTSToggle);
  }, []);

  useEffect(() => {
    if (autoRead && ttsEnabled && children) {
      const text = extractText(children);
      if (text) {
        ttsManager.speak(text);
      }
    }
  }, [autoRead, ttsEnabled, children]);

  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    if (Array.isArray(node)) return node.map(extractText).join(' ');
    if (node && typeof node === 'object' && 'props' in node) {
      return extractText((node as any).props.children);
    }
    return '';
  };

  const handleClick = () => {
    if (!ttsEnabled) return;

    const text = extractText(children);
    if (text) {
      setIsReading(true);
      ttsManager.speak(text);
      
      // Reset reading state after a delay
      setTimeout(() => setIsReading(false), 1000);
    }
  };

  if (!ttsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={`${className} ${ttsEnabled ? 'cursor-pointer hover:bg-blue-500/5 transition-colors rounded relative group' : ''}`}
      onClick={handleClick}
      title={ttsEnabled ? 'Click to read aloud' : ''}
    >
      {children}
      {ttsEnabled && (
        <Volume2 
          className={`w-4 h-4 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            isReading ? 'text-blue-400 animate-pulse' : 'text-muted-foreground'
          }`}
        />
      )}
    </div>
  );
};
