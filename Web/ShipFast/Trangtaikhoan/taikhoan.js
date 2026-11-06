const session = SF.initPage('customer');                  // bắt buộc đăng nhập khách hàng
const user = session ? SF.db.users.find(function (u) { return u.username === session.user; }) : null;
if (session && !user) SF.logout();                        // tài khoản không còn tồn tại

// Các đơn của khách này, đơn mới nhất xếp trước
function getMyOrders() {
  const list = SF.db.orders.filter(function (o) { return o.owner === user.username; });
  return list.sort(function (a, b) { return b.createdAt - a.createdAt; });
}

// HTML của một ô chỉ số
function kpiCard(label, value) {
  return `<div class="col-6 col-md-3"><div class="card kpi p-3"><div class="big">${value}</div>${label}</div></div>`;
}

// HTML của một dòng đơn (đơn "chờ lấy hàng" mới có nút Hủy)
function orderRow(o) {
  let cancelButton = '';
  if (o.status === 'pending') {
    cancelButton = `<button class="btn btn-sm btn-outline-danger" data-cancel="${o.code}"><i class="bi bi-x-lg"></i> Hủy</button>`;
  }
  return `<tr>
    <td><a href="../Tracuu/index.html?q=${o.code}">${o.code}</a></td>
    <td>${SF.esc(o.address)}</td>
    <td>${SF.money(o.fee)}</td>
    <td>${SF.badge(o.status)}</td>
    <td class="text-end">${cancelButton}</td></tr>`;
}

// Hiển thị ô chỉ số và bảng đơn
function render() {
  const orders = getMyOrders();
  const delivered = orders.filter(function (o) { return o.status === 'delivered'; });
  const processing = orders.filter(function (o) { return o.status !== 'delivered' && o.status !== 'cancelled'; });
  let spent = 0;                                          // tổng tiền đã chi cho các đơn đã giao
  delivered.forEach(function (o) { spent += o.fee; });

  $('kpis').innerHTML = kpiCard('Tổng đơn', orders.length) + kpiCard('Đang xử lý', processing.length) +
    kpiCard('Đã giao', delivered.length) + kpiCard('Đã chi', SF.money(spent));

  if (orders.length === 0) {
    $('rows').innerHTML = '<tr><td colspan="5" class="text-center py-4">Chưa có đơn nào. Hãy tạo đơn đầu tiên.</td></tr>';
    return;
  }
  $('rows').innerHTML = orders.map(orderRow).join('');
}

// Bấm nút "Hủy" trong bảng
$('rows').addEventListener('click', function (event) {
  const button = event.target.closest('[data-cancel]');
  if (!button) return;
  const code = button.dataset.cancel;
  if (!confirm(`Hủy đơn ${code}?`)) return;
  SF.setStatus(SF.findOrder(code), 'cancelled', 'Khách hàng hủy đơn');
  SF.save();
  alert(`Đã hủy đơn ${code}`);
  render();
});

// Bấm "Lưu hồ sơ"
$('profileForm').addEventListener('submit', function (event) {
  event.preventDefault();
  user.name = $('name').value.trim();
  user.email = $('email').value.trim();
  user.phone = $('phone').value;
  if ($('pass').value !== '') user.pass = $('pass').value; // chỉ đổi mật khẩu khi có nhập
  SF.save();
  SF.renameSession(user.name);
  SF.updateMenu(SF.getSession());                         // cập nhật tên hiển thị trên menu
  $('pass').value = '';
  alert('Đã lưu hồ sơ');
});

if (user) {
  $('name').value = user.name;                            // điền sẵn hồ sơ hiện tại
  $('email').value = user.email;
  $('phone').value = user.phone;
  render();
}
