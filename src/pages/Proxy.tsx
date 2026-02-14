import { useState } from "react";
import { Globe, ArrowRight, Shield, X, Maximize2, Minimize2, ArrowLeft, RotateCw, Star, Plus, Bookmark } from "lucide-react";
import { useSettings, searchEngines } from "@/hooks/useSettings";

const Proxy = () => {
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [newBookmarkName, setNewBookmarkName] = useState("");
  const { settings, addBookmark, removeBookmark } = useSettings();

  const engine = searchEngines[settings.searchEngine] || searchEngines.google;

  const handleGo = (targetUrl?: string) => {
    let target = targetUrl || url;
    if (!target) return;
    if (!target.startsWith("http")) {
      // If it looks like a URL (has a dot), treat as URL, otherwise search
      if (target.includes(".")) {
        target = "https://" + target;
      } else {
        target = engine.searchUrl + encodeURIComponent(target);
      }
    }
    setCurrentUrl(target);
  };

  const closeProxy = () => {
    setCurrentUrl("");
    setIsFullscreen(false);
  };

  const handleAddBookmark = () => {
    if (newBookmarkName.trim() && currentUrl) {
      addBookmark({ name: newBookmarkName.trim(), url: currentUrl });
      setNewBookmarkName("");
      setShowBookmarkForm(false);
    }
  };

  // Active browsing mode
  if (currentUrl) {
    return (
      <div className={`${isFullscreen ? "fixed inset-0 z-[100]" : "min-h-screen py-4"}`}>
        <div className={`${isFullscreen ? "h-full flex flex-col" : "container mx-auto px-4 flex flex-col"}`}>
          {/* Toolbar */}
          <div className="glass-card rounded-t-xl px-3 py-2 flex items-center gap-2 border-b border-border/50">
            <button onClick={closeProxy} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Close">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentUrl(currentUrl + "?")} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Reload">
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGo()}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary border border-border font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Enter URL or search..."
              />
            </div>
            <button onClick={() => handleGo()} className="p-1.5 rounded-lg bg-primary text-primary-foreground transition-all" title="Go">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowBookmarkForm(!showBookmarkForm)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Bookmark this page"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={closeProxy} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bookmark form */}
          {showBookmarkForm && (
            <div className="glass-card px-3 py-2 flex items-center gap-2 border-b border-border/50">
              <Bookmark className="w-4 h-4 text-primary shrink-0" />
              <input
                type="text"
                placeholder="Bookmark name..."
                value={newBookmarkName}
                onChange={(e) => setNewBookmarkName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddBookmark()}
                className="flex-1 px-3 py-1 rounded bg-secondary border border-border font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button onClick={handleAddBookmark} className="px-3 py-1 rounded bg-primary text-primary-foreground font-mono text-xs">
                Save
              </button>
            </div>
          )}

          {/* iframe */}
          <div className={`flex-1 ${isFullscreen ? "" : "rounded-b-xl overflow-hidden"}`} style={{ minHeight: isFullscreen ? undefined : "80vh" }}>
            <iframe
              src={currentUrl}
              className="w-full h-full border-0 bg-white"
              style={{ minHeight: isFullscreen ? "100%" : "80vh" }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              referrerPolicy="no-referrer"
              title="Proxy Browser"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Web Proxy</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          Browse the web — enter a URL or search term
        </p>

        {/* URL Input */}
        <div className="glass-card neon-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm text-primary">
              Search Engine: {engine.name}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter URL or search..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGo()}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>
            <button
              onClick={() => handleGo()}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-mono font-semibold hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all flex items-center gap-2"
            >
              Go
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bookmarks */}
        <h2 className="font-mono text-sm text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Bookmarks
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {settings.proxyBookmarks.map((bm, i) => (
            <div key={i} className="glass-card rounded-lg p-4 glow-hover group relative">
              <button
                onClick={() => {
                  setUrl(bm.url);
                  handleGo(bm.url);
                }}
                className="text-left w-full"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <span className="font-mono text-sm text-foreground group-hover:text-primary transition-all block truncate">
                  {bm.name}
                </span>
                <span className="block text-xs text-muted-foreground font-mono truncate">{bm.url}</span>
              </button>
              <button
                onClick={() => removeBookmark(i)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setShowBookmarkForm(true);
              setNewBookmarkName("");
            }}
            className="glass-card rounded-lg p-4 glow-hover flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-[100px]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-mono text-xs">Add Bookmark</span>
          </button>
        </div>

        {/* Info */}
        <div className="glass-card rounded-xl p-5 border-l-2 border-primary/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-mono font-semibold text-sm mb-1 text-foreground">How it works</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Enter a URL to load it in an embedded frame, or type a search query to use your
                selected search engine ({engine.name}). Change your search engine in Settings.
                Note: Some sites may block iframe embedding due to security policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proxy;
