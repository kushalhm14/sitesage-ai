import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { analysisAPI } from "@/lib/api";

const Dashboard = () => {
  const [mode, setMode] = useState<"url" | "manual">("url");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // URL Mode State
  const [url, setUrl] = useState("");
  const [urlKeyword, setUrlKeyword] = useState("");
  const [urlIndustry, setUrlIndustry] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [technicalSEO, setTechnicalSEO] = useState(true);
  const [content, setContent] = useState(true);
  const [keywords, setKeywords] = useState(true);
  const [ux, setUx] = useState(true);

  // Manual Mode State
  const [businessName, setBusinessName] = useState("");
  const [manualIndustry, setManualIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [manualKeyword, setManualKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [geographic, setGeographic] = useState("");
  const [blogStrategy, setBlogStrategy] = useState(true);
  const [metaTags, setMetaTags] = useState(true);
  const [landingPages, setLandingPages] = useState(false);
  const [socialMedia, setSocialMedia] = useState(false);
  const [productDesc, setProductDesc] = useState(false);

  const handleUrlAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !urlKeyword) {
      toast({
        title: "Missing fields",
        description: "Please fill in URL and primary keyword",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    toast({
      title: "🧠 AI is analyzing...",
      description: "Google Gemini is analyzing your website. This may take 30-60 seconds",
    });

    try {
      const result = await analysisAPI.analyzeURL({
        url,
        keyword: urlKeyword,
        industry: urlIndustry || undefined,
        competitor: competitor || undefined,
        focus: {
          technicalSEO,
          content,
          keywords,
          ux
        }
      });

      setLoading(false);
      toast({
        title: "✅ Analysis Complete!",
        description: "Your SEO analysis is ready",
      });
      
      // Navigate to results with real data
      navigate("/results", { 
        state: { 
          mode: "url", 
          data: result.analysis,
          keyword: urlKeyword 
        } 
      });
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "❌ Analysis Failed",
        description: error.message || "Please ensure the backend server is running on port 5000",
        variant: "destructive"
      });
    }
  };

  const handleManualGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName || !manualIndustry || !description || !targetAudience || !manualKeyword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (description.length < 50) {
      toast({
        title: "Description too short",
        description: "Please provide at least 50 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    toast({
      title: "✨ Generating strategy...",
      description: "Google Gemini is creating your SEO strategy. This may take 30-60 seconds",
    });

    try {
      const result = await analysisAPI.generateStrategy({
        businessName,
        industry: manualIndustry,
        description,
        targetAudience,
        primaryKeyword: manualKeyword,
        secondaryKeywords: secondaryKeywords ? secondaryKeywords.split(',').map(k => k.trim()) : undefined,
        geographic: geographic || undefined,
        contentGoals: {
          blogStrategy,
          metaTags,
          landingPages,
          socialMedia,
          productDesc
        }
      });

      setLoading(false);
      toast({
        title: "✅ Strategy Generated!",
        description: "Your SEO strategy is ready",
      });
      
      // Navigate to results with real data
      navigate("/results", { 
        state: { 
          mode: "manual", 
          data: result.analysis,
          keyword: manualKeyword 
        } 
      });
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "❌ Generation Failed",
        description: error.message || "Please ensure the backend server is running on port 5000",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SEO Optimizer Dashboard</h1>
          <p className="text-xl text-muted-foreground">Choose your optimization method below</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "url" | "manual")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 mb-8">
              <TabsTrigger value="url" className="text-lg">
                🔗 URL Analysis Mode
              </TabsTrigger>
              <TabsTrigger value="manual" className="text-lg">
                ✍️ Manual Input Mode
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">🔗 Website URL Analysis</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                </div>

                <form onSubmit={handleUrlAnalysis} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-base font-semibold">
                      Website URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-12 border-2"
                      required
                    />
                    <p className="text-sm text-muted-foreground">Enter the full URL of the website to analyze</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urlKeyword" className="text-base font-semibold">
                      Primary Target Keyword <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="urlKeyword"
                      type="text"
                      placeholder="organic skincare serum"
                      value={urlKeyword}
                      onChange={(e) => setUrlKeyword(e.target.value)}
                      className="h-12 border-2"
                      maxLength={100}
                      required
                    />
                    <p className="text-sm text-muted-foreground">Main keyword you want to rank for</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urlIndustry" className="text-base font-semibold">
                      Industry/Niche (optional)
                    </Label>
                    <Select value={urlIndustry} onValueChange={setUrlIndustry}>
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue placeholder="Select Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="realestate">Real Estate</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="marketing">Marketing Agency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitor" className="text-base font-semibold">
                      Competitor URL (optional)
                    </Label>
                    <Input
                      id="competitor"
                      type="url"
                      placeholder="https://competitor.com"
                      value={competitor}
                      onChange={(e) => setCompetitor(e.target.value)}
                      className="h-12 border-2"
                    />
                    <p className="text-sm text-muted-foreground">Compare against a competitor</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Analysis Focus</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="technical" checked={technicalSEO} onCheckedChange={(c) => setTechnicalSEO(c as boolean)} />
                        <label htmlFor="technical" className="text-sm font-medium cursor-pointer">Technical SEO</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="content" checked={content} onCheckedChange={(c) => setContent(c as boolean)} />
                        <label htmlFor="content" className="text-sm font-medium cursor-pointer">Content</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="keywords" checked={keywords} onCheckedChange={(c) => setKeywords(c as boolean)} />
                        <label htmlFor="keywords" className="text-sm font-medium cursor-pointer">Keywords</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ux" checked={ux} onCheckedChange={(c) => setUx(c as boolean)} />
                        <label htmlFor="ux" className="text-sm font-medium cursor-pointer">UX</label>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 btn-gradient text-lg font-semibold" disabled={loading}>
                    {loading ? "Analyzing..." : "🔍 Analyze Website →"}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">✍️ Manual SEO Strategy Builder</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                </div>

                <form onSubmit={handleManualGeneration} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-base font-semibold">
                      Business/Project Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="GlowSkin Naturals"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-12 border-2"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manualIndustry" className="text-base font-semibold">
                      Industry/Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={manualIndustry} onValueChange={setManualIndustry} required>
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue placeholder="Select Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="realestate">Real Estate</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="marketing">Marketing Agency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-semibold">
                      Product/Service Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what you offer..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-32 border-2"
                      maxLength={500}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      {description.length}/500 characters (min 50 chars)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="text-base font-semibold">
                      Target Audience <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="targetAudience"
                      type="text"
                      placeholder="Small business owners aged 25-45"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="h-12 border-2"
                      maxLength={200}
                      required
                    />
                    <p className="text-sm text-muted-foreground">Who are your ideal customers?</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manualKeyword" className="text-base font-semibold">
                      Primary Target Keyword <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="manualKeyword"
                      type="text"
                      placeholder="organic skincare serum"
                      value={manualKeyword}
                      onChange={(e) => setManualKeyword(e.target.value)}
                      className="h-12 border-2"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryKeywords" className="text-base font-semibold">
                      Secondary Keywords (comma-separated)
                    </Label>
                    <Input
                      id="secondaryKeywords"
                      type="text"
                      placeholder="keyword1, keyword2, keyword3"
                      value={secondaryKeywords}
                      onChange={(e) => setSecondaryKeywords(e.target.value)}
                      className="h-12 border-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geographic" className="text-base font-semibold">
                      Geographic Target
                    </Label>
                    <Select value={geographic} onValueChange={setGeographic}>
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue placeholder="Select Country/Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Content Goals (check all that apply)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="blogStrategy" checked={blogStrategy} onCheckedChange={(c) => setBlogStrategy(c as boolean)} />
                        <label htmlFor="blogStrategy" className="text-sm font-medium cursor-pointer">Blog Strategy</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="metaTags" checked={metaTags} onCheckedChange={(c) => setMetaTags(c as boolean)} />
                        <label htmlFor="metaTags" className="text-sm font-medium cursor-pointer">Meta Tags</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="landingPages" checked={landingPages} onCheckedChange={(c) => setLandingPages(c as boolean)} />
                        <label htmlFor="landingPages" className="text-sm font-medium cursor-pointer">Landing Pages</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="socialMedia" checked={socialMedia} onCheckedChange={(c) => setSocialMedia(c as boolean)} />
                        <label htmlFor="socialMedia" className="text-sm font-medium cursor-pointer">Social Media</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="productDesc" checked={productDesc} onCheckedChange={(c) => setProductDesc(c as boolean)} />
                        <label htmlFor="productDesc" className="text-sm font-medium cursor-pointer">Product Descriptions</label>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 btn-gradient text-lg font-semibold" disabled={loading}>
                    {loading ? "Generating..." : "✨ Generate SEO Strategy →"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-12 text-center max-w-md">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold mb-2">Google Gemini AI is analyzing...</h3>
            <p className="text-muted-foreground">This may take 30-60 seconds. Real AI analysis in progress!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
