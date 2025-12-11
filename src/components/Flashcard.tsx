import { motion } from "framer-motion";
import { type Note } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { removeFlashcard } from "../store/flashcardSlice";

interface FlashcardProps {
    note: Note;
}

export function Flashcard({ note }: FlashcardProps) {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = () => {
        if (user) {
            dispatch(removeFlashcard({ userId: user.uid, noteId: note.id }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group bg-card text-card-foreground border rounded-xl shadow-sm p-6 flex flex-col gap-2 hover:shadow-md transition-shadow duration-300 relative"
        >
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold tracking-tight pr-8">{note.title}</h3>
                <button
                    onClick={handleDelete}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete flashcard"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {note.content}
            </div>
        </motion.div>
    );
}
