/* ShipFast – Cài đặt: nội dung nằm trong settings.html, file này chỉ điền thông tin phiên và xử lý hộp thoại đăng xuất */
(function () {
  const S = SFAuth.get() || {};
  const $ = s => document.querySelector(s);
  const fmt = t => t ? new Date(t).toLocaleString("vi-VN") : "Chưa cập nhật";

  // Nhận diện trình duyệt
  const ua = navigator.userAgent;
  const m = (re, n) => { const x = ua.match(re); return x ? n + " " + x[1].split(".")[0] : null };
  const browser = m(/Edg\/([\d.]+)/, "Edge") || m(/OPR\/([\d.]+)/, "Opera") || m(/Firefox\/([\d.]+)/, "Firefox") ||
    m(/Chrome\/([\d.]+)/, "Chrome") || m(/Version\/([\d.]+).*Safari/, "Safari") || "Không xác định";

  // Điền các ô thông tin lấy từ phiên đăng nhập
  const fields = { user: S.user || "admin", lastLogin: fmt(S.at), sessionStart: fmt(S.at), sessionEnd: fmt(S.exp), browser: browser };
  Object.keys(fields).forEach(k => { const el = $('[data-field="' + k + '"]'); if (el) el.textContent = fields[k]; });

  // Hộp thoại xác nhận đăng xuất
  const dlg = $("#logoutDlg"), openBtn = $("#logoutBtn");
  const close = () => { dlg.hidden = true; removeEventListener("keydown", onKey); openBtn.focus(); };
  const onKey = e => e.key === "Escape" && close();

  openBtn.onclick = () => { dlg.hidden = false; addEventListener("keydown", onKey); $("#logoutNo").focus(); };
  dlg.onclick = e => e.target === dlg && close();
  $("#logoutNo").onclick = close;
  $("#logoutYes").onclick = () => SFAuth.logout();
})();
