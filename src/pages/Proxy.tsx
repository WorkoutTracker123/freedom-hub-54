import { useState } from "react";
import { Shield, ExternalLink } from "lucide-react";
import { useSettings, searchEngines } from "@/hooks/useSettings";

const PROXY_URL = "https://boltunblocker.com.cdn.cloudflare.net/lite";

const Proxy = () => {
  const { settings } = useSettings();
  const engine = searchEngines[settings.searchEngine] || searchEngines.google;

  const launchProxy = () => {
    const win = window.open("about:blank", "_blank");
    if (!win) return;

    const doc = win.document;
    doc.open();
    doc.close();

    doc.title = settings.tabCloak && settings.tabTitle ? settings.tabTitle : "Google Docs";
    const link = doc.createElement("link");
    link.rel = "icon";
    link.href = "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico";
    doc.head.appendChild(link);

    const style = doc.createElement("style");
    style.textContent = "* { margin: 0; padding: 0; box-sizing: border-box; } body { overflow: hidden; }";
    doc.head.appendChild(style);

    const iframe = doc.createElement("iframe");
    iframe.src = PROXY_URL;
    iframe.setAttribute("allowfullscreen", "true");
    iframe.style.cssText = "width: 100vw; height: 100vh; border: none;";
    doc.body.appendChild(iframe);
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

        <div className="glass-card neon-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm text-primary">
              Search Engine: {engine.name}
            </span>
          </div>

          <button
            onClick={launchProxy}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-mono font-bold text-lg hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all flex items-center justify-center gap-3 mb-4"
          >
            <ExternalLink className="w-5 h-5" />
            Launch Stealth Browser
          </button>

          <p className="text-center text-muted-foreground font-mono text-xs">
            Opens in a clean about:blank window — invisible to browser history
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-2 border-primary/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-mono font-semibold text-sm mb-1 text-foreground">How it works</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                The proxy opens in a detached about:blank window, which means it won't show up in your
                browser history. The tab title and favicon are automatically cloaked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proxy;
