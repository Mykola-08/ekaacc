# Design System Specification: "Porcelain & Flow"

## 1. Core Philosophy

* **Tactility:** Every interactive element must provide feedback. The code uses `active:scale-95`this "squishy" feel is essential.
* **Soft Containers:** Avoid hard borders where possible. Use slight contrast in background colors (`#F9F9F8` on `#FEFFFE`) to define hierarchy.
* **Hyper-Rounded:** We are avoiding sharp edges entirely. This is an "Apple-ish" super-ellipse (squircle) aesthetic.
* **Action Color:** Action color is a vibrant Blue (`#4DAFFF`), reminiscent of iOS native actions.

## 2. Design Tokens (Tailwind Config)

These tokens rely on `globals.css` variables but follow this semantic mapping:

### Colors

* **Background (Canvas):** `bg-background` -> `#F9F9F8` (Porcelain Subtle)
* **Surface (Cards/Sidebar):** `bg-card` / `bg-sidebar` -> `#FEFFFE` (Pure White)
* **Primary Brand (Action):** `bg-primary` -> `#4DAFFF` (Apple Blue)
* **Text Main:** `text-foreground` -> `#222222` (Soft Black)
* **Text Muted:** `text-muted-foreground` -> `#999999` (Muted Gray)
* **Borders:** `border-border` -> `#F5F5F5` (Very Light)

### Radius

* **Outer Containers (Cards, Sidebar, Modals):** `rounded-[36px]` (`rounded-3xl` + custom) -> `var(--radius)`
* **Inner Elements (Buttons, Inputs):** `rounded-2xl` or `rounded-xl`
* **Icons/Avatars:** `rounded-full`

### Motion (Framer Motion)

To maintain the "Apple" feel on a dashboard, use spring physics rather than ease-in-out.

```javascript
// Motion constants for your system
export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30
};
```

## 3. Component Architecture

### A. Typography

* **Headings:** Semibold (`font-semibold`), dark grey (`#222222`).
* **Body:** Medium (`font-medium`), soft grey (`#999999`).
* **Labels:** Small, uppercase, tracking-wide.

### B. Iconography (The "Thick Stroke" Style)

* **Weight:** `2.75px` (Thicker than standard 2px).
* **Style:** Rounded caps and joins.
* **Color:** `#999999` (Inactive) to `#222222` (Active).
* **Rule:** Never use filled icons unless it`s a notification dot. Keep everything outlined to match the "Airy" feel.

### C. Buttons & Interactions

1. **The "Row" Button:** (Used for settings/navigation)
    * Height: `48px` (`h-12`)
    * Radius: `16px`
    * Bg: `#F7F8F9` (`bg-secondary`)
    * Interaction: `active:scale-95`

2. **The "Action" Button:** (Used for confirmation/modals)
    * Height: `48px`
    * Radius: `Full` (Pill shape)
    * Bg: Brand Blue (`bg-primary`).
    * Align: Center.

## 4. Dashboard Concept Layout: "The Bento Grid"

Instead of a complex admin panel, use a "Bento Box" layout.

* **Sidebar:** Floating, pill-shaped (`rounded-[36px]`), detached from the edge.
* **Main Content:** Large cards with `rounded-[36px]`.

### Dashboard Layout Wrapper Example

```jsx
export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background p-4 flex gap-4 font-sans antialiased text-foreground">
      {/* Sidebar */}
      <nav className="w-64 bg-sidebar rounded-[36px] p-6 flex flex-col justify-between hidden md:flex border border-border">
         {/* ... */}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 bg-card rounded-[36px] p-8 overflow-y-auto border border-border">
        {children}
      </main>
    </div>
  );
}
```

## 5. Summary of Visual Rules

1. **No Pure Black:** Text is `#222222`.
2. **No Thin Borders:** If a border exists, it`s very light `#F5F5F5`. Use background color separation (`#F9F9F8` vs `#FEFFFE`) instead of borders where possible.
3. **Thick Icons:** Maintain that `2.75px` stroke width.
4. **Radius Consistency:**
    * Outer containers: `36px`
    * Inner containers/Buttons: `16px`
    * Icons/Small elements: `Full` (Circle)

---

# Legacy Animation Guidelines (Reference)

## 1. Easing

Use custom easing functions over built-in CSS easings for more natural motion.

### ease-out (Elements entering or exiting / user interactions)

```css
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
```

### ease-in-out (Elements moving within the screen)

```css
--ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
```

