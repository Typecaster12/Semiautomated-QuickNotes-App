import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { FlashcardHome } from "./pages/FlashcardHome";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/flashcards" element={<FlashcardHome />} />
            </Routes>
        </Router>
    );
}

export default App;
