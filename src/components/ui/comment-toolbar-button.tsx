'use client';

import * as React from 'react';

import { MessageSquareTextIconIcon } from 'hugeicons-react';
import { useEditorRef } from 'platejs/react';

import { commentPlugin } from '@/components/comment-kit';

import { ToolbarButton } from './toolbar';

export function CommentToolbarButton() {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      onClick={() => {
        editor.getTransforms(commentPlugin).comment.setDraft();
      }}
      data-plate-prevent-overlay
      tooltip="Comment"
    >
      <MessageSquareTextIconIcon />
    </ToolbarButton>
  );
}
