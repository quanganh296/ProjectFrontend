(function createDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.some(user => user.email === 'admin@example.com');

    if (!adminExists) {
        const adminUser = {
            id: "1",
            email: "admin@example.com",
            fullName: "Admin User",
            password: "admin123", 
            role: "admin",
            phone: "",
            username: "admin@example.com",
            registeredDate: new Date().toISOString().split('T')[0]
        };
        users.push(adminUser);
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
            errorDiv.textContent = "Tên chỉ được chứa chữ cái, khoảng trắng và ký tự có dấu tiếng Việt";
            errorDiv.classList.remove("hidden");
            return;
        }

        // Kiểm tra email
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            errorDiv.textContent = "Email không hợp lệ";
            errorDiv.classList.remove("hidden");
            return;
        }
        if (password.length < 8) {
            errorDiv.textContent = "Mật khẩu phải có ít nhất 8 ký tự";
            errorDiv.classList.remove("hidden");
            return;
        }
        // Kiểm tra mật khẩu trùng khớp
        if (password !== confirmPassword) {
            errorDiv.textContent = "Mật khẩu không khớp";
            errorDiv.classList.remove("hidden");
            return;
        }
        // Kiểm tra số điện thoại
        if (!/^\d{10,11}$/.test(phone)) {
            errorDiv.textContent = "Số điện thoại chỉ được chứa số và phải có độ dài từ 10 đến 11 ký tự";
            errorDiv.classList.remove("hidden");
            return;
        }
        // Kiểm tra email trùng
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email)) {
            errorDiv.textContent = "Email đã tồn tại";
            errorDiv.classList.remove("hidden");
            return;
        }
        // Kiểm tra số điện thoại trùng
        if (users.some(user => user.phone === phone)) {
            errorDiv.textContent = "Số điện thoại đã tồn tại";
            errorDiv.classList.remove("hidden");
            return;
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
            errorDiv.classList.add("hidden");
        });
    }
}