import * as cheerio from "cheerio"
import { analyzeText } from "./textAnalysis"

export async function analyzeLink(url: string) {
  // Fetch the webpage content
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    return { error: 'Failed to fetch the URL.' };
  }

  if (!response.ok) {
    return { error: 'Invalid URL or unable to fetch content.' };
  }

  const html = await response.text();

  // Parse the HTML
  const $ = cheerio.load(html);

  // Extract the main content (this is a simplified approach)
  const content = $("body").text();

  // Summarize the content (simple example)
  const summary = content.split('. ').slice(0, 3).join('. ') + '.';

  // Use the text analysis function to analyze the scraped content
  const result = await analyzeText(content);

  return {
    summary,
    ...result,
    url,
  };
}
