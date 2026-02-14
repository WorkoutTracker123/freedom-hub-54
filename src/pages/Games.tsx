import { useState } from "react";
import GameCard from "../components/GameCard";
import { Search } from "lucide-react";

const games = [
  { title: "2048", description: "Slide tiles and reach 2048", category: "Puzzle", url: "https://play2048.co/", color: "#00e5ff" },
  { title: "Slope", description: "Roll a ball down an endless slope", category: "Arcade", url: "https://slope-game.github.io/", color: "#a855f7" },
  { title: "Cookie Clicker", description: "Click cookies, build an empire", category: "Idle", url: "https://orteil.dashnet.org/cookieclicker/", color: "#22c55e" },
  { title: "Tetris", description: "The classic block puzzle game", category: "Puzzle", url: "https://tetris.com/play-tetris", color: "#f97316" },
  { title: "Flappy Bird", description: "Tap to fly through pipes", category: "Arcade", url: "https://flappybird.io/", color: "#eab308" },
  { title: "Pac-Man", description: "Classic arcade ghost-dodging", category: "Classic", url: "https://www.google.com/logos/2010/pacman10-i.html", color: "#facc15" },
  { title: "Subway Surfers", description: "Endless runner through subways", category: "Runner", url: "https://poki.com/en/g/subway-surfers", color: "#06b6d4" },
  { title: "Snake", description: "Eat and grow without hitting yourself", category: "Classic", url: "https://playsnake.org/", color: "#10b981" },
  { title: "Wordle", description: "Guess the 5-letter word daily", category: "Word", url: "https://www.nytimes.com/games/wordle/index.html", color: "#8b5cf6" },
  { title: "Minecraft Classic", description: "Build and explore in your browser", category: "Sandbox", url: "https://classic.minecraft.net/", color: "#84cc16" },
  { title: "Moto X3M", description: "Extreme motorcycle racing", category: "Racing", url: "https://poki.com/en/g/moto-x3m", color: "#ef4444" },
  { title: "Basketball Stars", description: "1v1 basketball action", category: "Sports", url: "https://poki.com/en/g/basketball-stars", color: "#f97316" },
];

const categories = ["All", ...new Set(games.map((g) => g.category))];

const Games = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = games.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Games</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          Play unblocked games directly in your browser
        </p>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  activeCategory === cat
                    ? "bg-primary/15 text-primary neon-border"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((game) => (
            <GameCard key={game.title} {...game} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-mono">
            No games found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
