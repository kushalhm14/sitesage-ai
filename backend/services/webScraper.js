import axios from 'axios';
import * as cheerio from 'cheerio';
import validator from 'validator';

/**
 * Web Scraper Service
 * Extracts SEO-relevant data from any webpage
 */

class WebScraperService {
  constructor() {
    this.timeout = parseInt(process.env.SCRAPER_TIMEOUT_MS) || 10000;
    this.userAgent = process.env.SCRAPER_USER_AGENT || 
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }

  /**
   * Scrape and analyze a webpage
   * @param {string} url - URL to scrape
   * @returns {Promise<Object>} - Extracted webpage data
   */
  async scrapeURL(url) {
    try {
      // Validate URL
      if (!validator.isURL(url, { require_protocol: true })) {
        throw new Error('Invalid URL format');
      }

      console.log(`🔍 Scraping URL: ${url}`);

      // Fetch HTML
      const html = await this.fetchHTML(url);
      
      // Parse HTML with Cheerio
      const $ = cheerio.load(html);
      
      // Extract all SEO data
      const scrapedData = {
        metaTitle: this.extractMetaTitle($),
        metaDescription: this.extractMetaDescription($),
        ogTags: this.extractOGTags($),
        headings: this.extractHeadings($),
        bodyContent: this.extractBodyContent($),
        structuredData: this.extractStructuredData($),
        images: this.extractImages($),
        internalLinks: this.countInternalLinks($, url),
        externalLinks: this.countExternalLinks($, url)
      };

      console.log(`✅ Successfully scraped: ${url}`);
      
      return scrapedData;

    } catch (error) {
      console.error(`❌ Scraping failed for ${url}:`, error.message);
      throw new Error(`Failed to scrape URL: ${error.message}`);
    }
  }

  /**
   * Fetch HTML from URL
   */
  async fetchHTML(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 400
      });

      return response.data;

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - website took too long to respond');
      } else if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response from server - website may be down');
      } else {
        throw new Error(error.message);
      }
    }
  }

  /**
   * Extract meta title
   */
  extractMetaTitle($) {
    return $('title').first().text().trim() ||
           $('meta[property="og:title"]').attr('content') ||
           $('meta[name="twitter:title"]').attr('content') ||
           '';
  }

  /**
   * Extract meta description
   */
  extractMetaDescription($) {
    return $('meta[name="description"]').attr('content') ||
           $('meta[property="og:description"]').attr('content') ||
           $('meta[name="twitter:description"]').attr('content') ||
           '';
  }

  /**
   * Extract Open Graph tags
   */
  extractOGTags($) {
    const ogTags = {};
    
    $('meta[property^="og:"]').each((i, elem) => {
      const property = $(elem).attr('property').replace('og:', '');
      const content = $(elem).attr('content');
      if (property && content) {
        ogTags[property] = content;
      }
    });

    return Object.keys(ogTags).length > 0 ? ogTags : null;
  }

  /**
   * Extract all headings (H1-H6)
   */
  extractHeadings($) {
    const headings = {
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: []
    };

    for (let level = 1; level <= 6; level++) {
      $(`h${level}`).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text) {
          headings[`h${level}`].push(text);
        }
      });
    }

    return headings;
  }

  /**
   * Extract body content (text only, cleaned)
   */
  extractBodyContent($) {
    // Remove scripts, styles, and navigation
    $('script, style, nav, header, footer, iframe, noscript').remove();
    
    // Get main content
    const mainContent = $('main').text() || $('article').text() || $('body').text();
    
    // Clean up whitespace
    const cleaned = mainContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
    
    // Limit to first 5000 characters for AI processing
    return cleaned.substring(0, 5000);
  }

  /**
   * Extract structured data (JSON-LD)
   */
  extractStructuredData($) {
    const structuredData = [];
    
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const json = JSON.parse($(elem).html());
        structuredData.push(json);
      } catch (e) {
        // Invalid JSON, skip
      }
    });

    return structuredData.length > 0 ? structuredData : null;
  }

  /**
   * Extract images with alt tags
   */
  extractImages($) {
    const images = [];
    
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt') || '';
      
      if (src) {
        images.push({ src, alt });
      }
    });

    return images.slice(0, 20); // Limit to first 20 images
  }

  /**
   * Count internal links
   */
  countInternalLinks($, baseURL) {
    let count = 0;
    const baseDomain = new URL(baseURL).hostname;
    
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      
      try {
        if (href.startsWith('/') || href.includes(baseDomain)) {
          count++;
        }
      } catch (e) {
        // Invalid href, skip
      }
    });

    return count;
  }

  /**
   * Count external links
   */
  countExternalLinks($, baseURL) {
    let count = 0;
    const baseDomain = new URL(baseURL).hostname;
    
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      
      try {
        if (href.startsWith('http') && !href.includes(baseDomain)) {
          count++;
        }
      } catch (e) {
        // Invalid href, skip
      }
    });

    return count;
  }
}

// Export singleton instance
const webScraperService = new WebScraperService();
export default webScraperService;
