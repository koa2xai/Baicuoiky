const session = SF.initPage('admin');                     // bắt buộc đăng nhập admin
const incidentModal = new bootstrap.Modal($('incidentModal')); // hộp thoại "Ghi nhận sự cố"
let searchText = '';                                      // chữ đang tìm
let statusFilter = '';                                    // trạng thái đang lọc ('' = tất cả)
let incidentOrderCode = '';                               // mã đơn đang được ghi nhận sự cố
const EDITABLE_STATUSES = SF.STEPS.concat(['cancelled']); // các trạng thái admin được chọn trong danh sách

// ---------- Chuẩn bị các ô chọn ----------

// Ô lọc trạng thái: thêm từng trạng thái làm một lựa chọn
Object.keys(SF.STATUS).forEach(function (key) {
  $('statusFilter').innerHTML += `<option value="${key}">${SF.STATUS[key].label}</option>`;
});
// Ô chọn loại sự cố trong hộp thoại
SF.INCIDENT_TYPES.forEach(function (type) {
  $('type').innerHTML += '<option>' + type + '</option>';
});
// Ô chọn mức độ sự cố trong hộp thoại
Object.keys(SF.SEVERITY).forEach(function (key) {
  $('severity').innerHTML += `<option value="${key}">Mức độ: ${SF.SEVERITY[key].label}</option>`;
});

// ---------- Hiển thị danh sách ----------

// Lấy các đơn khớp với ô tìm kiếm và ô lọc, đơn mới nhất xếp trước
function getVisibleOrders() {
  const text = searchText.toLowerCase();
  const list = SF.db.orders.filter(function (o) {
    const matchText = (o.code + ' ' + o.receiver).toLowerCase().includes(text);
    const matchStatus = statusFilter === '' || o.status === statusFilter;
    return matchText && matchStatus;
  });
  return list.sort(function (a, b) { return b.createdAt - a.createdAt; });
}

// Ô trạng thái: đơn sự cố chỉ hiện nhãn; đơn khác hiện ô chọn để đổi trạng thái
function statusCell(order) {
  if (order.status === 'incident') return SF.badge('incident');
  let html = `<select class="form-select form-select-sm" data-status-of="${order.code}">`;
  EDITABLE_STATUSES.forEach(function (key) {
    const selected = key === order.status ? 'selected' : '';
    html += `<option value="${key}" ${selected}>${SF.STATUS[key].label}</option>`;
  });
  return html + '</select>';
}

// HTML của một dòng đơn hàng
function orderRow(o) {
  const from = o.from || SF.DEFAULT_FROM;
  let pickupLine = '';                                    // dòng lịch lấy hàng (nếu đơn có)
  if (o.pickup) {
    pickupLine = `<div class="small text-body-secondary"><i class="bi bi-clock me-1"></i>Lấy hàng: ${SF.pickupText(o)}</div>`;
  }
  return `<tr class="animate__animated animate__fadeIn">
    <td><a href="../Tracuu/index.html?q=${o.code}">${o.code}</a></td>
    <td>${SF.esc(o.receiver)}<div class="small text-body-secondary">${SF.esc(from)} → ${SF.esc(o.address)} · ${SF.esc(o.phone)}</div>${pickupLine}</td>
    <td>${SF.SERVICES[o.service].name}</td>
    <td>${SF.money(o.fee)}</td>
    <td>${statusCell(o)}</td>
    <td class="text-end text-nowrap">
      <button class="btn btn-sm btn-outline-warning" data-incident="${o.code}" title="Ghi nhận sự cố"><i class="bi bi-exclamation-triangle"></i></button>
      <button class="btn btn-sm btn-outline-danger" data-delete="${o.code}" title="Xóa đơn"><i class="bi bi-trash"></i></button>
    </td></tr>`;
}

// Vẽ lại bảng đơn hàng
function renderRows() {
  const orders = getVisibleOrders();
  if (orders.length === 0) {
    $('rows').innerHTML = '<tr><td colspan="6" class="text-center py-4">Không có đơn phù hợp</td></tr>';
    return;
  }
  $('rows').innerHTML = orders.map(orderRow).join('');
}

// ---------- Xử lý thao tác của người dùng ----------

// Gõ vào ô tìm kiếm
$('search').addEventListener('input', function (event) {
  searchText = event.target.value;
  renderRows();
});

// Chọn trạng thái ở ô lọc
$('statusFilter').addEventListener('change', function (event) {
  statusFilter = event.target.value;
  renderRows();
});

// Đổi trạng thái một đơn bằng ô chọn trong bảng
$('rows').addEventListener('change', function (event) {
  const code = event.target.dataset.statusOf;
  if (!code) return;                                      // không phải ô chọn trạng thái
  SF.setStatus(SF.findOrder(code), event.target.value);
  SF.save();
  alert(`Đã cập nhật đơn ${code}`);
});

// Bấm nút "Ghi nhận sự cố" hoặc nút "Xóa" trong bảng
$('rows').addEventListener('click', function (event) {
  const incidentButton = event.target.closest('[data-incident]');
  const deleteButton = event.target.closest('[data-delete]');

  if (incidentButton) {                                   // mở hộp thoại ghi nhận sự cố
    incidentOrderCode = incidentButton.dataset.incident;
    $('incidentCode').textContent = incidentOrderCode;
    $('note').value = '';
    incidentModal.show();
  }
  if (deleteButton) {                                     // xóa đơn sau khi hỏi lại
    const code = deleteButton.dataset.delete;
    if (!confirm(`Xóa đơn ${code} và các sự cố liên quan?`)) return;
    SF.db.orders = SF.db.orders.filter(function (o) { return o.code !== code; });
    SF.db.incidents = SF.db.incidents.filter(function (i) { return i.orderCode !== code; });
    SF.save();
    renderRows();
  }
});

// Bấm "Lưu" trong hộp thoại sự cố: thêm sự cố mới và chuyển đơn sang trạng thái "Gặp sự cố"
$('incidentForm').addEventListener('submit', function (event) {
  event.preventDefault();
  SF.db.incidents.push({
    id: SF.nextId('SC'), orderCode: incidentOrderCode, type: $('type').value,
    severity: $('severity').value, state: 0, note: $('note').value.trim(), createdAt: Date.now()
  });
  SF.setStatus(SF.findOrder(incidentOrderCode), 'incident', $('type').value);
  SF.save();
  incidentModal.hide();
  alert('Đã ghi nhận sự cố');
  renderRows();
});

if (session) renderRows();                                // hiển thị danh sách lần đầu
