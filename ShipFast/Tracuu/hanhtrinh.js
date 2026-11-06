// ============================================================
// Bản đồ vận chuyển: vẽ tuyến từ điểm gửi đến điểm nhận, kèm vị trí hiện tại của kiện hàng.
// Dùng thư viện MapLibre GL (nền bản đồ OpenFreeMap), đường đi thật lấy từ OSRM.
// Tất cả đều miễn phí và không cần API key.
// ============================================================

// Tọa độ [vĩ độ, kinh độ] của các thành phố hay gặp (viết không dấu, chữ thường)
const CITY_COORDS = {
  'ha noi': [21.0285, 105.8542], 'ho chi minh': [10.7769, 106.7009], 'sai gon': [10.7769, 106.7009],
  'da nang': [16.0544, 108.2022], 'hai phong': [20.8449, 106.6881], 'can tho': [10.0452, 105.7469],
  'hue': [16.4637, 107.5909], 'nha trang': [12.2388, 109.1967], 'da lat': [11.9404, 108.4583],
  'vung tau': [10.346, 107.0843], 'quy nhon': [13.782, 109.2196], 'vinh': [18.6796, 105.6813]
};

// Đơn đã đi được bao nhiêu phần của tuyến (0 = còn ở điểm gửi, 1 = đã tới nơi)
const ROUTE_PROGRESS = { pending: 0, picked: 0.08, transit: 0.55, shipping: 0.92, delivered: 1, incident: 0.92 };

let trackMapInstance = null;     // bản đồ đang hiển thị (để xóa đi khi vẽ lại)
let latestRequest = 0;           // số thứ tự lần vẽ gần nhất (để bỏ qua lần vẽ cũ nếu người dùng đổi đơn)

// Bỏ dấu tiếng Việt và đổi thành chữ thường: 'Hà Nội' -> 'ha noi'
function removeAccents(text) {
  return text.normalize('NFD')                            // tách dấu ra khỏi chữ
    .replace(/[\u0300-\u036f]/g, '')                      // xóa các dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

// Tìm tọa độ của một địa chỉ. Ưu tiên bảng thành phố có sẵn, không có thì hỏi dịch vụ Nominatim.
async function findCoords(address) {
  const key = removeAccents(address);
  const cityNames = Object.keys(CITY_COORDS);
  for (let i = 0; i < cityNames.length; i++) {
    if (key.includes(cityNames[i])) return CITY_COORDS[cityNames[i]];
  }
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const places = await response.json();
    if (places.length > 0) return [Number(places[0].lat), Number(places[0].lon)];
  } catch (error) {
    // lỗi mạng: coi như không tìm thấy
  }
  return null;
}

// Lấy đường đi thật giữa 2 điểm từ OSRM. Lỗi mạng thì dùng đường thẳng.
async function findRoadPath(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    // OSRM trả về [kinh độ, vĩ độ]; đổi lại thành [vĩ độ, kinh độ]
    return data.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
  } catch (error) {
    return [from, to];
  }
}

// Khoảng cách xấp xỉ giữa 2 điểm (đủ dùng để so sánh độ dài các đoạn đường)
function distance(a, b) {
  const dLat = a[0] - b[0];
  const dLng = (a[1] - b[1]) * Math.cos(a[0] * Math.PI / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Tìm điểm nằm ở vị trí "ratio" (0 đến 1) dọc theo đường đi.
// Trả về: điểm đó, phần đường đã đi (done) và phần đường còn lại (left).
function pointAlongPath(path, ratio) {
  const lengths = [];                                     // độ dài từng đoạn nhỏ của đường
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const length = distance(path[i - 1], path[i]);
    lengths.push(length);
    total += length;
  }
  let remaining = total * ratio;                          // quãng đường cần đi tính từ điểm đầu
  let i = 0;
  while (i < lengths.length - 1 && remaining > lengths[i]) {
    remaining -= lengths[i];
    i++;
  }
  let fraction = 0;                                       // vị trí bên trong đoạn thứ i (0 đến 1)
  if (lengths[i] > 0) fraction = Math.min(remaining / lengths[i], 1);
  const start = path[i];
  const end = path[i + 1];
  const point = [start[0] + (end[0] - start[0]) * fraction, start[1] + (end[1] - start[1]) * fraction];

  return {
    point: point,
    done: path.slice(0, i + 1).concat([point]),
    left: [point].concat(path.slice(i + 1))
  };
}

// MapLibre dùng thứ tự [kinh độ, vĩ độ], ngược với dữ liệu của ta nên cần đổi
function toLngLat(point) { return [point[1], point[0]]; }

// Tạo dữ liệu đường kẻ cho bản đồ
function lineData(points) {
  return { type: 'Feature', geometry: { type: 'LineString', coordinates: points.map(toLngLat) } };
}

// Tạo biểu tượng ghim trên bản đồ (bọc thêm một lớp div vì MapLibre tự đặt vị trí cho lớp ngoài cùng)
function makePin(cssClass, icon) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<div class="trk-pin ${cssClass}"><i class="bi bi-${icon}"></i></div>`;
  return wrapper;
}

// Thêm một ghim có hộp thông tin khi bấm vào
function addPin(map, element, point, html) {
  new maplibregl.Marker({ element: element })
    .setLngLat(toLngLat(point))
    .setPopup(new maplibregl.Popup({ offset: 18 }).setHTML(html))
    .addTo(map);
}

SF.trackMap = {
  // Vẽ bản đồ cho một đơn hàng
  render: async function (order) {
    const myRequest = ++latestRequest;
    const box = $('trackMap');
    const statusText = $('mapStatus');

    if (trackMapInstance) {                               // xóa bản đồ cũ
      trackMapInstance.remove();
      trackMapInstance = null;
    }
    if (typeof maplibregl === 'undefined') {
      statusText.textContent = 'Không tải được bản đồ (kiểm tra mạng).';
      return;
    }
    statusText.textContent = 'Đang tải tuyến đường…';

    // Tìm tọa độ điểm gửi và điểm nhận
    const fromName = order.from || SF.DEFAULT_FROM;
    const source = await findCoords(fromName);
    const dest = await findCoords(order.address);
    if (myRequest !== latestRequest) return;              // người dùng đã chuyển sang đơn khác
    if (!source || !dest) {
      box.hidden = true;
      statusText.textContent = `Không định vị được ${source ? 'địa chỉ nhận “' + order.address : 'điểm gửi “' + fromName}”.`;
      return;
    }

    // Gửi và nhận cùng một khu vực: dịch điểm gửi đi một chút để tuyến không bị thành một chấm
    let start = source;
    if (Math.abs(dest[0] - source[0]) < 0.02 && Math.abs(dest[1] - source[1]) < 0.02) {
      start = [source[0] + 0.05, source[1] + 0.06];
    }
    const path = await findRoadPath(start, dest);
    if (myRequest !== latestRequest) return;

    // Tính vị trí hiện tại của kiện hàng theo trạng thái
    let ratio = 0;
    if (order.status !== 'cancelled' && ROUTE_PROGRESS[order.status]) ratio = ROUTE_PROGRESS[order.status];
    const along = pointAlongPath(path, ratio);

    // Tạo bản đồ và thu phóng cho vừa tuyến đường
    box.hidden = false;
    const map = new maplibregl.Map({
      container: box, style: 'https://tiles.openfreemap.org/styles/bright',
      attributionControl: { compact: true }, cooperativeGestures: true
    });
    trackMapInstance = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    const bounds = new maplibregl.LngLatBounds(toLngLat(path[0]), toLngLat(path[0]));
    path.forEach(function (p) { bounds.extend(toLngLat(p)); });
    map.fitBounds(bounds, { padding: 50, animate: false });

    // Ba ghim: điểm gửi, điểm nhận, vị trí hiện tại (đỏ nếu đơn gặp sự cố)
    const statusInfo = SF.STATUS[order.status];
    let truckClass = 'trk-truck';
    if (order.status === 'incident') truckClass += ' bad';
    addPin(map, makePin('a', 'box-seam'), start, `<b>Điểm gửi</b><br>${SF.esc(fromName)}`);
    addPin(map, makePin('b', 'geo-alt-fill'), dest, `<b>Điểm nhận</b><br>${SF.esc(order.address)}`);
    addPin(map, makePin(truckClass, statusInfo.icon), along.point, `<b>Vị trí hiện tại</b><br>${statusInfo.label}`);

    // Khi bản đồ tải xong: vẽ đường còn lại (nét đứt xám) và đường đã đi (nét vàng)
    map.on('load', function () {
      map.addSource('left', { type: 'geojson', data: lineData(along.left) });
      map.addLayer({ id: 'left', type: 'line', source: 'left', paint: { 'line-color': '#5f6b7a', 'line-width': 4, 'line-dasharray': [2, 2] } });
      if (ratio > 0) {
        map.addSource('done', { type: 'geojson', data: lineData(along.done) });
        map.addLayer({ id: 'done-border', type: 'line', source: 'done', paint: { 'line-color': '#b88a00', 'line-width': 9 } });
        map.addLayer({ id: 'done', type: 'line', source: 'done', layout: { 'line-cap': 'round' }, paint: { 'line-color': '#FFC800', 'line-width': 6 } });
      }
    });

    statusText.textContent = `${fromName} → ${order.address} · ${statusInfo.label}`;
    $('mapLegend').innerHTML = `<span><i class="bi bi-box-seam"></i> Điểm gửi</span>
      <span><i class="bi bi-truck"></i> Vị trí hiện tại</span>
      <span><i class="bi bi-geo-alt-fill"></i> Điểm nhận</span>
      <span>Nét vàng: đã đi · nét đứt: còn lại</span>`;
  }
};
