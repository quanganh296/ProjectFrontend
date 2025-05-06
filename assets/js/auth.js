(function createDefaultAdmin() {
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
})();
const logoutLinks = document.querySelectorAll('#logout-link, #mobile-logout-link');
logoutLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = '/code/ProjectFrontend/pages/auth/login.html';
    });
});
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value.trim();
        const errorDiv = document.getElementById('register-error');

        errorDiv.textContent = "";
        errorDiv.classList.add("hidden");

        // Kiểm tra tên chỉ chứa chữ cái, khoảng trắng và ký tự có dấu tiếng Việt
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
            try {
                throw new Error("Tên chỉ được chứa chữ cái, khoảng trắng và ký tự có dấu tiếng Việt");
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove("hidden");
                return;
            }
        }

        // Kiểm tra email
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            try {
                throw new Error("Email không hợp lệ");
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove("hidden");
                return;
            }
        }

        if (password.length < 8) {
            try {
                throw new Error("Mật khẩu phải có ít nhất 8 ký tự");
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove("hidden");
                return;
            }
        }
        // Kiểm tra mật khẩu trùng khớp
        if (password !== confirmPassword) {
            try {
                throw new Error("Mật khẩu không khớp");
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove("hidden");
                return;
            } }
        // Kiểm tra số điện thoại
        if (!/^\d{10,11}$/.test(phone)) {
            try {
                throw new Error("Số điện thoại chỉ được chứa số và phải có độ dài từ 10 đến 11 ký tự");
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove("hidden");
                return;
            } }
        // Kiểm tra email trùng
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email)) {
            try {
                throw new Error("Email đã tồn tại");
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove("hidden");
                return;
            }}
        // Kiểm tra số điện thoại trùng
        if (users.some(user => user.phone === phone)) {
            try {
                throw new Error("Số điện thoại đã tồn tại");
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove("hidden");
                return;
            }
        }
        const newUser = {
            id: Date.now().toString(),
            fullName,
            email,
            password,
            phone,
            role: 'user',
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = 'login.html';
    });

    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
        fullNameInput.addEventListener('input', function () {
            const errorDiv = document.getElementById('register-error');
            errorDiv.textContent = "";
            errorDiv.classList.remove("hidden");
        });
    }
}