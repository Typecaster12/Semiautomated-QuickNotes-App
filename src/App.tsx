import { useState, useEffect } from "react";
import { Flashcard } from "./components/Flashcard";
import { NoteCreator } from "./components/NoteCreator";
import { type Note } from "./lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "./lib/utils";

function App() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);

    // Load notes from local storage on mount (optional persistance for demo)
    useEffect(() => {
        const saved = localStorage.getItem("quicknotes-data");
        if (saved) {
            try {
                setNotes(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load notes", e);
            }
        }
    }, []);

    // Save notes to local storage
    useEffect(() => {
        localStorage.setItem("quicknotes-data", JSON.stringify(notes));
    }, [notes]);

    const addNote = (title: string, content: string) => {
        const newNote: Note = {
            id: Date.now().toString(),
            title,
            content,
            createdAt: Date.now(),
        };
        setNotes((prev) => [newNote, ...prev]);
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

            // The backend returns the full Gemini response structure, but we need to parse the JSON text inside it
            // or we could simplify the backend to return just the clean object.
            // Let's assume for now I should match what the frontend expected or adjust.
            // My backend code returned `data` directly from Gemini: `res.json(data)`.
            // So the structure is `data.candidates[0].content.parts[0].text`.

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
        <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
            <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        QuickNotes AI
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Create flashcards instantly with the power of Gemini
                    </p>
                </div>
                <button
                    onClick={() => setIsCreatorOpen(!isCreatorOpen)}
                    className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg"
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
                            <NoteCreator onSave={addNote} onGenerate={handleGenerate} />
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
                        <div className="col-span-1 md:col-span-2 text-center py-20 text-muted-foreground">
                            <p>No notes yet. Click the + button to create one!</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
