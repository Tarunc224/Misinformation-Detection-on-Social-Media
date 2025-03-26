import { GoogleGenerativeAI } from "@google/generative-ai"

/**
 * Initializes the Google Generative AI instance with the API key.
 */
if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  throw new Error("API key for Google Generative AI is not set.");
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);

/**
 * Analyzes the provided text for misinformation.
 * 
 * @param {string} text - The text to analyze for misinformation.
 * @returns {Promise<Object>} An object containing the percentage of factual information, analysis, and sources.
 */
export async function analyzeText(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `Analyze the following text for misinformation:

  "${text}"

  Provide a percentage of how likely this text contains factual information, and list any potential issues or red flags. Also, suggest reliable sources to fact-check this information.`

  console.log("Prompt sent to model:", prompt);
  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content from the model: " + error);
  }

  console.log("Model response:", result);
  if (!result || !result.response) {
    throw new Error("Model response is invalid or missing.");
  }

  const response = await result.response;
  console.log("Raw response from model:", await response.text());
  console.log("Raw response from model:", response);
  const generatedText = await response.text();
  console.log("Generated text:", generatedText);

  // Parse the generated text to extract percentage and sources
  const percentageMatch = generatedText.match(/(\d+)%/)
  const percentageReal = percentageMatch ? Number.parseInt(percentageMatch[1]) : 50
  const sourcesMatch = generatedText.match(/Sources:([\s\S]*)/i)
  const sources = sourcesMatch
    ? sourcesMatch[1]
        .split("\n")
        .filter((s) => s.trim().length > 0)
        .map((s) => s.trim())
    : []

  return {
    percentageReal,
    analysis: generatedText,
    sources,
  }
}
