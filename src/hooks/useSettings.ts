import { useState, useCallback, useEffect } from "react";

export interface ProxyBookmark {
  name: string;
  url: string;
}

export interface AppSettings {
  searchEngine: string;
  tabCloak: boolean;
  tabTitle: string;
  tabIcon: string;
  proxyBookmarks: ProxyBookmark[];
  favoriteGames: number[];
  theme: string;
}

const STORAGE_KEY = "freezone_settings";

const defaultSettings: AppSettings = {
  searchEngine: "google",
  tabCloak: false,
  tabTitle: "FreeZone",
  tabIcon: "",
  proxyBookmarks: [
    { name: "Google", url: "https://www.google.com" },
    { name: "YouTube", url: "https://www.youtube.com" },
    { name: "Wikipedia", url: "https://www.wikipedia.org" },
    { name: "Reddit", url: "https://www.reddit.com" },
    { name: "Discord", url: "https://discord.com" },
  ],
  favoriteGames: [],
  theme: "cyber",
};

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return defaultSettings;
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleFavoriteGame = useCallback((gameId: number) => {
    setSettingsState((prev) => {
      const favs = prev.favoriteGames.includes(gameId)
        ? prev.favoriteGames.filter((id) => id !== gameId)
        : [...prev.favoriteGames, gameId];
      const next = { ...prev, favoriteGames: favs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addBookmark = useCallback((bookmark: ProxyBookmark) => {
    setSettingsState((prev) => {
      const next = { ...prev, proxyBookmarks: [...prev.proxyBookmarks, bookmark] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((index: number) => {
    setSettingsState((prev) => {
      const bookmarks = [...prev.proxyBookmarks];
      bookmarks.splice(index, 1);
      const next = { ...prev, proxyBookmarks: bookmarks };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Apply tab cloaking
  useEffect(() => {
    if (settings.tabCloak && settings.tabTitle) {
      document.title = settings.tabTitle;
      if (settings.tabIcon) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = settings.tabIcon;
      }
    } else {
      document.title = "FreeZone";
    }
  }, [settings.tabCloak, settings.tabTitle, settings.tabIcon]);

  return { settings, updateSettings, toggleFavoriteGame, addBookmark, removeBookmark };
}

export const searchEngines: Record<string, { name: string; searchUrl: string }> = {
  google: { name: "Google", searchUrl: "https://www.google.com/search?igu=1&q=" },
  bing: { name: "Bing", searchUrl: "https://www.bing.com/search?q=" },
  duckduckgo: { name: "DuckDuckGo", searchUrl: "https://duckduckgo.com/?q=" },
  brave: { name: "Brave", searchUrl: "https://search.brave.com/search?q=" },
};
