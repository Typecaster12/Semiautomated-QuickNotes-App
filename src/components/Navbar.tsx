import { Layout, Zap, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { useState } from "react";

export const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

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

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
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

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-zinc-200">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2",
                                isActive("/")
                            )}
                        >
                            <Layout className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            to="/flashcards"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2",
                                isActive("/flashcards")
                            )}
                        >
                            <Zap className="w-4 h-4" />
                            My Flashcards
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
