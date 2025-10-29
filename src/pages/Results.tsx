import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Copy, FileDown, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <Card className="mb-8 card-hover">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your SEO Analysis is Ready!</h1>
            <p className="text-xl text-muted-foreground mb-6">Comprehensive insights and recommendations</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="btn-gradient">
                <FileDown className="mr-2" size={18} />
                Export PDF
              </Button>
              <Button variant="outline">
                <Copy className="mr-2" size={18} />
                Copy Report
              </Button>
              <Link to="/dashboard">
                <Button variant="outline">
                  <RefreshCw className="mr-2" size={18} />
                  New Audit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-5xl mx-auto space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="card-hover">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  {expandedSections.includes(index) ? <ChevronUp /> : <ChevronDown />}
                </div>
              </CardHeader>
              {expandedSections.includes(index) && (
                <CardContent className="pt-0 animate-fade-in">
                  <div className="border-t pt-6">
                    {section.content}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Section 1: SEO Score
const SEOScoreContent = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
        <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-r-transparent" style={{ transform: 'rotate(260deg)' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold gradient-text">72</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-1">Overall SEO Score</h3>
      <Badge className="bg-yellow-100 text-yellow-800">Good - Needs Improvement</Badge>
    </div>

    <div className="space-y-4">
      <h4 className="font-semibold text-lg">Breakdown:</h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Technical SEO</span>
            <span className="text-sm font-bold text-primary">85/100</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Content Quality</span>
            <span className="text-sm font-bold">65/100</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Keyword Usage</span>
            <span className="text-sm font-bold">78/100</span>
          </div>
          <Progress value={78} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Mobile Friendly</span>
            <span className="text-sm font-bold text-red-500">45/100 (Critical!)</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>
      </div>
    </div>

    <div className="bg-primary/10 border border-primary rounded-lg p-4">
      <p className="font-semibold">🎯 Top Priority: Improve mobile responsiveness</p>
    </div>
  </div>
);

// Section 2: Keyword Strategy
const KeywordStrategyContent = () => {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Primary Keyword</h4>
        <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-semibold">organic skincare serum</span>
            <Button size="sm" variant="ghost" onClick={() => toast({ title: "Copied!" })}>
              <Copy size={16} />
            </Button>
          </div>
          <div className="flex gap-3 text-sm">
            <Badge variant="secondary">Search Volume: 12,000/mo</Badge>
            <Badge variant="secondary">Difficulty: Medium</Badge>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">LSI Keywords (Latent Semantic Indexing)</h4>
        <ul className="space-y-2">
          {['natural face serum', 'anti-aging serum organic', 'vitamin C serum natural', 'organic facial treatment'].map((kw, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{kw}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Long-Tail Keywords (High Conversion)</h4>
        <ul className="space-y-2">
          {[
            'best organic anti-aging serum for sensitive skin',
            'affordable natural face serum for wrinkles',
            'organic vitamin C serum for dark spots'
          ].map((kw, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-sm">{kw}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm"><strong>Keyword Density Recommendation:</strong> 1.5-2.5%</p>
        <p className="text-sm">Use primary keyword 5-8 times per 1000 words</p>
      </div>
    </div>
  );
};

// Section 3: Meta Tags
const MetaTagsContent = () => {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Check className="text-success" size={20} />
          <h4 className="font-semibold">Optimized Meta Title</h4>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-2">
          <p className="font-medium">Organic Skincare Serum | Natural Anti-Aging Face Treatment - GlowSkin</p>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-success flex items-center gap-1">
            <Check size={16} /> Length: 58 chars (Optimal: 50-60)
          </span>
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Copied to clipboard!" })}>
            <Copy size={14} className="mr-1" /> Copy
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Check className="text-success" size={20} />
          <h4 className="font-semibold">Optimized Meta Description</h4>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-2">
          <p>Discover our premium organic skincare serum with natural ingredients. Anti-aging, hydrating, and perfect for sensitive skin. Shop now for radiant, youthful skin.</p>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-success flex items-center gap-1">
            <Check size={16} /> Length: 155 chars (Optimal: 150-160)
          </span>
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Copied to clipboard!" })}>
            <Copy size={14} className="mr-1" /> Copy
          </Button>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">🏷️ Suggested H1 Tag</h4>
        <p className="text-lg">"Transform Your Skin with Organic Serum"</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">🏷️ Suggested H2 Tags</h4>
        <ul className="space-y-1">
          {[
            'Why Choose Organic Skincare Serum?',
            'Key Ingredients & Benefits',
            'How to Use Our Natural Face Serum'
          ].map((h2, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{h2}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Section 4: Content Recommendations
const ContentRecommendationsContent = () => (
  <div className="space-y-6">
    <div>
      <h4 className="font-semibold mb-3">Homepage Content Structure</h4>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-4">
          <h5 className="font-medium mb-2">1. Hero Section (Above Fold)</h5>
          <ul className="space-y-1 text-sm">
            <li>• Main headline with primary keyword</li>
            <li>• Clear CTA button</li>
            <li>• Trust signals (testimonials, certifications)</li>
          </ul>
        </div>
        <div className="border-l-4 border-primary pl-4">
          <h5 className="font-medium mb-2">2. Product Benefits Section</h5>
          <ul className="space-y-1 text-sm">
            <li>• 3-5 key benefits with icons</li>
            <li>• Use LSI keywords naturally</li>
          </ul>
        </div>
        <div className="border-l-4 border-primary pl-4">
          <h5 className="font-medium mb-2">3. How It Works / Usage Guide</h5>
          <ul className="space-y-1 text-sm">
            <li>• Step-by-step instructions</li>
            <li>• Include long-tail keywords</li>
          </ul>
        </div>
        <div className="border-l-4 border-primary pl-4">
          <h5 className="font-medium mb-2">4. Social Proof</h5>
          <ul className="space-y-1 text-sm">
            <li>• Customer reviews (schema markup)</li>
            <li>• Before/after images</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-muted p-4 rounded-lg space-y-2">
      <p className="text-sm"><strong>Recommended Word Count:</strong> 800-1200 words</p>
      <p className="text-sm"><strong>Reading Level:</strong> 8th grade (accessible)</p>
      <p className="text-sm"><strong>Internal Links:</strong> Add 3-5 relevant product links</p>
    </div>
  </div>
);

// Section 5: Technical SEO
const TechnicalSEOContent = () => (
  <div className="space-y-6">
    <div>
      <h4 className="font-semibold text-red-600 mb-3">❌ Critical Issues (Fix Immediately)</h4>
      <div className="space-y-4">
        <div className="border-l-4 border-red-500 pl-4">
          <h5 className="font-medium mb-2">1. Mobile Responsiveness</h5>
          <p className="text-sm text-muted-foreground mb-2">Current Score: 45/100</p>
          <ul className="space-y-1 text-sm">
            <li>→ Use responsive design framework</li>
            <li>→ Test on mobile devices</li>
          </ul>
        </div>
        <div className="border-l-4 border-red-500 pl-4">
          <h5 className="font-medium mb-2">2. Page Load Speed</h5>
          <p className="text-sm text-muted-foreground mb-2">Current: 4.2s (Too slow!)</p>
          <ul className="space-y-1 text-sm">
            <li>→ Optimize images (use WebP format)</li>
            <li>→ Enable browser caching</li>
            <li>→ Minify CSS/JS files</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-yellow-600 mb-3">⚠️ Warnings (Address Soon)</h4>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-yellow-600 mt-1">•</span>
          <span>Missing alt tags on 7 images</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-600 mt-1">•</span>
          <span>No structured data (schema.org markup)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-600 mt-1">•</span>
          <span>Broken internal link found (1)</span>
        </li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold text-success mb-3">✅ Doing Well</h4>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-success mt-1">•</span>
          <span>SSL certificate active</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-success mt-1">•</span>
          <span>Clean URL structure</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-success mt-1">•</span>
          <span>Sitemap.xml present</span>
        </li>
      </ul>
    </div>
  </div>
);

// Section 6: Blog Ideas
const BlogIdeasContent = () => (
  <div className="space-y-6">
    {[
      {
        title: "10 Benefits of Organic Skincare Serum",
        keyword: "natural face serum benefits",
        wordCount: "1500-2000",
        reason: "High search volume, low competition"
      },
      {
        title: "How to Choose the Best Anti-Aging Serum",
        keyword: "best anti-aging serum",
        wordCount: "2000-2500",
        reason: "Buyer intent keyword, high conversion potential"
      },
      {
        title: "Organic vs Synthetic Skincare: The Truth",
        keyword: "organic skincare comparison",
        wordCount: "1200-1800",
        reason: "Educational content builds authority"
      }
    ].map((blog, i) => (
      <div key={i} className="border rounded-lg p-4 card-hover">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">📝</span>
          <div className="flex-1">
            <h5 className="font-semibold text-lg mb-2">{blog.title}</h5>
            <div className="space-y-1 text-sm">
              <p><strong>Target Keyword:</strong> {blog.keyword}</p>
              <p><strong>Word Count:</strong> {blog.wordCount}</p>
              <p><strong>Why:</strong> {blog.reason}</p>
            </div>
          </div>
        </div>
      </div>
    ))}

    <div className="bg-muted p-4 rounded-lg">
      <h5 className="font-semibold mb-2">Content Calendar Suggestion:</h5>
      <ul className="space-y-1 text-sm">
        <li>• Week 1: Publish Post #1</li>
        <li>• Week 3: Publish Post #2</li>
        <li>• Week 5: Publish Post #3</li>
        <li>• Frequency: 1-2 posts per week for best results</li>
      </ul>
    </div>
  </div>
);

// Section 7: Link Building
const LinkBuildingContent = () => (
  <div className="space-y-6">
    <div>
      <h4 className="font-semibold mb-3">Internal Linking Opportunities</h4>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span>Link "serum" to product page</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span>Link "skincare routine" to blog category</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span>Create pillar page: "Complete Skincare Guide"</span>
        </li>
      </ul>
    </div>

    <div>
      <h4 className="font-semibold mb-3">External Link Suggestions (Outreach)</h4>
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-4">
          <h5 className="font-medium mb-1">1. Beauty blogs (Domain Authority 40+)</h5>
          <p className="text-sm text-muted-foreground">Example: beautyblogger.com/guest-posts</p>
        </div>
        <div className="border-l-4 border-primary pl-4">
          <h5 className="font-medium mb-1">2. Skincare forums & communities</h5>
          <p className="text-sm text-muted-foreground">Participate with value-add comments</p>
        </div>
        <div className="border-l-4 border-primary pl-4">
          <h5 className="font-medium mb-1">3. Influencer collaborations</h5>
          <p className="text-sm text-muted-foreground">Partner with micro-influencers (10K-50K)</p>
        </div>
      </div>
    </div>

    <div className="bg-muted p-4 rounded-lg">
      <p className="text-sm font-semibold">Backlink Goal: 5-10 quality backlinks/month</p>
    </div>
  </div>
);

const sections = [
  {
    icon: "📊",
    title: "SEO Score & Overview",
    description: "Overall performance and key metrics",
    content: <SEOScoreContent />
  },
  {
    icon: "🔑",
    title: "Keyword Strategy",
    description: "Primary, LSI, and long-tail keywords",
    content: <KeywordStrategyContent />
  },
  {
    icon: "📝",
    title: "Meta Tags Optimization",
    description: "Optimized titles and descriptions",
    content: <MetaTagsContent />
  },
  {
    icon: "📖",
    title: "Content Recommendations",
    description: "Structure and content suggestions",
    content: <ContentRecommendationsContent />
  },
  {
    icon: "🚀",
    title: "Technical SEO Improvements",
    description: "Critical issues and fixes",
    content: <TechnicalSEOContent />
  },
  {
    icon: "💡",
    title: "Blog Content Ideas",
    description: "SEO-optimized blog post suggestions",
    content: <BlogIdeasContent />
  },
  {
    icon: "🔗",
    title: "Link Building Strategy",
    description: "Internal and external linking opportunities",
    content: <LinkBuildingContent />
  }
];

export default Results;
