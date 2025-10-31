# EKA Account - Therapy Management System

A Next.js application for managing therapy sessions, patient records, and wellness tracking.

## 🎯 Quick Start - Data Switching

This app uses a **unified data service layer** that makes it easy to switch between:

### Switch in One Line

Open `src/services/data-service.ts` and change:

```typescript
export const USE_MOCK_DATA = true;  // or false
```

Then restart: `npm run dev`

**That's it!** See [QUICK_START_DATA_SWITCHING.md](./QUICK_START_DATA_SWITCHING.md) for details.

## 📚 Documentation

### Design System & Style Guide

- **[Quick Style Guide](./QUICK_STYLE_GUIDE.md)** - ⭐ Start here! Quick reference for colors, components, and patterns
- **[Design System](./DESIGN_SYSTEM.md)** - Comprehensive design principles and guidelines
- **[Design System Implementation](./DESIGN_SYSTEM_IMPLEMENTATION.md)** - Migration guide and detailed examples

### Technical Documentation

- **[Square Integration Guide](./SQUARE_INTEGRATION.md)** - Payment processing and booking management setup
- [Quick Start - Data Switching](./QUICK_START_DATA_SWITCHING.md)
- [Features Documentation](./FEATURES.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

The app starts with **mock data** by default - perfect for trying it out!
