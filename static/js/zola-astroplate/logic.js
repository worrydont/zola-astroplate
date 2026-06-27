// Astroplate-aligned dark mode implementation
const htmlElement = document.documentElement;
const darkTheme = "dark";
const lightTheme = "light";
const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

const getSavedTheme = () => {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    console.warn("Failed to read theme from localStorage:", error);
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
};

// Initialize theme on page load (before DOMContentLoaded)
const defaultTheme = matchMedia.matches ? darkTheme : lightTheme;
const savedTheme = getSavedTheme() || defaultTheme;
const isDark = savedTheme === darkTheme;
htmlElement.classList.toggle("dark", isDark);

window.addEventListener("DOMContentLoaded", () => {
  // Copy button for code blocks
  const buildClipboardSvg = (title) => (`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><title>${title}</title><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>`);
  const buildOkSvg = (title) => (`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><title>${title}</title><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`);
  const buildErrorSvg = (title) => (`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><title>${title}</title><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`);

  const createClickHandler = (textElement, button, iconSet) => () => {
    navigator.clipboard
      .writeText(textElement.textContent)
      .then(() => {
        button.innerHTML = iconSet.ok;
        setTimeout(() => (button.innerHTML = iconSet.clipboard), 2000);
      })
      .catch(() => {
        button.innerHTML = iconSet.error;
      });
  };

  document.querySelectorAll("article.content pre").forEach((pre) => {
    const container = pre;
    const code = pre.querySelector("code");
    const article = pre.closest("article");
    const copyLabel = article?.dataset.clipboardCopy || "Copy";
    const copiedLabel = article?.dataset.clipboardCopied || "Copied";
    const errorLabel = article?.dataset.clipboardError || "Error";
    const iconSet = {
      clipboard: buildClipboardSvg(copyLabel),
      ok: buildOkSvg(copiedLabel),
      error: buildErrorSvg(errorLabel)
    };

    if (container && code && navigator?.clipboard?.writeText) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "text-text-light cursor-pointer hover:text-primary rounded-md absolute top-2 right-2";
      button.innerHTML = iconSet.clipboard;

      container.style.position = "relative";
      container.appendChild(button);

      button.addEventListener("click", createClickHandler(code, button, iconSet));
    }
  });

  // Theme Toggle - Astroplate approach
  const suns = document.querySelectorAll(".theme-icon-sun");
  const moons = document.querySelectorAll(".theme-icon-moon");
  const lightHighlight = document.getElementById("code-highlighting-light");
  const darkHighlight = document.getElementById("code-highlighting-dark");

  const setHighlightTheme = (theme) => {
    if (!lightHighlight || !darkHighlight) return;
    const useDark = theme === darkTheme;
    lightHighlight.disabled = useDark;
    darkHighlight.disabled = !useDark;
  };

  const updateThemeUI = (theme) => {
    const isDark = theme === darkTheme;

    // Update icon visibility
    if (isDark) {
      suns.forEach(s => s.classList.remove("hidden"));
      moons.forEach(m => m.classList.add("hidden"));
    } else {
      suns.forEach(s => s.classList.add("hidden"));
      moons.forEach(m => m.classList.remove("hidden"));
    }

    // Update .dark class on html element (Astroplate approach)
    htmlElement.classList.toggle("dark", isDark);
    setHighlightTheme(theme);
  };

  // Initialize UI
  const currentTheme = getSavedTheme() || defaultTheme;
  setHighlightTheme(currentTheme);
  updateThemeUI(currentTheme);

  const toggleTheme = () => {
    const currentTheme = htmlElement.classList.contains("dark") ? darkTheme : lightTheme;
    const newTheme = currentTheme === darkTheme ? lightTheme : darkTheme;
    updateThemeUI(newTheme);
    saveTheme(newTheme);
  };

  const themeToggleButton = document.getElementById("theme-toggle");
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }

  // Listen for system theme changes
  matchMedia.addEventListener("change", (e) => {
    if (!getSavedTheme()) {
      // Only auto-switch if user hasn't set a preference
      updateThemeUI(e.matches ? darkTheme : lightTheme);
    }
  });
});
