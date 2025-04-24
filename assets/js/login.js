document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email === 'admin@example.com' && password === 'admin123') {
        window.location.href = '../admin/dashboard.html';
    } else if (email === 'user@example.com' && password === 'user123') {
        window.location.href = 'D:/code/ProjectFrontend/index.html';
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Email hoặc mật khẩu không đúng!';
        errorMessage.classList.remove('hidden');
    }
});