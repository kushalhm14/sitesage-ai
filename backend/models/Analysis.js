import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  type: {
    type: String,
    enum: ['url', 'manual'],
    required: true
  },
  
  // Input data
  input: {
    url: String, // For URL mode
    title: String, // For manual mode
    description: String, // For manual mode
    keywords: [String], // For manual mode
    content: String // For manual mode
  },
  
  // Scraped content (for URL mode)
  scrapedContent: {
    metaTitle: String,
    metaDescription: String,
    ogTags: mongoose.Schema.Types.Mixed,
    headings: {
      h1: [String],
      h2: [String],
      h3: [String],
      h4: [String],
      h5: [String],
      h6: [String]
    },
    bodyContent: String,
    structuredData: mongoose.Schema.Types.Mixed,
    images: [{
      src: String,
      alt: String
    }],
    internalLinks: Number,
    externalLinks: Number
  },
  
  // AI Analysis Results
  results: {
    // SEO Scores
    seoScore: {
      type: Number,
      min: 0,
      max: 100
    },
    aeoScore: {
      type: Number,
      min: 0,
      max: 100
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // Recommendations
    recommendations: [{
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      category: String,
      title: String,
      description: String,
      impact: String,
      codeSnippet: String
    }],
    
    // Strengths
    strengths: [String],
    
    // Issues/Weaknesses
    issues: [{
      severity: {
        type: String,
        enum: ['critical', 'warning', 'info']
      },
      category: String,
      message: String,
      fix: String
    }],
    
    // SEO Metrics
    seoMetrics: {
      titleLength: Number,
      descriptionLength: Number,
      hasH1: Boolean,
      headingHierarchy: String,
      keywordDensity: Number,
      readabilityScore: Number,
      mobileResponsive: Boolean,
      hasStructuredData: Boolean
    },
    
    // AEO Metrics
    aeoMetrics: {
      hasSchemaMarkup: Boolean,
      hasFAQs: Boolean,
      hasEntityMarkup: Boolean,
      citationReadiness: Number,
      answerBoxPotential: Number,
      aiSearchOptimized: Boolean
    }
  },
  
  // Raw Gemini Response (for debugging)
  geminiResponse: {
    type: mongoose.Schema.Types.Mixed,
    select: false // Don't include by default
  },
  
  // Performance metrics
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  
  error: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ 'results.overallScore': -1 });

// Virtual for analysis age
analysisSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to get summary
analysisSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.type,
    url: this.input.url || 'Manual Input',
    seoScore: this.results.seoScore,
    aeoScore: this.results.aeoScore,
    overallScore: this.results.overallScore,
    createdAt: this.createdAt,
    ageInDays: this.ageInDays
  };
};

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
