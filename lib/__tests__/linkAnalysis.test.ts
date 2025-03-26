import { analyzeLink } from '../linkAnalysis';

describe('analyzeLink', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY = 'mock-api-key'; // Mock the API key
  });

  it('should return an error for an invalid URL', async () => {
    const result = await analyzeLink('invalid-url');
    expect(result.error).toBe('Invalid URL or unable to fetch content.');
  });

  it('should return a summary and analysis for a valid URL', async () => {
    const result = await analyzeLink('https://example.com');
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('url', 'https://example.com');
  });
});
