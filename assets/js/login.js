document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tìm người dùng khớp với email và mật khẩu
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (user) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            role: user.role
        }));

        // Chuyển hướng dựa trên vai trò
        if (user.role === 'admin') {
            window.location.href = '../admin/dashboard.html';
        } else {
            window.location.href = '../../index.html';
        }
    } else {
        errorMessage.textContent = 'Email hoặc mật khẩu không đúng!';
        errorMessage.classList.remove('hidden');
    }
});
const currentUser = {
    id: '1',
    username: 'admin',
    role: 'admin'
};
localStorage.setItem('currentUser', JSON.stringify(currentUser));
localStorage.removeItem('currentUser');