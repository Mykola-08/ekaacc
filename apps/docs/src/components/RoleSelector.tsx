'use client';

import { useRole, UserRole } from './RoleContext';

export function RoleSelector() {
  const { role, setRole } = useRole();

  const roles: { value: UserRole; label: string }[] = [
    { value: 'guest', label: 'Guest' },
    { value: 'user', label: 'End User' },
    { value: 'staff', label: 'Staff/Therapist' },
    { value: 'admin', label: 'Admin' },
    { value: 'developer', label: 'Developer' },
  ];

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-neutral-900 rounded-lg mb-6">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View documentation as:</span>
      <div className="flex gap-2 flex-wrap">
        {roles.map((r) => (
          <button
            key={r.value}
            onClick={() => setRole(r.value)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              role === r.value
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
