import { useState } from 'react';
import { Copy, Download, Code2, FileCode, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface CodePreviewProps {
  codePackage: {
    htmlMeta: string;
    jsonLd: string;
    nextjsMetadata: string;
    wordpressCode: string;
    imageAlts?: Array<{
      currentSrc: string;
      newAlt: string;
      htmlSnippet: string;
    }>;
  };
  url: string;
}

export default function CodePreview({ codePackage, url }: CodePreviewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('html');

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: '✅ Copied!',
      description: `${label} code copied to clipboard`,
    });
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: '⬇️ Downloaded!',
      description: `${filename} downloaded successfully`,
    });
  };

  const downloadAll = () => {
    // Create a simple text bundle of all code
    const bundle = `
===========================================
SiteSage AI Agent - Generated Code Package
URL: ${url}
Generated: ${new Date().toLocaleString()}
===========================================

1. HTML META TAGS (paste in <head>)
======================================
${codePackage.htmlMeta}


2. SCHEMA.ORG JSON-LD (paste before </body>)
============================================
${codePackage.jsonLd}


3. NEXT.JS METADATA (for app/layout.tsx)
=========================================
${codePackage.nextjsMetadata}


4. WORDPRESS CODE (add to functions.php)
=========================================
${codePackage.wordpressCode}


${codePackage.imageAlts && codePackage.imageAlts.length > 0 ? `
5. IMAGE ALT TAGS
=================
${codePackage.imageAlts.map(img => `
// ${img.currentSrc}
${img.htmlSnippet}
`).join('\n')}
` : ''}

===========================================
Implementation Guide:
1. Choose the format that matches your platform
2. Copy the relevant code section
3. Paste into your website files
4. Test changes locally before deploying
5. Monitor SEO improvements over 2-4 weeks

Questions? Visit: https://sitesage.ai/docs
===========================================
`;

    downloadCode(bundle, 'sitesage-ai-code-package.txt');
  };

  const CodeBlock = ({ code, language }: { code: string; language: string }) => (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm font-mono">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(code, language.toUpperCase())}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
    </div>
  );

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🤖 AI Agent Generated Code
            </h2>
            <p className="text-sm text-gray-600">Production-ready code to implement SEO fixes</p>
          </div>
        </div>
        <Button
          onClick={downloadAll}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Code Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
          <TabsTrigger value="html" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <span className="hidden sm:inline">HTML</span>
          </TabsTrigger>
          <TabsTrigger value="nextjs" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Next.js</span>
          </TabsTrigger>
          <TabsTrigger value="wordpress" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <span className="hidden sm:inline">WordPress</span>
          </TabsTrigger>
          <TabsTrigger value="jsonld" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">JSON-LD</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="space-y-4 mt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">HTML Meta Tags</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadCode(codePackage.htmlMeta, 'meta-tags.html')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <p className="text-sm text-gray-600">Paste this in your {'<head>'} section</p>
            <CodeBlock code={codePackage.htmlMeta} language="html" />
          </div>
        </TabsContent>

        <TabsContent value="nextjs" className="space-y-4 mt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Next.js Metadata</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadCode(codePackage.nextjsMetadata, 'metadata.ts')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <p className="text-sm text-gray-600">Add to app/layout.tsx or page.tsx</p>
            <CodeBlock code={codePackage.nextjsMetadata} language="typescript" />
          </div>
        </TabsContent>

        <TabsContent value="wordpress" className="space-y-4 mt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">WordPress PHP Code</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadCode(codePackage.wordpressCode, 'functions.php')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <p className="text-sm text-gray-600">Add to your theme's functions.php</p>
            <CodeBlock code={codePackage.wordpressCode} language="php" />
          </div>
        </TabsContent>

        <TabsContent value="jsonld" className="space-y-4 mt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Schema.org JSON-LD</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadCode(codePackage.jsonLd, 'schema-jsonld.html')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <p className="text-sm text-gray-600">Paste before {'</body>'} tag for structured data</p>
            <CodeBlock code={codePackage.jsonLd} language="html" />
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Alts Section (if available) */}
      {codePackage.imageAlts && codePackage.imageAlts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Image Alt Tag Improvements</h3>
          <div className="grid gap-3">
            {codePackage.imageAlts.map((img, index) => (
              <Card key={index} className="p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-mono text-gray-600">{img.currentSrc}</p>
                    <p className="text-sm font-semibold text-purple-600">{img.newAlt}</p>
                    <CodeBlock code={img.htmlSnippet} language="html" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Guide */}
      <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          Quick Implementation Guide
        </h3>
        <ol className="space-y-2 text-sm list-decimal list-inside text-gray-700">
          <li>Choose the code format that matches your platform (HTML, Next.js, or WordPress)</li>
          <li>Click "Copy" or "Download" to get the code</li>
          <li>Paste the code into the appropriate file in your website</li>
          <li>Test changes locally before deploying to production</li>
          <li>Monitor SEO improvements over the next 2-4 weeks</li>
        </ol>
        <p className="text-xs text-gray-600 mt-4">
          💡 <strong>Tip:</strong> Start with HTML meta tags for immediate SEO impact, then add JSON-LD for enhanced search visibility.
        </p>
      </Card>
    </Card>
  );
}
