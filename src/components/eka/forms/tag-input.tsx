'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue && !value.includes(inputValue)) {
      onChange([...value, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Add a tag..."
        />
        <Button onClick={handleAddTag}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
            <button onClick={() => handleRemoveTag(tag)} className="ml-2">
              <X className="h-4 w-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
