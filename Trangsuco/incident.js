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

const ST = [["Đã tạo đơn", "Hệ thống đã tiếp nhận đơn hàng"], ["Đã lấy hàng", "Nhân viên đã lấy hàng tại người gửi"], ["Đang vận chuyển", "Hàng đang đến bưu cục tiếp theo"], ["Đang giao hàng", "Đơn đang được giao đến người nhận"], ["Đã giao hàng", "Giao hàng thành công"]];
const PCT = [20, 40, 60, 80, 100], SEV = { l: "Thấp", m: "Trung bình", h: "Cao" }, XL = ["Mới ghi nhận", "Đang xử lý", "Đã xử lý"];
const O = [
  {
    id: "SF123456789VN", s: 3, eta: "14/10/2026 – 18:00", snd: ["Nguyễn Văn A", "0912 345 678", "123 Nguyễn Trãi, Q. Thanh Xuân, Hà Nội"], rcv: ["Trần Thị B", "0934 567 899", "45 Lê Lợi, P. Hòa Cường, Q. Hải Châu, Đà Nẵng"], svc: "Giao tiêu chuẩn", w: 2.5, d: "20 × 20 × 15", fee: 45000, cod: 1310000, dr: ["Trần Minh Đức", "0901 234 567"], h: ["12/10/2026 09:30", "12/10/2026 12:15", "13/10/2026 08:20", "14/10/2026 09:05"],
    inc: [{ id: "SC-0001", type: "Khách hẹn lại giờ giao", desc: "Người nhận yêu cầu giao sau 16:00.", at: "14/10/2026 09:40", ts: "2026-10-14", sev: "l", x: 1, staff: "Lê Thu Hà", note: "Đã liên hệ người nhận, thống nhất giao sau 16:00." }]
  },
  {
    id: "SF987654321VN", s: 2, eta: "15/10/2026 – 12:00", snd: ["Công ty Minh Phát", "0283 777 888", "12 Điện Biên Phủ, Q.1, TP.HCM"], rcv: ["Phạm Quốc Huy", "0977 123 456", "8 Trần Phú, TP. Nha Trang, Khánh Hòa"], svc: "Giao nhanh", w: 5, d: "40 × 30 × 25", fee: 92000, cod: 0, dr: ["Võ Thanh Tùng", "0988 111 222"], h: ["13/10/2026 08:00", "13/10/2026 10:30", "14/10/2026 07:45"],
    inc: [{ id: "SC-0002", type: "Hàng bị hư hỏng", desc: "Thùng hàng móp méo khi trung chuyển.", at: "14/10/2026 10:10", ts: "2026-10-14", sev: "h", x: 1, staff: "Nguyễn Hải Yến", note: "Đang chụp ảnh hiện trạng, chờ khách xác nhận mức đền bù." },
    { id: "SC-0003", type: "Chậm tiến độ", desc: "Xe tuyến đến trễ 6 giờ.", at: "14/10/2026 11:00", ts: "2026-10-14", sev: "m", x: 0, staff: "Lê Thu Hà", note: "" }]
  },
  {
    id: "SF555000111VN", s: 1, eta: "16/10/2026 – 17:00", snd: ["Hoàng Mai", "0903 222 333", "99 Lý Thường Kiệt, Huế"], rcv: ["Đỗ Văn Khoa", "0966 888 000", "27 Nguyễn Huệ, Q.1, TP.HCM"], svc: "Giao tiêu chuẩn", w: 1.2, d: "25 × 15 × 10", fee: 38000, cod: 450000, dr: null, h: ["14/10/2026 08:10", "14/10/2026 13:30"],
    inc: [{ id: "SC-0004", type: "Sai địa chỉ người nhận", desc: "Địa chỉ không đủ thông tin để giao.", at: "14/10/2026 15:20", ts: "2026-10-14", sev: "m", x: 1, staff: "Trần Bảo Nam", note: "Đã gọi người nhận xin địa chỉ chi tiết." }]
  },
  {
    id: "SF246813579VN", s: 4, eta: "12/10/2026 – 15:00", snd: ["Cửa hàng Sen Việt", "0911 000 111", "5 Hai Bà Trưng, Hà Nội"], rcv: ["Bùi Lan Anh", "0933 444 555", "70 Nguyễn Văn Linh, Cần Thơ"], svc: "Giao nhanh", w: 0.8, d: "20 × 15 × 8", fee: 52000, cod: 210000, dr: ["Võ Thanh Tùng", "0988 111 222"], h: ["09/10/2026 09:00", "09/10/2026 11:00", "10/10/2026 08:00", "12/10/2026 09:00", "12/10/2026 14:20"],
    inc: [{ id: "SC-0005", type: "Thất lạc tạm thời", desc: "Mất quét tại bưu cục trung chuyển.", at: "10/10/2026 18:00", ts: "2026-10-10", sev: "h", x: 2, staff: "Nguyễn Hải Yến", note: "Đã tìm thấy hàng và tiếp tục vận chuyển." }]
  },
  { id: "SF111222333VN", s: 0, eta: "17/10/2026 – 18:00", snd: ["Lương Gia Bảo", "0944 555 666", "31 Nguyễn Thái Học, Hà Nội"], rcv: ["Mai Thu Trang", "0955 666 777", "3 Pasteur, Q.3, TP.HCM"], svc: "Giao tiêu chuẩn", w: 3, d: "30 × 20 × 20", fee: 60000, cod: 0, dr: null, h: ["15/10/2026 16:00"], inc: [] }
];
// ghi chú/mức độ đã lưu (riêng từng mã sự cố)
const K = id => "sf_inc_" + id;
function load() { O.forEach(o => o.inc.forEach(i => { try { const v = JSON.parse(localStorage.getItem(K(i.id)) || "null"); if (v) Object.assign(i, v) } catch (e) { } })) } load();
const $ = s => document.querySelector(s), vnd = n => n.toLocaleString("vi-VN") + " VND", esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const toast = (t, e) => { const x = $('#toast'); x.textContent = t; x.style.background = e ? "#c0392b" : "#0b2a4a"; x.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(() => x.style.display = "none", 3000) };
const ft = { q: "", sev: "", x: "", from: "" }; let sel = null, draft = null;
const sevP = v => `<span class="pill" style="${v == 'h' ? 'background:#fde0e0;border-color:#d33' : v == 'm' ? 'background:#ffedc9;border-color:#e08a00' : ''}">${SEV[v]}</span>`;

function list() {
  const rows = []; O.forEach(o => o.inc.forEach(i => rows.push([o, i])));
  const f = rows.filter(([o, i]) => (!ft.q || o.id.toLowerCase().includes(ft.q.trim().toLowerCase())) && (!ft.sev || i.sev == ft.sev) && (ft.x === "" || i.x == ft.x) && (!ft.from || i.ts >= ft.from));
  const q = ft.q.trim(), miss = q && !f.length ? O.find(o => o.id.toLowerCase() == q.toLowerCase()) : null;
  $('#app').innerHTML = `<div class="crumb">Quản lý sự cố</div><h1 class="ttl">${ico("triangle-alert", 24)}Quản lý sự cố</h1><br>
 <div class="bar"><label class="ic">${ico("search")}<input type="text" id="q" placeholder="Nhập mã đơn hàng…" value="${esc(ft.q)}"></label>
 <label class="ic sm">${ico("flag")}<select id="fs"><option value="">Mức độ: Tất cả</option>${Object.entries(SEV).map(([k, v]) => `<option value="${k}" ${ft.sev == k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
 <label class="ic sm">${ico("circle-check")}<select id="fx"><option value="">Trạng thái: Tất cả</option>${XL.map((v, k) => `<option value="${k}" ${ft.x !== "" && ft.x == k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
 <label class="ic sm">${ico("calendar")}<input type="date" id="fd" value="${ft.from}" title="Phát sinh từ ngày"></label><button class="btn" id="go">Tìm kiếm</button><button class="btn o" id="clr">Xóa lọc</button></div>
 ${miss ? `<div class="msg">Đơn hàng này chưa ghi nhận sự cố. <a class="lnk" href="#/su-co/${miss.id}">Xem đơn ${miss.id}</a></div>` : ''}
 <div class="card tw"><table><tr><th>Mã đơn</th><th>Mã sự cố</th><th>Khách hàng</th><th>Loại sự cố</th><th>Phát sinh</th><th>Mức độ</th><th>Trạng thái</th><th>Phụ trách</th><th></th></tr>
 ${f.map(([o, i]) => `<tr><td><a class="lnk" href="#/su-co/${o.id}?i=${i.id}">${o.id}</a></td><td>${i.id}</td><td>${esc(o.rcv[0])}</td><td>${esc(i.type)}</td><td>${i.at}</td><td>${sevP(i.sev)}</td><td>${XL[i.x]}</td><td>${esc(i.staff)}</td><td><a class="lnk" href="#/su-co/${o.id}?i=${i.id}">Xem</a></td></tr>`).join('') || `<tr><td colspan="9">${q && !miss ? 'Không tìm thấy đơn hàng phù hợp' : 'Không có sự cố phù hợp bộ lọc'}</td></tr>`}</table></div>`;
  const run = () => { ft.q = $('#q').value; ft.sev = $('#fs').value; ft.x = $('#fx').value; ft.from = $('#fd').value; list() };
  $('#go').onclick = run; $('#q').onkeydown = e => e.key == "Enter" && run();["#fs", "#fx", "#fd"].forEach(s => $(s).onchange = run);
  $('#clr').onclick = () => { Object.assign(ft, { q: "", sev: "", x: "", from: "" }); list() };
}

function detail(id, iid, searched) {
  const o = O.find(x => x.id == id);
  const bar = `<div class="bar"><label class="ic">${ico("search")}<input type="text" id="q" placeholder="Nhập mã đơn hàng…" value="${esc(searched ?? id)}"></label><button class="btn" id="go">Tìm kiếm</button><button class="btn o" id="clr">Làm mới</button></div>`;
  const head = t => `<div class="top"><div><div class="crumb">Quản lý sự cố / Chi tiết sự cố</div><h1>${t}</h1></div><button class="btn o" id="back">Quay lại danh sách</button></div>`;
  const bind = () => {
    const run = () => { const v = $('#q').value.trim(); v && (location.hash = "#/su-co/" + encodeURIComponent(v.toUpperCase())) };
    $('#go').onclick = run; $('#q').onkeydown = e => e.key == "Enter" && run(); $('#clr').onclick = () => location.hash = "#/su-co"; $('#back').onclick = () => location.hash = "#/su-co"
  };
  if (!o) { $('#app').innerHTML = head("Không tìm thấy") + bar + `<div class="msg">Không tìm thấy đơn hàng phù hợp</div>`; $('#q').value = id; bind(); return }
  const inc = o.inc.find(i => i.id == iid) || o.inc[0] || null;
  if (!sel || sel.id != (inc && inc.id)) { draft = inc ? { sev: inc.sev, note: inc.note } : null; sel = inc }
  const row = (a, b) => `<div class="row"><span>${a}</span><b>${esc(b || "Chưa cập nhật")}</b></div>`;
  const tl = ST.map((s, k) => {
    const cls = k < o.s ? "" : k == o.s && o.s < 4 ? "cur" : k == o.s ? "" : "todo"; const done = k <= o.s && o.h[k];
    return `<div class="st ${cls}"><b>${s[0]}</b>${done ? o.h[k] + " · " + s[1] : "Chưa hoàn thành"}</div>`
  }).join('');
  const incTl = o.inc.map(i => `<div class="st inc"><b style="color:#d33">Sự cố ${i.id}: ${esc(i.type)}</b>${i.at}</div>`).join('');
  const p = PCT[o.s];
  $('#app').innerHTML = head(o.id) + bar + `<div class="grid"><div class="col">
 <div class="card stat"><div><div class="crumb">Trạng thái hiện tại</div><p style="margin:6px 0"><span class="pill s1">${ST[o.s][0]}</span></p><div style="font-size:12px">${o.s == 4 ? "Đã giao: " + o.h[4] : "Dự kiến giao: " + o.eta}</div></div>
  <div style="text-align:center"><div class="ring" style="background:conic-gradient(var(--teal) ${p}%,var(--line) 0)"><div>${p}%</div></div><div class="crumb">Tiến trình đơn</div></div></div>
 <div class="card"><h3>Người gửi</h3>${row("Họ tên", o.snd[0])}${row("Điện thoại", o.snd[1])}${row("Địa chỉ", o.snd[2])}</div>
 <div class="card"><h3>Người nhận</h3>${row("Họ tên", o.rcv[0])}${row("Điện thoại", o.rcv[1])}${row("Địa chỉ", o.rcv[2])}</div>
 <div class="card"><h3>Thông tin đơn hàng</h3>${row("Dịch vụ", o.svc)}${row("Khối lượng", o.w.toLocaleString("vi-VN", { minimumFractionDigits: 2 }) + " kg")}${row("Kích thước", o.d + " cm")}${row("Phí vận chuyển", vnd(o.fee))}${row("Thu hộ (COD)", vnd(o.cod))}
  <div style="display:flex;gap:10px;margin-top:12px"><button class="btn" style="flex:1" data-n="SMS">Gửi SMS</button><button class="btn o" style="flex:1" data-n="Email">Gửi Email</button></div></div>
 </div><div class="col">
 <div class="card"><h3>Lịch sử hành trình đơn hàng</h3><div class="tl">${tl}${incTl}</div></div>
 <div class="card"><h3>Tài xế phụ trách</h3>${row("Họ tên", o.dr ? o.dr[0] : "Chưa phân công")}${row("Điện thoại", o.dr ? o.dr[1] : "Chưa phân công")}</div>
 <div class="card"><h3 class="ttl">${ico("file-text")}Ghi chú / Xử lý sự cố</h3>${inc ? `
  ${o.inc.length > 1 ? `<div class="il">${o.inc.map(i => `<button class="it ${i.id == inc.id ? 'on' : ''}" data-i="${i.id}">${i.id} · ${SEV[i.sev]}</button>`).join('')}</div>` : ''}
  <div class="row"><span>Loại sự cố</span><b>${esc(inc.type)}</b></div><div class="row"><span>Mô tả</span><b>${esc(inc.desc)}</b></div>
  <div class="row"><span>Phát sinh</span><b>${inc.at}</b></div><div class="row"><span>Trạng thái xử lý</span><b>${XL[inc.x]}</b></div>
  <div class="row"><span>Phụ trách</span><b>${esc(inc.staff)}</b></div><div class="row"><span>Cập nhật gần nhất</span><b>${inc.upd || "Chưa cập nhật"}</b></div>
  <div class="crumb ttl" style="margin-top:8px">${ico("flag", 14)}Mức độ sự cố</div><div style="display:flex;gap:8px;margin:6px 0 10px">${Object.entries(SEV).map(([k, v]) => `<span class="pill sev ${k} ${draft.sev == k ? 'on' : ''}" data-s="${k}">${v}</span>`).join('')}</div>
  <div class="crumb ttl">${ico("file-text", 14)}Ghi chú</div><textarea id="note">${esc(draft.note)}</textarea>
  <div style="text-align:right;margin-top:10px"><button class="btn" id="save">Lưu ghi chú</button></div>`
      : `<div class="msg" style="margin:0">Đơn hàng này chưa ghi nhận sự cố</div>`}</div>
 </div></div>`;
  bind();
  document.querySelectorAll('[data-n]').forEach(b => b.onclick = () => toast("Chức năng gửi " + b.dataset.n + " chưa được tích hợp.", 1));
  if (!inc) return;
  document.querySelectorAll('[data-i]').forEach(b => b.onclick = () => location.hash = `#/su-co/${o.id}?i=${b.dataset.i}`);
  document.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { draft.note = $('#note').value; draft.sev = b.dataset.s; detail(id, inc.id, searched) });
  $('#save').onclick = () => {
    const note = $('#note').value, upd = new Date().toLocaleString("vi-VN") + " · Admin ShipFast";
    try { localStorage.setItem(K(inc.id), JSON.stringify({ sev: draft.sev, note, upd })) } catch (e) { toast("Lưu thất bại, nội dung vẫn được giữ lại.", 1); draft.note = note; return }
    Object.assign(inc, { sev: draft.sev, note, upd }); draft.note = note; toast("Đã lưu ghi chú cho " + inc.id); detail(id, inc.id, searched)
  };
}
function route() {
  const h = decodeURIComponent(location.hash || "#/su-co"), m = h.match(/^#\/su-co\/([^?]+)(?:\?i=(.+))?$/);
  $('#app').innerHTML = '<p>Đang tải…</p>';
  if (m) { sel = null; detail(m[1].toUpperCase(), m[2]) } else list(); window.scrollTo(0, 0)
}
addEventListener("hashchange", route); route();
