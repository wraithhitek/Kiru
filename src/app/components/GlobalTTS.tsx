import { useEffect, useState } from 'react';
import { ttsManager } from '../utils/textToSpeech';

export const GlobalTTS = () => {
  const [ttsEnabled, setTtsEnabled] = useState(false);

  useEffect(() => {
    // Listen for TTS toggle
    const handleTTSToggle = (event: any) => {
      setTtsEnabled(event.detail);
    };

    window.addEventListener('toggleTTS', handleTTSToggle);
    return () => window.removeEventListener('toggleTTS', handleTTSToggle);
  }, []);

  useEffect(() => {
    if (!ttsEnabled) return;

    // Create a MutationObserver to watch for new content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Skip certain elements
            if (
              element.tagName === 'SCRIPT' ||
              element.tagName === 'STYLE' ||
              element.tagName === 'NOSCRIPT' ||
              element.classList.contains('no-tts')
            ) {
              return;
            }

            // Get text content
            const text = element.textContent?.trim();
            
            // Only read substantial new content (more than 10 characters)
            if (text && text.length > 10) {
              // Check if this is AI response content
              if (
                element.classList.contains('formatted-text') ||
                element.closest('[class*="assistant"]') ||
                element.closest('[class*="response"]') ||
                element.closest('[class*="explanation"]') ||
                element.closest('[class*="analysis"]')
              ) {
                setTimeout(() => {
                  ttsManager.speak(text);
                }, 500);
              }
            }
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Add click listener to read any clicked text
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Skip buttons, inputs, and interactive elements
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }

      // Get the text content
      let text = '';
      
      // Try to get text from the clicked element or its parent
      if (target.textContent) {
        text = target.textContent.trim();
      } else if (target.parentElement?.textContent) {
        text = target.parentElement.textContent.trim();
      }

      if (text && text.length > 5) {
        ttsManager.speak(text);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClick);
    };
  }, [ttsEnabled]);

  return null; // This component doesn't render anything
};
