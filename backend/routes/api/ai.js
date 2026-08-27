const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const wrapAsync = require("../../utils/wrapAsync.js");
const inMemoryStore = require("../../models/inMemoryStore.js");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/ai/plan-trip
router.post(
    "/plan-trip",
    wrapAsync(async (req, res) => {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Gemini API key is not configured" });
        }

        // Fetch all listings to provide as context to the AI
        // In a real massive app, you'd do vector search or RAG. For now, we stringify a subset.
        const allListings = inMemoryStore.findListings({});
        const listingsContext = allListings.map(l => ({
            id: l._id,
            title: l.title,
            location: l.location,
            price: l.price,
            category: l.category,
            description: l.description,
            amenities: l.amenities
        }));

        const systemInstruction = `
            You are Farebnb's expert AI Trip Planner.
            You help users plan trips by recommending the best available listings from our database and generating a short, exciting itinerary.
            Below is the JSON of our available listings:
            ${JSON.stringify(listingsContext)}
            
            The user will give you a prompt like "I want a relaxing beach weekend under 5000 Rs".
            You must return a raw JSON response (NO markdown blocks, NO \`\`\`json, just the raw JSON object) matching exactly this schema:
            {
                "itineraryTitle": "A catchy title for the trip",
                "itineraryDescription": "A 2-3 sentence enthusiastic summary of what they will do",
                "recommendedListingIds": ["list_of_listing_ids_that_best_match_the_prompt"]
            }
            Do not include any other text, only the JSON. Always pick at least 1-3 best matching listing IDs.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: [
                    { role: 'user', parts: [{ text: systemInstruction }] },
                    { role: 'user', parts: [{ text: prompt }] }
                ],
                config: {
                    temperature: 0.7,
                }
            });

            let rawText = response.text;
            // Clean up possible markdown formatting if the model disobeys
            rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            
            const aiData = JSON.parse(rawText);
            
            // Hydrate the listings
            const recommendedListings = allListings.filter(l => aiData.recommendedListingIds.includes(l._id.toString()));

            res.json({
                itineraryTitle: aiData.itineraryTitle,
                itineraryDescription: aiData.itineraryDescription,
                listings: recommendedListings
            });

        } catch (error) {
            console.error("AI Plan Error:", error);
            res.status(500).json({ error: "Failed to generate trip plan. Please try again." });
        }
    })
);

module.exports = router;
