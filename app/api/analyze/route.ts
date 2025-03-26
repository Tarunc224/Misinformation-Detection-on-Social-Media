import { type NextRequest, NextResponse } from "next/server"
// import { analyzeText } from "../../lib/textAnalysis"
import { analyzeText } from "lib/textAnalysis"

export async function POST(req: NextRequest) {
  const { type, content } = await req.json()

  try {
    let result
    switch (type) {
      case "text":
        result = await analyzeText(content)
        break
      // Implement other types (link, image, video) here
      default:
        throw new Error("Invalid content type")
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "An error occurred during analysis: " + (error as Error).message }, { status: 500 })
  }
}
