import { useState, useRef, useEffect } from "react";
import { Send, User, Users } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  isMe: boolean;
}

const randomNames = ["Shadow", "Ghost", "Cipher", "Pixel", "Nova", "Byte", "Flux", "Neon", "Volt", "Echo"];

const Chat = () => {
  const [username] = useState(() => randomNames[Math.floor(Math.random() * randomNames.length)] + Math.floor(Math.random() * 999));
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to FreeZone Chat! 🎉 This is a local demo — messages stay in your browser.", sender: "System", timestamp: new Date(), isMe: false },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: username,
      timestamp: new Date(),
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate a reply
    setTimeout(() => {
      const replies = [
        "Hey, what's up? 👋",
        "Cool, glad you're here!",
        "This place is awesome 🔥",
        "Anyone playing games?",
        "Freedom is everything ✊",
        "Stay safe out there 💚",
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: randomNames[Math.floor(Math.random() * randomNames.length)] + Math.floor(Math.random() * 999),
          timestamp: new Date(),
          isMe: false,
        },
      ]);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Chat</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Anonymous chat — no accounts, no logs
        </p>

        {/* User info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card">
            <User className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm text-foreground">{username}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card">
            <Users className="w-4 h-4 text-neon-green" />
            <span className="font-mono text-sm text-neon-green">{Math.floor(Math.random() * 50 + 10)} online</span>
          </div>
        </div>

        {/* Chat Window */}
        <div className="glass-card neon-border rounded-xl flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                    msg.isMe
                      ? "bg-primary/15 border border-primary/30"
                      : msg.sender === "System"
                      ? "bg-secondary border border-border"
                      : "bg-secondary border border-border"
                  }`}
                >
                  {!msg.isMe && (
                    <span className={`block text-xs font-mono mb-1 ${msg.sender === "System" ? "text-neon-green" : "text-neon-purple"}`}>
                      {msg.sender}
                    </span>
                  )}
                  <p className="text-sm text-foreground">{msg.text}</p>
                  <span className="block text-[10px] text-muted-foreground mt-1 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
