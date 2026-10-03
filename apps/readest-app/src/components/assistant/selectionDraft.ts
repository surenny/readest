import type { SelectionContext } from '@/store/notebookStore';

export const formatSelectionContext = (context: SelectionContext) =>
  [
    '<selection-context>',
    `page: ${context.page}`,
    `section: ${context.index}`,
    context.cfi ? `cfi: ${context.cfi}` : null,
    context.href ? `href: ${context.href}` : null,
    context.text,
    '</selection-context>',
  ]
    .filter(Boolean)
    .join('\n');

export const buildSelectionDraftMessage = (question: string, contexts: SelectionContext[]) =>
  `${question.trim()}\n\n${contexts.map(formatSelectionContext).join('\n\n')}`;
