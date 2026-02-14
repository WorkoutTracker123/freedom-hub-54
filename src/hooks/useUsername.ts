import { useState, useCallback } from "react";

const STORAGE_KEY = "freezone_username";

const randomNames = ["Shadow", "Ghost", "Cipher", "Pixel", "Nova", "Byte", "Flux", "Neon", "Volt", "Echo", "Spark", "Drift", "Blaze", "Frost", "Orbit"];

function generateUsername(): string {
  return randomNames[Math.floor(Math.random() * randomNames.length)] + Math.floor(Math.random() * 9999);
}

export function useUsername() {
  const [username, setUsernameState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    const generated = generateUsername();
    localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  });

  const setUsername = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setUsernameState(trimmed);
  }, []);

  return { username, setUsername };
}
