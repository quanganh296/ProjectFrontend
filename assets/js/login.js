document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
  


    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tìm người dùng khớp với email và mật khẩu
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (user) {
      
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            email: user.email,
            fullName: user.fullName || 'N/A',
            role: user.role
        }));


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