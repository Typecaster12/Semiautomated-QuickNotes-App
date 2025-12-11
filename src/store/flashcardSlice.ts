import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Note } from '../lib/types';
import { db } from '../lib/firebase'; // Ensure firebase is initialized
import { collection, setDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

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

// Async Thunks
export const fetchFlashcards = createAsyncThunk(
    'flashcards/fetchFlashcards',
    async (userId: string) => {
        const q = query(
            collection(db, 'users', userId, 'flashcards'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const notes: Note[] = [];
        querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() } as Note);
        });
        return notes;
    }
);

export const addNewFlashcard = createAsyncThunk(
    'flashcards/addNewFlashcard',
    async ({ userId, note }: { userId: string, note: Note }) => {
        // Use setDoc with the client-generated ID
        await setDoc(doc(db, 'users', userId, 'flashcards', note.id), {
            ...note
        });
        return note;
    }
);

export const removeFlashcard = createAsyncThunk(
    'flashcards/removeFlashcard',
    async ({ userId, noteId }: { userId: string, noteId: string }) => {
        await deleteDoc(doc(db, 'users', userId, 'flashcards', noteId));
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
                // Optimistically add the note to the UI
                state.flashcards.unshift(action.meta.arg.note);
            })
            .addCase(addNewFlashcard.rejected, (state, action) => {
                // Rollback if failed
                state.flashcards = state.flashcards.filter(n => n.id !== action.meta.arg.note.id);
                state.error = action.error.message || 'Failed to add flashcard';
            })
            // Remove (Optimistic)
            .addCase(removeFlashcard.pending, (state, action) => {
                state.flashcards = state.flashcards.filter(note => note.id !== action.meta.arg.noteId);
            })
            .addCase(removeFlashcard.rejected, (state, action) => {
                // Rollback could be complex (need to restore note), but for deletion, re-fetching or error alert is usually enough.
                // For now, we'll just set error. Ideally, we should add it back.
                state.error = action.error.message || 'Failed to delete flashcard';
            });
    },
});

export const { setFlashcards } = flashcardSlice.actions;
export default flashcardSlice.reducer;
