interface GameCardProps {
  title: string;
  description: string;
  category: string;
  url: string;
  color: string;
}

const GameCard = ({ title, description, category, url, color }: GameCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card rounded-xl overflow-hidden glow-hover group block"
    >
      <div
        className="h-36 flex items-center justify-center text-4xl font-bold font-mono"
        style={{
          background: `linear-gradient(135deg, ${color}22, ${color}08)`,
          borderBottom: `1px solid ${color}33`,
        }}
      >
        <span style={{ color, textShadow: `0 0 20px ${color}66` }}>
          {title.charAt(0)}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ background: `${color}15`, color }}
          >
            {category}
          </span>
        </div>
        <h3 className="font-mono font-semibold mb-1 text-foreground group-hover:neon-text transition-all">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </a>
  );
};

export default GameCard;
