import { useState } from "react";
import { Flashcard } from "../components/Flashcard";
import { NoteCreator } from "../components/NoteCreator";
import { type Note } from "../lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { addFlashcard } from "../store/flashcardSlice";

export const FlashcardHome = () => {
    const notes = useSelector((state: RootState) => state.flashcards.flashcards);
    const dispatch = useDispatch();
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);

    const handleAddNote = (title: string, content: string) => {
        const newNote: Note = {
            id: Date.now().toString(),
            title,
            content,
            createdAt: Date.now(),
        };
        dispatch(addFlashcard(newNote));
        setIsCreatorOpen(false);
    };

    const handleGenerate = async (text: string): Promise<{ title: string; content: string }> => {
        console.log("Generating with AI for:", text);

        try {
            const response = await fetch("http://localhost:3000/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Server Error: ${err}`);
            }

            const data = await response.json();

            // Assuming the backend returns the Gemini response structure
            const jsonText = data.candidates[0].content.parts[0].text;
            const parsed = JSON.parse(jsonText);

            return {
                title: parsed.title || "AI Summary",
                content: parsed.content || jsonText
            };

        } catch (error) {
            console.error("AI Generation failed:", error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            <div className="p-4 md:p-8">
                <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900">
                                My Flashcards
                            </h1>
                        </div>

                        <p className="text-slate-500 text-sm ml-7">
                            Create and manage your AI-powered flashcards
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreatorOpen(!isCreatorOpen)}
                        className="p-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <Plus className={cn("w-6 h-6 transition-transform", isCreatorOpen && "rotate-45")} />
                    </button>
                </header>

                <main className="max-w-4xl mx-auto space-y-8">
                    <AnimatePresence>
                        {isCreatorOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <NoteCreator onSave={handleAddNote} onGenerate={handleGenerate} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {notes.map((note) => (
                                <Flashcard key={note.id} note={note} />
                            ))}
                        </AnimatePresence>
                        {notes.length === 0 && !isCreatorOpen && (
                            <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-400">
                                <p>No notes yet. Click the + button to create one!</p>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};
