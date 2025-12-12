
const testCreateFlashcard = async () => {
    try {
        console.log("Testing POST http://localhost:3000/api/flashcards...");
        const response = await fetch('http://localhost:3000/api/flashcards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 'test-user-123',
                title: 'Test Card',
                content: 'This is a test card content',
                createdAt: Date.now()
            })
        });

        const status = response.status;
        const text = await response.text();

        console.log(`Response Status: ${status}`);
        console.log(`Response Body: ${text}`);

        if (status === 201) {
            console.log("SUCCESS: Flashcard created.");
        } else {
            console.log("FAILURE: Could not create flashcard.");
        }
    } catch (error) {
        console.error("ERROR during fetch:", error);
    }
};

testCreateFlashcard();
