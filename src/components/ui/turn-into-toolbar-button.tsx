'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import type { TElement } from 'platejs';

import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu';
import { Tick01Icon, ArrowRight01Icon, BinaryCodeIcon, ColumnInsertIcon, FileAttachmentIcon, Heading01Icon, Heading02Icon, Heading03Icon, Heading04Icon, Heading05Icon, Heading06Icon, LeftToRightListBulletIcon, LeftToRightListNumberIcon, ParagraphBulletsPoint01Icon, QuoteDownIcon, SquareIcon } from 'hugeicons-react';
import { KEYS } from 'platejs';
import { useEditorRef, useSelectionFragmentProp } from 'platejs/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getBlockType, setBlockType } from '@/components/transforms';

import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

export const turnIntoItems = [
  {
    icon: <ParagraphBulletsPoint01Icon />,
    keywords: ['paragraph'],
    label: 'Text',
    value: KEYS.p,
  },
  {
    icon: <Heading01Icon />,
    keywords: ['title', 'h1'],
    label: 'Heading 1',
    value: 'h1',
  },
  {
    icon: <Heading02Icon />,
    keywords: ['subtitle', 'h2'],
    label: 'Heading 2',
    value: 'h2',
  },
  {
    icon: <Heading03Icon />,
    keywords: ['subtitle', 'h3'],
    label: 'Heading 3',
    value: 'h3',
  },
  {
    icon: <Heading04Icon />,
    keywords: ['subtitle', 'h4'],
    label: 'Heading 4',
    value: 'h4',
  },
  {
    icon: <Heading05Icon />,
    keywords: ['subtitle', 'h5'],
    label: 'Heading 5',
    value: 'h5',
  },
  {
    icon: <Heading06Icon />,
    keywords: ['subtitle', 'h6'],
    label: 'Heading 6',
    value: 'h6',
  },
  {
    icon: <LeftToRightListBulletIcon />,
    keywords: ['unordered', 'ul', '-'],
    label: 'Bulleted list',
    value: KEYS.ul,
  },
  {
    icon: <LeftToRightListNumberIcon />,
    keywords: ['ordered', 'ol', '1'],
    label: 'Numbered list',
    value: KEYS.ol,
  },
  {
    icon: <SquareIcon />,
    keywords: ['checklist', 'task', 'checkbox', '[]'],
    label: 'To-do list',
    value: KEYS.listTodo,
  },
  {
    icon: <ArrowRight01Icon />,
    keywords: ['collapsible', 'expandable'],
    label: 'Toggle list',
    value: KEYS.toggle,
  },
  {
    icon: <FileAttachmentIcon />,
    keywords: ['```'],
    label: 'Code',
    value: KEYS.codeBlock,
  },
  {
    icon: <BinaryCodeIcon />,
    keywords: ['code-drawing', 'diagram', 'plantuml', 'graphviz', 'flowchart', 'mermaid'],
    label: 'Code Drawing',
    value: KEYS.codeDrawing,
  },
  {
    icon: <QuoteDownIcon />,
    keywords: ['citation', 'blockquote', '>'],
    label: 'Quote',
    value: KEYS.blockquote,
  },
  {
    icon: <ColumnInsertIcon />,
    label: '3 columns',
    value: 'action_three_columns',
  },
];

export function TurnIntoToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const value = useSelectionFragmentProp({
    defaultValue: KEYS.p,
    getProp: (node) => getBlockType(node as TElement),
  });
  const selectedItem = React.useMemo(
    () => turnIntoItems.find((item) => item.value === (value ?? KEYS.p)) ?? turnIntoItems[0],
    [value]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton className="min-w-[125px]" pressed={open} tooltip="Turn into" isDropdown>
          {selectedItem.label}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar min-w-0"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          editor.tf.focus();
        }}
        align="start"
      >
        <ToolbarMenuGroup
          value={value}
          onValueChange={(type) => {
            setBlockType(editor, type);
          }}
          label="Turn into"
        >
          {turnIntoItems.map(({ icon, label, value: itemValue }) => (
            <DropdownMenuRadioItem
              key={itemValue}
              className="min-w-[180px] pl-2 *:first:[span]:hidden"
              value={itemValue}
            >
              <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
                <DropdownMenuItemIndicator>
                  <Tick01Icon />
                </DropdownMenuItemIndicator>
              </span>
              {icon}
              {label}
            </DropdownMenuRadioItem>
          ))}
        </ToolbarMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
