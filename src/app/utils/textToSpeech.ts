// Text-to-Speech utility
class TextToSpeechManager {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isEnabled: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Load voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
    // Prefer English voices
    this.selectedVoice = this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0];
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
    this.stop();
  }

  isActive() {
    return this.isEnabled;
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!this.isEnabled) return;

    // Stop any ongoing speech
    this.stop();

    // Clean text
    const cleanText = this.cleanText(text);
    if (!cleanText) return;

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (this.selectedVoice) {
      this.utterance.voice = this.selectedVoice;
    }
    
    this.utterance.rate = options?.rate || 1.0;
    this.utterance.pitch = options?.pitch || 1.0;
    this.utterance.volume = options?.volume || 1.0;
    this.utterance.lang = 'en-US';

    this.synthesis.speak(this.utterance);
  }

  stop() {
    this.synthesis.cancel();
  }

  pause() {
    this.synthesis.pause();
  }

  resume() {
    this.synthesis.resume();
  }

  private cleanText(text: string): string {
    // Remove markdown formatting
    let cleaned = text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, 'code block') // Replace code blocks
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, 'image: $1') // Replace images
      .replace(/\n+/g, '. ') // Replace newlines with periods
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    return cleaned;
  }

  getVoices() {
    return this.voices;
  }

  setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }
}

// Create singleton instance
export const ttsManager = new TextToSpeechManager();

// Hook for React components
export const useTTS = () => {
  const speak = (text: string) => {
    ttsManager.speak(text);
  };

  const stop = () => {
    ttsManager.stop();
  };

  const toggle = (enabled: boolean) => {
    if (enabled) {
      ttsManager.enable();
    } else {
      ttsManager.disable();
    }
  };

  return { speak, stop, toggle, isActive: ttsManager.isActive() };
};
