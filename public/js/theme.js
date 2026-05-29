export function createTheme(initialTheme = "dark") {
  let theme = initialTheme;

  function apply() {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggle() {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    apply();
  }

  return { apply, toggle };
}
