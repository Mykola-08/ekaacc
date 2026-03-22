#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Complete mapping of broken icon names to correct hugeicons-react names
const iconMap = {
  // Alignment
  'AlignCenterIconIcon': 'TextAlignCenterIcon',
  'AlignJustifyIconIcon': 'TextAlignJustifyCenterIcon',
  'AlignLeftIconIcon': 'AlignLeftIcon',
  'AlignRightIconIcon': 'AlignRightIcon',

  // Text Formatting
  'BoldIconIcon': 'TextBoldIcon',
  'BoldIcon': 'TextBoldIcon',
  'ItalicIconIcon': 'TextItalicIcon',
  'ItalicIcon': 'TextItalicIcon',
  'StrikethroughIconIcon': 'TextStrikethroughIcon',
  'StrikethroughIcon': 'TextStrikethroughIcon',
  'UnderlineIconIcon': 'TextUnderlineIcon',
  'UnderlineIcon': 'TextUnderlineIcon',
  'SubscriptIconIcon': 'TextSubscriptIcon',
  'SuperscriptIconIcon': 'TextSuperscriptIcon',
  'BaselineIconIcon': 'TextFontIcon',
  'PilcrowIconIcon': 'ParagraphBulletsPoint01Icon',
  'WrapTextIcon': 'TextWrapIcon',

  // Headings
  'Heading1IconIcon': 'Heading01Icon',
  'Heading1Icon': 'Heading01Icon',
  'Heading2IconIcon': 'Heading02Icon',
  'Heading2Icon': 'Heading02Icon',
  'Heading3IconIcon': 'Heading03Icon',
  'Heading3Icon': 'Heading03Icon',
  'Heading4IconIcon': 'Heading04Icon',
  'Heading5IconIcon': 'Heading05Icon',
  'Heading6IconIcon': 'Heading06Icon',

  // Arrows/Navigation
  'ArrowDownIconIcon': 'ArrowDown01Icon',
  'ArrowDownIcon': 'ArrowDown01Icon',
  'ArrowUpIconIcon': 'ArrowUp01Icon',
  'ArrowUpIcon': 'ArrowUp01Icon',
  'ArrowLeftIconIcon': 'ArrowLeft01Icon',
  'ArrowRightIconIcon': 'ArrowRight01Icon',
  'ArrowDownToLineIconIcon': 'ArrowDown01Icon',
  'ArrowUpToLineIconIcon': 'ArrowUp01Icon',
  'ChevronDownIconIcon': 'ArrowDown01Icon',
  'ChevronLeftIconIcon': 'ArrowLeft01Icon',
  'ChevronRightIconIcon': 'ArrowRight01Icon',
  'ChevronsUpDownIconIcon': 'ArrowShrink01Icon',
  'ChevronsUpDownIcon': 'ArrowShrink01Icon',
  'CornerDownLeftIconIcon': 'ArrowDown01Icon',
  'CornerUpLeftIcon': 'ArrowUp01Icon',

  // Alerts/Status
  'AlertTriangleIconIcon': 'Alert02Icon',
  'CheckCircle2IconIcon': 'CheckmarkCircle02Icon',
  'CheckCircleIconIcon': 'CheckmarkCircle01Icon',
  'CheckIconIcon': 'Tick01Icon',
  'XCircleIconIcon': 'Cancel02Icon',
  'XCircleIcon': 'Cancel02Icon',
  'XIconIcon': 'Cancel01Icon',

  // Media
  'AlbumIcon': 'Album01Icon',
  'AudioLinesIcon': 'AiAudioIcon',
  'AudioLinesIconIcon': 'AiAudioIcon',
  'FilmIcon': 'Film01Icon',
  'FilmIconIcon': 'Film01Icon',
  'ImageIconIcon': 'Image01Icon',
  'MusicIconIcon': 'FileMusicIcon',
  'Music2IconIcon': 'FileMusicIcon',
  'VideoIconIcon': 'AiVideoIcon',
  'PauseIconIcon': 'PauseIcon',
  'PlayIconIcon': 'PlayIcon',
  'MicIconIcon': 'Mic01Icon',

  // Files/Docs
  'BookIconIcon': 'BookOpen01Icon',
  'BookOpenCheckIcon': 'BookOpen01Icon',
  'FileIconIcon': 'FileAttachmentIcon',
  'FileTextIconIcon': 'FileAttachmentIcon',
  'FileCodeIconIcon': 'FileAttachmentIcon',
  'FileUpIcon': 'FileUploadIcon',
  'FileUpIconIcon': 'FileUploadIcon',
  'FolderIconIcon': 'FolderLibraryIcon',
  'FolderOpenIconIcon': 'FolderOpenIcon',
  'DownloadIconIcon': 'Download01Icon',

  // List/Table
  'ListIconIcon': 'LeftToRightListBulletIcon',
  'ListEndIcon': 'LeftToRightListBulletIcon',
  'ListMinusIcon': 'LeftToRightListBulletIcon',
  'ListPlusIcon': 'LeftToRightListBulletIcon',
  'ListOrderedIcon': 'LeftToRightListNumberIcon',
  'ListOrderedIconIcon': 'LeftToRightListNumberIcon',
  'ListChecksIcon': 'CheckListIcon',
  'ListTodoIconIcon': 'CheckListIcon',
  'ListCollapseIconIcon': 'LeftToRightListBulletIcon',
  'TableIconIcon': 'TableIcon',
  'TableOfContentsIconIcon': 'MenuSquareIcon',
  'IndentIconIcon': 'TextIndent01Icon',
  'OutdentIconIcon': 'TextIndentLessIcon',
  'Columns3IconIcon': 'ColumnInsertIcon',
  'SquareSplitHorizontalIconIcon': 'ColumnInsertIcon',

  // Editing/Writing
  'WandIcon': 'MagicWand01Icon',
  'Wand2IconIcon': 'MagicWand01Icon',
  'WandSparklesIconIcon': 'MagicWand02Icon',
  'FeatherIconIcon': 'FeatherIcon',
  'PenIconIcon': 'PencilEdit01Icon',
  'PenLineIcon': 'PencilEdit01Icon',
  'PenToolIconIcon': 'PenTool01Icon',
  'PencilIconIcon': 'PencilIcon',
  'PencilLineIconIcon': 'PencilEdit01Icon',
  'EraserIconIcon': 'EraserIcon',
  'HighlighterIconIcon': 'HighlighterIcon',
  'PaintBucketIconIcon': 'PaintBucketIcon',

  // Links/Navigation
  'LinkIconIcon': 'Link01Icon',
  'Link2IconIcon': 'Link01Icon',
  'ExternalLinkIconIcon': 'ExternalDriveIcon',
  'UnlinkIcon': 'Unlink01Icon',

  // Code
  'Code2Icon': 'BinaryCodeIcon',
  'Code2IconIcon': 'BinaryCodeIcon',
  'BracesIconIcon': 'BinaryCodeIcon',
  'TerminalIconIcon': 'ComputerTerminal01Icon',
  'LeafIconIcon': 'Leaf01Icon',
  'RadicalIconIcon': 'SquareIcon',
  'CodeIcon': 'BinaryCodeIcon',

  // Misc UI
  'AppleIconIcon': 'AppleIcon',
  'BadgeHelpIcon': 'HelpCircleIcon',
  'BookmarkIconIcon': 'BookmarkAdd01Icon',
  'BotIconIcon': 'BotIcon',
  'BrainIconIcon': 'BrainIcon',
  'CalendarIconIcon': 'Calendar01Icon',
  'CircleIconIcon': 'CircleIcon',
  'CircleDotIconIcon': 'AddCircleHalfDotIcon',
  'CircleSmallIconIcon': 'CircleIcon',
  'ClockIconIcon': 'Clock01Icon',
  'CombineIcon': 'LayerIcon',
  'CombineIconIcon': 'LayerIcon',
  'CompassIconIcon': 'CompassIcon',
  'CopyIconIcon': 'Copy01Icon',
  'DotIconIcon': 'CircleIcon',
  'EyeIconIcon': 'EyeIcon',
  'EyeOffIconIcon': 'EyeIcon',
  'FlagIconIcon': 'Flag01Icon',
  'GitCommitIconIcon': 'GitCommitIcon',
  'GlobeIconIcon': 'GlobeIcon',
  'GlobalIcon': 'GlobalIcon', // This one exists
  'Grid2X2IconIcon': 'Grid02Icon',
  'Grid3x3IconIcon': 'Grid02Icon',
  'GripHorizontalIcon': 'HandGripIcon',
  'GripVerticalIcon': 'HandGripIcon',
  'KeyboardIconIcon': 'KeyboardIcon',
  'LightbulbIconIcon': 'BulbIcon',
  'Loader2IconIcon': 'Loading03Icon',
  'MarsIconIcon': 'Male02Icon',
  'MarsStrokeIconIcon': 'Male02Icon',
  'MessageCircleIconIcon': 'Message01Icon',
  'MessageSquareTextIconIcon': 'Message01Icon',
  'MessagesSquareIconIcon': 'Message01Icon',
  'MinusIconIcon': 'MinusSignIcon',
  'MoreHorizontalIconIcon': 'MoreHorizontalIcon',
  'NonBinaryIconIcon': 'Female02Icon',
  'PackageIconIcon': 'PackageIcon',
  'PaperclipIconIcon': 'Attachment01Icon',
  'PlusIconIcon': 'Add01Icon',
  'QuoteIcon': 'QuoteDownIcon',
  'QuoteIconIcon': 'QuoteDownIcon',
  'Redo2IconIcon': 'Redo02Icon',
  'SearchIconIcon': 'Search01Icon',
  'SmileIconIcon': 'SmileIcon',
  'SparklesIconIcon': 'SparklesIcon',
  'SquareIconIcon': 'SquareIcon',
  'StarIconIcon': 'StarIcon',
  'TransgenderIconIcon': 'Female02Icon',
  'Trash2IconIcon': 'Delete01Icon',
  'TrashIconIcon': 'Delete01Icon',
  'Undo2IconIcon': 'Undo02Icon',
  'UngroupIcon': 'UngroupItemsIcon',
  'VenusAndMarsIconIcon': 'Female02Icon',
  'VenusIconIcon': 'Female02Icon',
  'WrenchIconIcon': 'Wrench01Icon',
};

function findFiles(dir, exts) {
  const results = [];
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory() && !['node_modules', '.next', '.git'].includes(e.name)) {
        walk(full);
      } else if (e.isFile() && exts.some(x => e.name.endsWith(x))) {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

const files = findFiles('/home/user/ekaacc/src', ['.tsx', '.ts']);
let totalFixed = 0;
let filesFixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("from 'hugeicons-react'")) continue;

  let changed = false;
  let newContent = content;

  // For each mapping, do a global replacement of the old name with the new name
  // We need to be careful to only replace identifier usages, not partial matches
  // Sort by length descending to avoid partial replacements
  const sortedEntries = Object.entries(iconMap).sort((a, b) => b[0].length - a[0].length);

  for (const [oldName, newName] of sortedEntries) {
    if (oldName === newName) continue;
    // Use word boundary regex to avoid partial matches
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    if (regex.test(newContent)) {
      newContent = newContent.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
      changed = true;
      totalFixed++;
    }
  }

  if (changed) {
    fs.writeFileSync(file, newContent);
    filesFixed++;
    console.log('Fixed: ' + path.relative('/home/user/ekaacc', file));
  }
}

console.log(`\nTotal: fixed ${totalFixed} replacements in ${filesFixed} files`);
