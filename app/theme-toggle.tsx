"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { themeEffect } from "./theme-effect";
import va from "@vercel/analytics";
import { MoonIcon, SunIcon } from "./Icons"; 

export function ThemeToggle() {
  const [preference, setPreference] = useState<"dark" | "light" | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light" | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const systemTheme = useMemo(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", []);

  const updateTheme = useCallback(() => {
    const current = themeEffect();
    setCurrentTheme(current);
    setPreference(localStorage.getItem("theme") as "dark" | "light" | null);
  }, []);

  useEffect(() => {
    updateTheme();

    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => updateTheme();

    matchMedia.addEventListener("change", onChange);
    return () => matchMedia.removeEventListener("change", onChange);
  }, [updateTheme]);

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === "theme") updateTheme();
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [updateTheme]);

  const toggleTheme = () => {
    let newPreference: null | string = currentTheme === "dark" ? "light" : "dark";
    if (preference !== null && systemTheme === currentTheme) {
      newPreference = null;
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newPreference);
    }

    va.track("Theme toggle", { Theme: newPreference === null ? "system" : newPreference });

    setPreference(newPreference);
  };

  const themeText = useMemo(() => {
    return preference === null ? "System" : preference === "dark" ? "Dark" : "Light";
  }, [preference]);

  return (
    <>
      {isHovering && (
        <span className="text-[9px] text-gray-400 mr-[-5px] hidden md:inline">
          {themeText}
        </span>
      )}
      <button
        aria-label="Toggle theme"
        className={`inline-flex ${isHovering ? "bg-gray-200 dark:bg-[#313131]" : ""} active:bg-gray-300 transition-[background-color] dark:active:bg-[#242424] rounded-sm p-2 
          bg-gray-200
          dark:bg-[#313131]
          theme-system:!bg-inherit
          [&_.sun-icon]:hidden
          dark:[&_.moon-icon]:hidden
          dark:[&_.sun-icon]:inline
        }`}
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <span className="sun-icon">
          <SunIcon />
        </span>
        <span className="moon-icon">
          <MoonIcon />
        </span>
      </button>
    </>
  );
}