/**
 * ShipFast - Xử lý tra cứu đơn hàng (tracuu.js)
 * Tích hợp điều khiển trạng thái xe chạy / dừng sự cố / dừng về đích trên bản đồ SVG.
 */

const MOCK_ORDERS = {
  "SF123456789VN": {
    code: "SF123456789VN",
    service: "Giao tiêu chuẩn",
    createdDate: "12/10/2026 09:30",
    statusText: "Đang giao hàng",
    statusChipClass: "chip--delivering",
    receiverName: "Nguyễn Vũ Trường Giang",
    receiverPhone: "0934 *** 800",
    receiverAddress: "45 Lê Lợi, P. Hòa Cường, Q. Hải Châu, Đà Nẵng",
    driverName: "Lê Dương Bảo Lâm",
    driverPhone: "0901 234 567",
    eta: "Hôm nay, trước 18:00",
    truckClass: "delivery-truck", // Xe đang chạy bình thường
    timeline: [
      { title: "Đã tạo đơn", desc: "12/10/2026 09:30 - Hệ thống đã tiếp nhận đơn hàng", status: "completed" },
      { title: "Đã lấy hàng", desc: "12/10/2026 12:15 - Nhân viên đã lấy hàng tại người gửi", status: "completed" },
      { title: "Đang vận chuyển", desc: "13/10/2026 08:20 - Hàng đang trên đường đến bưu cục tiếp theo", status: "completed" },
      { title: "Đang giao hàng", desc: "14/10/2026 09:05 - Đơn hàng đang được giao đến địa chỉ nhận", status: "current" },
      { title: "Đã giao hàng", desc: "Chưa hoàn thành", status: "todo" }
    ]
  },
  "SF123456792VN": {
    code: "SF123456792VN",
    service: "Giao hỏa tốc",
    createdDate: "13/10/2026 10:15",
    statusText: "Gặp sự cố",
    statusChipClass: "chip--issue",
    receiverName: "Trần Thị Bích Ngọc",
    receiverPhone: "0912 *** 456",
    receiverAddress: "120 Nguyễn Văn Linh, Q. Thanh Khê, Đà Nẵng",
    driverName: "Nguyễn Văn A",
    driverPhone: "0988 777 666",
    eta: "Đang cập nhật lại thời gian",
    truckClass: "delivery-truck issue", // Xe dừng lại, đổi màu đỏ báo lỗi
    timeline: [
      { title: "Đã tạo đơn", desc: "13/10/2026 10:15 - Hệ thống đã tiếp nhận đơn hàng", status: "completed" },
      { title: "Đã lấy hàng", desc: "13/10/2026 11:30 - Nhân viên đã lấy hàng thành công", status: "completed" },
      { title: "Đang giao hàng", desc: "13/10/2026 14:00 - Không liên lạc được người nhận", status: "current" },
      { title: "Đã giao hàng", desc: "Chưa hoàn thành", status: "todo" }
    ]
  },
  "SF123456793VN": {
    code: "SF123456793VN",
    service: "Giao tiết kiệm",
    createdDate: "10/10/2026 08:00",
    statusText: "Đã giao hàng",
    statusChipClass: "chip--delivered",
    receiverName: "Phạm Minh Hoàng",
    receiverPhone: "0978 *** 123",
    receiverAddress: "88 Trần Phú, Q. Hải Châu, Đà Nẵng",
    driverName: "Phan Văn Nam",
    driverPhone: "0905 111 222",
    eta: "Đã giao lúc 11/10/2026 15:30",
    truckClass: "delivery-truck delivered", // Xe về đích, đứng yên ở điểm nhận màu xanh
    timeline: [
      { title: "Đã tạo đơn", desc: "10/10/2026 08:00 - Hệ thống đã tiếp nhận đơn hàng", status: "completed" },
      { title: "Đã lấy hàng", desc: "10/10/2026 10:00 - Đã lấy hàng thành công", status: "completed" },
      { title: "Đang vận chuyển", desc: "10/10/2026 14:30 - Đến kho trung chuyển Đà Nẵng", status: "completed" },
      { title: "Đang giao hàng", desc: "11/10/2026 09:00 - Tài xế đang giao hàng", status: "completed" },
      { title: "Đã giao hàng", desc: "11/10/2026 15:30 - Người nhận đã ký nhận", status: "current" }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const codeInput = document.getElementById("codeInput");
  const sampleBtn = document.getElementById("sampleBtn");
  const resultSection = document.getElementById("result");

  if (sampleBtn && codeInput) {
    sampleBtn.addEventListener("click", () => {
      const sampleCode = sampleBtn.innerText.trim();
      codeInput.value = sampleCode;
      handleSearch(sampleCode);
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputVal = codeInput.value.trim();

      if (!inputVal) {
        alert("Vui lòng nhập mã vận đơn để kiểm tra!");
        codeInput.focus();
        return;
      }

      handleSearch(inputVal);
    });
  }

  function handleSearch(code) {
    const cleanCode = code.toUpperCase();
    const orderData = MOCK_ORDERS[cleanCode];

    if (!orderData) {
      resultSection.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px 20px; animation: fadeIn 0.3s ease;">
          <h2 style="color: #B3261E; margin-bottom: 8px;">Không tìm thấy đơn hàng!</h2>
          <p style="color: var(--muted); margin: 0;">
            Mã vận đơn "<b>${escapeHTML(code)}</b>" không tồn tại trong hệ thống.<br>
            Thử các mã mẫu: <b>SF123456789VN</b> (Đang giao), <b>SF123456792VN</b> (Sự cố), <b>SF123456793VN</b> (Đã giao)
          </p>
        </div>
      `;
      return;
    }

    resultSection.innerHTML = renderOrderDetails(orderData);
  }

  function renderOrderDetails(data) {
    const timelineHTML = data.timeline.map((item) => {
      let stepClass = "step";
      if (item.status === "current") stepClass += " current";
      if (item.status === "todo") stepClass += " todo";

      return `
        <li class="${stepClass}">
          <b>${escapeHTML(item.title)}</b>
          ${escapeHTML(item.desc)}
        </li>
      `;
    }).join("");

    return `
      <!-- Thẻ tóm tắt đơn hàng -->
      <div class="card summary" style="animation: fadeIn 0.3s ease;">
        <div>
          <div class="lbl">Mã vận đơn</div>
          <div class="summary__code">${escapeHTML(data.code)}</div>
        </div>
        <div>
          <div class="lbl">Dịch vụ</div>
          <div class="summary__val">${escapeHTML(data.service)}</div>
        </div>
        <div>
          <div class="lbl">Ngày đặt</div>
          <div class="summary__val">${escapeHTML(data.createdDate)}</div>
        </div>
        <div>
          <div class="lbl">Trạng thái</div>
          <span class="chip ${data.statusChipClass}">${escapeHTML(data.statusText)}</span>
        </div>
      </div>

      <div class="track" style="animation: fadeIn 0.4s ease;">
        <!-- Cột trái: Hành trình đơn hàng -->
        <div class="card">
          <h2>Hành trình đơn hàng</h2>
          <ol class="timeline">
            ${timelineHTML}
          </ol>
          <div class="live">Thông tin được cập nhật theo thời gian thực</div>
        </div>

        <!-- Cột phải: Bản đồ + Thông tin giao nhận -->
        <div class="stack">
          <div class="card map">
            <div class="map__bar">
              <div>
                <b style="color: var(--cyan)">${escapeHTML(data.statusText)}</b>
                <div class="lbl">Tài xế: ${escapeHTML(data.driverName)} · ${escapeHTML(data.driverPhone)}</div>
              </div>
              <div class="eta">Dự kiến giao<br><b>${escapeHTML(data.eta)}</b></div>
            </div>
            <div class="live-map">
              <svg viewBox="0 0 500 260" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#E9EFF5" />
                <path d="M 0,60 L 500,60 M 0,180 L 500,180 M 150,0 L 150,260 M 350,0 L 350,260" 
                      stroke="#FFFFFF" stroke-width="6" opacity="0.7" />
                <path id="deliveryTrack" class="map-track" 
                      d="M 50 200 C 120 200, 150 70, 250 70 C 350 70, 380 190, 450 190" />
                <g transform="translate(50, 200)">
                  <circle r="8" fill="#0889AB" />
                  <circle r="4" fill="#FFFFFF" />
                  <text x="0" y="22" font-size="11" font-weight="600" fill="#0B2A4A" text-anchor="middle">Điểm gửi</text>
                </g>
                <g transform="translate(450, 190)">
                  <circle r="8" fill="#E8890C" />
                  <circle r="4" fill="#FFFFFF" />
                  <text x="0" y="22" font-size="11" font-weight="600" fill="#0B2A4A" text-anchor="middle">Điểm nhận</text>
                </g>
                <!-- Xe giao hàng động (thay đổi class và hiệu ứng theo dữ liệu trạng thái đơn) -->
                <g class="${data.truckClass}">
                  <rect x="-18" y="-12" width="22" height="14" rx="3" fill="#0889AB" />
                  <path d="M 4 -12 L 12 -12 L 16 -4 L 16 2 L 4 2 Z" fill="#06728F" />
                  <path d="M 6 -10 L 11 -10 L 13 -5 L 6 -5 Z" fill="#22C1E3" />
                  <circle cx="-10" cy="3" r="3" fill="#0B2A4A" />
                  <circle cx="10" cy="3" r="3" fill="#0B2A4A" />
                  <polygon points="16,-2 24,-6 24,2" fill="#FFE58F" opacity="0.8" />
                </g>
              </svg>
            </div>
          </div>

          <div class="card">
            <h2>Thông tin giao nhận</h2>
            <div class="row"><span class="lbl">Người nhận</span><b>${escapeHTML(data.receiverName)}</b></div>
            <div class="row"><span class="lbl">Điện thoại</span><b>${escapeHTML(data.receiverPhone)}</b></div>
            <div class="row"><span class="lbl">Địa chỉ</span><b>${escapeHTML(data.receiverAddress)}</b></div>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});