import * as React from 'react';

import type { SlateElementProps } from 'platejs/static';

import { SlateElement } from 'platejs/static';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

export function ToggleElementStatic(props: SlateElementProps) {
  return (
    <SlateElement {...props} className="pl-6">
      <div
        className="-left-0.5 absolute top-0 size-6 cursor-pointer select-none items-center justify-center rounded-[calc(var(--radius)*0.6)] p-px text-muted-foreground transition-colors hover:bg-accent [&_svg]:size-4"
        contentEditable={false}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-0 transition-transform duration-75"  />
      </div>
      {props.children}
    </SlateElement>
  );
}
