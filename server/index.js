import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Configure dotenv to read from root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected', readyState: mongoose.connection.readyState });
    }
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quicknotes';

const connectDB = async () => {
    try {
        const maskedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
        console.log(`Attempting to connect to MongoDB at: ${maskedURI}`);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Do not exit, allow server to try running, but API calls might fail
    }
};
connectDB();

// Flashcard Schema
const flashcardSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Number, default: Date.now }
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

// Routes

// Get all flashcards for a user
app.get('/api/flashcards/:userId', async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        // Map _id to id for frontend compatibility
        const formattedCards = flashcards.map(card => ({
            id: card._id.toString(),
            title: card.title,
            content: card.content,
            createdAt: card.createdAt,
            userId: card.userId
        }));
        res.json(formattedCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new flashcard
app.post('/api/flashcards', async (req, res) => {
    try {
        console.log("Received create request body:", req.body);
        const { userId, title, content, createdAt } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const newCard = new Flashcard({
            userId,
            title,
            content,
            createdAt: createdAt || Date.now()
        });
        const savedCard = await newCard.save();
        console.log("Saved card:", savedCard);
        res.status(201).json({
            id: savedCard._id.toString(),
            title: savedCard.title,
            content: savedCard.content,
            createdAt: savedCard.createdAt,
            userId: savedCard.userId
        });
    } catch (error) {
        console.error("Error saving flashcard:", error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// Delete a flashcard
app.delete('/api/flashcards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Flashcard.findByIdAndDelete(id);
        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate', async (req, res) => {
    try {
        const { text } = req.body;
        const apiKey = process.env.VITE_GEMINI_API_KEY; // Using the same key name from .env

        if (!apiKey) {
            return res.status(500).json({ error: 'Server API key configuration missing' });
        }

        console.log("Generating with AI for:", text);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Summarize the following text into a flashcard title and a short concise content body. JSON format { "title": "string", "content": "string" }. Text: ${text}`
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Gemini API Error: ${err}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("AI Generation failed:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
