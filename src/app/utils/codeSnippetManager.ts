// Code Snippet Management Utility

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  explanation: string;
  source: 'ai_tutor' | 'code_explainer' | 'debug_error' | 'manual';
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CodeSnippetManager {
  private static STORAGE_KEY = 'codeSnippets';

  // Get all snippets
  static getAllSnippets(): CodeSnippet[] {
    const snippetsJson = localStorage.getItem(this.STORAGE_KEY);
    if (!snippetsJson) return [];
    
    try {
      const snippets = JSON.parse(snippetsJson);
      // Sort by creation date (newest first)
      return snippets.sort((a: CodeSnippet, b: CodeSnippet) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error parsing snippets:', error);
      return [];
    }
  }

  // Save snippet
  static saveSnippet(snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>): CodeSnippet {
    const snippets = this.getAllSnippets();
    
    const newSnippet: CodeSnippet = {
      ...snippet,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    snippets.unshift(newSnippet);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snippets));
    
    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('snippetSaved', { detail: newSnippet }));
    
    return newSnippet;
  }

  // Auto-save from AI features
  static autoSaveFromAI(
    code: string, 
    explanation: string, 
    source: 'ai_tutor' | 'code_explainer' | 'debug_error',
    language?: string
  ): CodeSnippet | null {
    // Don't save if code is too short or empty
    if (!code.trim() || code.trim().length < 10) return null;

    // Don't save duplicates (check last 10 snippets)
    const recentSnippets = this.getAllSnippets().slice(0, 10);
    const isDuplicate = recentSnippets.some(snippet => 
      snippet.code.trim() === code.trim() && snippet.source === source
    );
    
    if (isDuplicate) return null;

    // Detect language if not provided
    const detectedLanguage = language || this.detectLanguage(code);
    
    // Generate title from code or explanation
    const title = this.generateTitle(code, explanation, source);
    
    // Generate tags
    const tags = this.generateTags(code, explanation, detectedLanguage, source);

    return this.saveSnippet({
      title,
      code: code.trim(),
      language: detectedLanguage,
      explanation: explanation.trim(),
      source,
      tags,
      isFavorite: false
    });
  }

  // Delete snippet
  static deleteSnippet(id: string): void {
    const snippets = this.getAllSnippets();
    const filteredSnippets = snippets.filter(snippet => snippet.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSnippets));
    
    window.dispatchEvent(new CustomEvent('snippetDeleted', { detail: id }));
  }

  // Toggle favorite
  static toggleFavorite(id: string): void {
    const snippets = this.getAllSnippets();
    const snippet = snippets.find(s => s.id === id);
    
    if (snippet) {
      snippet.isFavorite = !snippet.isFavorite;
      snippet.updatedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snippets));
      
      window.dispatchEvent(new CustomEvent('snippetUpdated', { detail: snippet }));
    }
  }

  // Update snippet
  static updateSnippet(id: string, updates: Partial<CodeSnippet>): void {
    const snippets = this.getAllSnippets();
    const snippetIndex = snippets.findIndex(s => s.id === id);
    
    if (snippetIndex !== -1) {
      snippets[snippetIndex] = {
        ...snippets[snippetIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snippets));
      
      window.dispatchEvent(new CustomEvent('snippetUpdated', { detail: snippets[snippetIndex] }));
    }
  }

  // Search snippets
  static searchSnippets(query: string): CodeSnippet[] {
    const snippets = this.getAllSnippets();
    const lowerQuery = query.toLowerCase();
    
    return snippets.filter(snippet =>
      snippet.title.toLowerCase().includes(lowerQuery) ||
      snippet.code.toLowerCase().includes(lowerQuery) ||
      snippet.explanation.toLowerCase().includes(lowerQuery) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get snippets by language
  static getSnippetsByLanguage(language: string): CodeSnippet[] {
    return this.getAllSnippets().filter(snippet => snippet.language === language);
  }

  // Get favorite snippets
  static getFavoriteSnippets(): CodeSnippet[] {
    return this.getAllSnippets().filter(snippet => snippet.isFavorite);
  }

  // Get snippets by source
  static getSnippetsBySource(source: CodeSnippet['source']): CodeSnippet[] {
    return this.getAllSnippets().filter(snippet => snippet.source === source);
  }

  // Get statistics
  static getStatistics() {
    const snippets = this.getAllSnippets();
    const languages = [...new Set(snippets.map(s => s.language))];
    const sources = [...new Set(snippets.map(s => s.source))];
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return {
      total: snippets.length,
      favorites: snippets.filter(s => s.isFavorite).length,
      languages: languages.length,
      sources: sources.length,
      thisWeek: snippets.filter(s => new Date(s.createdAt) > weekAgo).length,
      byLanguage: languages.map(lang => ({
        language: lang,
        count: snippets.filter(s => s.language === lang).length
      })),
      bySource: sources.map(source => ({
        source,
        count: snippets.filter(s => s.source === source).length
      }))
    };
  }

  // Private helper methods
  private static detectLanguage(code: string): string {
    const lowerCode = code.toLowerCase();
    
    if (lowerCode.includes('def ') || lowerCode.includes('import ') || lowerCode.includes('print(')) return 'python';
    if (lowerCode.includes('function ') || lowerCode.includes('const ') || lowerCode.includes('let ')) return 'javascript';
    if (lowerCode.includes('react') || lowerCode.includes('usestate') || lowerCode.includes('useeffect')) return 'react';
    if (lowerCode.includes('public class') || lowerCode.includes('system.out')) return 'java';
    if (lowerCode.includes('#include') || lowerCode.includes('cout')) return 'cpp';
    if (lowerCode.includes('<html>') || lowerCode.includes('<div>')) return 'html';
    if (lowerCode.includes('display:') || lowerCode.includes('color:')) return 'css';
    if (lowerCode.includes('select ') || lowerCode.includes('from ') || lowerCode.includes('where ')) return 'sql';
    
    return 'general';
  }

  private static generateTitle(code: string, explanation: string, source: string): string {
    // Try to extract meaningful title from code
    const lines = code.split('\n').filter(line => line.trim());
    
    // Look for function definitions
    const functionMatch = lines.find(line => 
      line.includes('function ') || 
      line.includes('def ') || 
      line.includes('class ') ||
      line.includes('const ') ||
      line.includes('let ')
    );
    
    if (functionMatch) {
      // Extract function/class name
      const match = functionMatch.match(/(?:function|def|class|const|let)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (match) {
        return `${match[1]} - ${this.getSourceDisplayName(source)}`;
      }
    }
    
    // Try to extract from explanation
    if (explanation) {
      const words = explanation.split(' ').slice(0, 5).join(' ');
      if (words.length > 10) {
        return `${words}... - ${this.getSourceDisplayName(source)}`;
      }
    }
    
    // Fallback to generic title
    return `Code Snippet - ${this.getSourceDisplayName(source)}`;
  }

  private static generateTags(code: string, explanation: string, language: string, source: string): string[] {
    const tags: Set<string> = new Set();
    
    // Add language tag
    tags.add(language);
    
    // Add source tag
    tags.add(source.replace('_', ' '));
    
    // Extract tags from code patterns
    const lowerCode = code.toLowerCase();
    const lowerExplanation = explanation.toLowerCase();
    
    // Common programming concepts
    if (lowerCode.includes('function') || lowerExplanation.includes('function')) tags.add('function');
    if (lowerCode.includes('class') || lowerExplanation.includes('class')) tags.add('class');
    if (lowerCode.includes('loop') || lowerCode.includes('for') || lowerCode.includes('while')) tags.add('loop');
    if (lowerCode.includes('if') || lowerCode.includes('else')) tags.add('conditional');
    if (lowerCode.includes('array') || lowerCode.includes('list') || lowerCode.includes('[')) tags.add('array');
    if (lowerCode.includes('object') || lowerCode.includes('{')) tags.add('object');
    if (lowerCode.includes('async') || lowerCode.includes('await') || lowerCode.includes('promise')) tags.add('async');
    if (lowerCode.includes('import') || lowerCode.includes('require')) tags.add('import');
    if (lowerCode.includes('export')) tags.add('export');
    
    // Framework specific
    if (lowerCode.includes('react') || lowerCode.includes('jsx')) tags.add('react');
    if (lowerCode.includes('usestate') || lowerCode.includes('useeffect')) tags.add('hooks');
    if (lowerCode.includes('component')) tags.add('component');
    
    // Convert to array and limit to 5 tags
    return Array.from(tags).slice(0, 5);
  }

  private static getSourceDisplayName(source: string): string {
    const names = {
      'ai_tutor': 'AI Tutor',
      'code_explainer': 'Code Explainer',
      'debug_error': 'Debug Error',
      'manual': 'Manual'
    };
    return names[source as keyof typeof names] || source;
  }

  // Export/Import functionality
  static exportSnippets(): string {
    return JSON.stringify(this.getAllSnippets(), null, 2);
  }

  static importSnippets(jsonData: string): { success: boolean; count: number; error?: string } {
    try {
      const importedSnippets = JSON.parse(jsonData);
      
      if (!Array.isArray(importedSnippets)) {
        return { success: false, count: 0, error: 'Invalid format: expected array' };
      }
      
      const existingSnippets = this.getAllSnippets();
      const validSnippets = importedSnippets.filter(snippet => 
        snippet.id && snippet.title && snippet.code
      );
      
      // Merge with existing snippets (avoid duplicates by ID)
      const existingIds = new Set(existingSnippets.map(s => s.id));
      const newSnippets = validSnippets.filter(s => !existingIds.has(s.id));
      
      const mergedSnippets = [...existingSnippets, ...newSnippets];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mergedSnippets));
      
      return { success: true, count: newSnippets.length };
    } catch (error) {
      return { success: false, count: 0, error: 'Invalid JSON format' };
    }
  }
}