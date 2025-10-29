import express from 'express';
import Analysis from '../models/Analysis.js';
import geminiService from '../services/geminiService.js';
import webScraperService from '../services/webScraper.js';
import { authenticateToken, checkAnalysisQuota } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/analysis/analyze-url
 * Analyze a website URL
 */
router.post('/analyze-url', authenticateToken, checkAnalysisQuota, async (req, res) => {
  try {
    const { url } = req.body;
    const startTime = Date.now();

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a URL to analyze'
      });
    }

    console.log(`🔍 Analyzing URL: ${url} for user ${req.user.email}`);

    // Step 1: Scrape the website
    const scrapedContent = await webScraperService.scrapeURL(url);

    // Step 2: Analyze with Gemini AI
    const aiAnalysis = await geminiService.analyzeSEO(scrapedContent, url);

    // Step 3: Create analysis record
    const analysis = await Analysis.create({
      userId: req.user._id,
      type: 'url',
      input: { url },
      scrapedContent,
      results: {
        seoScore: aiAnalysis.seoScore,
        aeoScore: aiAnalysis.aeoScore,
        overallScore: aiAnalysis.overallScore,
        recommendations: aiAnalysis.recommendations,
        strengths: aiAnalysis.strengths,
        issues: aiAnalysis.issues,
        seoMetrics: aiAnalysis.seoMetrics,
        aeoMetrics: aiAnalysis.aeoMetrics
      },
      geminiResponse: aiAnalysis,
      processingTime: Date.now() - startTime,
      status: 'completed'
    });

    // Step 4: Decrement user's analysis quota
    req.user.decrementAnalysis();
    await req.user.save();

    console.log(`✅ Analysis completed in ${analysis.processingTime}ms`);

    res.status(200).json({
      success: true,
      message: 'URL analyzed successfully',
      analysis: {
        id: analysis._id,
        type: analysis.type,
        url: analysis.input.url,
        results: analysis.results,
        processingTime: analysis.processingTime,
        createdAt: analysis.createdAt
      },
      quota: {
        remaining: req.user.subscription.analysesRemaining,
        plan: req.user.subscription.plan
      }
    });

  } catch (error) {
    console.error('❌ URL Analysis Error:', error.message);

    // Save failed analysis
    try {
      await Analysis.create({
        userId: req.user._id,
        type: 'url',
        input: { url: req.body.url },
        status: 'failed',
        error: error.message
      });
    } catch (dbError) {
      console.error('Failed to save error analysis:', dbError);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze URL',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/analysis/generate-strategy
 * Generate SEO strategy from manual input
 */
router.post('/generate-strategy', authenticateToken, checkAnalysisQuota, async (req, res) => {
  try {
    const { title, description, keywords, content } = req.body;
    const startTime = Date.now();

    // Validate input
    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a title or content'
      });
    }

    console.log(`📝 Generating strategy for user ${req.user.email}`);

    // Generate strategy with Gemini AI
    const aiStrategy = await geminiService.generateStrategy({
      title,
      description,
      keywords,
      content
    });

    // Create analysis record
    const analysis = await Analysis.create({
      userId: req.user._id,
      type: 'manual',
      input: { title, description, keywords, content },
      results: {
        seoScore: aiStrategy.seoScore,
        aeoScore: aiStrategy.aeoScore,
        overallScore: aiStrategy.overallScore,
        recommendations: aiStrategy.recommendations,
        strengths: aiStrategy.strengths,
        issues: aiStrategy.issues,
        seoMetrics: aiStrategy.seoMetrics,
        aeoMetrics: aiStrategy.aeoMetrics
      },
      geminiResponse: aiStrategy,
      processingTime: Date.now() - startTime,
      status: 'completed'
    });

    // Decrement user's analysis quota
    req.user.decrementAnalysis();
    await req.user.save();

    console.log(`✅ Strategy generated in ${analysis.processingTime}ms`);

    res.status(200).json({
      success: true,
      message: 'Strategy generated successfully',
      analysis: {
        id: analysis._id,
        type: analysis.type,
        results: analysis.results,
        processingTime: analysis.processingTime,
        createdAt: analysis.createdAt
      },
      quota: {
        remaining: req.user.subscription.analysesRemaining,
        plan: req.user.subscription.plan
      }
    });

  } catch (error) {
    console.error('❌ Strategy Generation Error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate strategy',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/analysis/history
 * Get user's analysis history
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-geminiResponse -scrapedContent.bodyContent');

    const total = await Analysis.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      analyses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ History Fetch Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis history'
    });
  }
});

/**
 * GET /api/analysis/:id
 * Get specific analysis by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('❌ Analysis Fetch Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis'
    });
  }
});

/**
 * DELETE /api/analysis/:id
 * Delete an analysis
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('❌ Analysis Delete Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete analysis'
    });
  }
});

export default router;
