// components/TagInput.tsx
'use client';

import { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

export function TagInput({ tags, setTags }: TagInputProps) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (value: string) => {
        const trimmed = value.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
            setInput('');
        } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    return (
        <div
            className="flex flex-wrap items-center gap-1 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring min-h-[42px]"
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map((tag, index) => (
                <span
                    key={tag + index}
                    className="bg-muted text-muted-foreground text-sm px-2 py-1 rounded-full flex items-center gap-1"
                >
                    {tag}
                    <button
                        type="button"
                        className="hover:text-red-500"
                        onClick={() => removeTag(index)}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-[100px] border-none focus:outline-none bg-transparent text-sm"
                placeholder="Add tag..."
            />
        </div>
    );
}
