import express from 'express';
import { GoogleGenerativeAI } from '@google/genai';
import { Mistake } from './types';

const router = express.Router();

const ai = new GoogleGenerativeAI({
  apiKey: process.env.API_KEY as string
});

router.post('/suggestions', async (req, res) => {
  try {
    const { mistakes, playerLevel } = req.body;
    if (!mistakes || playerLevel === undefined) {
      return res.status(400).send('Missing required parameters: mistakes and playerLevel.');
    }

    const mistakeSummary = mistakes.map((m: Mistake) =>
      `Problem: "${m.questionText}", Your Answer: ${m.userAnswer === '' ? 'Not Attempted' : m.userAnswer}, Correct Answer: ${m.correctAnswer}`
    ).join('\n');

    const prompt = `
      A user playing a math game called "Math Master" just finished a round. Their current skill level is ${playerLevel}.
      They made the following mistakes:
      ${mistakeSummary}

      Based on these mistakes, analyze for any patterns (e.g., trouble with a specific operation, carrying/borrowing, certain numbers)
      and provide 2-3 short, encouraging, and actionable suggestions for improvement. Address the user directly.
      Format the response as a single string, with each suggestion starting with a bullet point (•).
    `;

    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text;
    res.json({ suggestions: text });

  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    res.status(500).send("Sorry, I couldn't generate suggestions at this time. Keep practicing, you're doing great!");
  }
});

export default router;
