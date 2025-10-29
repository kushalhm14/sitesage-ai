import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Copy, FileDown, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [keyword, setKeyword] = useState("");

  // Get real data from navigation state
  useEffect(() => {
    const state = location.state as any;
    if (!state || !state.data) {
      toast({
        title: "No analysis data",
        description: "Please run an analysis first",
        variant: "destructive"
      });
      navigate("/dashboard");
      return;
    }

    console.log("📊 Analysis Data Received:", state.data);
    setAnalysisData(state.data);
    setKeyword(state.keyword || "");
  }, [location, navigate, toast]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "✅ Copied!", description: "Text copied to clipboard" });
  };

  // Show loading while data is being fetched
  if (!analysisData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your AI analysis...</p>
        </div>
      </div>
    );
  }

  const results = analysisData.results || {};
  const sections = buildSections(results, keyword, copyToClipboard);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <Card className="mb-8 card-hover">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your AI SEO Analysis is Ready!</h1>
            <p className="text-xl text-muted-foreground mb-2">Powered by Google Gemini 1.5 Flash</p>
            {analysisData.url && (
              <p className="text-sm text-muted-foreground mb-2">📍 Analyzed: <strong>{analysisData.url}</strong></p>
            )}
            {analysisData.businessName && (
              <p className="text-sm text-muted-foreground mb-2">🏢 Business: <strong>{analysisData.businessName}</strong></p>
            )}
            {keyword && (
              <p className="text-sm text-muted-foreground mb-6">🔑 Target Keyword: <strong>{keyword}</strong></p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="outline" className="px-6 py-6">
                  <RefreshCw className="mr-2" size={18} />
                  New Analysis
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

        {/* RAW AI RESPONSE SECTION - Shows real Google Gemini output */}
        {analysisData.geminiResponse && (
          <Card className="mt-8 max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle>🧠 Full Google Gemini AI Response</CardTitle>
              <CardDescription>Complete analysis from Google's AI (unfiltered)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg max-h-96 overflow-y-auto relative group">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-white"
                  onClick={() => copyToClipboard(analysisData.geminiResponse)}
                >
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {analysisData.geminiResponse}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Helper function to build sections from REAL backend data
function buildSections(results: any, keyword: string, copyFn: (text: string) => void) {
  const sections = [];

  // Section 1: Scores - Use REAL scores from Gemini
  sections.push({
    icon: "📊",
    title: "SEO & AEO Scores",
    description: "AI-calculated performance metrics",
    content: <RealScoresContent results={results} />
  });

  // Section 2: Recommendations - Use REAL recommendations from Gemini
  if (results.recommendations && results.recommendations.length > 0) {
    sections.push({
      icon: "💡",
      title: "AI Recommendations",
      description: `${results.recommendations.length} actionable improvements from Google Gemini`,
      content: <RealRecommendationsContent recommendations={results.recommendations} copyFn={copyFn} />
    });
  }

  // Section 3: Keyword Strategy - Use REAL keywords from Gemini
  if (results.keywordStrategy || keyword) {
    sections.push({
      icon: "🔑",
      title: "Keyword Strategy",
      description: "AI-generated keyword insights",
      content: <RealKeywordStrategyContent data={results.keywordStrategy} keyword={keyword} />
    });
  }

  // Section 4: Meta Tags - Use REAL meta tags from Gemini
  if (results.metaTags) {
    sections.push({
      icon: "🏷️",
      title: "Optimized Meta Tags",
      description: "AI-written SEO tags",
      content: <RealMetaTagsContent data={results.metaTags} copyFn={copyFn} />
    });
  }

  // Section 5: Content Suggestions - Use REAL suggestions from Gemini
  if (results.contentSuggestions && results.contentSuggestions.length > 0) {
    sections.push({
      icon: "📝",
      title: "Content Strategy",
      description: `${results.contentSuggestions.length} AI-generated content ideas`,
      content: <RealContentSuggestionsContent data={results.contentSuggestions} />
    });
  }

  return sections;
}

// REAL Scores Component
const RealScoresContent = ({ results }: any) => {
  const seoScore = results.seoScore || 0;
  const aeoScore = results.aeoScore || 0;
  const overallScore = results.overallScore || Math.round((seoScore + aeoScore) / 2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard title="SEO Score" score={seoScore} color="from-blue-500 to-cyan-500" />
        <ScoreCard title="AEO Score" score={aeoScore} color="from-purple-500 to-pink-500" />
        <ScoreCard title="Overall Score" score={overallScore} color="from-green-500 to-emerald-500" />
      </div>
      <div className="text-sm text-muted-foreground text-center">
        ✨ Scores calculated by Google Gemini 1.5 Flash AI
      </div>
    </div>
  );
};

const ScoreCard = ({ title, score, color }: { title: string; score: number; color: string }) => (
  <div className="text-center p-6 bg-muted rounded-xl">
    <div className={`text-5xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
      {score}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <Progress value={score} className="h-2" />
  </div>
);

// REAL Recommendations Component
const RealRecommendationsContent = ({ recommendations, copyFn }: any) => {
  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  };

  return (
    <div className="space-y-4">
      {recommendations.map((rec: any, idx: number) => (
        <div key={idx} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h4 className="font-semibold text-lg">{rec.title}</h4>
                {rec.priority && (
                  <Badge className={priorityColors[rec.priority as keyof typeof priorityColors]}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                )}
                {rec.category && (
                  <Badge variant="outline">{rec.category}</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{rec.description}</p>
            </div>
          </div>
          {rec.code && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg relative group">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-white"
                onClick={() => copyFn(rec.code)}
              >
                <Copy size={16} />
              </Button>
              <pre className="text-sm overflow-x-auto">
                <code>{rec.code}</code>
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// REAL Keyword Strategy Component
const RealKeywordStrategyContent = ({ data, keyword }: any) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold mb-3 text-lg">Primary Keyword</h3>
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <span className="text-lg font-semibold">{data?.primary || keyword || "Not specified"}</span>
      </div>
    </div>

    {data?.lsi && data.lsi.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3 text-lg">LSI Keywords (Latent Semantic Indexing)</h3>
        <div className="flex flex-wrap gap-2">
          {data.lsi.map((kw: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="px-3 py-1">
              {kw}
            </Badge>
          ))}
        </div>
      </div>
    )}

    {data?.longTail && data.longTail.length > 0 && (
      <div>
        <h3 className="font-semibold mb-3 text-lg">Long-Tail Keywords (High Conversion)</h3>
        <ul className="space-y-2">
          {data.longTail.map((kw: string, idx: number) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-purple-500">▸</span>
              <span>{kw}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// REAL Meta Tags Component
const RealMetaTagsContent = ({ data, copyFn }: any) => {
  const metaTags = `<title>${data.title || ''}</title>
<meta name="description" content="${data.description || ''}" />
<meta property="og:title" content="${data.ogTitle || data.title || ''}" />
<meta property="og:description" content="${data.ogDescription || data.description || ''}" />`;

  return (
    <div className="space-y-4">
      {data.title && (
        <div>
          <div className="font-semibold mb-2">Title Tag ({data.title.length} characters)</div>
          <div className="bg-muted p-3 rounded mt-2">
            <p className="font-medium">{data.title}</p>
          </div>
        </div>
      )}

      {data.description && (
        <div>
          <div className="font-semibold mb-2">Meta Description ({data.description.length} characters)</div>
          <div className="bg-muted p-3 rounded mt-2">
            <p>{data.description}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-900 text-slate-100 p-4 rounded-lg relative group">
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-white"
          onClick={() => copyFn(metaTags)}
        >
          <Copy size={16} />
        </Button>
        <pre className="text-sm overflow-x-auto">
          <code>{metaTags}</code>
        </pre>
      </div>
    </div>
  );
};

// REAL Content Suggestions Component
const RealContentSuggestionsContent = ({ data }: any) => (
  <div className="space-y-4">
    {data.map((content: any, idx: number) => (
      <div key={idx} className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h4 className="font-semibold text-lg">{content.title}</h4>
          {content.type && <Badge variant="outline">{content.type}</Badge>}
          {content.keyword && (
            <Badge className="bg-purple-100 text-purple-800">{content.keyword}</Badge>
          )}
        </div>
        {content.outline && content.outline.length > 0 && (
          <ul className="space-y-1 mt-3">
            {content.outline.map((point: string, pidx: number) => (
              <li key={pidx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);

export default Results;
