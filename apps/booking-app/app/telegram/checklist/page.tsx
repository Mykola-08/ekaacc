'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export default function ChecklistPage() {
 const [items, setItems] = useState([
  { id: 1, label: 'Morning Meditation', checked: false },
  { id: 2, label: 'Drink Water', checked: false },
  { id: 3, label: 'Journaling', checked: false },
  { id: 4, label: 'Evening Stretch', checked: false },
 ]);

 const toggleItem = (id: number) => {
  setItems(items.map(item => 
   item.id === id ? { ...item, checked: !item.checked } : item
  ));
 };

 return (
  <div className="p-4">
   <h1 className="text-xl font-bold mb-4">Daily Checklist</h1>
   <div className="space-y-4">
    {items.map((item) => (
     <div key={item.id} className="flex items-center space-x-2">
      <Checkbox 
       id={`item-${item.id}`} 
       checked={item.checked}
       onCheckedChange={() => toggleItem(item.id)}
      />
      <label 
       htmlFor={`item-${item.id}`}
       className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? 'line-through text-gray-500' : ''}`}
      >
       {item.label}
      </label>
     </div>
    ))}
   </div>
  </div>
 );
}
