'use client';

import * as React from 'react';

import { TextBoldIcon, BinaryCodeIcon, TextItalicIcon, TextStrikethroughIcon, TextUnderlineIcon, MagicWand02Icon } from 'hugeicons-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { AIToolbarButton } from './ai-toolbar-button';
import { CommentToolbarButton } from './comment-toolbar-button';
import { InlineEquationToolbarButton } from './equation-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MoreToolbarButton } from './more-toolbar-button';
import { SuggestionToolbarButton } from './suggestion-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          <ToolbarGroup>
            <AIToolbarButton tooltip="AI commands">
              <MagicWand02Icon />
              Ask AI
            </AIToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <TurnIntoToolbarButton />

            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <TextBoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <TextItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (⌘+U)">
              <TextUnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.strikethrough} tooltip="Strikethrough (⌘+⇧+M)">
              <TextStrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
              <BinaryCodeIcon />
            </MarkToolbarButton>

            <InlineEquationToolbarButton />

            <LinkToolbarButton />
          </ToolbarGroup>
        </>
      )}

      <ToolbarGroup>
        <CommentToolbarButton />
        <SuggestionToolbarButton />

        {!readOnly && <MoreToolbarButton />}
      </ToolbarGroup>
    </>
  );
}
