const session = SF.initPage('admin');   // bắt buộc đăng nhập admin
const SHOW_DAYS = 14;                   // biểu đồ doanh thu hiển thị 14 ngày gần nhất
// Màu từng phần của biểu đồ tròn, theo đúng thứ tự các trạng thái trong SF.STATUS
const STATUS_COLORS = ['#6c757d', '#0dcaf0', '#0d6efd', '#FFC800', '#198754', '#dc3545', '#212529'];

// Cộng tổng phí vận chuyển của một danh sách đơn
function sumFee(orders) {
  let total = 0;
  orders.forEach(function (o) { total += o.fee; });
  return total;
}

// Đếm số đơn có field (status hoặc service) bằng value
function countOrders(field, value) {
  return SF.db.orders.filter(function (o) { return o[field] === value; }).length;
}

// HTML của một ô chỉ số
function kpiCard(icon, label, value) {
  return `<div class="col-6 col-xl-3"><div class="card kpi p-3">
    <i class="bi bi-${icon} text-body-secondary"></i><div class="big">${value}</div>${label}</div></div>`;
}

// Hiển thị 4 ô chỉ số ở đầu trang
function showKpis(delivered) {
  const notCancelled = SF.db.orders.filter(function (o) { return o.status !== 'cancelled'; });
  let successRate = 0;                                      // tỷ lệ giao thành công (%)
  if (notCancelled.length > 0) successRate = Math.round(delivered.length / notCancelled.length * 100);
  const openIncidents = SF.db.incidents.filter(function (i) { return i.state < 2; }).length; // sự cố chưa xử lý xong

  $('kpis').innerHTML =
    kpiCard('cash-coin', 'Doanh thu', SF.money(sumFee(delivered))) +
    kpiCard('boxes', 'Tổng đơn', SF.db.orders.length) +
    kpiCard('check2-circle', 'Giao thành công', successRate + '%') +
    kpiCard('exclamation-triangle', 'Sự cố đang mở', openIncidents);
}

// Biểu đồ đường: doanh thu từng ngày (chỉ tính đơn đã giao)
function showRevenueChart(delivered) {
  const labels = [];
  const revenues = [];
  for (let i = SHOW_DAYS - 1; i >= 0; i--) {                // từ 13 ngày trước đến hôm nay
    const day = new Date();
    day.setDate(day.getDate() - i);
    labels.push(`${day.getDate()}/${day.getMonth() + 1}`);
    const ordersOfDay = delivered.filter(function (o) {
      return new Date(o.createdAt).toDateString() === day.toDateString();
    });
    revenues.push(sumFee(ordersOfDay));
  }
  new Chart($('revenueChart'), {
    type: 'line',
    data: { labels: labels, datasets: [{ data: revenues, borderColor: '#FFC800', backgroundColor: 'rgba(255,200,0,.2)', fill: true, tension: 0.3 }] },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });
}

// Biểu đồ tròn: tỷ lệ các trạng thái đơn
function showStatusChart() {
  const keys = Object.keys(SF.STATUS);
  const labels = keys.map(function (k) { return SF.STATUS[k].label; });
  const counts = keys.map(function (k) { return countOrders('status', k); });
  new Chart($('statusChart'), {
    type: 'doughnut',
    data: { labels: labels, datasets: [{ data: counts, backgroundColor: STATUS_COLORS, borderWidth: 0 }] },
    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });
}

// Biểu đồ cột: số đơn theo dịch vụ
function showServiceChart() {
  const keys = Object.keys(SF.SERVICES);
  const labels = keys.map(function (k) { return SF.SERVICES[k].name; });
  const counts = keys.map(function (k) { return countOrders('service', k); });
  new Chart($('serviceChart'), {
    type: 'bar',
    data: { labels: labels, datasets: [{ data: counts, backgroundColor: '#FFC800' }] },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

// Chạy khi đã đăng nhập đúng admin
if (session) {
  const delivered = SF.db.orders.filter(function (o) { return o.status === 'delivered'; });
  showKpis(delivered);
  showRevenueChart(delivered);
  showStatusChart();
  showServiceChart();
}
