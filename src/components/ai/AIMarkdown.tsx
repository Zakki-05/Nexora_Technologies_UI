'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { isSafeHttpUrl, parseSafeMarkdown } from '@/features/ai/utils/sanitizeMarkdown';

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-[12px] font-mono text-blue-700 dark:text-cyan-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1] ?? '';
      const href = linkMatch[2] ?? '';
      if (href && isSafeHttpUrl(href)) {
        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-cyan-400 underline hover:opacity-80"
          >
            {label}
          </a>
        );
      }
      return <span key={idx}>{label}</span>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
        <span className="uppercase tracking-wider font-mono">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function AIMarkdown({ content }: { content: string }) {
  const blocks = parseSafeMarkdown(content);

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-800 dark:text-slate-100 break-words">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const cls =
            block.level === 1
              ? 'text-base font-bold mt-2'
              : block.level === 2
              ? 'text-sm font-bold mt-2'
              : 'text-sm font-semibold mt-1';
          return (
            <p key={idx} className={cls}>
              {renderInline(block.text)}
            </p>
          );
        }
        if (block.type === 'code') {
          return <CodeBlock key={idx} language={block.language} code={block.code} />;
        }
        if (block.type === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul';
          return (
            <Tag
              key={idx}
              className={`pl-5 space-y-1 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
            >
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx}>{renderInline(item)}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === 'table') {
          return (
            <div key={idx} className="overflow-x-auto my-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
                  <tr>
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-3 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={idx}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
