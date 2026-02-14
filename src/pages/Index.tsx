import { Shield, Gamepad2, Globe, MessageCircle, Zap, Lock } from "lucide-react";
import FeatureCard from "../components/FeatureCard";

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card neon-border mb-8">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm text-primary">Encrypted & Anonymous</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-foreground">Break </span>
            <span className="neon-text">Free</span>
            <br />
            <span className="text-muted-foreground text-3xl md:text-5xl font-semibold">
              Access Everything. Anywhere.
            </span>
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
            Games, proxy tools, and anonymous chat — all in one place.
            No restrictions. No tracking. Just freedom.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="/games"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-mono font-semibold hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all"
            >
              <Gamepad2 className="w-5 h-5" />
              Play Games
            </a>
            <a
              href="/proxy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card neon-border font-mono font-semibold text-foreground hover:bg-primary/10 transition-all"
            >
              <Globe className="w-5 h-5" />
              Open Proxy
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-mono text-sm text-primary mb-2 tracking-widest uppercase">
            Features
          </h2>
          <p className="text-center text-2xl font-bold text-foreground mb-12">
            Everything you need to stay free
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Gamepad2 className="w-6 h-6 text-primary" />}
              title="Games"
              description="Play hundreds of unblocked HTML5 games directly in your browser. No downloads needed."
              href="/games"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-neon-purple" />}
              title="Web Proxy"
              description="Browse any website freely through our built-in web proxy. Bypass any filter or firewall."
              href="/proxy"
            />
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6 text-neon-green" />}
              title="Anonymous Chat"
              description="Talk to others anonymously. No accounts, no tracking, no logs. Just conversation."
              href="/chat"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {[
              { value: "500+", label: "Games" },
              { value: "100%", label: "Free" },
              { value: "0", label: "Logs Kept" },
              { value: "∞", label: "Freedom" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black font-mono neon-text mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm neon-text">FreeZone</span>
          </div>
          <p className="text-muted-foreground text-xs font-mono">
            The internet should be free for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
