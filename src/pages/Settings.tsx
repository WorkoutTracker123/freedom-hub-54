import { useState } from "react";
import { Settings as SettingsIcon, User, Search, Palette, Shield, Globe, Bookmark, Trash2, Plus } from "lucide-react";
import { useUsername } from "@/hooks/useUsername";
import { useSettings, searchEngines, type ProxyBookmark } from "@/hooks/useSettings";

const Settings = () => {
  const { username, setUsername } = useUsername();
  const { settings, updateSettings, addBookmark, removeBookmark } = useSettings();
  const [editingName, setEditingName] = useState(username);
  const [newBmName, setNewBmName] = useState("");
  const [newBmUrl, setNewBmUrl] = useState("");

  const handleSaveName = () => {
    if (editingName.trim()) {
      setUsername(editingName.trim());
    }
  };

  const handleAddBookmark = () => {
    if (newBmName.trim() && newBmUrl.trim()) {
      addBookmark({ name: newBmName.trim(), url: newBmUrl.trim().startsWith("http") ? newBmUrl.trim() : "https://" + newBmUrl.trim() });
      setNewBmName("");
      setNewBmUrl("");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">Settings</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm mb-8">Customize your TakaoNet experience</p>

        <div className="space-y-6">
          {/* Profile */}
          <section className="glass-card neon-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-mono font-semibold text-foreground">Profile</h2>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="font-mono text-xs text-muted-foreground block mb-1">Display Name</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={editingName.trim() === username}
                    className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all"
                  >
                    Save
                  </button>
                </div>
              </label>
            </div>
          </section>

          {/* Search Engine */}
          <section className="glass-card neon-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="font-mono font-semibold text-foreground">Search Engine</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(searchEngines).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => updateSettings({ searchEngine: key })}
                  className={`p-3 rounded-lg font-mono text-sm text-left transition-all ${
                    settings.searchEngine === key
                      ? "bg-primary/15 text-primary neon-border"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </section>

          {/* Tab Cloaking */}
          <section className="glass-card neon-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-mono font-semibold text-foreground">Tab Cloaking</h2>
            </div>
            <p className="text-muted-foreground text-xs font-mono mb-4">
              Disguise this tab to look like a different website
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  onClick={() => updateSettings({ tabCloak: !settings.tabCloak })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    settings.tabCloak ? "bg-primary" : "bg-secondary border border-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${
                      settings.tabCloak ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
                <span className="font-mono text-sm text-foreground">Enable Tab Cloaking</span>
              </label>
              {settings.tabCloak && (
                <>
                  <label className="block">
                    <span className="font-mono text-xs text-muted-foreground block mb-1">Tab Title</span>
                    <input
                      type="text"
                      value={settings.tabTitle}
                      onChange={(e) => updateSettings({ tabTitle: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      placeholder="Google Classroom"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs text-muted-foreground block mb-1">Tab Icon URL (optional)</span>
                    <input
                      type="text"
                      value={settings.tabIcon}
                      onChange={(e) => updateSettings({ tabIcon: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      placeholder="https://classroom.google.com/favicon.ico"
                    />
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { title: "Google Classroom", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
                      { title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
                      { title: "Canvas", icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
                      { title: "Khan Academy", icon: "https://cdn.kastatic.org/images/favicon.ico?logo" },
                    ].map((preset) => (
                      <button
                        key={preset.title}
                        onClick={() => updateSettings({ tabTitle: preset.title, tabIcon: preset.icon })}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground font-mono text-xs transition-colors"
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Bookmarks */}
          <section className="glass-card neon-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="w-5 h-5 text-primary" />
              <h2 className="font-mono font-semibold text-foreground">Proxy Bookmarks</h2>
            </div>
            <div className="space-y-2 mb-4">
              {settings.proxyBookmarks.map((bm, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-sm text-foreground block truncate">{bm.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground block truncate">{bm.url}</span>
                  </div>
                  <button onClick={() => removeBookmark(i)} className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newBmName}
                onChange={(e) => setNewBmName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <input
                type="text"
                placeholder="URL"
                value={newBmUrl}
                onChange={(e) => setNewBmUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddBookmark()}
                className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button onClick={handleAddBookmark} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-xs">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="glass-card rounded-xl p-6 border border-destructive/30">
            <h2 className="font-mono font-semibold text-destructive mb-3">Reset Data</h2>
            <p className="text-muted-foreground text-xs font-mono mb-4">
              Clear all saved data including username, settings, favorites, and bookmarks.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Are you sure? This will reset all your data.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 rounded-lg bg-destructive/15 text-destructive font-mono text-sm hover:bg-destructive/25 transition-colors"
            >
              Reset Everything
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
