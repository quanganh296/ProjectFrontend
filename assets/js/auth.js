window.authUtils = {
    handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const email = formData.get('email').trim().toLowerCase();
        const fullName = formData.get('fullName').trim();
        const phone = formData.get('phone').trim();
        if (!email || !fullName || !phone || !password || !confirmPassword) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Email không hợp lệ!');
            return;
        }

        if (password.length < 8) {
            alert('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) {
            alert('Email đã được sử dụng!');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            username: email,
            password,
            email,
            fullName,
            phone,
            role: 'user',
            registeredDate: new Date().toISOString().split('T')[0],
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        window.location.href = 'login.html';
    },
};