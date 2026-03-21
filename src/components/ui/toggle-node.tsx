'use client';

import * as React from 'react';

import type { PlateElementProps } from 'platejs/react';

import { useToggleButton, useToggleButtonState } from '@platejs/toggle/react';
import { PlateElement } from 'platejs/react';

import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

export function ToggleElement(props: PlateElementProps) {
  const element = props.element;
  const state = useToggleButtonState(element.id as string);
  const { buttonProps, open } = useToggleButton(state);

  return (
    <PlateElement {...props} className="pl-6">
      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground hover:bg-accent absolute top-0 -left-0.5 size-6 cursor-pointer items-center justify-center rounded-[calc(var(--radius)*0.6)] p-px transition-colors select-none [&_svg]:size-4"
        contentEditable={false}
        {...buttonProps}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className={
            open
              ? 'rotate-90 transition-transform duration-75'
              : 'rotate-0 transition-transform duration-75'
          }
        />
      </Button>
      {props.children}
    </PlateElement>
  );
}
