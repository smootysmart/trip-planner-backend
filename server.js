const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize GoogleGenerativeAI
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-plan", async (req, res) => {
  const { days, country } = req.body;

  if (!days || !country) {
    return res.status(400).json({ error: "Days and country are required." });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    const prompt = `Create a detailed travel itinerary for a ${days}-day trip to ${country}. Respond with ONLY a valid JSON object. The JSON should have a single root key "itinerary" which is an array of objects, one for each day. Each day object must include: "day" (number), "title" (string), "morning" (object with "activity" and "description"), "lunch" (object with "description" and "food_suggestions" as an array), "afternoon" (object with "activity" and "description"), and "evening" (object with "activity" and "description").`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean the response to get a valid JSON string, as the model might wrap it in markdown
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      text = jsonMatch[1];
    }

    try {
      const planJson = JSON.parse(text);
      // Send both the structured JSON and the raw text for display
      res.json({ plan: planJson, rawText: JSON.stringify(planJson, null, 2) });
    } catch (parseError) {
      console.error(
        "Error parsing JSON from AI response:",
        parseError,
        "Raw text:",
        text
      );
      // Fallback to sending raw text if JSON parsing fails
      res.json({
        plan: null,
        rawText: text,
        error: "Failed to parse the itinerary into a calendar format.",
      });
    }
  } catch (error) {
    console.error("Error generating travel plan:", error);
    res.status(500).json({ error: "Failed to generate travel plan." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
