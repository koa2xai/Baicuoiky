/* =====================================================================
   ShipFast – Báo cáo & Thống kê
   Danh sách đơn hàng, khung thẻ thống kê, biểu đồ, chú giải đều nằm trong report.html.
   File này chỉ làm việc tính toán và thao tác:
   - đọc dữ liệu từ các dòng của bảng (thuộc tính data-*)
   - lọc theo kỳ / mã đơn / trạng thái, phân trang
   - điền số liệu vào thẻ, vẽ cột biểu đồ (nhân bản <template>), tô biểu đồ tròn
   ===================================================================== */
const GROUPS = ["delivered", "shipping", "pending", "incident"];   // thứ tự hiển thị

const $ = id => document.getElementById(id);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ---------- 1. Tiện ích ngày giờ, tiền tệ ---------- */
// Ngày được xử lý dạng chữ "YYYY-MM-DD" nên không bị lệch múi giờ.
function pad(n) { return String(n).padStart(2, "0"); }
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function fmtDate(s) { return s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4); }
function fmtMoney(v) { return v.toLocaleString("vi-VN") + " ₫"; }
function fmtShort(v) { return v >= 1e6 ? (v / 1e6).toFixed(1).replace(".", ",") + " tr" : Math.round(v / 1000) + "k"; }
function pct(a, b) { return b === 0 ? 0 : (a / b) * 100; }
function fmtPct(a, b) { return pct(a, b).toFixed(1).replace(".", ",") + "%"; }

/* ---------- 2. Khoảng thời gian ---------- */
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

/* ---------- 3. Dữ liệu: đọc từ bảng trong HTML ---------- */
// Doanh thu của từng đơn đã được ghi sẵn ở data-revenue (chỉ đơn "đã giao" mới có doanh thu; COD không tính).
const ALL_ORDERS = $$("#tableBody tr[data-code]").map(row => ({
  row: row,
  status: row.dataset.status,
  createdAt: row.dataset.created,            // "YYYY-MM-DD HH:MM"
  revenue: +row.dataset.revenue
}));

const periodInput = $("periodValue");
const state = {
  type: "month",
  values: { day: periodInput.dataset.day, week: periodInput.dataset.week, month: periodInput.dataset.month },
  page: 1,
  pageSize: 5
};

// Giá trị mặc định (dùng cho nút "Xóa bộ lọc")
const DEFAULTS = { type: state.type, values: Object.assign({}, state.values) };

// Kiểm tra giá trị ô "Thời gian" (trình duyệt không hỗ trợ ô tháng/tuần sẽ cho gõ tay nên có thể sai định dạng)
function isValidPeriod(type, v) {
  if (typeof v !== "string") return false;
  if (type === "day") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const d = new Date(v + "T00:00:00Z");
    return !isNaN(d) && d.toISOString().slice(0, 10) === v;   // loại ngày không tồn tại như 2026-02-30
  }
  if (type === "month") return /^\d{4}-(0[1-9]|1[0-2])$/.test(v);
  const m = /^(\d{4})-W(\d{2})$/.exec(v);
  if (!m || +m[2] < 1 || +m[2] > 53) return false;
  return addDays(getRange("week", v).from, 3).slice(0, 4) === m[1];   // tuần 53 chỉ có ở năm có 53 tuần
}
const PERIOD_HINT = { day: "YYYY-MM-DD", week: "YYYY-Www (vd 2026-W42)", month: "YYYY-MM (vd 2026-10)" };

/* ---------- 4. Lọc & tổng hợp ---------- */
function filterOrders(range, code, status) {
  const keyword = code.trim().toLowerCase();
  return ALL_ORDERS.filter(o => {
    const day = o.createdAt.slice(0, 10);
    return day >= range.from && day <= range.to
      && (keyword === "" || o.row.dataset.code.toLowerCase().includes(keyword))
      && (status === "all" || o.status === status);
  });
}
function summarize(orders) {
  const byStatus = { delivered: 0, shipping: 0, pending: 0, incident: 0 };
  let revenue = 0;
  orders.forEach(o => { byStatus[o.status]++; revenue += o.revenue; });
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
    b.revenue += o.revenue; b.count++;
  });
  return buckets;
}

/* ---------- 5. Điền số liệu vào giao diện ---------- */
function setNote(key, text, cls) {
  const el = document.querySelector('[data-note="' + key + '"]');
  el.textContent = text;
  el.className = cls || "";
}
function changeNote(key, cur, old) {
  if (old === 0) return setNote(key, "Kỳ trước chưa có dữ liệu để so sánh");
  const p = ((cur - old) / old) * 100;
  setNote(key, (p >= 0 ? "+" : "") + p.toFixed(1).replace(".", ",") + "% so với kỳ trước", p >= 0 ? "up" : "down");
}
function renderStats(s, prev) {
  document.querySelector('[data-stat="revenue"]').textContent = fmtMoney(s.revenue);
  document.querySelector('[data-stat="count"]').textContent = s.count.toLocaleString("vi-VN");
  document.querySelector('[data-stat="delivered"]').textContent = s.byStatus.delivered.toLocaleString("vi-VN");
  document.querySelector('[data-stat="incident"]').textContent = s.byStatus.incident.toLocaleString("vi-VN");
  changeNote("revenue", s.revenue, prev.revenue);
  changeNote("count", s.count, prev.count);
  setNote("delivered", fmtPct(s.byStatus.delivered, s.count) + " tổng số đơn");
  setNote("incident", fmtPct(s.byStatus.incident, s.count) + " tổng số đơn");
}

function renderBarChart(buckets, range, s) {
  const chart = $("barChart"), empty = $("emptyChart");
  chart.querySelectorAll(".gridline, .ytick, .bar-col").forEach(n => n.remove());

  const max = Math.max(...buckets.map(b => b.revenue));
  const ticks = max === 0 ? [0] : [0, 0.25, 0.5, 0.75, 1];
  ticks.forEach(t => {
    const frag = $("tickTpl").content.cloneNode(true);
    const pos = "calc(22px + (100% - 22px) * " + t + ")";
    frag.querySelector(".gridline").style.bottom = pos;
    const y = frag.querySelector(".ytick");
    y.style.bottom = pos;
    y.textContent = fmtShort(max * t);
    chart.insertBefore(frag, empty);
  });

  const showLabel = i => buckets.length <= 8 || i % Math.ceil(buckets.length / 12) === 0;
  buckets.forEach((b, i) => {
    const col = $("barTpl").content.firstElementChild.cloneNode(true);
    const tip = b.text + ": " + fmtMoney(b.revenue) + " - " + b.count + " đơn";
    col.dataset.tip = tip;
    col.title = tip;
    col.querySelector(".bar").style.height = (max === 0 ? 0 : (b.revenue / max) * 100) + "%";
    const label = col.querySelector("span");
    if (showLabel(i)) label.textContent = b.label; else label.remove();
    chart.insertBefore(col, empty);
  });

  if (s.count === 0) empty.textContent = "Không có dữ liệu trong bộ lọc này";
  else if (s.revenue === 0) empty.textContent = "Có " + s.count + " đơn nhưng chưa có doanh thu ghi nhận (chỉ đơn đã giao mới tính)";
  empty.hidden = s.count > 0 && s.revenue > 0;

  $("chartInfo").textContent = "Rê chuột hoặc bấm vào một cột để xem doanh thu và số đơn.";
  $("rangeLabel").textContent = range.label + (state.type === "day" ? " · theo giờ" : " · theo ngày");
}

function renderDonut(s) {
  let start = 0;
  const parts = [];
  GROUPS.forEach(k => {
    const li = document.querySelector('#legend li[data-status="' + k + '"]');
    li.querySelector("[data-count]").textContent = s.byStatus[k] + " đơn";
    li.querySelector("[data-pct]").textContent = fmtPct(s.byStatus[k], s.count);
    const color = getComputedStyle(li.querySelector(".dot")).backgroundColor;   // màu lấy từ CSS (.d-delivered ...)
    const end = start + pct(s.byStatus[k], s.count);
    parts.push(color + " " + start + "% " + end + "%");
    start = end;
  });
  $("donut").style.background = s.count === 0 ? "#e5e9ef" : "conic-gradient(" + parts.join(",") + ")";
  $("donutTotal").textContent = s.count.toLocaleString("vi-VN");
}

function renderTable(orders) {
  const total = orders.length, pages = Math.max(1, Math.ceil(total / state.pageSize));
  state.page = Math.min(state.page, pages);
  const startIdx = (state.page - 1) * state.pageSize;
  const visible = orders.slice(startIdx, startIdx + state.pageSize);

  ALL_ORDERS.forEach(o => { o.row.hidden = !visible.includes(o); });
  $("emptyRow").hidden = visible.length > 0;

  $("tableInfo").textContent = total === 0 ? "Hiển thị 0 đơn" : "Hiển thị " + (startIdx + 1) + "–" + (startIdx + visible.length) + " trong " + total + " đơn";
  $("pageNo").textContent = "Trang " + state.page + "/" + pages;
  $("prevBtn").disabled = state.page <= 1;
  $("nextBtn").disabled = state.page >= pages;
}

// Tự kiểm tra: các thành phần phải khớp nhau. Kết quả hiện ở cuối bảng và trong console.
function selfCheck(orders, s, buckets) {
  const groupSum = GROUPS.reduce((t, k) => t + s.byStatus[k], 0);
  const barRevenue = buckets.reduce((t, b) => t + b.revenue, 0);
  const barCount = buckets.reduce((t, b) => t + b.count, 0);
  const tableRevenue = orders.reduce((t, o) => t + o.revenue, 0);
  const ok = groupSum === s.count && s.count === orders.length && barRevenue === s.revenue && tableRevenue === s.revenue && barCount === s.count;
  $("checkResult").textContent = ok ? "✓ Kiểm tra: số đơn và doanh thu khớp giữa thẻ, biểu đồ và bảng." : "⚠ Số liệu chưa khớp, hãy kiểm tra lại hàm lọc.";
  if (!ok) console.error({ groupSum, barRevenue, barCount, tableRevenue, s });
}

/* ---------- 6. Cập nhật toàn trang ---------- */
function update() {
  try {
    $("message").hidden = true;
    const status = $("statusFilter").value, code = $("orderCode").value;
    const range = getRange(state.type, state.values[state.type]);
    const orders = filterOrders(range, code, status);
    const s = summarize(orders);
    const prev = summarize(filterOrders(getPrevRange(state.type, range), code, status));
    const buckets = buildBuckets(orders, state.type, range);

    renderStats(s, prev);
    renderBarChart(buckets, range, s);
    renderDonut(s);
    renderTable(orders);
    selfCheck(orders, s, buckets);
  } catch (err) {
    console.error(err);
    $("message").textContent = "Không thể tải dữ liệu báo cáo. Vui lòng thử lại.";
    $("message").className = "message error";
    $("message").hidden = false;
  }
}

/* ---------- 7. Sự kiện ---------- */
function setPeriodInput() {
  periodInput.type = state.type === "day" ? "date" : state.type;   // date | week | month
  periodInput.value = state.values[state.type];
  periodInput.placeholder = PERIOD_HINT[state.type];
}
function showMessage(text) {
  $("message").textContent = text;
  $("message").className = "message error";
  $("message").hidden = false;
}
$("periodType").addEventListener("change", e => { state.type = e.target.value; state.page = 1; setPeriodInput(); update(); });
periodInput.addEventListener("change", e => {
  const v = e.target.value.trim();
  if (isValidPeriod(state.type, v)) {
    state.values[state.type] = v; state.page = 1; update();
  } else {
    periodInput.value = state.values[state.type];   // giữ lại kỳ đang xem
    update();
    if (v) showMessage("Thời gian không hợp lệ. Vui lòng nhập theo định dạng " + PERIOD_HINT[state.type] + ".");
  }
});
$("orderCode").addEventListener("input", () => { state.page = 1; update(); });
$("statusFilter").addEventListener("change", () => { state.page = 1; update(); });
$("clearBtn").addEventListener("click", () => {
  $("orderCode").value = "";
  $("statusFilter").value = "all";
  state.type = DEFAULTS.type;
  state.values = Object.assign({}, DEFAULTS.values);
  $("periodType").value = state.type;
  setPeriodInput();
  state.page = 1;
  update();
});
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

// Khởi động
setPeriodInput();
update();
