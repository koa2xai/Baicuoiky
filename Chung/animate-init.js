(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pop(el, name) {
    if (!el || reduce) return;
    var c = "animate__" + name;
    el.classList.remove("animate__animated", c);
    void el.offsetWidth;
    el.classList.add("animate__animated", c);
    el.addEventListener("animationend", function done() {
      el.classList.remove("animate__animated", c);
      el.removeEventListener("animationend", done);
    });
  }

  window.SFAnim = { pop: pop };
})();
