(function () {
  const STORAGE_KEY = "edupulse_state_sl_v2";
  const THEME_KEY = "edupulse_theme_v1";

  function cloneDefault() {
    return JSON.parse(JSON.stringify(window.DEFAULT_EDUPULSE_DATA));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = cloneDefault();
        saveState(initial);
        return initial;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.teachers)) {
        return cloneDefault();
      }
      return parsed;
    } catch (e) {
      return cloneDefault();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      window._memoryFallbackState = state;
    }
  }

  function resetState() {
    const fresh = cloneDefault();
    saveState(fresh);
    return fresh;
  }

  function getTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch (e) {
      return "light";
    }
  }

  function setTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    document.documentElement.setAttribute("data-theme", theme);
  }

  window.EduStore = {
    loadState: loadState,
    saveState: saveState,
    resetState: resetState,
    getTheme: getTheme,
    setTheme: setTheme
  };
})();
