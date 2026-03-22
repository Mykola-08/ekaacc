'use client';

import * as React from 'react';

import { useIndentButton, useOutdentButton } from '@platejs/indent/react';
import { TextIndent01Icon, TextIndentLessIcon } from 'hugeicons-react';

import { ToolbarButton } from './toolbar';

export function IndentToolbarButton(props: React.ComponentProps<typeof ToolbarButton>) {
  const { props: buttonProps } = useIndentButton();

  return (
    <ToolbarButton {...props} {...buttonProps} tooltip="Indent">
      <TextIndent01Icon />
    </ToolbarButton>
  );
}

export function OutdentToolbarButton(props: React.ComponentProps<typeof ToolbarButton>) {
  const { props: buttonProps } = useOutdentButton();

  return (
    <ToolbarButton {...props} {...buttonProps} tooltip="Outdent">
      <TextIndentLessIcon />
    </ToolbarButton>
  );
}
