import { motion } from "framer-motion";
import { type Note } from "@/lib/types";

interface FlashcardProps {
    note: Note;
}

export function Flashcard({ note }: FlashcardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card text-card-foreground border rounded-xl shadow-sm p-6 flex flex-col gap-2 hover:shadow-md transition-shadow duration-300"
        >
            <h3 className="text-xl font-bold tracking-tight">{note.title}</h3>
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {note.content}
            </div>
        </motion.div>
    );
}
