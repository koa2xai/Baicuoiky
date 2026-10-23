/* =====================================================================
   ShipFast – Quản lý sự cố
   Toàn bộ nội dung (bảng sự cố, chi tiết từng đơn) nằm trong incident.html.
   File này chỉ xử lý thao tác:
   - chuyển giữa màn hình danh sách / chi tiết theo địa chỉ (#/su-co, #/su-co/MÃ?i=MÃ_SỰ_CỐ)
   - lọc bảng, tìm mã đơn
   - chọn mức độ, lưu ghi chú (localStorage)
   ===================================================================== */
const SEV = { l: "Thấp", m: "Trung bình", h: "Cao" };
const LVL_CLASS = { l: "", m: "lvl-m", h: "lvl-h" };
const KEY = id => "sf_inc_" + id;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const viewList = $("#viewList"), viewDetail = $("#viewDetail");
const filter = { q: "", sev: "", x: "", from: "" };

/* ---------- Nạp ghi chú / mức độ đã lưu ---------- */
function applySaved(panel, saved) {
  const id = panel.dataset.inc;
  panel.querySelectorAll(".sev").forEach(p => p.classList.toggle("on", p.dataset.s === saved.sev));
  panel.querySelector(".note").value = saved.note;
  panel.querySelector('[data-role="upd"]').textContent = saved.upd || "Chưa cập nhật";
  syncSeverity(id, saved.sev);
}
// cập nhật nhãn mức độ ở bảng danh sách và ở nút chọn sự cố
function syncSeverity(incId, sev) {
  const row = $('#viewList tr[data-inc="' + incId + '"]');
  if (row) {
    row.dataset.sev = sev;
    const pill = row.querySelector('[data-role="list-sev"]');
    pill.textContent = SEV[sev];
    pill.className = ("pill " + LVL_CLASS[sev]).trim();
  }
  const tab = $('.it[data-i="' + incId + '"] [data-role="tab-sev"]');
  if (tab) tab.textContent = SEV[sev];
}
$$(".incident").forEach(panel => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY(panel.dataset.inc)) || "null");
    if (saved) applySaved(panel, saved);
  } catch (e) { }
});

/* ---------- Màn hình danh sách ---------- */
function showList() {
  viewDetail.hidden = true;
  viewList.hidden = false;

  const q = filter.q.trim().toLowerCase();
  const rows = $$("#viewList tr[data-inc]");
  let shown = 0;
  rows.forEach(r => {
    const ok = (!q || r.dataset.order.toLowerCase().includes(q)) &&
      (!filter.sev || r.dataset.sev === filter.sev) &&
      (filter.x === "" || r.dataset.status === filter.x) &&
      (!filter.from || r.dataset.date >= filter.from);
    r.hidden = !ok;
    if (ok) shown++;
  });

  // Đơn tồn tại nhưng chưa có sự cố -> gợi ý xem đơn đó
  const orderExists = q && $('#viewDetail .grid[data-order="' + filter.q.trim().toUpperCase() + '"]');
  const miss = !shown && orderExists ? orderExists.dataset.order : null;
  $("#listMiss").hidden = !miss;
  if (miss) {
    $("#listMissId").textContent = miss;
    $("#listMissLink").href = "#/su-co/" + miss;
  }

  $("#emptyRow").hidden = shown > 0;
  if (!shown) $("#emptyText").textContent = q && !miss ? "Không tìm thấy đơn hàng phù hợp" : "Không có sự cố phù hợp bộ lọc";
}
function runFilter() {
  filter.q = $("#q").value; filter.sev = $("#fs").value; filter.x = $("#fx").value; filter.from = $("#fd").value;
  showList();
}
$("#go").onclick = runFilter;
$("#q").addEventListener("keydown", e => { if (e.key === "Enter") runFilter(); });
["#fs", "#fx", "#fd"].forEach(s => $(s).onchange = runFilter);
$("#clr").onclick = () => {
  Object.assign(filter, { q: "", sev: "", x: "", from: "" });
  $("#q").value = ""; $("#fs").value = ""; $("#fx").value = ""; $("#fd").value = "";
  showList();
};

/* ---------- Màn hình chi tiết ---------- */
function showDetail(id, incId) {
  viewList.hidden = true;
  viewDetail.hidden = false;

  const order = $('#viewDetail .grid[data-order="' + id + '"]');
  $$("#viewDetail .grid").forEach(g => g.hidden = g !== order);
  $("#detailMiss").hidden = !!order;
  $("#detailTitle").textContent = order ? id : "Không tìm thấy";
  $("#dq").value = id;
  if (!order) return;

  const panels = Array.from(order.querySelectorAll(".incident"));
  if (!panels.length) return;
  const current = panels.find(p => p.dataset.inc === incId) || panels[0];
  panels.forEach(p => p.hidden = p !== current);
  order.querySelectorAll(".it").forEach(b => b.classList.toggle("on", b.dataset.i === current.dataset.inc));
}
function runDetailSearch() {
  const v = $("#dq").value.trim();
  if (v) location.hash = "#/su-co/" + encodeURIComponent(v.toUpperCase());
}
$("#dgo").onclick = runDetailSearch;
$("#dq").addEventListener("keydown", e => { if (e.key === "Enter") runDetailSearch(); });
$("#dclr").onclick = $("#back").onclick = () => location.hash = "#/su-co";

// chuyển giữa các sự cố của cùng một đơn
$$(".it").forEach(b => b.onclick = () => {
  const order = b.closest(".grid").dataset.order;
  location.hash = "#/su-co/" + order + "?i=" + b.dataset.i;
});
// chọn mức độ
$$(".incident .sev").forEach(p => p.onclick = () => {
  p.parentNode.querySelectorAll(".sev").forEach(x => x.classList.toggle("on", x === p));
});
// lưu ghi chú
$$('.incident [data-role="save"]').forEach(btn => btn.onclick = () => {
  const panel = btn.closest(".incident"), id = panel.dataset.inc;
  const sev = panel.querySelector(".sev.on").dataset.s;
  const note = panel.querySelector(".note").value;
  const upd = new Date().toLocaleString("vi-VN") + " · " + (SFAuth.get() ? SFAuth.get().name : "Admin ShipFast");
  try { localStorage.setItem(KEY(id), JSON.stringify({ sev, note, upd })); }
  catch (e) { SFToast("Lưu thất bại, nội dung vẫn được giữ lại.", true); return; }
  panel.querySelector('[data-role="upd"]').textContent = upd;
  syncSeverity(id, sev);
  SFToast("Đã lưu ghi chú cho " + id);
});

/* ---------- Điều hướng theo địa chỉ ---------- */
function route() {
  const h = decodeURIComponent(location.hash || "#/su-co");
  const m = h.match(/^#\/su-co\/([^?]+)(?:\?i=(.+))?$/);
  if (m) showDetail(m[1].toUpperCase(), m[2]); else showList();
  window.scrollTo(0, 0);
}
addEventListener("hashchange", route);
route();
