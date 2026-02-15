import { useState } from "react";
import { Globe, ArrowRight, Shield, Star, Plus, Bookmark, X, ExternalLink } from "lucide-react";
import { useSettings, searchEngines } from "@/hooks/useSettings";

const PROXY_URL = "https://boltunblocker.com.cdn.cloudflare.net/lite";

const Proxy = () => {
  const [url, setUrl] = useState("");
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [newBookmarkName, setNewBookmarkName] = useState("");
  const [newBookmarkUrl, setNewBookmarkUrl] = useState("");
  const { settings, addBookmark, removeBookmark } = useSettings();

  const engine = searchEngines[settings.searchEngine] || searchEngines.google;

  const launchProxy = (targetUrl?: string) => {
    // Open the external proxy in an about:blank window for stealth
    const win = window.open("about:blank", "_blank");
    if (!win) return;

    const proxyTarget = targetUrl || PROXY_URL;

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${settings.tabCloak && settings.tabTitle ? settings.tabTitle : "Google Docs"}</title>
        <link rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { overflow: hidden; }
          iframe { width: 100vw; height: 100vh; border: none; }
        </style>
      </head>
      <body>
        <iframe src="${proxyTarget}" allowfullscreen></iframe>
      </body>
      </html>
    `);
    win.document.close();
  };

  const launchSearch = () => {
    if (!url.trim()) {
      launchProxy();
      return;
    }
    let target = url.trim();
    if (!target.startsWith("http")) {
      if (target.includes(".")) {
        target = "https://" + target;
      } else {
        target = engine.searchUrl + encodeURIComponent(target);
      }
    }
    // For search/URL, open the proxy service directly
    launchProxy(PROXY_URL);
  };

  const handleAddBookmark = () => {
    if (newBookmarkName.trim() && newBookmarkUrl.trim()) {
      let bookmarkUrl = newBookmarkUrl.trim();
      if (!bookmarkUrl.startsWith("http")) bookmarkUrl = "https://" + bookmarkUrl;
      addBookmark({ name: newBookmarkName.trim(), url: bookmarkUrl });
      setNewBookmarkName("");
      setNewBookmarkUrl("");
      setShowBookmarkForm(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Web Proxy</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          Launch a stealth browser in a detached window — hidden from history
        </p>

        {/* Launch Proxy */}
        <div className="glass-card neon-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm text-primary">
              Search Engine: {engine.name}
            </span>
          </div>

          <button
            onClick={() => launchProxy()}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-mono font-bold text-lg hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all flex items-center justify-center gap-3 mb-4"
          >
            <ExternalLink className="w-5 h-5" />
            Launch Stealth Browser
          </button>

          <p className="text-center text-muted-foreground font-mono text-xs">
            Opens in a clean about:blank window — invisible to browser history
          </p>
        </div>

        {/* Bookmarks */}
        <h2 className="font-mono text-sm text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Quick Links
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {settings.proxyBookmarks.map((bm, i) => (
            <div key={i} className="glass-card rounded-lg p-4 glow-hover group relative">
              <button
                onClick={() => launchProxy(bm.url)}
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
              setShowBookmarkForm(!showBookmarkForm);
              setNewBookmarkName("");
              setNewBookmarkUrl("");
            }}
            className="glass-card rounded-lg p-4 glow-hover flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-[100px]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-mono text-xs">Add Bookmark</span>
          </button>
        </div>

        {/* Add bookmark form */}
        {showBookmarkForm && (
          <div className="glass-card rounded-xl p-4 mb-8 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Bookmark name..."
              value={newBookmarkName}
              onChange={(e) => setNewBookmarkName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <input
              type="text"
              placeholder="URL (e.g. google.com)..."
              value={newBookmarkUrl}
              onChange={(e) => setNewBookmarkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddBookmark()}
              className="px-3 py-2 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button onClick={handleAddBookmark} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm">
              Save Bookmark
            </button>
          </div>
        )}

        {/* Info */}
        <div className="glass-card rounded-xl p-5 border-l-2 border-primary/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-mono font-semibold text-sm mb-1 text-foreground">How it works</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                The proxy opens in a detached about:blank window, which means it won't show up in your
                browser history. The tab title and favicon are automatically cloaked. Bookmark your
                favorite sites for quick access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proxy;
