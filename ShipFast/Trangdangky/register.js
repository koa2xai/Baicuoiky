SF.initPage();

// Bấm nút "Tạo tài khoản"
$('registerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const error = SF.register($('username').value, $('pass').value, $('name').value, $('email').value, $('phone').value);
  if (error) {                                            // tên tài khoản bị trùng
    $('error').textContent = error;
    $('registerForm').classList.remove('animate__fadeInUp', 'animate__headShake');   // rung form khi báo lỗi
    void $('registerForm').offsetWidth;
    $('registerForm').classList.add('animate__headShake');
    return;
  }
  SF.login($('username').value, $('pass').value);         // đăng nhập luôn
  alert('Đăng ký thành công');
  location.href = '../Trangtaikhoan/index.html';
});
