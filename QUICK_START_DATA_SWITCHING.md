# Quick Start: Switching Between Mock Data and Firebase

## 🎯 The One-Line Change

**Location:** `src/services/data-service.ts`

```typescript
// For Mock Data (Development/Demo)
export const USE_MOCK_DATA = true;

// For Firebase (Production)
export const USE_MOCK_DATA = false;
```

Then restart your dev server: `npm run dev`

## ✅ What's Already Done

The app is now using the **Unified Data Provider** which:

- ✅ Automatically loads the correct data service based on `USE_MOCK_DATA`
- ✅ Provides the same API whether using mock or Firebase
- ✅ Handles authentication, sessions, reports, services, and more
- ✅ Shows a visual indicator of which data source is active (in user menu)

## 📝 Example: Home Page Already Migrated

The home page (`src/app/(app)/home/page.tsx`) already uses the new system. Here's how it works:

```typescript
import { useData } from '@/context/unified-data-context';

export default function HomePage() {
  const { 
    currentUser,    // Current logged-in user
    sessions,       // User's sessions
    reports,        // User's reports
    isLoading,      // Loading state
    dataSource      // 'mock' or 'firebase'
  } = useData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {currentUser?.name}!</h1>
```

## 🔄 Migrating Other Components

### Before (Old Way)

```typescript
import { useMockData } from '@/context/mock-data-context';

export default function MyComponent() {
  const { currentUser, sessions } = useMockData();
  // ...
}
```

### After (New Way)

```typescript
import { useData } from '@/context/unified-data-context';

export default function MyComponent() {
  const { currentUser, sessions } = useData();
  // ...
}
```

That's it! Just change the import.

## 🎨 Visual Indicator

Open the user menu (click your avatar in the top right) to see which data source is active:

- 🗄️ **Mock Data** - Development/demo mode
- 🔥 **Firebase** - Production mode

## 📚 Full Documentation

See [DATA_SERVICE_GUIDE.md](./DATA_SERVICE_GUIDE.md) for:

- Complete API reference
- All available methods

1. **Start with Mock Data** (default)

   ```bash
   # src/services/data-service.ts
   export const USE_MOCK_DATA = true;
   
   npm run dev
   ```

   - Login will use mock authentication
   - Data persists in localStorage
   - Fast development, no network calls

2. **Switch to Firebase**

   ```bash
   # src/services/data-service.ts
   export const USE_MOCK_DATA = false;
   
   npm run dev
   - Login will use Firebase Auth
   - Data persists in Firestore
   - Real-time sync across devices

## 🔐 Firebase Setup (When Ready)

When you're ready to use Firebase:

1. Ensure `src/firebase/config.ts` has your Firebase credentials
2. Set up Firestore collections (see [DATA_SERVICE_GUIDE.md](./DATA_SERVICE_GUIDE.md))
3. Configure Firestore security rules
4. Set `USE_MOCK_DATA = false`
5. Restart dev server

## 💡 Tips

- **Development:** Use mock data for fast iteration
- **Testing:** Test both modes before production
- **Production:** Use Firebase for real users
- **Demo:** Use mock data for presentations
- **Hybrid:** Use environment variables to auto-switch:

  ```typescript
  export const USE_MOCK_DATA = process.env.NODE_ENV === 'development';
  ```

## ❓ Common Questions

**Q: Will I lose my mock data when I switch to Firebase?**
A: No, mock data is stored separately in localStorage. You can switch back and forth freely.

**Q: Do I need to change my components?**
A: No! Components using `useData()` work with both data sources automatically.

**Q: Can I use both at the same time?**
A: No, but you can switch between them by changing one flag and restarting.

**Q: What if I forget which mode I'm in?**
A: Check the badge in your user menu dropdown - it shows the current data source.

---

**Need help?** Check the [full documentation](./DATA_SERVICE_GUIDE.md) or ask the team!
