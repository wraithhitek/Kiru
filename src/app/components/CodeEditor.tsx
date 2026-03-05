import { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Upload, X, FileCode } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: string;
  onLanguageChange?: (language: string) => void;
  allowFileUpload?: boolean;
}

const languages = [
  'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css'
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = 'Paste your code here...',
  language = 'python',
  onLanguageChange,
  allowFileUpload = true
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('File is too large. Maximum size is 1MB.');
        return;
      }

      setUploadedFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onChange(content);
        
        // Auto-detect language from file extension
        const ext = file.name.split('.').pop()?.toLowerCase();
        const langMap: { [key: string]: string } = {
          'py': 'python',
          'js': 'javascript',
          'ts': 'typescript',
          'tsx': 'typescript',
          'jsx': 'javascript',
          'java': 'java',
          'cpp': 'cpp',
          'c': 'c',
          'cs': 'csharp',
          'go': 'go',
          'rs': 'rust',
          'php': 'php',
          'rb': 'ruby',
          'swift': 'swift',
          'kt': 'kotlin',
          'sql': 'sql',
          'html': 'html',
          'css': 'css'
        };
        
        if (ext && langMap[ext]) {
          handleLanguageChange(langMap[ext]);
        }
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      
      reader.readAsText(file);
      
      // Reset input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadedFileName('');
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          
          {uploadedFileName && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
              <FileCode className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400">{uploadedFileName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {allowFileUpload && (
            <label className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm cursor-pointer hover:shadow-lg transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload File
              <input
                ref={fileInputRef}
                type="file"
                accept=".py,.js,.ts,.tsx,.jsx,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.sql,.html,.css,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-sm hover:bg-secondary/80 transition-colors"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>

          {value && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Clear code"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor/Preview */}
      {showPreview && value ? (
        <div className="rounded-xl overflow-hidden border border-border">
          <SyntaxHighlighter
            language={selectedLanguage}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: '#0A0A0A',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}
            showLineNumbers
          >
            {value}
          </SyntaxHighlighter>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-64 px-4 py-3 rounded-xl bg-input-background border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          style={{ fontFamily: 'monospace' }}
        />
      )}

      {/* Character count */}
      {value && (
        <div className="text-xs text-muted-foreground text-right">
          {value.length} characters, {value.split('\n').length} lines
        </div>
      )}
    </div>
  );
};
