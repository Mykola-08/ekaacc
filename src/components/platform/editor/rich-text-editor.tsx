'use client';

import { useCallback, useMemo, useState } from 'react';
// @ts-ignore - slate modules not installed
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Save,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

interface RichTextEditorProps {
  initialValue?: Descendant[];
  onChange?: (value: Descendant[]) => void;
  onSave?: (value: Descendant[]) => void;
  placeholder?: string;
  className?: string;
  showAIAssist?: boolean;
}

export function RichTextEditor({
  initialValue,
  onChange,
  onSave,
  placeholder = 'Start writing...',
  className,
  showAIAssist = false,
}: RichTextEditorProps) {
  const [value, setValue] = useState<Descendant[]>(
    initialValue || [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      } as Descendant,
    ]
  );

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleSave = () => {
    onSave?.(value);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        {/* Toolbar */}
        <div className="bg-muted/30 border-b p-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* Text formatting */}
            <MarkButton format="bold" icon={Bold} />
            <MarkButton format="italic" icon={Italic} />
            <MarkButton format="underline" icon={Underline} />
            <MarkButton format="strikethrough" icon={Strikethrough} />
            <MarkButton format="code" icon={Code} />

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Headings */}
            <BlockButton format="heading-one" icon={Heading1} />
            <BlockButton format="heading-two" icon={Heading2} />
            <BlockButton format="heading-three" icon={Heading3} />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <BlockButton format="numbered-list" icon={ListOrdered} />
            <BlockButton format="bulleted-list" icon={List} />
            <BlockButton format="block-quote" icon={Quote} />

            <div className="flex-1" />

            {/* AI Assist */}
            {showAIAssist && (
              <>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Assist
                </Button>
                <Separator orientation="vertical" className="mx-1 h-6" />
              </>
            )}

            {/* Save button */}
            {onSave && (
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Editor */}
        <CardContent className="p-0">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            autoFocus
            className="prose prose-sm min-h-[300px] max-w-none p-4 focus:outline-none"
            onKeyDown={(event: React.KeyboardEvent) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </CardContent>
      </Slate>
    </Card>
  );
}

// Mark button component
const MarkButton = ({ format, icon: Icon }: { format: string; icon: any }) => {
  const editor = useSlateStatic();
  return (
    <Button
      variant={isMarkActive(editor, format) ? 'secondary' : 'ghost'}
      size="sm"
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className="h-8 w-8 p-0"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

// Block button component
const BlockButton = ({ format, icon: Icon }: { format: string; icon: any }) => {
  const editor = useSlateStatic();
  return (
    <Button
      variant={isBlockActive(editor, format) ? 'secondary' : 'ghost'}
      size="sm"
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      className="h-8 w-8 p-0"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

// Element renderer
const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: (element as any).align };
  switch ((element as any).type) {
    case 'block-quote':
      return (
        <blockquote
          style={style}
          {...attributes}
          className="border-muted-foreground border-l-4 pl-4 italic"
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes} className="list-disc pl-6">
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes} className="mt-6 mb-4 text-3xl font-semibold">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes} className="mt-5 mb-3 text-2xl font-semibold">
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 style={style} {...attributes} className="mt-4 mb-2 text-xl font-semibold">
          {children}
        </h3>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes} className="list-decimal pl-6">
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes} className="mb-2">
          {children}
        </p>
      );
  }
};

// Leaf renderer
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if ((leaf as any).bold) {
    children = <strong>{children}</strong>;
  }

  if ((leaf as any).code) {
    children = <code className="bg-muted rounded px-1 py-0.5 text-sm">{children}</code>;
  }

  if ((leaf as any).italic) {
    children = <em>{children}</em>;
  }

  if ((leaf as any).underline) {
    children = <u>{children}</u>;
  }

  if ((leaf as any).strikethrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

// Helper to use slate static
const useSlateStatic = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return editor;
};

// Toggle mark
const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// Check if mark is active
const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};

// Toggle block
const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n: any) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes((n as any).type),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  } as Partial<SlateElement>;

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block as any);
  }
};

// Check if block is active
const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: any) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === format,
    })
  );

  return !!match;
};

// Simple hotkey checker
const isHotkey = (hotkey: string, event: any) => {
  const keys = hotkey.split('+');
  const modKey = keys[0] === 'mod';
  const key = keys[keys.length - 1];

  if (modKey) {
    return (event.ctrlKey || event.metaKey) && event.key === key;
  }

  return event.key === key;
};
