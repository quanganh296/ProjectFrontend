document.addEventListener('DOMContentLoaded', function () {
    updateNavigation();

    const logoutLinks = document.querySelectorAll('#logout-link, #mobile-logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            alert('Bạn đã đăng xuất thành công!');
            window.location.href = 'pages/auth/login.html';
        });
    });

    // Xử lý nút menu di động
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
});

function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Menu chính
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const adminLink = document.getElementById('admin-link');

    // Menu di động
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const mobileLogoutLink = document.getElementById('mobile-logout-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');

    if (currentUser) {
        // Ẩn "Đăng nhập" và hiển thị "Đăng xuất"
        loginLink.classList.add('hidden');
        logoutLink.classList.remove('hidden');
        mobileLoginLink.classList.add('hidden');
        mobileLogoutLink.classList.remove('hidden');

        // Hiển thị "Admin" nếu là admin
        if (currentUser.role === 'admin') {
            adminLink.classList.remove('hidden');
            mobileAdminLink.classList.remove('hidden');
        } else {
            adminLink.classList.add('hidden');
            mobileAdminLink.classList.add('hidden');
        }
    } else {
        // Hiển thị "Đăng nhập" và ẩn "Đăng xuất" và "Admin"
        loginLink.classList.remove('hidden');
        logoutLink.classList.add('hidden');
        mobileLoginLink.classList.remove('hidden');
        mobileLogoutLink.classList.add('hidden');
        adminLink.classList.add('hidden');
        mobileAdminLink.classList.add('hidden');
    }
}