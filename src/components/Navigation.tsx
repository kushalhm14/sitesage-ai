import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isLandingPage = location.pathname === "/";

  if (!isLandingPage) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="gradient-text">SiteSage AI</span>
            </Link>
            {location.pathname === "/dashboard" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">John Doe</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                  JD
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="gradient-text">SiteSage AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <Link to="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="btn-gradient">
                Get Started →
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                How It Works
              </a>
              <Link to="/login">
                <Button variant="outline" className="w-full border-primary text-primary">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full btn-gradient">
                  Get Started →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
