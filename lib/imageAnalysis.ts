import { PaLM } from "@google-ai/generativelanguage"
import { GoogleAuth } from "google-auth-library"

const palm = new PaLM({
  authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_PALM_API_KEY!),
})

export async function analyzeImage(image: File) {
  // Convert image to base64
  const buffer = await image.arrayBuffer()
  const base64Image = Buffer.from(buffer).toString("base64")

  const result = await palm.generateText({
    model: "models/text-bison-001",
    prompt: `Analyze this image for potential misinformation or manipulation:
    
    [IMAGE]${base64Image}[/IMAGE]
    
    Describe what you see in the image and highlight any elements that might be indicative of manipulation or misinformation. Provide a percentage of how likely this image contains factual information.`,
    temperature: 0.7,
    maxOutputTokens: 1024,
  })

  const generatedText = result.result!

  // Parse the generated text to extract percentage and analysis
  const percentageMatch = generatedText.match(/(\d+)%/)
  const percentageReal = percentageMatch ? Number.parseInt(percentageMatch[1]) : 50

  return {
    percentageReal,
    analysis: generatedText,
  }
}

