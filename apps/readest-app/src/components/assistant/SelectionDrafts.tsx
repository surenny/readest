import { XIcon } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';
import { useNotebookStore } from '@/store/notebookStore';

export function SelectionDrafts() {
  const _ = useTranslation();
  const { aiQuestionAnchors, aiDraftAttachments, removeAIQuestionAnchor, removeAIDraftAttachment } =
    useNotebookStore();
  const contexts = [
    ...aiQuestionAnchors,
    ...aiDraftAttachments.filter(
      (item) => !aiQuestionAnchors.some((anchor) => anchor.id === item.id),
    ),
  ];

  if (contexts.length === 0) return null;

  return (
    <div
      className='flex max-h-40 flex-col gap-1.5 overflow-y-auto px-3 pt-3'
      data-testid='selection-drafts'
    >
      {contexts.map((context) => {
        const isQuestionTarget = aiQuestionAnchors.some((anchor) => anchor.id === context.id);
        return (
          <div
            key={context.id}
            data-selection-kind={isQuestionTarget ? 'question' : 'attachment'}
            className='eink-bordered border-base-content/10 bg-base-100 flex min-h-9 max-w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs'
            title={context.text}
          >
            <span className='text-base-content/60 shrink-0 font-medium'>
              {isQuestionTarget ? _('Question target') : _('Attachment')}
            </span>
            <span className='min-w-0 flex-1 truncate'>{context.text}</span>
            <button
              type='button'
              className='hover:bg-base-200 rounded p-0.5'
              aria-label={isQuestionTarget ? _('Remove question target') : _('Remove attachment')}
              onClick={() =>
                isQuestionTarget
                  ? removeAIQuestionAnchor(context.id)
                  : removeAIDraftAttachment(context.id)
              }
            >
              <XIcon className='size-3' />
            </button>
          </div>
        );
      })}
    </div>
  );
}
