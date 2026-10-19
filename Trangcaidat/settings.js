/* Layout dùng chung: sidebar 3 mục, nút ba gạch, icon Lucide (SVG nội tuyến) */
const IC = {
  "triangle-alert": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  "chart-no-axes-combined": '<path d="M12 16v5"/><path d="M16 14v7"/><path d="M20 10v11"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18v3"/><path d="M8 14v7"/>',
  "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  "menu": '<path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/>',
  "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  "banknote": '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  "package": '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  "circle-check": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  "chart-pie": '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>',
  "flag": '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  "lock": '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  "monitor": '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
  "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  "pencil": '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'
};
function ico(n, s) { s = s || 16; return '<svg class="ic-s" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || "") + '</svg>' }

(function () {
  const NAV = [
  ["incident", "../Trangsuco/incident.html",      "Quản lý sự cố",      "triangle-alert"],
  ["report",   "../Trangthongke/report.html",     "Báo cáo & Thống kê", "chart-no-axes-combined"],
  ["settings", "../Trangcaidat/settings.html",    "Cài đặt",            "settings"]
];
  const B = document.body, page = B.dataset.page, S = window.SFAuth && SFAuth.get();
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  B.classList.add("sf-init");
  if (localStorage.getItem("sf_collapsed") === "1") B.classList.add("collapsed");
  B.insertAdjacentHTML("afterbegin",
    '<aside class="sf-side" id="sfSide"><div class="sf-logo"><b>S<span class="t">hipFast</span></b><small class="t">Giao nhận, niềm tin vững</small></div><nav aria-label="Menu chính">' +
    NAV.map(n => '<a href="' + n[1] + '" data-tip="' + esc(n[2]) + '" title="' + esc(n[2]) + '"' + (n[0] === page ? ' class="on" aria-current="page"' : '') + '>' + ico(n[3], 18) + '<span class="t">' + esc(n[2]) + '</span></a>').join("") +
    '</nav></aside><div class="sf-ov" id="sfOv"></div><header class="sf-head"><button class="sf-burger" id="sfBurger" aria-label="Đóng/mở menu" aria-controls="sfSide">' + ico("menu", 22) + '</button><span class="sf-hello">Xin chào, ' + esc(S ? S.name : "Admin ShipFast") + '</span></header>');
  const mob = matchMedia("(max-width:820px)"), b = $id("sfBurger");
  function $id(i) { return document.getElementById(i) }
  const sync = () => b.setAttribute("aria-expanded", String(mob.matches ? B.classList.contains("open") : !B.classList.contains("collapsed")));
  b.onclick = () => { if (mob.matches) B.classList.toggle("open"); else { B.classList.toggle("collapsed"); localStorage.setItem("sf_collapsed", B.classList.contains("collapsed") ? "1" : "0") } sync() };
  $id("sfOv").onclick = () => { B.classList.remove("open"); sync() };
  $id("sfSide").addEventListener("click", e => { if (e.target.closest("a")) B.classList.remove("open") });
  addEventListener("keydown", e => { if (e.key === "Escape" && B.classList.contains("open")) $id("sfOv").click() });
  mob.addEventListener("change", () => { B.classList.remove("open"); sync() });
  document.querySelectorAll("[data-ic]").forEach(e => e.innerHTML = ico(e.dataset.ic, +e.dataset.s || 16));
  sync(); requestAnimationFrame(() => requestAnimationFrame(() => B.classList.remove("sf-init")));
})();

(function () {
  const S = SFAuth.get() || {}, $ = s => document.querySelector(s);
  const A = { name: "Admin ShipFast", user: S.user || "admin", email: "admin@gmail.com", role: "Quản trị viên", dept: "Quản trị hệ thống" }; // dữ liệu demo
  const fmt = t => t ? new Date(t).toLocaleString("vi-VN") : "Chưa cập nhật";
  const ua = navigator.userAgent, m = (re, n) => { const x = ua.match(re); return x ? n + " " + x[1].split(".")[0] : null };
  const br = m(/Edg\/([\d.]+)/, "Edge") || m(/OPR\/([\d.]+)/, "Opera") || m(/Firefox\/([\d.]+)/, "Firefox") || m(/Chrome\/([\d.]+)/, "Chrome") || m(/Version\/([\d.]+).*Safari/, "Safari") || "Không xác định";
  const row = (a, b) => `<div class="row"><span>${a}</span><b>${b}</b></div>`;
  const toast = t => { const x = $("#toast"); x.textContent = t; x.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(() => x.style.display = "none", 3000) };
  $("#app").innerHTML = `<div><div class="crumb">Cài đặt</div><h1 class="ttl">${ico("settings", 24)}Cài đặt tài khoản Admin</h1></div>
  <div class="card"><h3 class="ttl">${ico("user")}Thông tin quản trị viên</h3>
   <div class="hero"><div class="av" aria-hidden="true">A</div><div><h2>${A.name}</h2><p>${A.email}</p><span class="pill">${A.role}</span><span class="pill ok">Đang hoạt động</span></div></div>
   ${row("Bộ phận", A.dept)}${row("Ngày tạo tài khoản", "Chưa cập nhật")}${row("Lần đăng nhập gần nhất", fmt(S.at))}</div>
  <div class="g2">
   <div class="card"><h3 class="ttl">${ico("file-text")}Thông tin tài khoản</h3>${row("Họ và tên", A.name)}${row("Tên tài khoản", A.user)}${row("Email", A.email)}${row("Vai trò", A.role)}
    <div class="acts"><button class="btn o" data-n="Chỉnh sửa thông tin">${ico("pencil", 14)}Chỉnh sửa thông tin</button></div></div>
   <div class="card"><h3 class="ttl">${ico("shield-check")}Bảo mật tài khoản</h3>${row("Phương thức đăng nhập", "Tên tài khoản và mật khẩu")}${row("Mật khẩu", "Đã thiết lập (ẩn)")}
    <div class="acts"><button class="btn o" data-n="Đổi mật khẩu">${ico("lock", 14)}Đổi mật khẩu</button></div></div>
  </div>
  <div class="card"><h3 class="ttl">${ico("monitor")}Thông tin phiên đăng nhập</h3>${row("Đăng nhập lúc", fmt(S.at))}${row("Phiên hết hạn lúc", fmt(S.exp))}${row("Trình duyệt", br)}</div>
  <div class="card out"><div><h3>Kết thúc phiên đăng nhập</h3><p>Bạn sẽ được chuyển về trang đăng nhập.</p></div><button class="btn red" id="lo">${ico("log-out", 16)}Đăng xuất</button></div>`;
  document.querySelectorAll("[data-n]").forEach(b => b.onclick = () => toast("Chức năng “" + b.dataset.n + "” chưa được tích hợp (chưa có backend)."));
  const lo = $("#lo");
  lo.onclick = () => {
    const d = document.createElement("div"); d.className = "dlg";
    d.innerHTML = `<div class="box" role="dialog" aria-modal="true" aria-labelledby="dt"><h3 id="dt">Đăng xuất</h3><p>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Admin không?</p><div class="acts"><button class="btn o" id="no">Hủy</button><button class="btn red" id="yes">Đăng xuất</button></div></div>`;
    document.body.appendChild(d);
    const k = e => e.key === "Escape" && close(), close = () => { d.remove(); removeEventListener("keydown", k); lo.focus() };
    addEventListener("keydown", k); d.onclick = e => e.target === d && close();
    d.querySelector("#no").onclick = close; d.querySelector("#yes").onclick = () => SFAuth.logout(); d.querySelector("#no").focus();
  };
})();
