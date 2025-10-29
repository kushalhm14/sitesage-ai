import axios from 'axios';

/**
 * Google Gemini AI Service
 * Handles all AI-powered SEO & AEO analysis using direct REST API (v1 stable)
 */
class GeminiService {
  constructor() {
    this.apiKey = null;
    // Use v1beta for now since v1 doesn't support gemini-1.5-flash yet
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
    // Use the latest stable Gemini 2.5 Flash (FREE tier, released June 2025)
    this.modelName = 'gemini-2.5-flash';
  }

  /**
   * Initialize Gemini client (lazy)
   */
  initialize() {
    if (this.apiKey) return;

    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error(
        'GEMINI_API_KEY not found. Create one at https://aistudio.google.com/app/apikey'
      );
    }

    console.log(`✅ Gemini initialized (${this.modelName} - FREE tier, 1M tokens)`);
  }

  /**
   * Retry with exponential backoff for API rate limits/overload
   */
  async retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        const isOverloaded = error.response?.data?.error?.code === 503 || 
                            error.response?.data?.error?.status === 'UNAVAILABLE';
        const isRateLimited = error.response?.data?.error?.code === 429;
        
        if ((isOverloaded || isRateLimited) && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
          console.log(`⏳ Gemini overloaded. Retrying in ${delay/1000}s... (Attempt ${i + 2}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  }

  /**
   * Analyze SEO & AEO for a scraped webpage
   */
  async analyzeSEO(scrapedData, url) {
    try {
      this.initialize();
      const start = Date.now();

      const prompt = this.buildSEOAnalysisPrompt(scrapedData, url);

      // Call Gemini API with retry mechanism
      const response = await this.retryWithBackoff(async () => {
        return await axios.post(
          `${this.baseURL}/${this.modelName}:generateContent?key=${this.apiKey}`,
          {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 120000 // 2 minute timeout (Gemini can be slow)
          }
        );
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const analysis = this.parseGeminiResponse(text);

      return {
        ...analysis,
        processingTime: Date.now() - start,
        status: 'success',
      };
    } catch (error) {
      console.error('❌ Gemini SEO Analysis Error:', error.response?.data || error.message);
      throw new Error(`AI analysis failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Generate production-ready code for implementing SEO fixes
   * (AI Agent feature - generates actual code snippets)
   */
  async generateImplementationCode(analysis, url) {
    try {
      this.initialize();
      const start = Date.now();

      // Extract key info from analysis
      const topRecommendations = analysis.recommendations?.slice(0, 5) || [];
      const issues = analysis.issues?.slice(0, 3) || [];
      const currentTitle = analysis.seoMetrics?.titleTag || 'Add your title here';
      const currentDesc = analysis.seoMetrics?.metaDescription || 'Add your description here';

      const prompt = `You are an AI Code Generation Agent. Generate production-ready, copy-paste code for implementing SEO fixes on this website.

WEBSITE: ${url}
SEO SCORE: ${analysis.seoScore}/100
AEO SCORE: ${analysis.aeoScore}/100

CURRENT STATE:
- Title: "${currentTitle}" (${analysis.seoMetrics?.titleLength || 0} chars)
- Description: "${currentDesc}" (${analysis.seoMetrics?.descriptionLength || 0} chars)
- Has H1: ${analysis.seoMetrics?.hasH1 ? 'Yes' : 'No'}
- Open Graph: ${analysis.seoMetrics?.hasOpenGraph ? 'Yes' : 'Missing'}

TOP ISSUES TO FIX:
${issues.map((issue, i) => `${i + 1}. [${issue.severity}] ${issue.message}`).join('\n')}

TOP RECOMMENDATIONS:
${topRecommendations.map((rec, i) => `${i + 1}. [${rec.priority}] ${rec.title}: ${rec.description}`).join('\n')}

TASK: Generate complete, production-ready code that fixes these issues.

Generate:
1. **HTML Meta Tags**: Complete <head> section with title, description, Open Graph, Twitter Cards, favicon
2. **JSON-LD Schema**: Schema.org structured data (Organization/Product/FAQ based on website type)
3. **Next.js Metadata**: TypeScript metadata object for Next.js 13+ app directory
4. **WordPress Code**: PHP function to add meta tags via wp_head hook
5. **Image Alt Fixes**: At least 3 example image alt tag improvements

IMPORTANT: 
- Use REAL content from the website, not placeholders
- Make meta tags compelling and keyword-rich
- Include proper Schema.org types
- Code should be ready to copy-paste
- Return ONLY valid JSON

JSON FORMAT:
{
  "htmlMeta": "<!-- Complete HTML meta tags -->\\n<meta charset=\\"UTF-8\\">\\n<title>Optimized Title Here</title>\\n<meta name=\\"description\\" content=\\"Optimized description here\\" />\\n<meta property=\\"og:title\\" content=\\"...\\" />\\n<!-- More tags -->",
  "jsonLd": "<script type=\\"application/ld+json\\">\\n{\\n  \\"@context\\": \\"https://schema.org\\",\\n  \\"@type\\": \\"Organization\\",\\n  \\"name\\": \\"Company Name\\",\\n  \\"url\\": \\"${url}\\"\\n}\\n</script>",
  "nextjsMetadata": "import { Metadata } from 'next';\\n\\nexport const metadata: Metadata = {\\n  title: 'Optimized Title',\\n  description: 'Optimized description',\\n  openGraph: {\\n    title: '...',\\n    description: '...',\\n    url: '${url}'\\n  }\\n};",
  "wordpressCode": "<?php\\n// Add to functions.php\\nfunction sitesage_seo_meta() {\\n  echo '<meta name=\\"description\\" content=\\"Optimized description\\" />';\\n}\\nadd_action('wp_head', 'sitesage_seo_meta', 1);\\n?>",
  "imageAlts": [
    {"currentSrc": "image1.jpg", "newAlt": "Descriptive alt text", "htmlSnippet": "<img src=\\"image1.jpg\\" alt=\\"Descriptive alt text\\" />"}
  ]
}`;

      const response = await this.retryWithBackoff(async () => {
        return await axios.post(
          `${this.baseURL}/${this.modelName}:generateContent?key=${this.apiKey}`,
          {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.3, // Lower temp for code generation
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 60000 // 1 minute for code gen
          }
        );
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Log the raw response for debugging
      console.log('🤖 Raw Gemini Code Response (first 500 chars):', text.substring(0, 500));
      
      const codePackage = this.parseCodeResponse(text);

      return {
        ...codePackage,
        processingTime: Date.now() - start,
        status: 'success',
        generatedAt: new Date().toISOString(),
        url
      };
    } catch (error) {
      console.error('❌ Gemini Code Generation Error:', error.response?.data || error.message);
      throw new Error(`Code generation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Generate SEO strategy for manual input
   */
  async generateStrategy(manualData) {
    try {
      this.initialize();
      const start = Date.now();

      const prompt = this.buildStrategyPrompt(manualData);
      
      // Call Gemini API directly using v1 stable endpoint
      const response = await axios.post(
        `${this.baseURL}/${this.modelName}:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 minute timeout
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const strategy = this.parseGeminiResponse(text);

      return {
        ...strategy,
        processingTime: Date.now() - start,
        status: 'success',
      };
    } catch (error) {
      console.error('❌ Gemini Strategy Generation Error:', error.response?.data || error.message);
      throw new Error(`Strategy generation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

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
      externalLinks,
    } = scrapedData || {};

    return `Analyze this webpage for SEO and AEO (Answer Engine Optimization).

URL: ${url}
Title: ${metaTitle || 'Missing'}
Description: ${metaDescription || 'Missing'}
H1: ${headings?.h1?.join(', ') || 'None'}
H2: ${headings?.h2?.slice(0, 3).join(', ') || 'None'}
Content: ${(bodyContent || '').slice(0, 500)}...
Images: ${Array.isArray(images) ? images.length : 0}
Links: ${internalLinks || 0} internal, ${externalLinks || 0} external
Schema: ${structuredData ? 'Yes' : 'No'}

Return ONLY valid JSON (no markdown):
{
  "seoScore": 0-100,
  "aeoScore": 0-100,
  "overallScore": 0-100,
  "recommendations": [{"priority": "high/medium/low", "category": "meta-tags/content/technical", "title": "...", "description": "...", "impact": "...", "codeSnippet": "..."}],
  "strengths": ["..."],
  "issues": [{"severity": "critical/warning/info", "category": "...", "message": "...", "fix": "..."}],
  "seoMetrics": {"titleLength": 0, "descriptionLength": 0, "hasH1": true/false, "headingHierarchy": "valid/invalid", "keywordDensity": 0, "readabilityScore": 0, "mobileResponsive": true/false, "hasStructuredData": true/false},
  "aeoMetrics": {"hasSchemaMarkup": true/false, "hasFAQs": true/false, "hasEntityMarkup": true/false, "citationReadiness": 0-100, "answerBoxPotential": 0-100, "aiSearchOptimized": true/false}
}`;
  }

  buildStrategyPrompt(manualData) {
    const { title, description, keywords, content } = manualData || {};

    return `You are an expert SEO and AEO strategist. Create an optimization strategy for this content.

CONTENT DATA:
Title: ${title || 'Not provided'}
Description: ${description || 'Not provided'}
Keywords: ${Array.isArray(keywords) ? keywords.join(', ') : keywords || 'Not provided'}
Content: ${(content || '').slice(0, 1500)}...

STRATEGY REQUIREMENTS:
Use the same JSON schema as the SEO analysis (seoScore, aeoScore, overallScore, recommendations, strengths, issues, seoMetrics, aeoMetrics).
Focus on actionable, implementable steps and schema markup examples.

Return ONLY valid JSON (no markdown fences).`;
  }

  /**
   * Parse & validate JSON from Gemini
   */
  parseGeminiResponse(text) {
    try {
      let clean = (text || '').trim();

      // Strip code fences if model added them
      if (clean.startsWith('```')) {
        clean = clean.replace(/^```json?\s*/i, '').replace(/```$/i, '').trim();
      }

      const parsed = JSON.parse(clean);

      // ✅ Use `=== undefined` so 0 is allowed
      const requiredMissing =
        parsed.seoScore === undefined ||
        parsed.aeoScore === undefined ||
        parsed.recommendations === undefined;

      if (requiredMissing) {
        throw new Error('Invalid response format: missing required fields');
      }

      return parsed;
    } catch (err) {
      console.error('❌ JSON Parsing Error:', err?.message);
      console.error('Raw response:\n', text);

      return {
        seoScore: 0,
        aeoScore: 0,
        overallScore: 0,
        recommendations: [
          {
            priority: 'high',
            category: 'error',
            title: 'Analysis Failed',
            description:
              'Could not parse AI response. Please retry the analysis or refine the prompt.',
            impact: 'N/A',
            codeSnippet: '',
          },
        ],
        strengths: [],
        issues: [
          {
            severity: 'critical',
            category: 'error',
            message: 'AI response parsing failed',
            fix: 'Retry or check server logs for raw response',
          },
        ],
        seoMetrics: {},
        aeoMetrics: {},
        error: err?.message || 'Parse error',
      };
    }
  }

  /**
   * Parse code generation response from Gemini
   */
  parseCodeResponse(text) {
    try {
      let clean = (text || '').trim();

      // Strip markdown code fences
      if (clean.startsWith('```')) {
        clean = clean.replace(/^```json?\s*/i, '').replace(/```$/i, '').trim();
      }

      const parsed = JSON.parse(clean);

      // Return the code package with defaults for missing fields
      return {
        htmlMeta: parsed.htmlMeta || '<!-- No HTML meta tags generated -->',
        jsonLd: parsed.jsonLd || '<!-- No JSON-LD generated -->',
        nextjsMetadata: parsed.nextjsMetadata || '// No Next.js metadata generated',
        wordpressCode: parsed.wordpressCode || '<?php\n// No WordPress code generated\n?>',
        imageAlts: Array.isArray(parsed.imageAlts) ? parsed.imageAlts : []
      };
    } catch (err) {
      console.error('❌ Code Parsing Error:', err?.message);
      console.error('Raw code response:\n', text);

      // Return fallback structure
      return {
        htmlMeta: `<!-- Error parsing code: ${err.message} -->\n<!-- Raw response logged to console -->`,
        jsonLd: '<!-- JSON-LD generation failed -->',
        nextjsMetadata: '// Code generation failed',
        wordpressCode: '<?php\n// Code generation failed\n?>',
        imageAlts: []
      };
    }
  }
}

// Export singleton instance
const geminiService = new GeminiService();
export default geminiService;
