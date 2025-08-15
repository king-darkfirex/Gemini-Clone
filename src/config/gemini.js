const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_ID = "gemma-3-1b-it"; // You can change to gemini-2.0-flash later

export async function getGeminiResponse(userInput) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userInput }],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    console.log("Gemini API Response:", data);

    // Safely get text from the response
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error fetching response.";
  }
}
