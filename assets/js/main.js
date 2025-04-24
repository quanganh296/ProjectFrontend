document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value.trim().toLowerCase();
                const password = document.getElementById('password').value;
                const errorMessage = document.getElementById('error-message');
                const users = JSON.parse(localStorage.getItem('users')) || [];
                console.log('Email nhập:', email); 
                console.log('Danh sách users:', users); 
                if (!users.length) {
                    errorMessage.textContent = 'Không có người dùng nào trong hệ thống. Vui lòng đăng ký!';
                    errorMessage.classList.remove('hidden');
                    return;
                }

                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    errorMessage.classList.add('hidden');
                    if (user.role === 'admin') {
                        window.location.href = '../../pages/admin/dashboard.html';
                    } else {
                        window.location.href = 'D:/code/ProjectFrontend/index.html';
                    }
                } else {
                    const emailExists = users.some(u => u.email === email);
                    errorMessage.textContent = emailExists ? 'Mật khẩu không đúng!' : 'Email không tồn tại!';
                    errorMessage.classList.remove('hidden');
                }
            });
        }
    }
    updateNavigation();
});
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        const restrictedPages = ['schedule.html', 'dashboard.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (restrictedPages.includes(currentPage)) {
            window.location.href = 'D:/code/ProjectFrontend/pages/auth/login.html';
            return;
        }
    }

    const loginLinks = document.querySelectorAll('#login-link, #mobile-login-link');
    const logoutLinks = document.querySelectorAll('#logout-link, #mobile-logout-link');
    const adminLinks = document.querySelectorAll('#admin-link, #mobile-admin-link');

    if (currentUser) {
        loginLinks.forEach(link => link.classList.add('hidden'));
        logoutLinks.forEach(link => link.classList.remove('hidden'));
        if (currentUser.role === 'admin') {
            adminLinks.forEach(link => link.classList.remove('hidden'));
        } else {
            adminLinks.forEach(link => link.classList.add('hidden'));
        }
        logoutLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('currentUser'); 
                window.location.href = 'D:/code/ProjectFrontend/pages/auth/login.html'; 
            });
        });
    } else {
        loginLinks.forEach(link => link.classList.remove('hidden'));
        logoutLinks.forEach(link => link.classList.add('hidden'));
        adminLinks.forEach(link => link.classList.add('hidden'));
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});