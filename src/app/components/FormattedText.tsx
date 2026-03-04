import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content, className = '' }) => {
  const formatText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Split by code blocks first (```...```)
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(...formatInlineText(text.slice(lastIndex, match.index), key));
        key += 100;
      }

      // Add code block
      const language = match[1] || '';
      const code = match[2];
      parts.push(
        <div key={key++} className="my-4 rounded-lg bg-black/40 border border-border overflow-hidden">
          {language && (
            <div className="px-4 py-2 bg-black/20 border-b border-border text-xs text-muted-foreground">
              {language}
            </div>
          )}
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm font-mono text-blue-300">{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(...formatInlineText(text.slice(lastIndex), key));
    }

    return parts;
  };

  const formatInlineText = (text: string, startKey: number) => {
    const parts: React.ReactNode[] = [];
    const lines = text.split('\n');
    let key = startKey;

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        parts.push(<br key={`br-${key++}`} />);
      }

      // Check for numbered lists (1. 2. 3.)
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (numberedListMatch) {
        parts.push(
          <div key={key++} className="flex gap-3 my-2">
            <span className="font-bold text-blue-400 min-w-[24px]">{numberedListMatch[1]}.</span>
            <span>{formatInlineMarkdown(numberedListMatch[2], key)}</span>
          </div>
        );
        key += 50;
        return;
      }

      // Check for bullet points (- or *)
      const bulletMatch = line.match(/^[\-\*]\s+(.+)/);
      if (bulletMatch) {
        parts.push(
          <div key={key++} className="flex gap-3 my-2">
            <span className="text-blue-400 min-w-[16px]">•</span>
            <span>{formatInlineMarkdown(bulletMatch[1], key)}</span>
          </div>
        );
        key += 50;
        return;
      }

      // Check for headers (##)
      const headerMatch = line.match(/^(#{1,3})\s+(.+)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const HeaderTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;
        parts.push(
          <HeaderTag 
            key={key++} 
            className={`font-bold mt-4 mb-2 ${level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : 'text-base'}`}
          >
            {formatInlineMarkdown(headerMatch[2], key)}
          </HeaderTag>
        );
        key += 50;
        return;
      }

      // Regular line with inline formatting
      if (line.trim()) {
        parts.push(...formatInlineMarkdown(line, key));
        key += 50;
      }
    });

    return parts;
  };

  const formatInlineMarkdown = (text: string, startKey: number): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let key = startKey;

    // Process inline code first (`code`)
    const inlineCodeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...processBoldItalic(text.slice(lastIndex, match.index), key));
        key += 10;
      }
      parts.push(
        <code 
          key={key++} 
          className="px-2 py-0.5 rounded bg-black/40 text-blue-300 font-mono text-sm border border-border"
        >
          {match[1]}
        </code>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(...processBoldItalic(text.slice(lastIndex), key));
    }

    return parts;
  };

  const processBoldItalic = (text: string, startKey: number): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let key = startKey;

    // Process **bold** and *italic*
    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // Bold
        parts.push(<strong key={key++} className="font-bold text-foreground">{match[2]}</strong>);
      } else if (match[3]) {
        // Italic
        parts.push(<em key={key++} className="italic">{match[3]}</em>);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className={`formatted-text ${className}`}>
      {formatText(content)}
    </div>
  );
};
