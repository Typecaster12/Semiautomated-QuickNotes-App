import { Layout, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

export const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path
            ? "text-zinc-900 bg-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50";
    };

    return (
        <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Zap className="h-6 w-6 text-zinc-900 fill-zinc-900" />
                            <span className="font-bold text-xl text-zinc-900">QuickNotes AI</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={cn(
                                "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2",
                                isActive("/")
                            )}
                        >
                            <Layout className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            to="/flashcards"
                            className={cn(
                                "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2",
                                isActive("/flashcards")
                            )}
                        >
                            <Zap className="w-4 h-4" />
                            My Flashcards
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
