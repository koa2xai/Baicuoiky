/* =====================================================================
   ShipFast – thao tác dùng chung cho các trang quản trị
   (nội dung sidebar, header, thông báo đều nằm sẵn trong HTML; file này chỉ xử lý thao tác)
   - nút ba gạch: thu gọn / mở sidebar (nhớ lựa chọn trong localStorage)
   - lớp phủ + phím Esc đóng menu trên điện thoại
   - hiện tên admin đang đăng nhập
   - SFToast(): hiện thông báo; mọi phần tử có data-toast="..." bấm vào sẽ hiện thông báo đó
   ===================================================================== */
(function () {
  var B = document.body, S = window.SFAuth && SFAuth.get();
  var burger = document.getElementById("sfBurger");
  var overlay = document.getElementById("sfOv");
  var side = document.getElementById("sfSide");
  var mob = matchMedia("(max-width:820px)");

  if (localStorage.getItem("sf_collapsed") === "1") B.classList.add("collapsed");

  var nameEl = document.getElementById("adminName");
  if (nameEl && S) nameEl.textContent = S.name;

  function sync() {
    burger.setAttribute("aria-expanded", String(mob.matches ? B.classList.contains("open") : !B.classList.contains("collapsed")));
  }

  burger.onclick = function () {
    if (mob.matches) B.classList.toggle("open");
    else {
      B.classList.toggle("collapsed");
      localStorage.setItem("sf_collapsed", B.classList.contains("collapsed") ? "1" : "0");
    }
    sync();
  };
  overlay.onclick = function () { B.classList.remove("open"); sync(); };
  side.addEventListener("click", function (e) { if (e.target.closest("a")) B.classList.remove("open"); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && B.classList.contains("open")) overlay.click(); });
  mob.addEventListener("change", function () { B.classList.remove("open"); sync(); });
  sync();
  // bỏ lớp sf-init (tắt hiệu ứng chuyển) sau khi trang vẽ xong, để sidebar không "trượt" lúc mới tải
  requestAnimationFrame(function () { requestAnimationFrame(function () { B.classList.remove("sf-init"); }); });

  // ---- Thông báo (toast) ----
  var toastEl = document.getElementById("toast"), timer;
  window.SFToast = function (text, isError) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.style.background = isError ? "#c0392b" : "";
    toastEl.style.display = "block";
    clearTimeout(timer);
    timer = setTimeout(function () { toastEl.style.display = "none"; }, 3000);
  };
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toast]");
    if (t) SFToast(t.dataset.toast, t.hasAttribute("data-toast-error"));
  });
})();
