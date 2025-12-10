import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface NoteCreatorProps {
    onSave: (title: string, content: string) => void;
    onGenerate: (text: string) => Promise<{ title: string; content: string }>;
}

export function NoteCreator({ onSave, onGenerate }: NoteCreatorProps) {
    const [mode, setMode] = useState<"manual" | "ai">("manual");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [longText, setLongText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content) {
            onSave(title, content);
            setTitle("");
            setContent("");
        }
    };

    const handleGenerate = async () => {
        if (!longText) return;
        setIsGenerating(true);
        try {
            const result = await onGenerate(longText);
            onSave(result.title, result.content);
            setLongText("");
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-card border rounded-2xl shadow-lg overflow-hidden">
            <div className="flex border-b">
                <button
                    onClick={() => setMode("manual")}
                    className={cn(
                        "flex-1 p-4 text-sm font-medium transition-colors",
                        mode === "manual" ? "bg-muted/50 text-foreground" : "text-muted-foreground hover:bg-muted/20"
                    )}
                >
                    Manual Entry
                </button>
                <button
                    onClick={() => setMode("ai")}
                    className={cn(
                        "flex-1 p-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                        mode === "ai" ? "bg-muted/50 text-foreground" : "text-muted-foreground hover:bg-muted/20"
                    )}
                >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    AI Assist
                </button>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {mode === "manual" ? (
                        <motion.form
                            key="manual"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleManualSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Card Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full p-2 rounded-lg border bg-background min-h-[100px] focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                    placeholder="Card content..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!title || !content}
                                className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                Create Card
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Paste your long text here</label>
                                <textarea
                                    value={longText}
                                    onChange={(e) => setLongText(e.target.value)}
                                    className="w-full p-2 rounded-lg border bg-background min-h-[150px] focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                    placeholder="Paste an article, email, or brain dump..."
                                />
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={!longText || isGenerating}
                                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Summarizing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Flashcard
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
