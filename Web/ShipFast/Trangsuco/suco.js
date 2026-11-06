const session = SF.initPage('admin');                     // bắt buộc đăng nhập admin
const editModal = new bootstrap.Modal($('editModal'));    // hộp thoại sửa sự cố
let editingIncident = null;                               // sự cố đang được sửa

// Ô chọn mức độ trong hộp thoại
Object.keys(SF.SEVERITY).forEach(function (key) {
  $('severity').innerHTML += `<option value="${key}">Mức độ: ${SF.SEVERITY[key].label}</option>`;
});
// Ô chọn trạng thái xử lý (giá trị là số thứ tự 0, 1, 2)
SF.INCIDENT_STATES.forEach(function (text, index) {
  $('state').innerHTML += `<option value="${index}">${text}</option>`;
});

// HTML của một dòng sự cố
function incidentRow(i) {
  const severity = SF.SEVERITY[i.severity];
  return `<tr>
    <td>${i.id}</td>
    <td><a href="../Tracuu/index.html?q=${i.orderCode}">${i.orderCode}</a></td>
    <td>${SF.esc(i.type)}<div class="small text-body-secondary">${SF.esc(i.note)}</div></td>
    <td><span class="badge text-bg-${severity.color}">${severity.label}</span></td>
    <td>${SF.INCIDENT_STATES[i.state]}</td>
    <td class="text-end"><button class="btn btn-sm btn-outline-secondary" data-edit="${i.id}"><i class="bi bi-pencil"></i></button></td>
    </tr>`;
}

// Vẽ lại bảng sự cố
function renderRows() {
  if (SF.db.incidents.length === 0) {
    $('rows').innerHTML = '<tr><td colspan="6" class="text-center py-4">Chưa có sự cố. Ghi nhận từ trang Đơn hàng.</td></tr>';
    return;
  }
  $('rows').innerHTML = SF.db.incidents.map(incidentRow).join('');
}

// Bấm nút bút chì: mở hộp thoại và điền sẵn thông tin hiện tại của sự cố
$('rows').addEventListener('click', function (event) {
  const button = event.target.closest('[data-edit]');
  if (!button) return;
  editingIncident = SF.db.incidents.find(function (i) { return i.id === button.dataset.edit; });
  $('incidentId').textContent = editingIncident.id;
  $('orderCode').textContent = editingIncident.orderCode;
  $('severity').value = editingIncident.severity;
  $('state').value = editingIncident.state;
  $('note').value = editingIncident.note;
  editModal.show();
});

// Bấm "Lưu": cập nhật sự cố
$('editForm').addEventListener('submit', function (event) {
  event.preventDefault();
  editingIncident.severity = $('severity').value;
  editingIncident.state = Number($('state').value);
  editingIncident.note = $('note').value.trim();

  // Sự cố đã xử lý xong (trạng thái 2) thì đơn hàng quay lại "Đang giao hàng"
  const order = SF.findOrder(editingIncident.orderCode);
  if (editingIncident.state === 2 && order && order.status === 'incident') {
    SF.setStatus(order, 'shipping', 'Sự cố đã được xử lý');
  }
  SF.save();
  editModal.hide();
  alert(`Đã cập nhật ${editingIncident.id}`);
  renderRows();
});

if (session) renderRows();
