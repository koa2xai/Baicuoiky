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

const STATUS = {
  incident: { label: "Gặp sự cố", color: "#ef4a5a" },
  pending: { label: "Chờ lấy hàng", color: "#f5b731" },
  shipping: { label: "Đang giao hàng", color: "#3b82f6" },
  delivered: { label: "Đã giao hàng", color: "#17b97f" },
};
const GROUPS = ["delivered", "shipping", "pending", "incident"]; // thứ tự hiển thị

// Tạo đúng 8 đơn hàng cố định
function buildSampleOrders() {
  const customers = ["Nguyễn Văn A", "Công ty TNHH ABC", "Phạm Thị B", "Công ty XYZ", "Trần Văn C", "Lê Thị D", "Hoàng Văn Nam", "Công ty 123"];
  const regions = ["Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh", "Hải Phòng", "Cần Thơ"];
  const staff = ["Trần Minh Đức", "Lê Thị Hương", "Nguyễn Hoàng Nam", "Phạm Quốc Anh"];
  const pattern = ["delivered", "shipping", "delivered", "pending", "delivered", "incident", "delivered", "shipping"];
  const days = ["2026-10-01", "2026-10-05", "2026-10-08", "2026-10-10", "2026-10-12", "2026-10-14", "2026-10-15", "2026-10-15"];

  const list = [];
  for (let i = 0; i < 8; i++) {
    const date = days[i];
    let status = pattern[i];
    list.push({
      code: "SF" + (123456789 + i) + "VN",
      customer: customers[i],
      region: regions[i % regions.length],
      createdAt: date + " " + pad(8 + (i * 2)) + ":" + pad((i * 15) % 60),
      expected: addDays(date, 2),
      status: status,
      staff: staff[i % staff.length],
      fee: 25000 + (i * 5000),      // phí vận chuyển
      surcharge: i % 3 === 0 ? 15000 : 0,    // phụ phí
      discount: i % 4 === 0 ? 10000 : 0,     // giảm giá
      cod: i % 2 === 0 ? 200000 + i * 10000 : 0, // tiền thu hộ
    });
  }
  return list;
}

/* ---------- 2. HÀM TIỆN ÍCH (ngày giờ, tiền tệ) ---------- */
// Toàn bộ ngày được xử lý dạng chữ "YYYY-MM-DD" theo giờ Việt Nam, nên không bị lệch múi giờ.
function pad(n) { return String(n).padStart(2, "0"); }
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function fmtDate(s) { return s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4); }
function fmtDateTime(s) { return fmtDate(s) + " " + s.slice(11, 16); }
function fmtMoney(v) { return v.toLocaleString("vi-VN") + " ₫"; }
function fmtShort(v) { return v >= 1e6 ? (v / 1e6).toFixed(1).replace(".", ",") + " tr" : Math.round(v / 1000) + "k"; }
function pct(a, b) { return b === 0 ? 0 : (a / b) * 100; }
function fmtPct(a, b) { return pct(a, b).toFixed(1).replace(".", ",") + "%"; }

/* ---------- 3. KHOẢNG THỜI GIAN ---------- */
// Trả về { from, to, label } cho ngày / tuần / tháng
function getRange(type, value) {
  if (type === "day") return { from: value, to: value, label: fmtDate(value) };
  if (type === "month") {
    const y = +value.slice(0, 4), m = +value.slice(5, 7);
    const last = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
    return { from: value + "-01", to: last, label: "Tháng " + m + "/" + y };
  }
  // Tuần ISO, ví dụ "2026-W42": tuần 1 là tuần chứa ngày 4/1, tuần bắt đầu từ thứ Hai
  const y = +value.slice(0, 4), w = +value.slice(6);
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const monday1 = addDays(jan4.toISOString().slice(0, 10), -((jan4.getUTCDay() + 6) % 7));
  const from = addDays(monday1, (w - 1) * 7), to = addDays(from, 6);
  return { from, to, label: "Tuần " + w + "/" + y + " (" + fmtDate(from) + " - " + fmtDate(to) + ")" };
}
// Kỳ liền trước (để so sánh)
function getPrevRange(type, range) {
  if (type === "month") return getRange("month", addDays(range.from, -1).slice(0, 7));
  const n = type === "day" ? 1 : 7;
  return { from: addDays(range.from, -n), to: addDays(range.to, -n) };
}

/* ---------- 4. QUY TẮC DOANH THU (MỘT hàm duy nhất cho cả trang) ---------- */
// - Chỉ đơn "đã giao" mới ghi nhận doanh thu; đơn khác = 0.
// - Doanh thu = phí vận chuyển + phụ phí - giảm giá. COD KHÔNG được cộng.
// - Đơn được xếp vào kỳ theo ngày tạo đơn (dữ liệu mẫu chưa có ngày hoàn thành).
function calcRevenue(order) {
  if (order.status !== "delivered") return 0;
  return Math.max(0, order.fee + order.surcharge - order.discount);
}

/* ---------- 5. LỌC & TỔNG HỢP ---------- */
const ALL_ORDERS = buildSampleOrders();

// Bước 1: tách đơn thuộc 4 nhóm báo cáo (loại đơn hủy/hoàn)
function isReportable(o) { return GROUPS.includes(o.status); }

// Bước 2: lọc theo kỳ + mã đơn + trạng thái
function filterOrders(range, code, status) {
  const keyword = code.trim().toLowerCase();
  return ALL_ORDERS.filter(o => {
    const day = o.createdAt.slice(0, 10);
    return isReportable(o)
      && day >= range.from && day <= range.to
      && (keyword === "" || o.code.toLowerCase().includes(keyword))
      && (status === "all" || o.status === status);
  });
}

// Bước 3: tính mọi con số từ danh sách đã lọc
function summarize(orders) {
  const byStatus = { delivered: 0, shipping: 0, pending: 0, incident: 0 };
  let revenue = 0;
  orders.forEach(o => { byStatus[o.status]++; revenue += calcRevenue(o); });
  return { count: orders.length, revenue, byStatus };
}

// Gom doanh thu theo cột biểu đồ: giờ (ngày) hoặc ngày (tuần/tháng)
function buildBuckets(orders, type, range) {
  const buckets = [];
  if (type === "day") for (let h = 0; h < 24; h++) buckets.push({ key: pad(h), label: pad(h) + "h", revenue: 0, count: 0, text: pad(h) + ":00" });
  else for (let d = range.from; d <= range.to; d = addDays(d, 1))
    buckets.push({ key: d, label: type === "month" ? d.slice(8) : d.slice(8) + "/" + d.slice(5, 7), revenue: 0, count: 0, text: fmtDate(d) });
  orders.forEach(o => {
    const key = type === "day" ? o.createdAt.slice(11, 13) : o.createdAt.slice(0, 10);
    const b = buckets.find(x => x.key === key);
    b.revenue += calcRevenue(o); b.count++;
  });
  return buckets;
}

/* ---------- 6. VẼ GIAO DIỆN ---------- */
const $ = id => document.getElementById(id);
const state = { type: "month", values: { day: "2026-10-15", week: "2026-W42", month: "2026-10" }, page: 1, pageSize: 5 };

function renderStats(s, prev) {
  const change = (cur, old) => {
    if (old === 0) return '<span>Kỳ trước chưa có dữ liệu để so sánh</span>';
    const p = ((cur - old) / old) * 100;
    return '<span class="' + (p >= 0 ? "up" : "down") + '">' + (p >= 0 ? "+" : "") + p.toFixed(1).replace(".", ",") + "% so với kỳ trước</span>";
  };
  const cards = [
    { ic: "banknote", name: "Tổng doanh thu", cls: "c-teal", value: fmtMoney(s.revenue), note: change(s.revenue, prev.revenue) },
    { ic: "package", name: "Tổng số đơn hàng", cls: "c-blue", value: s.count.toLocaleString("vi-VN"), note: change(s.count, prev.count) },
    { ic: "circle-check", name: "Đơn hàng đã giao", cls: "c-green", value: s.byStatus.delivered.toLocaleString("vi-VN"), note: fmtPct(s.byStatus.delivered, s.count) + " tổng số đơn" },
    { ic: "triangle-alert", name: "Đơn hàng gặp sự cố", cls: "c-red", value: s.byStatus.incident.toLocaleString("vi-VN"), note: fmtPct(s.byStatus.incident, s.count) + " tổng số đơn" },
  ];
  $("stats").innerHTML = cards.map(c =>
    '<div class="stat"><div class="name ' + c.cls + '">' + ico(c.ic) + c.name + '</div><div class="value">' + c.value + '</div><div class="note">' + c.note + "</div></div>").join("");
}

function renderBarChart(buckets, range, s) {
  const max = Math.max(...buckets.map(b => b.revenue));
  const ticks = max === 0 ? [0] : [0, 0.25, 0.5, 0.75, 1];
  let html = ticks.map(t => '<div class="gridline" style="bottom:calc(22px + (100% - 22px) * ' + t + ')"></div><div class="ytick" style="bottom:calc(22px + (100% - 22px) * ' + t + ')">' + fmtShort(max * t) + "</div>").join("");
  const showLabel = i => buckets.length <= 8 || i % Math.ceil(buckets.length / 12) === 0;
  buckets.forEach((b, i) => {
    const h = max === 0 ? 0 : (b.revenue / max) * 100;
    const tip = b.text + ": " + fmtMoney(b.revenue) + " - " + b.count + " đơn";
    html += '<div class="bar-col" data-tip="' + tip + '" title="' + tip + '"><div class="bar" style="height:' + h + '%"></div>' + (showLabel(i) ? "<span>" + b.label + "</span>" : "") + "</div>";
  });
  if (s.count === 0) html += '<div class="empty-chart">Không có dữ liệu trong bộ lọc này</div>';
  else if (s.revenue === 0) html += '<div class="empty-chart">Có ' + s.count + " đơn nhưng chưa có doanh thu ghi nhận (chỉ đơn đã giao mới tính)</div>";
  $("barChart").innerHTML = html;
  $("chartInfo").textContent = "Rê chuột hoặc bấm vào một cột để xem doanh thu và số đơn.";
  $("rangeLabel").textContent = range.label + (state.type === "day" ? " · theo giờ" : state.type === "week" ? " · theo ngày" : " · theo ngày");
}

function renderDonut(s) {
  let start = 0, parts = [];
  GROUPS.forEach(k => {
    const end = start + pct(s.byStatus[k], s.count);
    parts.push(STATUS[k].color + " " + start + "% " + end + "%");
    start = end;
  });
  $("donut").style.background = s.count === 0 ? "#e5e9ef" : "conic-gradient(" + parts.join(",") + ")";
  $("donutTotal").textContent = s.count.toLocaleString("vi-VN");
  $("legend").innerHTML = GROUPS.map(k =>
    '<li><span class="dot" style="background:' + STATUS[k].color + '"></span><span>' + STATUS[k].label + ": <b>" + s.byStatus[k] + " đơn</b> — " + fmtPct(s.byStatus[k], s.count) + "</span></li>").join("");
}

function renderTable(orders) {
  const total = orders.length, pages = Math.max(1, Math.ceil(total / state.pageSize));
  state.page = Math.min(state.page, pages);
  const startIdx = (state.page - 1) * state.pageSize;
  const rows = orders.slice(startIdx, startIdx + state.pageSize);
  $("tableBody").innerHTML = rows.length === 0
    ? '<tr><td colspan="8" class="empty-row">Không tìm thấy đơn hàng phù hợp</td></tr>'
    : rows.map(o => "<tr><td><a href=\"chi-tiet-don.html?ma=" + o.code + "\">" + o.code + "</a></td><td>" + o.customer + "</td><td>" + o.region + "</td><td>" + fmtDateTime(o.createdAt) +
      '</td><td><span class="badge b-' + o.status + '">' + STATUS[o.status].label + '</span></td><td class="right">' + fmtMoney(calcRevenue(o)) + "</td><td>" + fmtDate(o.expected) + "</td><td>" + o.staff + "</td></tr>").join("");
  $("tableInfo").textContent = total === 0 ? "Hiển thị 0 đơn" : "Hiển thị " + (startIdx + 1) + "–" + (startIdx + rows.length) + " trong " + total + " đơn";
  $("pageNo").textContent = "Trang " + state.page + "/" + pages;
  $("prevBtn").disabled = state.page <= 1;
  $("nextBtn").disabled = state.page >= pages;
}

// Tự kiểm tra: các thành phần phải khớp nhau. Kết quả hiện ở cuối bảng và trong console.
function selfCheck(orders, s, buckets) {
  const groupSum = GROUPS.reduce((t, k) => t + s.byStatus[k], 0);
  const barRevenue = buckets.reduce((t, b) => t + b.revenue, 0);
  const barCount = buckets.reduce((t, b) => t + b.count, 0);
  const tableRevenue = orders.reduce((t, o) => t + calcRevenue(o), 0);
  const ok = groupSum === s.count && s.count === orders.length && barRevenue === s.revenue && tableRevenue === s.revenue && barCount === s.count;
  $("checkResult").textContent = ok ? "✓ Kiểm tra: số đơn và doanh thu khớp giữa thẻ, biểu đồ và bảng." : "⚠ Số liệu chưa khớp, hãy kiểm tra lại hàm lọc.";
  if (!ok) console.error({ groupSum, barRevenue, barCount, tableRevenue, s });
}

/* ---------- 7. CẬP NHẬT TOÀN TRANG ---------- */
function update() {
  try {
    $("message").hidden = true;
    const status = $("statusFilter").value, code = $("orderCode").value;
    const range = getRange(state.type, state.values[state.type]);
    const orders = filterOrders(range, code, status);          // tập dữ liệu CHUNG
    const s = summarize(orders);
    const prev = summarize(filterOrders(getPrevRange(state.type, range), code, status));
    const buckets = buildBuckets(orders, state.type, range);

    renderStats(s, prev);
    renderBarChart(buckets, range, s);
    renderDonut(s);
    renderTable(orders);
    selfCheck(orders, s, buckets);

    // Báo số đơn hủy/hoàn bị loại để không "âm thầm" mất đơn
    const out = ALL_ORDERS.filter(o => !isReportable(o) && o.createdAt.slice(0, 10) >= range.from && o.createdAt.slice(0, 10) <= range.to).length;
    if (out > 0) { $("message").textContent = out + " đơn đã hủy/hoàn hàng trong kỳ này nằm ngoài báo cáo và không tính vào số liệu."; $("message").hidden = false; }
  } catch (err) {
    console.error(err);
    $("message").textContent = "Không thể tải dữ liệu báo cáo. Vui lòng thử lại.";
    $("message").className = "message error"; $("message").hidden = false;
  }
}

/* ---------- 8. SỰ KIỆN ---------- */
function setPeriodInput() {
  const input = $("periodValue");
  input.type = state.type === "day" ? "date" : state.type;   // date | week | month
  input.value = state.values[state.type];
}
$("periodType").addEventListener("change", e => { state.type = e.target.value; state.page = 1; setPeriodInput(); update(); });
$("periodValue").addEventListener("change", e => { if (e.target.value) { state.values[state.type] = e.target.value; state.page = 1; update(); } });
$("orderCode").addEventListener("input", () => { state.page = 1; update(); });
$("statusFilter").addEventListener("change", () => { state.page = 1; update(); });
$("clearBtn").addEventListener("click", () => { $("orderCode").value = ""; $("statusFilter").value = "all"; state.page = 1; update(); });
$("prevBtn").addEventListener("click", () => { state.page--; update(); });
$("nextBtn").addEventListener("click", () => { state.page++; update(); });
// Rê chuột / bấm vào cột biểu đồ -> hiện chi tiết
["mouseover", "click"].forEach(ev => $("barChart").addEventListener(ev, e => {
  const col = e.target.closest(".bar-col");
  if (!col) return;
  document.querySelectorAll(".bar-col.on").forEach(c => c.classList.remove("on"));
  col.classList.add("on");
  $("chartInfo").textContent = col.dataset.tip;
}));

// Khởi động: hiện trạng thái tải ngắn rồi vẽ báo cáo
setPeriodInput();
$("stats").innerHTML = '<p class="muted">Đang tải dữ liệu...</p>';
setTimeout(update, 250);
