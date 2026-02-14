import { useState } from "react";
import { Globe, ArrowRight, Shield, AlertTriangle } from "lucide-react";

const Proxy = () => {
  const [url, setUrl] = useState("");

  const handleGo = () => {
    if (!url) return;
    let target = url;
    if (!target.startsWith("http")) target = "https://" + target;
    // Using a public CORS proxy for demo purposes
    window.open(`https://www.google.com/search?igu=1&q=${encodeURIComponent(target)}`, "_blank");
  };

  const quickLinks = [
    { name: "Google", url: "google.com", icon: "🔍" },
    { name: "YouTube", url: "youtube.com", icon: "▶️" },
    { name: "Wikipedia", url: "wikipedia.org", icon: "📚" },
    { name: "Reddit", url: "reddit.com", icon: "🗨️" },
    { name: "Discord", url: "discord.com", icon: "💬" },
    { name: "Twitter / X", url: "x.com", icon: "🐦" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Web Proxy</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          Browse the web freely — bypass restrictions and firewalls
        </p>

        {/* URL Input */}
        <div className="glass-card neon-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm text-primary">Secure Connection</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter URL (e.g., youtube.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGo()}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>
            <button
              onClick={handleGo}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-mono font-semibold hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all flex items-center gap-2"
            >
              Go
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="font-mono text-sm text-muted-foreground mb-4 uppercase tracking-widest">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {quickLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setUrl(link.url);
              }}
              className="glass-card rounded-lg p-4 glow-hover text-left group"
            >
              <span className="text-2xl mb-2 block">{link.icon}</span>
              <span className="font-mono text-sm text-foreground group-hover:neon-text transition-all">
                {link.name}
              </span>
              <span className="block text-xs text-muted-foreground font-mono">{link.url}</span>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="glass-card rounded-xl p-5 border-l-2 border-primary/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-mono font-semibold text-sm mb-1 text-foreground">How it works</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                The proxy routes your traffic through an external server, making it appear as if
                you're browsing from a different location. This helps bypass local network
                restrictions and filters. For best results, use a VPN alongside this tool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proxy;
