import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { FlashcardHome } from "./pages/FlashcardHome";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/flashcards" element={
                    <ProtectedRoute>
                        <FlashcardHome />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
