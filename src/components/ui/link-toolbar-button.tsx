'use client';

import * as React from 'react';

import {
  useLinkToolbarButton,
  useLinkToolbarButtonState,
} from '@platejs/link/react';

import { ToolbarButton } from './toolbar';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link01Icon } from '@hugeicons/core-free-icons';

export function LinkToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const state = useLinkToolbarButtonState();
  const { props: buttonProps } = useLinkToolbarButton(state);

  return (
    <ToolbarButton {...props} {...buttonProps} data-plate-focus tooltip="Link">
      <HugeiconsIcon icon={Link01Icon}  />
    </ToolbarButton>
  );
}
