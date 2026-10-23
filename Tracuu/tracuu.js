document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const codeInput = document.getElementById("codeInput");
  const sampleBtn = document.getElementById("sampleBtn");
  const orders = document.querySelectorAll("#result .order");
  const notFound = document.getElementById("notFound");
  const notFoundCode = document.getElementById("notFoundCode");

  function handleSearch(code) {
    const cleanCode = code.toUpperCase();
    let found = false;

    orders.forEach((order) => {
      const match = order.dataset.code === cleanCode;
      order.hidden = !match;
      if (match) found = true;
    });

    notFound.hidden = found;
    if (!found) notFoundCode.textContent = code;
  }

  sampleBtn.addEventListener("click", () => {
    const sampleCode = sampleBtn.textContent.trim();
    codeInput.value = sampleCode;
    handleSearch(sampleCode);
  });

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
});
