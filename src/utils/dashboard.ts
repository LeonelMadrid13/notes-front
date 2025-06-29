// utils/dashboard.ts

import type { Note } from '@/app/(notes)/dashboard/page';

export function addTagIfNotExists(existingTags: string[], newTag: string): string[] {
    if (!existingTags.includes(newTag)) {
        return [...existingTags, newTag];
    }
    return existingTags;
}

export function generateSuggestions(notes: Note[], input: string, exclude: string[]): string[] {
    const excludeSet = new Set(exclude.map(e => e.toLowerCase()));
    return Array.from(
        new Set(
            notes
                .flatMap(n => [n.title, n.content, n.tag || ''])
                .filter(Boolean)
                .map(s => s.toLowerCase())
                .filter(s => s.includes(input.toLowerCase()) && !excludeSet.has(s))
        )
    ).slice(0, 5);
}
