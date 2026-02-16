import { useState, useRef, useEffect } from "react";
import { Send, User, Users, Trash2 } from "lucide-react";
import { useUsername } from "@/hooks/useUsername";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

const Chat = () => {
  const { username } = useUsername();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [onlineCount, setOnlineCount] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load recent messages & subscribe to realtime
  useEffect(() => {
    const fetchMessages = async () => {
      const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .gte("created_at", thirtyMinAgo)
        .order("created_at", { ascending: true })
        .limit(200);
      if (data) setMessages(data as ChatMessage[]);
    };
    fetchMessages();

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ username });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    await supabase.from("chat_messages").insert({
      username,
      message: text,
    });
  };

  // Cleanup old messages client-side
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.filter(
          (m) => new Date(m.created_at).getTime() > Date.now() - 30 * 60 * 1000
        )
      );
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Chat</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Anonymous real-time chat — no accounts, messages auto-delete after 30 min
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card">
            <User className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm text-foreground">{username}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm text-primary">{onlineCount} online</span>
          </div>
        </div>

        <div className="glass-card neon-border rounded-xl flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground font-mono text-sm py-8">
                No messages yet — say something! 👋
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.username === username;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                      isMe
                        ? "bg-primary/15 border border-primary/30"
                        : "bg-secondary border border-border"
                    }`}
                  >
                    {!isMe && (
                      <span className="block text-xs font-mono mb-1 text-accent">
                        {msg.username}
                      </span>
                    )}
                    <p className="text-sm text-foreground">{msg.message}</p>
                    <span className="block text-[10px] text-muted-foreground mt-1 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

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
