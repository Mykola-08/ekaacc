'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { Calendar01Icon, ArrowRight01Icon, BinaryCodeIcon, ColumnInsertIcon, FileAttachmentIcon, Film01Icon, Heading01Icon, Heading02Icon, Heading03Icon, Image01Icon, Link01Icon, LeftToRightListBulletIcon, LeftToRightListNumberIcon, MinusSignIcon, PenTool01Icon, ParagraphBulletsPoint01Icon, Add01Icon, QuoteDownIcon, SquareIcon, TableIcon, MenuSquareIcon } from 'hugeicons-react';
import { KEYS } from 'platejs';
import { type PlateEditor, useEditorRef } from 'platejs/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { insertBlock, insertInlineElement } from '@/components/transforms';

import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

type Group = {
  group: string;
  items: Item[];
};

type Item = {
  icon: React.ReactNode;
  value: string;
  onSelect: (editor: PlateEditor, value: string) => void;
  focusEditor?: boolean;
  label?: string;
};

const groups: Group[] = [
  {
    group: 'Basic blocks',
    items: [
      {
        icon: <ParagraphBulletsPoint01Icon />,
        label: 'Paragraph',
        value: KEYS.p,
      },
      {
        icon: <Heading01Icon />,
        label: 'Heading 1',
        value: 'h1',
      },
      {
        icon: <Heading02Icon />,
        label: 'Heading 2',
        value: 'h2',
      },
      {
        icon: <Heading03Icon />,
        label: 'Heading 3',
        value: 'h3',
      },
      {
        icon: <TableIcon />,
        label: 'Table',
        value: KEYS.table,
      },
      {
        icon: <FileAttachmentIcon />,
        label: 'Code',
        value: KEYS.codeBlock,
      },
      {
        icon: <QuoteDownIcon />,
        label: 'Quote',
        value: KEYS.blockquote,
      },
      {
        icon: <MinusSignIcon />,
        label: 'Divider',
        value: KEYS.hr,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: 'Lists',
    items: [
      {
        icon: <LeftToRightListBulletIcon />,
        label: 'Bulleted list',
        value: KEYS.ul,
      },
      {
        icon: <LeftToRightListNumberIcon />,
        label: 'Numbered list',
        value: KEYS.ol,
      },
      {
        icon: <SquareIcon />,
        label: 'To-do list',
        value: KEYS.listTodo,
      },
      {
        icon: <ArrowRight01Icon />,
        label: 'Toggle list',
        value: KEYS.toggle,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: 'Media',
    items: [
      {
        icon: <Image01Icon />,
        label: 'Image',
        value: KEYS.img,
      },
      {
        icon: <Film01Icon />,
        label: 'Embed',
        value: KEYS.mediaEmbed,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: 'Advanced blocks',
    items: [
      {
        icon: <MenuSquareIcon />,
        label: 'Table of contents',
        value: KEYS.toc,
      },
      {
        icon: <ColumnInsertIcon />,
        label: '3 columns',
        value: 'action_three_columns',
      },
      {
        focusEditor: false,
        icon: <SquareIcon />,
        label: 'Equation',
        value: KEYS.equation,
      },
      {
        icon: <PenTool01Icon />,
        label: 'Excalidraw',
        value: KEYS.excalidraw,
      },
      {
        icon: <BinaryCodeIcon />,
        label: 'Code Drawing',
        value: KEYS.codeDrawing,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: 'Inline',
    items: [
      {
        icon: <Link01Icon />,
        label: 'Link',
        value: KEYS.link,
      },
      {
        focusEditor: true,
        icon: <Calendar01Icon />,
        label: 'Date',
        value: KEYS.date,
      },
      {
        focusEditor: false,
        icon: <SquareIcon />,
        label: 'Inline Equation',
        value: KEYS.inlineEquation,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      },
    })),
  },
];

export function InsertToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Insert" isDropdown>
          <Add01Icon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
        align="start"
      >
        {groups.map(({ group, items: nestedItems }) => (
          <ToolbarMenuGroup key={group} label={group}>
            {nestedItems.map(({ icon, label, value, onSelect }) => (
              <DropdownMenuItem
                key={value}
                className="min-w-[180px]"
                onSelect={() => {
                  onSelect(editor, value);
                  editor.tf.focus();
                }}
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </ToolbarMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
