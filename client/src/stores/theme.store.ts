import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: "light" | "dark") => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: getSystemTheme(),

      setTheme: (theme: Theme) => {
        const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
        applyTheme(resolvedTheme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme =
          theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
        const resolvedTheme =
          newTheme === "system" ? getSystemTheme() : newTheme;
        applyTheme(resolvedTheme);
        set({ theme: newTheme, resolvedTheme });
      },
    }),
    {
      name: "greenloop-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolvedTheme =
            state.theme === "system" ? getSystemTheme() : state.theme;
          applyTheme(resolvedTheme);
          state.resolvedTheme = resolvedTheme;
        }
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (e) => {
    const store = useThemeStore.getState();
    if (store.theme === "system") {
      const newTheme = e.matches ? "dark" : "light";
      applyTheme(newTheme);
      useThemeStore.setState({ resolvedTheme: newTheme });
    }
  });
}
