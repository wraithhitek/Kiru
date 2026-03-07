import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FeatureLayout } from '../components/FeatureLayout';
import { 
  Code2, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Tag, 
  Calendar,
  Trash2,
  Plus,
  BookOpen,
  Star,
  Download
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { CodeSnippetManager, CodeSnippet } from '../utils/codeSnippetManager';

export default function CodeSnippets() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSnippets();
  }, []);

  useEffect(() => {
    filterSnippets();
  }, [snippets, searchQuery, selectedLanguage, selectedSource]);

  const loadSnippets = () => {
    const allSnippets = CodeSnippetManager.getAllSnippets();
    setSnippets(allSnippets);
  };

  const filterSnippets = () => {
    let filtered = snippets;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(snippet => 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(snippet => snippet.language === selectedLanguage);
    }

    // Source filter
    if (selectedSource !== 'all') {
      filtered = filtered.filter(snippet => snippet.source === selectedSource);
    }

    setFilteredSnippets(filtered);
  };

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      CodeSnippetManager.deleteSnippet(id);
      loadSnippets();
    }
  };

  const handleToggleFavorite = (id: string) => {
    CodeSnippetManager.toggleFavorite(id);
    loadSnippets();
  };

  const exportSnippets = () => {
    const dataStr = JSON.stringify(snippets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kiru-code-snippets.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLanguages = () => {
    const languages = [...new Set(snippets.map(s => s.language))];
    return languages.sort();
  };

  const getSources = () => {
    const sources = [...new Set(snippets.map(s => s.source))];
    return sources.sort();
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      python: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      react: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      html: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      css: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      java: 'bg-red-500/20 text-red-400 border-red-500/30',
      cpp: 'bg-green-500/20 text-green-400 border-green-500/30',
      general: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[language] || colors.general;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ai_tutor': return <BookOpen className="w-4 h-4" />;
      case 'code_explainer': return <Code2 className="w-4 h-4" />;
      case 'debug_error': return <Search className="w-4 h-4" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  return (
    <FeatureLayout
      title="Code Snippets"
      description="Your personal code knowledge base"
      icon={<Code2 className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{snippets.length}</p>
                <p className="text-sm text-muted-foreground">Total Snippets</p>
              </div>
              <Code2 className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{getLanguages().length}</p>
                <p className="text-sm text-muted-foreground">Languages</p>
              </div>
              <Tag className="w-8 h-8 text-emerald-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{snippets.filter(s => s.isFavorite).length}</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{snippets.filter(s => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(s.createdAt) > weekAgo;
                }).length}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search snippets, tags, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                showFilters 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-card border-border hover:border-blue-500/50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={exportSnippets}
              className="px-4 py-2 rounded-lg bg-secondary border border-border hover:border-blue-500/50 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border pt-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="all">All Languages</option>
                      {getLanguages().map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Source</label>
                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="all">All Sources</option>
                      <option value="ai_tutor">AI Tutor</option>
                      <option value="code_explainer">Code Explainer</option>
                      <option value="debug_error">Debug Error</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Snippets Grid */}
        {filteredSnippets.length === 0 ? (
          <Card className="p-12 text-center">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground mb-4">
              {snippets.length === 0 
                ? "Start using AI Tutor, Code Explainer, or Debug Error to automatically save code snippets!"
                : "Try adjusting your search or filters."
              }
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSnippets.map((snippet, index) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:border-blue-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(snippet.source)}
                      <h3 className="font-semibold text-lg">{snippet.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFavorite(snippet.id)}
                        className={`p-1 rounded transition-colors ${
                          snippet.isFavorite 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-muted-foreground hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${snippet.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(snippet.id)}
                        className="p-1 rounded text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getLanguageColor(snippet.language)}`}>
                      {snippet.language}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 mb-3 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{snippet.code}</pre>
                  </div>

                  {snippet.explanation && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {snippet.explanation}
                    </p>
                  )}

                  {snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {snippet.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleCopy(snippet.code, snippet.id)}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedId === snippet.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </FeatureLayout>
  );
}