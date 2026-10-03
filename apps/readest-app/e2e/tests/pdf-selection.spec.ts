import { expect, test } from '../fixtures/base';
import { SAMPLE_PDF } from '../fixtures/books';

test.describe('PDF selection', () => {
  test('keeps two Ctrl-drag passages independent before attaching', async ({ openBook }) => {
    const reader = await openBook(SAMPLE_PDF);

    const firstPassage = await reader.selectPdfTextWithMouse('Control', 0);
    const secondPassage = await reader.selectPdfTextWithMouse('Control', 1);

    expect(secondPassage).not.toBe(firstPassage);

    await expect(reader.annotationPopup).toBeVisible();
    await reader.selectionAction('attach').click();

    const drafts = reader.notebook.getByTestId('selection-drafts');
    const attachments = drafts.locator('[data-selection-kind="attachment"]');
    await expect(attachments).toHaveCount(2);
    await expect(attachments.nth(0)).toContainText(firstPassage);
    await expect(attachments.nth(1)).toContainText(secondPassage);
  });
});
