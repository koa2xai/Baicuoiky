(function () {
  var K = "sf_session";
  var BASE = document.currentScript.src.replace(/[^\/]*$/, "");  
  var LOGIN = BASE + "../Trangdangnhap/login.html";
  function get() { try { var s = JSON.parse(localStorage.getItem(K)); return s && s.exp > Date.now() ? s : null } catch (e) { return null } }
  window.SFAuth = {
    get: get,
    login: function (u, p) {
      if (u.trim().toLowerCase() !== "admin" || p !== "admin123") return false;
      var now = Date.now();
      localStorage.setItem(K, JSON.stringify({ user: "admin", name: "Admin ShipFast", at: now, exp: now + 8 * 3600e3 }));
      return true;
    },
    logout: function () { localStorage.removeItem(K); location.replace(LOGIN); }
  };
  var onLogin = /login\.html$/.test(location.pathname);
  if (!onLogin && !get()) location.replace(LOGIN);
  addEventListener("pageshow", function (e) { if (e.persisted && !onLogin && !get()) location.replace(LOGIN); });
  addEventListener("storage", function (e) { if (e.key === K && !onLogin && !get()) location.replace(LOGIN); });
})();