import { useState, useEffect, useMemo } from "react";
import { Search, Star, X, Maximize2, Minimize2, ArrowLeft, Heart } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const COVER_URL = "https://cdn.jsdelivr.net/gh/gn-math/covers@main";
const HTML_URL = "https://cdn.jsdelivr.net/gh/gn-math/html@main";
const ZONES_URL = "https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json";

interface Zone {
  id: number;
  name: string;
  cover: string;
  url: string;
  author?: string;
  authorLink?: string;
  special?: string[];
  featured?: boolean;
}

function resolveUrl(url: string): string {
  return url.replace("{COVER_URL}", COVER_URL).replace("{HTML_URL}", HTML_URL);
}

const Games = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeGame, setActiveGame] = useState<Zone | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { settings, toggleFavoriteGame } = useSettings();

  useEffect(() => {
    fetch(ZONES_URL + "?t=" + Date.now())
      .then((r) => r.json())
      .then((data: Zone[]) => {
        // Filter out the discord ad entry
        setZones(data.filter((z) => z.id >= 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const tags = useMemo(() => {
    const allTags = new Set<string>();
    zones.forEach((z) => z.special?.forEach((t) => allTags.add(t)));
    return ["All", ...Array.from(allTags)];
  }, [zones]);

  const filtered = useMemo(() => {
    return zones.filter((z) => {
      const matchSearch = z.name.toLowerCase().includes(search.toLowerCase());
      const matchTag = activeTag === "All" || z.special?.includes(activeTag);
      const matchFav = !showFavorites || settings.favoriteGames.includes(z.id);
      return matchSearch && matchTag && matchFav;
    });
  }, [zones, search, activeTag, showFavorites, settings.favoriteGames]);

  const openGame = (zone: Zone) => {
    setActiveGame(zone);
    setIsFullscreen(false);
  };

  const closeGame = () => {
    setActiveGame(null);
    setIsFullscreen(false);
  };

  // Fullscreen game player
  if (activeGame) {
    const gameUrl = resolveUrl(activeGame.url);
    const isFav = settings.favoriteGames.includes(activeGame.id);

    return (
      <div className={`${isFullscreen ? "fixed inset-0 z-[100]" : "min-h-screen py-4"}`}>
        <div className={`${isFullscreen ? "h-full flex flex-col" : "container mx-auto px-4 flex flex-col"}`}>
          {/* Toolbar */}
          <div className="glass-card rounded-t-xl px-4 py-2 flex items-center justify-between gap-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <button onClick={closeGame} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-mono text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-foreground font-mono font-semibold text-sm">{activeGame.name}</span>
              {activeGame.author && (
                <span className="text-muted-foreground text-xs font-mono hidden sm:inline">by {activeGame.author}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavoriteGame(activeGame.id)}
                className={`p-2 rounded-lg transition-all ${isFav ? "text-red-400 bg-red-400/10" : "text-muted-foreground hover:text-foreground"}`}
                title={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={closeGame}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* iframe */}
          <div className={`flex-1 ${isFullscreen ? "" : "rounded-b-xl overflow-hidden"}`} style={{ minHeight: isFullscreen ? undefined : "75vh" }}>
            <iframe
              src={gameUrl}
              className="w-full h-full border-0 bg-background"
              style={{ minHeight: isFullscreen ? "100%" : "75vh" }}
              allow="autoplay; fullscreen; gamepad"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title={activeGame.name}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Games</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          {zones.length} games available — play directly in your browser
        </p>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs transition-all ${
                showFavorites ? "bg-red-400/15 text-red-400 neon-border" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showFavorites ? "fill-current" : ""}`} />
              Favorites ({settings.favoriteGames.length})
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all capitalize ${
                  activeTag === tag
                    ? "bg-primary/15 text-primary neon-border"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground font-mono text-sm">Loading games...</p>
          </div>
        )}

        {/* Game Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((zone) => {
              const coverSrc = resolveUrl(zone.cover);
              const isFav = settings.favoriteGames.includes(zone.id);
              return (
                <button
                  key={zone.id}
                  onClick={() => openGame(zone)}
                  className="glass-card rounded-xl overflow-hidden glow-hover group text-left relative"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-secondary">
                    <img
                      src={coverSrc}
                      alt={zone.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="font-mono text-xs text-primary">▶ Play Now</span>
                    </div>
                    {/* Fav indicator */}
                    {isFav && (
                      <div className="absolute top-2 right-2">
                        <Heart className="w-4 h-4 text-red-400 fill-current drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-mono font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {zone.name}
                    </h3>
                    {zone.author && (
                      <p className="text-muted-foreground text-[10px] font-mono truncate mt-0.5">{zone.author}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-mono">
            No games found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
