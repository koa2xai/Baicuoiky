// ============================================================
// Trang Tạo đơn (khách hàng): đặt đơn mới, sau đó chuyển sang trang Tra cứu
// ============================================================

const session = SF.initPage('customer');                  // bắt buộc đăng nhập khách hàng
const owner = session ? SF.db.users.find(function (u) { return u.username === session.user; }) : null;
if (session && !owner) SF.logout();                       // tài khoản không còn tồn tại

// Ngày dạng '2026-10-25' (dạng mà ô chọn ngày của trình duyệt dùng)
function toIsoDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

const today = toIsoDate(new Date());

// Giờ hiện tại dạng số, ví dụ 14:30 -> 14.5
function currentHour() {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}

// Khung giờ đã qua (hoặc sắp hết, còn dưới 30 phút) thì không cho chọn nữa
function isSlotClosed(slotIndex) {
  if ($('pickupDate').value !== today) return false;      // ngày khác hôm nay: khung nào cũng chọn được
  const endHour = SF.PICKUP_SLOTS[slotIndex][1];
  return currentHour() >= endHour - 0.5;
}

// Dòng gợi ý dưới ô chọn giờ
function updatePickupHint() {
  const date = $('pickupDate').value;
  const slot = $('pickupSlot').value;
  if (date === '' || slot === '') {
    $('pickupHint').textContent = '';
    return;
  }
  $('pickupHint').textContent = `Shipper dự kiến tới lấy hàng trong khoảng ${SF.slotLabel(Number(slot))} ngày ${SF.formatDate(date)} (sẽ gọi trước khi đến).`;
}

// Điền các khung giờ vào ô chọn, khung đã đóng thì làm mờ
function fillSlots() {
  const oldValue = $('pickupSlot').value;                 // nhớ lựa chọn cũ để giữ lại nếu còn dùng được
  let html = '';
  for (let i = 0; i < SF.PICKUP_SLOTS.length; i++) {
    const disabled = isSlotClosed(i) ? 'disabled' : '';
    html += `<option value="${i}" ${disabled}>${SF.slotLabel(i)}</option>`;
  }
  $('pickupSlot').innerHTML = html;

  // Chọn lại khung cũ nếu còn mở, nếu không thì chọn khung mở đầu tiên
  let chosen = '';
  for (let i = 0; i < $('pickupSlot').options.length; i++) {
    const option = $('pickupSlot').options[i];
    if (option.disabled) continue;
    if (chosen === '') chosen = option.value;
    if (option.value === oldValue) chosen = oldValue;
  }
  $('pickupSlot').value = chosen;
  updatePickupHint();
}

// Hiển thị phí tạm tính theo dịch vụ và khối lượng đang nhập
function updateFee() {
  const kg = Number($('kg').value) || 1;
  $('fee').textContent = SF.money(SF.calcFee($('service').value, kg));
}

// Tạo mã vận đơn ngẫu nhiên dạng SF + 9 chữ số + VN (không trùng mã đã có)
function newOrderCode() {
  let code;
  do {
    code = `SF${Math.floor(100000000 + Math.random() * 900000000)}VN`;
  } while (SF.findOrder(code));
  return code;
}

// ---------- Chuẩn bị form ----------
if (owner) {
  $('receiver').value = owner.name;                       // điền sẵn thông tin người nhận
  $('phone').value = owner.phone;
}
Object.keys(SF.SERVICES).forEach(function (key) {         // danh sách dịch vụ
  $('service').innerHTML += `<option value="${key}">${SF.SERVICES[key].name}</option>`;
});

// Ngày lấy hàng: tối thiểu là hôm nay; nếu hôm nay đã hết khung giờ thì mặc định là ngày mai
const lastSlotEnd = SF.PICKUP_SLOTS[SF.PICKUP_SLOTS.length - 1][1];
const defaultDate = new Date();
if (currentHour() >= lastSlotEnd - 0.5) defaultDate.setDate(defaultDate.getDate() + 1);
$('pickupDate').min = today;
$('pickupDate').value = toIsoDate(defaultDate);
fillSlots();
updateFee();

// Đổi ngày thì tính lại các khung giờ; đổi khung giờ thì cập nhật gợi ý
$('pickupDate').addEventListener('input', fillSlots);
$('pickupSlot').addEventListener('input', updatePickupHint);
// Đổi dịch vụ hoặc khối lượng thì tính lại phí
$('service').addEventListener('input', updateFee);
$('kg').addEventListener('input', updateFee);

// Bấm "Đặt đơn"
$('orderForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const slotOption = $('pickupSlot').options[$('pickupSlot').selectedIndex];
  if ($('pickupDate').value < today || !slotOption || slotOption.disabled) {
    alert('Khung giờ lấy hàng đã qua, hãy chọn lại.');
    return;
  }
  const service = $('service').value;
  const kg = Number($('kg').value);
  const code = newOrderCode();
  const now = Date.now();

  SF.db.orders.push({
    code: code,
    owner: owner.username,
    receiver: $('receiver').value.trim(),
    phone: $('phone').value,
    from: $('from').value.trim(),
    address: $('address').value.trim(),
    pickup: { date: $('pickupDate').value, slot: Number($('pickupSlot').value) },
    service: service,
    kg: kg,
    cod: Number($('cod').value) || 0,
    fee: SF.calcFee(service, kg),
    status: 'pending',
    createdAt: now,
    driver: 'Chưa phân công',
    log: [{ status: 'pending', time: now }]
  });
  SF.save();
  alert(`Đã tạo đơn ${code}`);
  location.href = `../Tracuu/index.html?q=${code}`;
});
