import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const apiKey = "";
const genAI = new GoogleGenerativeAI(apiKey);

router.post('/suggestions', async (req, res) => {
    try {
        const { mistakes, playerLevel } = req.body;
        
        // Your API logic here...
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

        const prompt = `
        Act as a helpful math tutor. You will be given a list of a student's mistakes from a math game.
        For each mistake, provide a very brief explanation of the correct concept.
        After the explanations, provide a single, encouraging paragraph of general advice.
        Here are the mistakes (Question, Incorrect Answer, Correct Answer) and the student's level (${playerLevel}):
        ${JSON.stringify(mistakes)}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ suggestions: text });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ error: 'Failed to generate suggestions.' });
    }
});

export default router;
