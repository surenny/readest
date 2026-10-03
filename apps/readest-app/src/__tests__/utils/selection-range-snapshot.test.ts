import { describe, expect, it } from 'vitest';

describe('selection range snapshots', () => {
  it('keeps the selected text when the native selection later changes', () => {
    const doc = document.implementation.createHTMLDocument();
    const paragraph = doc.createElement('p');
    paragraph.textContent = 'prefix exact selected suffix';
    doc.body.append(paragraph);
    const text = paragraph.firstChild!;
    const nativeRange = doc.createRange();
    nativeRange.setStart(text, 7);
    nativeRange.setEnd(text, 21);
    const snapshot = nativeRange.cloneRange();

    nativeRange.setStart(text, 0);
    nativeRange.setEnd(text, text.textContent!.length);

    expect(snapshot.toString()).toBe('exact selected');
    expect(nativeRange.toString()).toBe('prefix exact selected suffix');
  });
});
