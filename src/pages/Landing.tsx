import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Website's SEO in Seconds with AI
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Get instant SEO audits, keyword strategies, and content recommendations powered by advanced AI — no expertise required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8">
                    🚀 Start Free Audit
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8">
                    📖 See How It Works
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-white/80 text-sm">Audits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-white/80 text-sm">SEO Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">&lt;60 sec</div>
                  <div className="text-white/80 text-sm">Analysis</div>
                </div>
              </div>
            </div>
            <Card className="p-8 card-hover bg-white/95 backdrop-blur">
              <div className="text-center space-y-4">
                <div className="text-6xl">📊</div>
                <h3 className="text-2xl font-bold gradient-text">Instant SEO Intelligence</h3>
                <p className="text-muted-foreground">
                  URL analysis or manual input - your choice
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SiteSage AI Works</h2>
            <p className="text-xl text-muted-foreground">Two powerful modes to optimize your SEO strategy</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <CardTitle>Choose Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  URL analysis or manual details - pick the method that works best for you
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <CardTitle>AI Analyzes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Claude extracts content and generates comprehensive SEO strategy in seconds
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <CardTitle>Get Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  SEO audit, keywords, meta tags, blog ideas - everything you need to rank
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dual Modes Feature */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Two Ways to Optimize Your SEO</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all duration-300 card-hover">
              <CardHeader>
                <div className="text-5xl mb-4">🔗</div>
                <CardTitle className="text-2xl">Mode 1: URL Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Paste your website URL</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>AI fetches page content</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Instant SEO audit</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Keyword gap analysis</span>
                </div>
                <Link to="/dashboard" className="block pt-4">
                  <Button className="w-full btn-gradient">Try URL Mode →</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 card-hover">
              <CardHeader>
                <div className="text-5xl mb-4">✍️</div>
                <CardTitle className="text-2xl">Mode 2: Manual Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Enter business details</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Define target keywords</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Get SEO strategy from scratch</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Perfect for new websites</span>
                </div>
                <Link to="/dashboard" className="block pt-4">
                  <Button className="w-full btn-gradient">Try Manual Mode →</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Businesses Choose SiteSage AI</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`${plan.popular ? 'border-2 border-primary shadow-xl scale-105' : ''} card-hover relative`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white">
                    MOST POPULAR
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="text-success mt-0.5" size={18} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <Link to="/signup" className="block pt-4">
                    <Button className={`w-full ${plan.popular ? 'btn-gradient' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const features = [
  {
    icon: "⚡",
    title: "Instant SEO Audit",
    description: "Get comprehensive SEO analysis in under 60 seconds"
  },
  {
    icon: "🎯",
    title: "Keyword Strategy",
    description: "Primary, LSI, and long-tail keyword recommendations"
  },
  {
    icon: "📝",
    title: "Meta Tag Generator",
    description: "AI-crafted title tags and meta descriptions that convert"
  },
  {
    icon: "📊",
    title: "Content Suggestions",
    description: "Blog topics and content ideas tailored to your niche"
  },
  {
    icon: "🔍",
    title: "Competitor Insights",
    description: "See what your competitors are ranking for"
  },
  {
    icon: "🚀",
    title: "Performance Tips",
    description: "Page speed, mobile optimization, and UX improvements"
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: 0,
    popular: false,
    cta: "Start Free",
    features: [
      "5 audits/month",
      "Basic SEO analysis",
      "Manual mode access",
      "Email support"
    ]
  },
  {
    name: "Professional",
    price: 29,
    popular: true,
    cta: "Get Started",
    features: [
      "50 audits/month",
      "Advanced SEO analysis",
      "Both URL & Manual modes",
      "Blog content ideas",
      "Priority support",
      "PDF export"
    ]
  },
  {
    name: "Enterprise",
    price: 99,
    popular: false,
    cta: "Contact Us",
    features: [
      "Unlimited audits",
      "API access",
      "Priority AI processing",
      "White-label reports",
      "Dedicated support",
      "Custom integrations"
    ]
  }
];

export default Landing;
