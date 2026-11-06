// ============================================================
// data.js - Dữ liệu và hàm dùng chung cho mọi trang (lưu trong localStorage)
// ============================================================

const SF = {};                                    // gom mọi thứ dùng chung vào đối tượng SF
function $(id) { return document.getElementById(id); } // viết tắt: $('rows') = lấy phần tử có id="rows"

// ---------- 1. Hằng số ----------
const DB_KEY = 'sf4_db';                          // nơi lưu dữ liệu
const SESSION_KEY = 'sf4_session';                // nơi lưu phiên đăng nhập
const ONE_HOUR = 60 * 60 * 1000;                  // 1 giờ (mili giây)
const ONE_DAY = 24 * ONE_HOUR;                    // 1 ngày (mili giây)
const LOGIN_PAGE = '../Trangdangnhap/index.html';

// Trạng thái đơn hàng: tên hiển thị, màu Bootstrap, biểu tượng
SF.STATUS = {
  pending:   { label: 'Chờ lấy hàng',    color: 'secondary', icon: 'box-seam' },
  picked:    { label: 'Đã lấy hàng',     color: 'info',      icon: 'bag-check' },
  transit:   { label: 'Đang vận chuyển', color: 'primary',   icon: 'truck' },
  shipping:  { label: 'Đang giao hàng',  color: 'warning',   icon: 'bicycle' },
  delivered: { label: 'Đã giao hàng',    color: 'success',   icon: 'check2-circle' },
  incident:  { label: 'Gặp sự cố',       color: 'danger',    icon: 'exclamation-triangle' },
  cancelled: { label: 'Đã hủy',          color: 'dark',      icon: 'x-circle' }
};
SF.STEPS = ['pending', 'picked', 'transit', 'shipping', 'delivered']; // các bước của đơn giao thành công
SF.SERVICES = {                                                      // dịch vụ: phí cơ bản + phí mỗi kg
  std:  { name: 'Tiêu chuẩn', base: 20000, perKg: 5000 },
  fast: { name: 'Hỏa tốc',    base: 35000, perKg: 8000 },
  eco:  { name: 'Tiết kiệm',  base: 15000, perKg: 3500 }
};
SF.SEVERITY = {                                                      // mức độ sự cố
  l: { label: 'Thấp', color: 'success' },
  m: { label: 'Trung bình', color: 'warning' },
  h: { label: 'Cao', color: 'danger' }
};
SF.INCIDENT_STATES = ['Mới ghi nhận', 'Đang xử lý', 'Đã xử lý'];
SF.INCIDENT_TYPES = ['Hàng bị hư hỏng', 'Không liên lạc được người nhận', 'Sai địa chỉ', 'Chậm tiến độ', 'Thất lạc tạm thời'];
SF.DEFAULT_FROM = 'TP. Hồ Chí Minh';                                 // điểm gửi của đơn cũ chưa ghi điểm gửi
SF.PICKUP_SLOTS = [[8, 10], [10, 12], [13, 15], [15, 17], [17, 19]]; // khung giờ lấy hàng: [giờ bắt đầu, giờ kết thúc]

// ---------- 2. Hàm nhỏ dùng chung ----------

// Phí vận chuyển = phí cơ bản + số kg (làm tròn lên, tối thiểu 0.5) x phí mỗi kg
SF.calcFee = function (service, kg) {
  const s = SF.SERVICES[service];
  return s.base + Math.ceil(Math.max(kg, 0.5)) * s.perKg;
};

// '2026-10-25' -> '25/10/2026'
SF.formatDate = function (isoDate) {
  const p = isoDate.split('-');
  return `${p[2]}/${p[1]}/${p[0]}`;
};

// Khung giờ số i -> '08:00–10:00'
SF.slotLabel = function (i) {
  const slot = SF.PICKUP_SLOTS[i];
  return `${String(slot[0]).padStart(2, '0')}:00–${String(slot[1]).padStart(2, '0')}:00`;
};

// Lịch lấy hàng của đơn: '25/10/2026 · 08:00–10:00' (đơn không có lịch -> chuỗi rỗng)
SF.pickupText = function (order) {
  if (!order.pickup) return '';
  return `${SF.formatDate(order.pickup.date)} · ${SF.slotLabel(order.pickup.slot)}`;
};

// Chống chèn mã HTML: đổi ký tự đặc biệt thành dạng an toàn
SF.esc = function (text) {
  if (text === null || text === undefined) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

// Số tiền: 25000 -> '25.000 ₫'
SF.money = function (value) { return Number(value).toLocaleString('vi-VN') + ' ₫'; };

// Ngày giờ dạng ngắn kiểu Việt Nam
SF.dateTime = function (time) { return new Date(time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }); };

// Nhãn màu của trạng thái (HTML)
SF.badge = function (status) {
  const s = SF.STATUS[status];
  return `<span class="badge text-bg-${s.color}"><i class="bi bi-${s.icon} me-1"></i>${s.label}</span>`;
};

// ---------- 3. Dữ liệu mẫu (tạo ở lần mở web đầu tiên) ----------

// Tạo hành trình của đơn mẫu, mỗi bước cách nhau 5 giờ
function buildLog(finalStatus, startTime) {
  let reached = finalStatus;                              // bước cuối cùng đơn đã đi tới
  if (finalStatus === 'incident') reached = 'shipping';   // đơn sự cố: đã tới bước "đang giao"
  if (finalStatus === 'cancelled') reached = 'pending';   // đơn hủy: dừng ở bước đầu
  const log = [];
  for (let i = 0; i <= SF.STEPS.indexOf(reached); i++) {
    log.push({ status: SF.STEPS[i], time: startTime + i * 5 * ONE_HOUR });
  }
  if (finalStatus === 'incident') {
    log.push({ status: 'incident', time: startTime + 25 * ONE_HOUR, note: 'Không liên lạc được người nhận' });
  }
  return log;
}

// Tạo một đơn mẫu (daysAgo = đơn được tạo cách đây mấy ngày)
function sampleOrder(index, daysAgo, receiver, phone, address, service, kg, cod, status) {
  const drivers = ['Trần Minh Đức', 'Lê Thị Hương', 'Phạm Quốc Anh', 'Nguyễn Hoàng Nam'];
  const createdAt = Date.now() - daysAgo * ONE_DAY;
  return {
    code: `SF12345678${index}VN`,
    owner: index % 2 === 0 ? 'khach' : null,              // đơn chẵn thuộc tài khoản khách demo
    receiver: receiver, phone: phone, from: SF.DEFAULT_FROM, address: address,
    service: service, kg: kg, cod: cod, status: status, createdAt: createdAt,
    fee: SF.calcFee(service, kg), driver: drivers[index % 4], log: buildLog(status, createdAt)
  };
}

// Tạo toàn bộ dữ liệu mẫu và lưu vào localStorage
function createSeedData() {
  const data = {
    admin: { user: 'admin', pass: 'admin123', name: 'Admin ShipFast', email: 'admin@shipfast.vn' },
    users: [{ username: 'khach', pass: 'khach123', name: 'Khách Demo', email: 'khach@gmail.com', phone: '0912345678' }],
    orders: [
      sampleOrder(0, 22, 'Nguyễn Văn A',  '0912345678', 'Hà Nội',          'std',  2,  0,      'delivered'),
      sampleOrder(1, 19, 'Công ty ABC',   '0281234567', 'Đà Nẵng',         'fast', 5,  450000, 'delivered'),
      sampleOrder(2, 16, 'Phạm Thị B',    '0934567899', 'TP. Hồ Chí Minh', 'eco',  3,  0,      'delivered'),
      sampleOrder(3, 14, 'Công ty XYZ',   '0243222111', 'Hải Phòng',       'std',  8,  0,      'delivered'),
      sampleOrder(4, 12, 'Trần Văn C',    '0907111222', 'Cần Thơ',         'std',  1,  120000, 'delivered'),
      sampleOrder(5, 9,  'Lê Thị D',      '0912345678', 'Hà Nội',          'fast', 2,  0,      'incident'),
      sampleOrder(6, 7,  'Hoàng Văn Nam', '0905333444', 'Đà Nẵng',         'std',  4,  300000, 'delivered'),
      sampleOrder(7, 5,  'Công ty 123',   '0283999888', 'TP. Hồ Chí Minh', 'eco',  12, 0,      'shipping'),
      sampleOrder(8, 3,  'Đỗ Văn Khoa',   '0988777666', 'Huế',             'fast', 2,  0,      'transit'),
      sampleOrder(9, 1,  'Bùi Lan Anh',   '0911222333', 'Nha Trang',       'std',  1,  0,      'pending')
    ],
    incidents: [{ id: 'SC-0001', orderCode: 'SF123456785VN', type: 'Không liên lạc được người nhận', severity: 'h', state: 1, note: 'Đã thử gọi 3 lần.', createdAt: Date.now() - 8 * ONE_DAY }],
    tickets: [],                    // yêu cầu hỗ trợ của khách
    seq: { SC: 2, YC: 1 }           // số thứ tự tiếp theo cho mã SC-xxxx và YC-xxxx
  };
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  return data;
}

// ---------- 4. Đọc, ghi dữ liệu và đơn hàng ----------

// Đọc dữ liệu đã lưu (chưa có hoặc bị hỏng thì trả về null)
function loadData() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)); } catch (error) { return null; }
}

SF.db = loadData() || createSeedData();   // toàn bộ dữ liệu; chưa có thì tạo dữ liệu mẫu

// Lưu dữ liệu (gọi sau mỗi lần thay đổi)
SF.save = function () { localStorage.setItem(DB_KEY, JSON.stringify(SF.db)); };

// Sinh mã kế tiếp: SF.nextId('SC') -> 'SC-0002'
SF.nextId = function (prefix) {
  const number = SF.db.seq[prefix];
  SF.db.seq[prefix] = number + 1;
  return `${prefix}-${String(number).padStart(4, '0')}`;
};

// Tìm đơn theo mã vận đơn (không phân biệt hoa thường)
SF.findOrder = function (code) {
  const wanted = String(code).trim().toUpperCase();
  return SF.db.orders.find(function (o) { return o.code === wanted; });
};

// Các đơn của một số điện thoại, đơn mới nhất xếp trước
SF.ordersByPhone = function (phone) {
  const cleanPhone = phone.replace(/\s/g, '');            // bỏ khoảng trắng
  const list = SF.db.orders.filter(function (o) { return o.phone === cleanPhone; });
  return list.sort(function (a, b) { return b.createdAt - a.createdAt; });
};

// Đổi trạng thái đơn và ghi thêm một dòng vào hành trình
SF.setStatus = function (order, status, note) {
  order.status = status;
  order.log.push({ status: status, time: Date.now(), note: note });
};

// ---------- 5. Tài khoản và đăng nhập ----------

// Đăng ký khách mới. Trả về câu báo lỗi, hoặc null nếu thành công.
SF.register = function (username, pass, name, email, phone) {
  const key = username.trim().toLowerCase();
  const exists = SF.db.users.some(function (u) { return u.username === key; });
  if (key === SF.db.admin.user || exists) return 'Tên tài khoản đã tồn tại.';
  SF.db.users.push({ username: key, pass: pass, name: name.trim(), email: email.trim(), phone: phone });
  SF.save();
  return null;
};

// Phiên đăng nhập hiện tại (null nếu chưa đăng nhập hoặc đã hết hạn)
SF.getSession = function () {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session && session.expires > Date.now()) return session;
  } catch (error) {
    // dữ liệu phiên bị hỏng -> coi như chưa đăng nhập
  }
  return null;
};

// Lưu phiên đăng nhập (có hiệu lực 8 giờ)
function saveSession(user, name, role) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user: user, name: name, role: role, expires: Date.now() + 8 * ONE_HOUR }));
}

// Đăng nhập. Đúng thì trả về vai trò ('admin' hoặc 'customer'), sai thì trả về null.
SF.login = function (username, pass) {
  const key = username.trim().toLowerCase();
  const admin = SF.db.admin;
  if (key === admin.user && pass === admin.pass) {
    saveSession(admin.user, admin.name, 'admin');
    return 'admin';
  }
  const customer = SF.db.users.find(function (u) { return u.username === key && u.pass === pass; });
  if (!customer) return null;
  saveSession(customer.username, customer.name, 'customer');
  return 'customer';
};

// Đổi tên hiển thị trong phiên (dùng sau khi sửa hồ sơ)
SF.renameSession = function (newName) {
  const session = SF.getSession();
  if (session) saveSession(session.user, newName, session.role);
};

// Đăng xuất: admin về trang đăng nhập, khách về trang tra cứu
SF.logout = function () {
  const session = SF.getSession();
  localStorage.removeItem(SESSION_KEY);
  location.href = (session && session.role === 'admin') ? LOGIN_PAGE : '../Tracuu/index.html';
};

// ---------- 6. Khởi tạo trang ----------

// Cập nhật menu: phần tử data-show="guest|customer|admin" chỉ hiện đúng vai trò;
// phần tử data-user="name|user" được điền tên người đang đăng nhập.
SF.updateMenu = function (session) {
  const role = session ? session.role : 'guest';          // chưa đăng nhập = khách vãng lai (guest)
  document.querySelectorAll('[data-show]').forEach(function (el) {
    el.hidden = !el.dataset.show.split(' ').includes(role);
  });
  document.querySelectorAll('[data-user]').forEach(function (el) {
    el.textContent = session ? session[el.dataset.user] : '';
  });
};

// Gọi ở đầu mỗi trang. Truyền 'admin' hoặc 'customer' nếu trang bắt buộc đăng nhập.
// Trả về phiên đăng nhập, hoặc null nếu không hợp lệ (đã chuyển sang trang đăng nhập).
SF.initPage = function (requiredRole) {
  const session = SF.getSession();
  if (requiredRole && (!session || session.role !== requiredRole)) {
    location.replace(LOGIN_PAGE);
    return null;
  }
  SF.updateMenu(session);
  document.querySelectorAll('[data-logout]').forEach(function (button) {   // nút có data-logout = nút đăng xuất
    button.addEventListener('click', function (event) {
      event.preventDefault();
      SF.logout();
    });
  });
  return session;
};
