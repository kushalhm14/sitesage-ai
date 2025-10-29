import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Gemini AI Service
 * Handles all AI-powered SEO & AEO analysis using Gemini 1.5 Flash (FREE)
 */

class GeminiService {
  constructor() {
    // Don't check API key in constructor - check when actually using it
    this.apiKey = null;
    this.genAI = null;
    this.model = null;
  }

  /**
   * Initialize Gemini client (lazy loading)
   */
  initialize() {
    if (this.genAI) return; // Already initialized

    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables. Get your FREE key at: https://aistudio.google.com/app/apikey');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini AI initialized successfully');
  }

  /**
   * Analyze SEO & AEO for a scraped webpage
   * @param {Object} scrapedData - Data extracted from web scraper
   * @param {string} url - Original URL
   * @returns {Promise<Object>} - Comprehensive SEO/AEO analysis
   */
  async analyzeSEO(scrapedData, url) {
    try {
      this.initialize(); // Initialize on first use
      const startTime = Date.now();

      const prompt = this.buildSEOAnalysisPrompt(scrapedData, url);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const analysis = this.parseGeminiResponse(text);
      
      const processingTime = Date.now() - startTime;
      
      return {
        ...analysis,
        processingTime,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Gemini SEO Analysis Error:', error.message);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate SEO strategy for manual input
   * @param {Object} manualData - User-provided content data
   * @returns {Promise<Object>} - SEO/AEO strategy recommendations
   */
  async generateStrategy(manualData) {
    try {
      this.initialize(); // Initialize on first use
      const startTime = Date.now();

      const prompt = this.buildStrategyPrompt(manualData);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const strategy = this.parseGeminiResponse(text);
      
      const processingTime = Date.now() - startTime;
      
      return {
        ...strategy,
        processingTime,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Gemini Strategy Generation Error:', error.message);
      throw new Error(`Strategy generation failed: ${error.message}`);
    }
  }

  /**
   * Build comprehensive SEO analysis prompt
   */
  buildSEOAnalysisPrompt(scrapedData, url) {
    const {
      metaTitle,
      metaDescription,
      ogTags,
      headings,
      bodyContent,
      structuredData,
      images,
      internalLinks,
      externalLinks
    } = scrapedData;

    return `You are an expert SEO and AEO (Answer Engine Optimization) consultant. Analyze this webpage comprehensively for both traditional search engines (Google, Bing) and AI-powered answer engines (ChatGPT Search, Perplexity, Google SGE).

**WEBPAGE DATA:**
URL: ${url}
Meta Title: ${metaTitle || 'Not found'}
Meta Description: ${metaDescription || 'Not found'}
Open Graph Tags: ${JSON.stringify(ogTags || {})}

H1 Headings: ${headings?.h1?.join(', ') || 'None'}
H2 Headings: ${headings?.h2?.join(', ') || 'None'}
H3 Headings: ${headings?.h3?.join(', ') || 'None'}

Body Content Preview: ${bodyContent?.substring(0, 1000) || 'No content found'}...

Structured Data: ${structuredData ? 'Present' : 'Not found'}
Images: ${images?.length || 0} images found
Internal Links: ${internalLinks || 0}
External Links: ${externalLinks || 0}

**ANALYSIS REQUIREMENTS:**

1. **SEO Score (0-100):** Rate traditional search engine optimization
2. **AEO Score (0-100):** Rate AI answer engine readiness
3. **Overall Score (0-100):** Combined weighted average (60% SEO + 40% AEO)

4. **Recommendations (5-10 items):** Prioritized action items with:
   - Priority: high/medium/low
   - Category: meta-tags/content/technical/structured-data/aeo
   - Title: Brief recommendation title
   - Description: Detailed explanation
   - Impact: Expected improvement
   - Code snippet (if applicable)

5. **Strengths (3-5 items):** What's already optimized well

6. **Issues (5-10 items):** Problems found with:
   - Severity: critical/warning/info
   - Category: Same as recommendations
   - Message: What's wrong
   - Fix: How to fix it

7. **SEO Metrics:**
   - Title length (optimal: 50-60 chars)
   - Description length (optimal: 150-160 chars)
   - Has H1: true/false
   - Heading hierarchy: valid/invalid
   - Keyword density: percentage
   - Readability score (0-100)
   - Mobile responsive: estimated true/false
   - Has structured data: true/false

8. **AEO Metrics:**
   - Has schema markup: true/false
   - Has FAQs: true/false
   - Has entity markup: true/false
   - Citation readiness (0-100): How likely AI will cite this
   - Answer box potential (0-100): Likelihood for featured snippets
   - AI search optimized: true/false

**CRITICAL: Return ONLY valid JSON in this exact format (no markdown, no code blocks):**

{
  "seoScore": 75,
  "aeoScore": 60,
  "overallScore": 69,
  "recommendations": [
    {
      "priority": "high",
      "category": "meta-tags",
      "title": "Optimize Meta Description",
      "description": "Your meta description is too short. Expand it to 150-160 characters to improve CTR.",
      "impact": "Could improve click-through rate by 15-20%",
      "codeSnippet": "<meta name=\\"description\\" content=\\"Your optimized description here\\">"
    }
  ],
  "strengths": ["Good H1 hierarchy", "Fast load time"],
  "issues": [
    {
      "severity": "critical",
      "category": "content",
      "message": "Missing H1 heading",
      "fix": "Add exactly one H1 heading with your primary keyword"
    }
  ],
  "seoMetrics": {
    "titleLength": 55,
    "descriptionLength": 140,
    "hasH1": true,
    "headingHierarchy": "valid",
    "keywordDensity": 2.5,
    "readabilityScore": 75,
    "mobileResponsive": true,
    "hasStructuredData": false
  },
  "aeoMetrics": {
    "hasSchemaMarkup": false,
    "hasFAQs": false,
    "hasEntityMarkup": false,
    "citationReadiness": 45,
    "answerBoxPotential": 60,
    "aiSearchOptimized": false
  }
}`;
  }

  /**
   * Build strategy generation prompt for manual input
   */
  buildStrategyPrompt(manualData) {
    const { title, description, keywords, content } = manualData;

    return `You are an expert SEO and AEO strategist. Generate a comprehensive optimization strategy based on this content:

**CONTENT DATA:**
Title: ${title || 'Not provided'}
Description: ${description || 'Not provided'}
Keywords: ${keywords?.join(', ') || 'Not provided'}
Content: ${content?.substring(0, 1500) || 'Not provided'}...

**STRATEGY REQUIREMENTS:**

Generate a detailed SEO/AEO strategy with the same structure as the SEO analysis, but focused on:
1. How to optimize this content for search engines
2. How to make it AI-answer-engine ready
3. Specific improvements for better rankings
4. Schema markup recommendations
5. Content structure suggestions

Return ONLY valid JSON in the exact same format as SEO analysis (seoScore, aeoScore, recommendations, etc.).
Focus on actionable, implementable strategies.`;
  }

  /**
   * Parse and validate Gemini JSON response
   */
  parseGeminiResponse(text) {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }
      
      cleanText = cleanText.trim();
      
      const parsed = JSON.parse(cleanText);
      
      // Validate required fields
      if (!parsed.seoScore || !parsed.aeoScore || !parsed.recommendations) {
        throw new Error('Invalid response format: missing required fields');
      }
      
      return parsed;

    } catch (error) {
      console.error('❌ JSON Parsing Error:', error.message);
      console.error('Raw response:', text);
      
      // Return fallback structure
      return {
        seoScore: 0,
        aeoScore: 0,
        overallScore: 0,
        recommendations: [{
          priority: 'high',
          category: 'error',
          title: 'Analysis Failed',
          description: 'Could not parse AI response. Please try again.',
          impact: 'N/A',
          codeSnippet: ''
        }],
        strengths: [],
        issues: [{
          severity: 'critical',
          category: 'error',
          message: 'AI response parsing failed',
          fix: 'Please retry the analysis'
        }],
        seoMetrics: {},
        aeoMetrics: {},
        error: error.message
      };
    }
  }
}

// Export singleton instance
const geminiService = new GeminiService();
export default geminiService;
