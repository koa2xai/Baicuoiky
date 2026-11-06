SF.initPage();
const resultBox = $('result');
const searchQuery = new URLSearchParams(location.search).get('q') || ''; // chữ người dùng đã nhập (nằm sau ?q= trên thanh địa chỉ)
const query = searchQuery.trim();
$('q').value = query;

// Ẩn bớt số điện thoại: 0912345678 -> 0912 *** 678
function maskPhone(phone) {
  return `${phone.slice(0, 4)} *** ${phone.slice(-3)}`;
}

// Giờ:phút của một mốc thời gian, ví dụ '08:00'
function hourMinute(time) {
  return new Date(time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// Mốc bắt đầu và kết thúc (mili giây) của khung giờ lấy hàng
function pickupRange(order) {
  const parts = order.pickup.date.split('-');             // ['2026', '10', '25']
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;                     // tháng trong JavaScript đếm từ 0
  const day = Number(parts[2]);
  const slot = SF.PICKUP_SLOTS[order.pickup.slot];
  return { start: new Date(year, month, day, slot[0]).getTime(), end: new Date(year, month, day, slot[1]).getTime() };
}

// Câu "Shipper dự kiến tới" tùy theo tình trạng đơn
function pickupEta(order) {
  const pickedLog = order.log.find(function (l) { return l.status === 'picked'; });
  if (pickedLog) return `Đã lấy hàng lúc ${SF.dateTime(pickedLog.time)}`;
  if (order.status === 'cancelled') return 'Đơn đã hủy';
  const range = pickupRange(order);
  const timeText = `${hourMinute(range.start)}–${hourMinute(range.end)}`;
  if (Date.now() > range.end) return `Đã quá khung ${timeText}, shipper sẽ liên hệ bạn sớm`;
  return `Trong khoảng ${timeText}`;
}

// ---------- 1. Trang chủ (chưa nhập gì) ----------
function showHome() {
  const orders = SF.db.orders;
  const delivered = orders.filter(function (o) { return o.status === 'delivered'; });
  let rate = 0;                                           // tỷ lệ giao thành công (%)
  if (orders.length > 0) rate = Math.round(delivered.length / orders.length * 100);

  function statCard(icon, value, text) {
    return `<div class="col-md-4"><div class="card kpi p-3 animate__animated animate__zoomIn"><i class="bi bi-${icon} fs-3"></i>
      <div class="big">${value}</div><div class="text-body-secondary">${text}</div></div></div>`;
  }
  resultBox.innerHTML = `<div class="row g-3 text-center">
    ${statCard('boxes', orders.length, 'đơn đã xử lý')}
    ${statCard('check2-circle', rate + '%', 'giao thành công')}
    ${statCard('clock-history', '07–21h', 'hỗ trợ mỗi ngày')}</div>`;
}

// ---------- 2. Chi tiết một đơn ----------

// Thanh các bước: Chờ lấy -> Đã lấy -> Vận chuyển -> Đang giao -> Đã giao
function stepperHtml(order) {
  let reached = 0;                                        // vị trí bước xa nhất đơn đã đi tới
  order.log.forEach(function (l) {
    const index = SF.STEPS.indexOf(l.status);
    if (index > reached) reached = index;
  });
  const barWidth = reached / (SF.STEPS.length - 1) * 100; // độ dài thanh vàng (%)

  let steps = '';
  SF.STEPS.forEach(function (key, index) {
    const done = index <= reached ? 'on' : '';            // class "on" tô vàng bước đã qua
    steps += `<div class="rs ${done}"><span><i class="bi bi-${SF.STATUS[key].icon}"></i></span>${SF.STATUS[key].label}</div>`;
  });
  return `<div class="route"><div class="route-bar"><i style="width:${barWidth}%"></i></div><div class="route-steps">${steps}</div></div>`;
}

// Các sự cố chưa xử lý xong của đơn (hiện ô cảnh báo đỏ)
function incidentsHtml(order) {
  let html = '';
  SF.db.incidents.forEach(function (i) {
    if (i.orderCode === order.code && i.state < 2) {
      html += `<div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>Sự cố: ${SF.esc(i.type)}. Chúng tôi đang xử lý đơn của bạn.</div>`;
    }
  });
  return html;
}

// Dòng thời gian hành trình (mới nhất ở trên cùng)
function timelineHtml(order) {
  let html = '';
  order.log.slice().reverse().forEach(function (l) {
    let note = '';
    if (l.note) note = ` · ${SF.esc(l.note)}`;
    html += `<li><b>${SF.STATUS[l.status].label}</b><div class="small text-body-secondary">${SF.dateTime(l.time)}${note}</div></li>`;
  });
  return html;
}

function showOrder(order) {
  // Hai dòng về lịch lấy hàng: chỉ có ở đơn do khách tự tạo
  let pickupInfo = '';
  if (order.pickup) {
    pickupInfo = `<dt>Hẹn lấy hàng</dt><dd>${SF.pickupText(order)}</dd>
      <dt>Shipper dự kiến tới</dt><dd>${SF.esc(pickupEta(order))}</dd>`;
  }
  // Nút Hủy chỉ hiện khi đơn còn "chờ lấy hàng"
  let cancelButton = '';
  if (order.status === 'pending') {
    cancelButton = '<button class="btn btn-outline-danger mt-3" id="cancelBtn"><i class="bi bi-x-lg me-1"></i>Hủy đơn</button>';
  }

  resultBox.innerHTML = `
    <a href="index.html" class="small"><i class="bi bi-arrow-left"></i> Tra cứu khác</a>
    <div class="d-flex flex-wrap justify-content-between align-items-center my-3 gap-2"><h2 class="mb-0">${order.code}</h2>${SF.badge(order.status)}</div>
    ${incidentsHtml(order)}
    <div class="card p-4 mb-3 animate__animated animate__fadeInUp">${stepperHtml(order)}</div>
    <div class="card p-4 mb-3 animate__animated animate__fadeInUp" style="--animate-delay:.1s">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h5 class="mb-0"><i class="bi bi-map me-2"></i>Bản đồ vận chuyển</h5><span class="small text-body-secondary" id="mapStatus"></span></div>
      <div id="trackMap" class="track-map"></div>
      <div class="d-flex flex-wrap gap-3 mt-2 small text-body-secondary" id="mapLegend"></div>
    </div>
    <div class="row g-3">
      <div class="col-lg-7"><div class="card p-4 animate__animated animate__fadeInUp" style="--animate-delay:.2s"><h5 class="mb-3">Hành trình</h5><ul class="tl">${timelineHtml(order)}</ul></div></div>
      <div class="col-lg-5"><div class="card p-4 animate__animated animate__fadeInUp" style="--animate-delay:.3s"><h5 class="mb-3">Thông tin giao nhận</h5><dl class="mb-0 small">
        <dt>Người nhận</dt><dd>${SF.esc(order.receiver)}</dd>
        <dt>Điện thoại</dt><dd>${maskPhone(order.phone)}</dd>
        <dt>Giao từ</dt><dd>${SF.esc(order.from || SF.DEFAULT_FROM)}</dd>
        <dt>Giao đến</dt><dd>${SF.esc(order.address)}</dd>${pickupInfo}
        <dt>Dịch vụ</dt><dd>${SF.SERVICES[order.service].name} · ${order.kg} kg · ${SF.money(order.fee)}</dd>
        <dt>Tài xế</dt><dd>${SF.esc(order.driver)}</dd>
      </dl>${cancelButton}</div></div>
    </div>`;

  SF.trackMap.render(order);                              // vẽ bản đồ (file hanhtrinh.js)

  if (order.status === 'pending') {                       // bấm nút Hủy đơn
    $('cancelBtn').addEventListener('click', function () {
      if (!confirm(`Hủy đơn ${order.code}?`)) return;
      SF.setStatus(order, 'cancelled', 'Khách hàng hủy đơn');
      SF.save();
      alert(`Đã hủy đơn ${order.code}`);
      showOrder(order);
    });
  }
}

// ---------- 3. Danh sách đơn theo số điện thoại ----------
function showList(orders, phone) {
  let rows = '';
  orders.forEach(function (o) {
    rows += `<tr class="animate__animated animate__fadeIn"><td><a href="?q=${o.code}">${o.code}</a></td>
      <td>${SF.esc(o.from || SF.DEFAULT_FROM)} → ${SF.esc(o.address)}</td>
      <td>${SF.money(o.fee)}</td><td>${SF.badge(o.status)}</td></tr>`;
  });
  resultBox.innerHTML = `<h4 class="mb-3">${orders.length} đơn của số ${maskPhone(phone)}</h4>
    <div class="card animate__animated animate__fadeInUp"><div class="table-responsive"><table class="table table-hover mb-0">
    <thead><tr><th>Mã</th><th>Từ → Đến</th><th>Phí</th><th>Trạng thái</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

// ---------- 4. Không tìm thấy ----------
function showNotFound(message) {
  resultBox.innerHTML = `<div class="alert alert-warning animate__animated animate__shakeX"><i class="bi bi-search me-2"></i>${message}</div>`;
}

// ---------- Quyết định hiển thị kiểu nào ----------
function showResult() {
  if (query === '') {                                     // chưa nhập gì
    showHome();
    return;
  }
  const phone = query.replace(/\s/g, '');                 // bỏ khoảng trắng
  const looksLikePhone = /^0[0-9]{9}$/.test(phone);       // đúng 10 chữ số, bắt đầu bằng 0
  if (looksLikePhone) {
    const orders = SF.ordersByPhone(phone);
    if (orders.length > 0) showList(orders, phone);
    else showNotFound('Không có đơn nào gắn với số điện thoại này.');
    return;
  }
  const order = SF.findOrder(query);
  if (order) {
    showOrder(order);
  } else {
    showNotFound(`Không tìm thấy mã “${SF.esc(query)}”. Kiểm tra lại từng ký tự hoặc thử số điện thoại người nhận.`);
  }
}

showResult();
