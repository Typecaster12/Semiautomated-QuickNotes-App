import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Note } from '../lib/types';

interface FlashcardState {
    flashcards: Note[];
    loading: boolean;
    error: string | null;
}

const initialState: FlashcardState = {
    flashcards: [],
    loading: false,
    error: null,
};

const API_URL = 'http://localhost:3000/api/flashcards';

// Async Thunks
// Async Thunks
export const fetchFlashcards = createAsyncThunk(
    'flashcards/fetchFlashcards',
    async (userId: string) => {
        const url = `${API_URL}/${userId}`;
        console.log(`Fetching flashcards from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch flashcards');
        }
        return await response.json();
    }
);

export const addNewFlashcard = createAsyncThunk(
    'flashcards/addNewFlashcard',
    async ({ userId, note }: { userId: string, note: Note }) => {
        console.log(`Adding flashcard to: ${API_URL}`);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...note, userId }),
        });
        if (!response.ok) {
            console.error(`Add failed for ${API_URL}: ${response.status} ${response.statusText}`);
            throw new Error('Failed to add flashcard');
        }
        return await response.json();
    }
);

export const removeFlashcard = createAsyncThunk(
    'flashcards/removeFlashcard',
    async ({ userId, noteId }: { userId: string, noteId: string }) => {
        const url = `${API_URL}/${noteId}`;
        console.log(`Removing flashcard at: ${url}`);
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error(`Remove failed for ${url}: ${response.status} ${response.statusText}`);
            throw new Error('Failed to delete flashcard');
        }
        return noteId;
    }
);

const flashcardSlice = createSlice({
    name: 'flashcards',
    initialState,
    reducers: {
        setFlashcards: (state, action: PayloadAction<Note[]>) => {
            state.flashcards = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchFlashcards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFlashcards.fulfilled, (state, action) => {
                state.loading = false;
                state.flashcards = action.payload;
            })
            .addCase(fetchFlashcards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch flashcards';
            })
            // Add (Optimistic)
            .addCase(addNewFlashcard.pending, (state, action) => {
                // Ideally, we wait for the server response to get the real ID,
                // but for optimistic UI, we can assume success or show a loader.
                // However, since we return the saved note from API, we can just append it in fulfilled.
                // If we want purely optimistic, we'd need to handle ID syncing.
                // For simplicity here, let's rely on fulfilled or existing logic.
                // The previous logic was: state.flashcards.unshift(action.meta.arg.note);
                // But the ID comes from server now (or at least _id).
                // Let's trust the server response for the definitive list/item.
            })
            .addCase(addNewFlashcard.fulfilled, (state, action) => {
                state.flashcards.unshift(action.payload);
            })
            .addCase(addNewFlashcard.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to add flashcard';
            })
            // Remove (Optimistic)
            .addCase(removeFlashcard.pending, (state, action) => {
                state.flashcards = state.flashcards.filter(note => note.id !== action.meta.arg.noteId);
            })
            .addCase(removeFlashcard.rejected, (state, action) => {
                // Rollback logic would inherently require re-fetching or undoing the filter.
                state.error = action.error.message || 'Failed to delete flashcard';
                // Ideally trigger a re-fetch here if critical.
            });
    },
});

export const { setFlashcards } = flashcardSlice.actions;
export default flashcardSlice.reducer;
