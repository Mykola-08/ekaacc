# Data Service Layer - Easy Mock ↔ Firebase Switching

This application uses a unified data service layer that makes it trivially easy to switch between mock data (for development/demo) and Firebase (for production).

## 🎯 Quick Start - Switching Data Sources

**To switch between mock data and Firebase, simply:**

1. Open `src/services/data-service.ts`
2. Change the `USE_MOCK_DATA` constant:
   ```typescript
   export const USE_MOCK_DATA = true;  // Use mock data (default)
   // or
   export const USE_MOCK_DATA = false; // Use Firebase
   ```
3. Restart your dev server: `npm run dev`

**That's it!** No other code changes needed.

## 📁 Architecture

### Service Layer
The data access is abstracted into three main files:

1. **`src/services/data-service.ts`** - Main configuration and interface
   - Contains `USE_MOCK_DATA` flag (the ONLY place you change to switch)
   - Defines `IDataService` interface that both implementations follow
   - Returns the appropriate service based on configuration

2. **`src/services/mock-data-service.ts`** - Mock implementation
   - Stores data in memory and localStorage
   - Perfect for development, testing, and demos
   - No Firebase/network calls needed

3. **`src/services/firebase-data-service.ts`** - Firebase implementation
   - Connects to real Firebase Firestore
   - Handles authentication via Firebase Auth
   - Real-time data persistence

### Context Layer
**`src/context/unified-data-context.tsx`** - React Context wrapper
- Automatically uses the correct service based on configuration
- Provides React hooks for components
- Handles loading states and data caching
- **Exports `useData()` hook** - use this in your components!

## 🔧 Using the Data Service in Components

### Option 1: Using the Context (Recommended)
```tsx
import { useData } from '@/context/unified-data-context';

export default function MyComponent() {
  const { 
    currentUser, 
    sessions, 
    reports,
    login, 
    logout,
    updateUser,
    isLoading,
    dataSource // 'mock' or 'firebase'
  } = useData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Current user: {currentUser?.name}</p>
      <p>Data source: {dataSource}</p>
      <p>Sessions: {sessions.length}</p>
    </div>
  );
}
```

### Option 2: Direct Service Access (Advanced)
```tsx
import { getDataService } from '@/services/data-service';

export default function MyComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const service = await getDataService();
      const currentUser = await service.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  return <div>{user?.name}</div>;
}
```

## 📦 Available Data & Methods

### User Management
```typescript
getCurrentUser(): Promise<User | null>
getAllUsers(): Promise<User[]>
updateUser(userId: string, updates: Partial<User>): Promise<void>
```

### Authentication
```typescript
login(email: string, password: string): Promise<User>
logout(): Promise<void>
```

### Sessions
```typescript
getSessions(userId?: string): Promise<Session[]>
createSession(session: Omit<Session, 'id'>): Promise<Session>
updateSession(sessionId: string, updates: Partial<Session>): Promise<void>
cancelSession(sessionId: string): Promise<void>
```

### Reports
```typescript
getReports(userId?: string): Promise<Report[]>
createReport(report: Omit<Report, 'id'>): Promise<Report>
```

### Services/Therapies
```typescript
getServices(): Promise<Service[]>
createService(service: Omit<Service, 'id'>): Promise<Service>
updateService(serviceId: string, updates: Partial<Service>): Promise<void>
```

### Journal Entries
```typescript
getJournalEntries(userId?: string): Promise<JournalEntry[]>
createJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry>
```

### Other Data
```typescript
getExercises(): Promise<Exercise[]>
getCommunityPosts(): Promise<CommunityPost[]>
createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<CommunityPost>
```

## 🔄 Migration Guide

### Updating Existing Components

**Before (using mock-data-context):**
```tsx
import { useMockData } from '@/context/mock-data-context';

export default function MyComponent() {
  const { currentUser, sessions } = useMockData();
  // ...
}
```

**After (using unified context):**
```tsx
import { useData } from '@/context/unified-data-context';

export default function MyComponent() {
  const { currentUser, sessions } = useData();
  // ...
}
```

**Or use the alias for minimal changes:**
```tsx
// This works because unified-data-context exports useMockData as an alias
import { useMockData } from '@/context/unified-data-context';

export default function MyComponent() {
  const { currentUser, sessions } = useMockData();
  // ...
}
```

## 🏗️ Setup in Your App

Add the provider at your app root:

**`src/app/layout.tsx`:**
```tsx
import { UnifiedDataProvider } from '@/context/unified-data-context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <UnifiedDataProvider>
          {children}
        </UnifiedDataProvider>
      </body>
    </html>
  );
}
```

## 🎨 Mock Data Persistence

When using mock data:
- Data is stored in **localStorage** for persistence across page reloads
- Each data type has its own storage key
- Data can be reset by clearing localStorage: `localStorage.clear()`

Storage keys used:
- `mock_current_user` - Current logged-in user
- `mock_sessions` - All sessions
- `mock_reports` - All reports
- `mock_services` - All services/therapies
- `mock_journal` - Journal entries
- `mock_community` - Community posts

## 🔥 Firebase Configuration

When switching to Firebase (`USE_MOCK_DATA = false`):

1. Ensure your Firebase config is set in `src/firebase/config.ts`
2. Your Firestore security rules should allow the operations
3. Data structure in Firestore should match the TypeScript types

**Required Firestore collections:**
- `users` - User profiles
- `sessions` - Therapy sessions
- `reports` - Session reports
- `services` - Available therapies/services
- `journal` - Journal entries (with userId field)
- `exercises` - Exercise library
- `community` - Community posts

## 🧪 Testing Different Scenarios

### Scenario 1: Development with Mock Data
```typescript
// src/services/data-service.ts
export const USE_MOCK_DATA = true;
```
- Fast development
- No network calls
- Data persists in localStorage
- Perfect for UI development

### Scenario 2: Production with Firebase
```typescript
// src/services/data-service.ts
export const USE_MOCK_DATA = false;
```
- Real authentication
- Cloud data persistence
- Multi-device sync
- Production-ready

### Scenario 3: Hybrid Testing
You can even conditionally switch based on environment:
```typescript
// src/services/data-service.ts
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development';
```

## 🎯 Best Practices

1. **Always use the unified context** (`useData()`) in components
2. **Never mix** mock-data-context and user-context directly
3. **Only change** the `USE_MOCK_DATA` flag - never modify service implementations to switch
4. **Test both modes** before deploying to production
5. **Keep data structures consistent** between mock and Firebase

## 🐛 Troubleshooting

### "Data service not initialized" error
- The service is still loading. Check `isLoading` state before accessing data.

### Mock data not persisting
- Check browser localStorage - it might be disabled or full
- Try `localStorage.clear()` and reload

### Firebase connection issues
- Verify Firebase config in `src/firebase/config.ts`
- Check Firestore security rules
- Ensure Firebase is initialized before data access

## 📝 Adding New Data Types

To add a new data type:

1. Add the TypeScript type to `src/lib/types.ts`
2. Add methods to `IDataService` interface in `src/services/data-service.ts`
3. Implement in `src/services/mock-data-service.ts`
4. Implement in `src/services/firebase-data-service.ts`
5. Add to `UnifiedDataProvider` state and context
6. Add mock data to `src/lib/mock-data.ts`

Example:
```typescript
// 1. Add type
export type NewType = { id: string; name: string; };

// 2. Add to interface
export interface IDataService {
  getNewTypes(): Promise<NewType[]>;
}

// 3 & 4. Implement in both services
async getNewTypes(): Promise<NewType[]> {
  // Implementation
}

// 5. Add to context
const [newTypes, setNewTypes] = useState<NewType[]>([]);
```

## 🚀 Deployment Checklist

Before deploying:

- [ ] Set `USE_MOCK_DATA = false` in production
- [ ] Verify Firebase credentials are correct
- [ ] Test all CRUD operations with Firebase
- [ ] Check Firestore security rules
- [ ] Verify data migration if moving from mock to Firebase
- [ ] Test authentication flows

---

**Questions?** Check the source code comments or ask the team!
