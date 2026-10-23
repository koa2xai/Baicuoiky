/* =====================================================================
   ShipFast – các class Animate.css (animate__animated animate__fadeInUp ...) nay viết TRỰC TIẾP trong HTML
   (độ trễ: style="animation-delay:.2s"). File này chỉ còn hàm chạy lại hiệu ứng theo yêu cầu:
   SFAnim.pop(el, "tenHieuUng") – dùng cho các hiệu ứng cần kích hoạt lại sau một hành động
   (rung khi đăng nhập sai, nảy khi gửi form...).
   ===================================================================== */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pop(el, name) {
    if (!el || reduce) return;
    var c = "animate__" + name;
    el.classList.remove("animate__animated", c);
    void el.offsetWidth;                   // buộc trình duyệt tính lại để chạy lại hiệu ứng
    el.classList.add("animate__animated", c);
    el.addEventListener("animationend", function done() {
      el.classList.remove("animate__animated", c);
      el.removeEventListener("animationend", done);
    });
  }

  window.SFAnim = { pop: pop };
})();
