import { describe, expect, test } from 'vitest';
import { buildSelectionDraftMessage } from '@/components/assistant/selectionDraft';

describe('selection draft message', () => {
  test('adds independent selection contexts only when explicitly sent', () => {
    const message = buildSelectionDraftMessage('Compare these passages', [
      {
        id: 'selection-1',
        bookKey: 'book-1',
        text: 'First selection',
        page: 2,
        index: 1,
      },
      {
        id: 'selection-2',
        bookKey: 'book-1',
        text: 'Second selection',
        page: 4,
        index: 3,
      },
    ]);

    expect(message).toContain('Compare these passages');
    expect(message.match(/<selection-context>/g)).toHaveLength(2);
    expect(message).toContain('First selection');
    expect(message).toContain('Second selection');
  });
});
