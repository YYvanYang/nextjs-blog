export const themeEffect = function () {
  const pref = localStorage.getItem("theme");
  const isDarkThemePreferred = pref === "dark" || (!pref && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const themeColor = isDarkThemePreferred ? "#1c1c1c" : "#fcfcfc";
  const themeClass = isDarkThemePreferred ? "dark" : "light";

  // 统一处理文档根元素的类
  document.documentElement.classList.toggle("theme-system", pref === null);
  document.documentElement.classList.toggle("dark", isDarkThemePreferred);
  document.documentElement.classList.add("pause-transitions");

  // 统一设置主题颜色
  document.head.querySelector("meta[name=theme-color]")?.setAttribute("content", themeColor);

  // 使用requestAnimationFrame来优化过渡效果
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("pause-transitions");
  });

  return themeClass;
};