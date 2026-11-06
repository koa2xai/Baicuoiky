// Sau khi đăng nhập, mỗi vai trò được chuyển tới trang riêng
const HOME_PAGE = { admin: '../Trangtongquan/index.html', customer: '../Trangtaikhoan/index.html' };

const session = SF.initPage();
if (session) location.replace(HOME_PAGE[session.role]);   // đã đăng nhập rồi thì chuyển đi luôn

// Bấm nút "Đăng nhập"
$('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const role = SF.login($('user').value, $('pass').value);
  if (role) {
    location.href = HOME_PAGE[role];
  } else {
    $('error').textContent = 'Sai tên tài khoản hoặc mật khẩu.';
  }
});
