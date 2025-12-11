import { describe, it, expect, beforeEach } from 'vitest';
import flashcardReducer, { addFlashcard, setFlashcards, deleteFlashcard } from './flashcardSlice';
import { Note } from '../lib/types';

describe('flashcardSlice', () => {
    const initialState = { flashcards: [] };

    beforeEach(() => {
        // Clear localStorage mock if we were mocking it, but reducer relies on passing state
    });

    it('should return initial state', () => {
        expect(flashcardReducer(undefined, { type: 'unknown' })).toEqual({ flashcards: [] });
    });

    it('should handle addFlashcard', () => {
        const newNote: Note = {
            id: '1',
            title: 'Test Note',
            content: 'Content',
            createdAt: 123
        };
        const actual = flashcardReducer(initialState, addFlashcard(newNote));
        expect(actual.flashcards).toHaveLength(1);
        expect(actual.flashcards[0]).toEqual(newNote);
    });

    it('should handle deleteFlashcard', () => {
        const note: Note = {
            id: '1',
            title: 'Test Note',
            content: 'Content',
            createdAt: 123
        };
        const startState = { flashcards: [note] };
        const actual = flashcardReducer(startState, deleteFlashcard('1'));
        expect(actual.flashcards).toHaveLength(0);
    });
});
