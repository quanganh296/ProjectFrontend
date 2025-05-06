document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const defaultAdmin = {
        id: "1",
        email: "admin@example.com",
        fullName: "Admin User",
        password: "admin123",
        role: "admin",
        phone: "",
        username: "admin@example.com",
        registeredDate: new Date().toISOString().split('T')[0]
    };
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.some(user => user.email === defaultAdmin.email);
    if (!adminExists) {
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
    }
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password) ||
                 (email.toLowerCase() === defaultAdmin.email.toLowerCase() && password === defaultAdmin.password ? defaultAdmin : null);
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