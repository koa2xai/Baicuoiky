const MY_TICKETS_KEY = 'sf3_my_tickets';
const session = SF.initPage();

// Nếu là khách hàng đã đăng nhập thì lấy thông tin tài khoản để điền sẵn vào form
let account = null;
if (session && session.role === 'customer') {
  account = SF.db.users.find(function (u) { return u.username === session.user; });
}

// Danh sách mã yêu cầu mà trình duyệt này đã gửi
function getMyTicketIds() {
  try {
    return JSON.parse(localStorage.getItem(MY_TICKETS_KEY)) || [];
  } catch (error) {
    return [];
  }
}

// Điền sẵn họ tên và email nếu đã đăng nhập
function fillAccountInfo() {
  if (!account) return;
  $('name').value = account.name;
  $('email').value = account.email;
}

// HTML của một yêu cầu trong mục "Yêu cầu của tôi"
function ticketCard(t) {
  let statusBadge = '<span class="badge text-bg-secondary">Đang chờ</span>';
  let replyPart = '';
  if (t.reply) {
    statusBadge = '<span class="badge text-bg-success">Đã phản hồi</span>';
    replyPart = `<div class="alert alert-success small mt-2 mb-0"><i class="bi bi-reply me-1"></i>${SF.esc(t.reply)}</div>`;
  }
  return `<div class="card p-3 mb-2">
    <div class="d-flex justify-content-between"><b>${t.id}</b>${statusBadge}</div>
    <div class="small">${SF.esc(t.message)}</div>${replyPart}</div>`;
}

// Hiển thị các yêu cầu của tôi (đã gửi từ trình duyệt này, hoặc thuộc tài khoản đang đăng nhập)
function renderMyTickets() {
  const ids = getMyTicketIds();
  const mine = SF.db.tickets.filter(function (t) {
    return ids.includes(t.id) || (account && t.owner === account.username);
  });
  if (mine.length === 0) {
    $('myTickets').innerHTML = '';
    return;
  }
  $('myTickets').innerHTML = '<h5>Yêu cầu của tôi</h5>' + mine.map(ticketCard).join('');
}

// Bấm "Gửi yêu cầu"
$('ticketForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const id = SF.nextId('YC');
  SF.db.tickets.unshift({                                 // unshift: đưa yêu cầu mới lên đầu danh sách
    id: id,
    name: $('name').value.trim(),
    email: $('email').value.trim(),
    orderCode: $('orderCode').value.trim().toUpperCase(),
    message: $('message').value.trim(),
    createdAt: Date.now(),
    owner: account ? account.username : null,
    reply: ''
  });
  SF.save();

  const ids = getMyTicketIds();                           // nhớ mã yêu cầu này
  ids.push(id);
  localStorage.setItem(MY_TICKETS_KEY, JSON.stringify(ids));

  event.target.reset();                                   // xóa trống form
  fillAccountInfo();
  alert(`Đã gửi yêu cầu ${id}`);
  renderMyTickets();
});

fillAccountInfo();
renderMyTickets();
