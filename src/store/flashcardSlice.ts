import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../lib/types';

interface FlashcardState {
    flashcards: Note[];
}

// Load initial state from local storage
const loadInitialState = (): FlashcardState => {
    try {
        const saved = localStorage.getItem("quicknotes-data");
        if (saved) {
            return { flashcards: JSON.parse(saved) };
        }
    } catch (e) {
        console.error("Failed to load notes from local storage", e);
    }
    return { flashcards: [] };
};

const initialState: FlashcardState = loadInitialState();

export const flashcardSlice = createSlice({
    name: 'flashcards',
    initialState,
    reducers: {
        addFlashcard: (state, action: PayloadAction<Note>) => {
            state.flashcards.unshift(action.payload);
            // Sync to local storage
            localStorage.setItem("quicknotes-data", JSON.stringify(state.flashcards));
        },
        setFlashcards: (state, action: PayloadAction<Note[]>) => {
            state.flashcards = action.payload;
            // Sync to local storage
            localStorage.setItem("quicknotes-data", JSON.stringify(state.flashcards));
        },
        deleteFlashcard: (state, action: PayloadAction<string>) => {
            state.flashcards = state.flashcards.filter(note => note.id !== action.payload);
            // Sync to local storage
            localStorage.setItem("quicknotes-data", JSON.stringify(state.flashcards));
        }
    },
});

export const { addFlashcard, setFlashcards, deleteFlashcard } = flashcardSlice.actions;

export default flashcardSlice.reducer;