import { describe, expect, it } from 'vitest';
import { isSafeHttpUrl, parseSafeMarkdown } from '@/features/ai/utils/sanitizeMarkdown';

describe('sanitizeMarkdown', () => {
  it('allows only http and https URLs', () => {
    expect(isSafeHttpUrl('https://nexoratechnologieszakki.vercel.app/')).toBe(true);
    expect(isSafeHttpUrl('http://localhost:3000')).toBe(true);
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('parses headings, code blocks, lists, and tables', () => {
    const md = [
      '# Leave Summary',
      '',
      '- Annual: 15 days',
      '- Sick: 10 days',
      '',
      '| Type | Remaining |',
      '| --- | --- |',
      '| Annual | 15 |',
      '',
      '```ts',
      'const ok = true;',
      '```',
    ].join('\n');

    const blocks = parseSafeMarkdown(md);
    expect(blocks.map((b) => b.type)).toEqual(['heading', 'list', 'table', 'code']);
  });
});
