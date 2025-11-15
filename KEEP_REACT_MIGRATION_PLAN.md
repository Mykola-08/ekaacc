# Keep React Migration Plan

## Overview
This document tracks the migration of all components from Radix UI to Keep React.

## Migration Status: IN PROGRESS

### Phase 1: Core UI Components (COMPLETED)
- ✅ Installed Keep React and Phosphor Icons
- ✅ Updated Tailwind config with Keep React preset
- ✅ Created component re-export structure
- ✅ Created documentation and examples

### Phase 2: Component Mapping

#### Direct 1:1 Replacements (No Changes Needed)
These components have the same API:
- Button → Button ✅
- Input → Input ✅
- Label → Label ✅
- Checkbox → Checkbox ✅
- Switch → Switch ✅
- Table → Table ✅
- Card → Card ✅
- Badge → Badge ✅
- Avatar → Avatar ✅
- Textarea → Textarea ✅
- Skeleton → Skeleton ✅
- Divider/Separator → Divider ✅

#### Components Requiring Minor Changes
- Dialog → Modal (different component names)
- Tabs → Tabs (TabsTrigger → TabsItem)
- Select → Select (no SelectTrigger wrapper needed)
- Alert → Notification (different structure)
- Progress → Progress (slightly different API)
- Dropdown → Dropdown (different structure)
- Popover → Popover (minor API changes)
- Tooltip → Tooltip (minor API changes)

#### Components Not in Keep React
Need custom solutions or workarounds:
- ScrollArea → Use native overflow-auto
- Separator → Use Divider
- Sheet → Use Drawer
- Calendar → Use DatePicker or keep Radix version

### Phase 3: File Migration Progress

#### High Priority Files (User-Facing)
- [ ] src/app/(app)/layout.tsx - App shell
- [ ] src/app/(app)/page.tsx - Dashboard
- [ ] src/app/login/page.tsx - Authentication
- [ ] src/components/DashboardView.tsx - Main dashboard
- [ ] src/components/eka/app-header.tsx - Header
- [ ] src/components/eka/app-sidebar.tsx - Sidebar

#### Form Components
- [ ] src/components/eka/forms/welcome-personalization-form.tsx
- [ ] src/components/eka/forms/session-assessment-form.tsx
- [ ] src/components/eka/new-booking-form.tsx
- [ ] src/components/PersonalBlock.tsx
- [ ] src/components/OnboardingForm.tsx

#### Feature Components
- [ ] src/components/eka/ai-assistant.tsx
- [ ] src/components/eka/notification-center.tsx
- [ ] src/components/eka/subscription-promotion.tsx
- [ ] src/components/eka/billing-packages.tsx
- [ ] src/components/eka/booking-calendar.tsx

#### Admin Components
- [ ] src/components/eka/admin-panel.tsx
- [ ] src/components/eka/person-profile.tsx

### Phase 4: App Pages
- [ ] src/app/(app)/sessions/page.tsx
- [ ] src/app/(app)/wallet/page.tsx
- [ ] src/app/(app)/settings/page.tsx
- [ ] src/app/admin/*
- [ ] src/app/therapist/*

### Migration Commands

```bash
# Find all files using Radix UI components
grep -r "from '@/components/ui/" src/ --include="*.tsx" --include="*.ts"

# Count component usage
grep -r "from '@/components/ui/" src/ --include="*.tsx" | wc -l
```

### Import Replacement Patterns

```typescript
// OLD (Radix UI)
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsTrigger } from '@/components/ui/tabs';

// NEW (Keep React)
import { Button } from '@/components/keep';
import { Modal, ModalContent } from '@/components/keep';
import { Tabs, TabsItem } from '@/components/keep';
```

### Testing Checklist
After migration of each component:
- [ ] Visual check - styling correct
- [ ] Functionality - all interactions work
- [ ] Dark mode - theme switching works
- [ ] Responsive - mobile and desktop
- [ ] Accessibility - keyboard navigation
- [ ] TypeScript - no type errors

### Rollback Strategy
If issues occur:
1. Git branch for migration: `git checkout -b keep-react-migration`
2. Commit frequently per file/component
3. Can revert individual files if needed
4. Keep old components in `src/components/ui/` until fully migrated

### Notes
- Keep React uses Phosphor Icons instead of Lucide
- Some Radix UI components may need to stay (Calendar, ScrollArea)
- Can run both libraries in parallel during migration
- Update documentation as components are migrated

### Completion Criteria
- [ ] All components using Keep React
- [ ] No imports from `@/components/ui/`
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Visual regression testing complete
