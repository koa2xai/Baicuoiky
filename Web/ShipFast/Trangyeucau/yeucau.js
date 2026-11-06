const session = SF.initPage('admin');                     // bắt buộc đăng nhập admin
const replyModal = new bootstrap.Modal($('replyModal'));  // hộp thoại phản hồi
let replyTicketId = '';                                   // mã yêu cầu đang được phản hồi

// HTML của một yêu cầu: đã phản hồi thì hiện nội dung phản hồi, chưa thì hiện nút "Phản hồi"
function ticketCard(t) {
  let orderPart = '';
  if (t.orderCode) orderPart = ` · ${SF.esc(t.orderCode)}`;

  let replyPart;
  if (t.reply) {
    replyPart = `<div class="alert alert-success small mb-0">${SF.esc(t.reply)}</div>`;
  } else {
    replyPart = `<button class="btn btn-sm btn-primary align-self-start" data-reply="${t.id}"><i class="bi bi-reply me-1"></i>Phản hồi</button>`;
  }
  return `<div class="card p-3 mb-2">
    <div class="d-flex justify-content-between"><b>${t.id} · ${SF.esc(t.name)}</b><small>${SF.dateTime(t.createdAt)}</small></div>
    <div class="small text-body-secondary">${SF.esc(t.email)}${orderPart}</div>
    <p class="my-2">${SF.esc(t.message)}</p>${replyPart}</div>`;
}

// Vẽ lại danh sách yêu cầu
function renderList() {
  if (SF.db.tickets.length === 0) {
    $('list').innerHTML = '<div class="alert alert-secondary">Chưa có yêu cầu nào từ khách hàng.</div>';
    return;
  }
  $('list').innerHTML = SF.db.tickets.map(ticketCard).join('');
}

// Bấm nút "Phản hồi": mở hộp thoại
$('list').addEventListener('click', function (event) {
  const button = event.target.closest('[data-reply]');
  if (!button) return;
  replyTicketId = button.dataset.reply;
  $('ticketId').textContent = replyTicketId;
  $('reply').value = '';
  replyModal.show();
});

// Bấm "Gửi phản hồi": lưu nội dung phản hồi vào yêu cầu
$('replyForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const ticket = SF.db.tickets.find(function (t) { return t.id === replyTicketId; });
  ticket.reply = $('reply').value.trim();
  SF.save();
  replyModal.hide();
  alert('Đã gửi phản hồi');
  renderList();
});

if (session) renderList();
