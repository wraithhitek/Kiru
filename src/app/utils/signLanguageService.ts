// Sign Language Service
export interface SignInstruction {
  word: string;
  sign: string;
  handShape: string;
  movement: string;
  location: string;
  duration: number;
}

export interface SignLanguageResponse {
  text: string;
  signInstructions: SignInstruction[];
  totalDuration: number;
  timestamp: number;
}

class SignLanguageService {
  private cache: Map<string, SignLanguageResponse> = new Map();

  async getSignInstructions(text: string): Promise<SignLanguageResponse | null> {
    // Check cache first
    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/text-to-sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Failed to get sign language instructions');
      }

      const data: SignLanguageResponse = await response.json();
      
      // Cache the result
      this.cache.set(text, data);
      
      return data;
    } catch (error) {
      console.error('Error getting sign language instructions:', error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const signLanguageService = new SignLanguageService();
