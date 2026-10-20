
const form = document.getElementById("supportForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const trackingInput = document.getElementById("tracking");
const messageInput = document.getElementById("message");
const noteInput = document.getElementById("note");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

// Kiem tra ho ten
function checkName() {
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Vui lòng nhập họ và tên.";
        nameInput.classList.add("invalid");
        return false;
    }

    nameError.textContent = "";
    nameInput.classList.remove("invalid");
    return true;
}

// Kiem tra email
function checkEmail() {
    const email = emailInput.value.trim();

    if (email === "") {
        emailError.textContent = "Vui lòng nhập email.";
        emailInput.classList.add("invalid");
        return false;
    }

    if (!emailInput.validity.valid) {
        emailError.textContent = "Email không đúng định dạng.";
        emailInput.classList.add("invalid");
        return false;
    }

    emailError.textContent = "";
    emailInput.classList.remove("invalid");
    return true;
}

// Kiem tra noi dung yeu cau
function checkMessage() {
    if (messageInput.value.trim() === "") {
        messageError.textContent = "Vui lòng nhập nội dung yêu cầu.";
        messageInput.classList.add("invalid");
        return false;
    }

    messageError.textContent = "";
    messageInput.classList.remove("invalid");
    return true;
}

// Kiem tra du lieu de bat hoac tat nut gui
function validateButton() {
    const nameValid = nameInput.value.trim() !== "";
    const emailValid =
        emailInput.value.trim() !== "" &&
        emailInput.validity.valid;
    const messageValid = messageInput.value.trim() !== "";

    submitBtn.disabled = !(nameValid && emailValid && messageValid);
}

// Kiem tra khi nhap ho ten
nameInput.addEventListener("input", function() {
    checkName();
    validateButton();
});

// Kiem tra khi nhap email
emailInput.addEventListener("input", function() {
    checkEmail();
    validateButton();
});

// Kiem tra khi nhap noi dung
messageInput.addEventListener("input", function() {
    checkMessage();
    validateButton();
});

// Xu ly khi nhan nut gui
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const nameValid = checkName();
    const emailValid = checkEmail();
    const messageValid = checkMessage();

    if (!nameValid || !emailValid || !messageValid) {
        submitBtn.disabled = true;
        result.textContent = "";
        return;
    }

    // Lay thong tin da nhap
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const tracking = trackingInput.value.trim();
    const message = messageInput.value.trim();
    const note = noteInput.value.trim();

    // In thong tin ra Console de kiem tra
    console.log("Ho va ten:", name);
    console.log("Email:", email);
    console.log("Ma van don:", tracking);
    console.log("Noi dung yeu cau:", message);
    console.log("Ghi chu:", note);

    // Hien thi thong bao thanh cong
    result.style.color = "green";
    result.textContent =
        "Yêu cầu hỗ trợ của bạn đã được ghi nhận thành công!";

    // Xoa noi dung bieu mau
    form.reset();

    // Xoa thong bao loi
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    nameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");
    messageInput.classList.remove("invalid");

    // Tat nut gui sau khi xoa form
    submitBtn.disabled = true;
});
