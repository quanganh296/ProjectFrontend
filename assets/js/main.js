document.addEventListener('DOMContentLoaded', function () {
    updateNavigation();
    loadServices();
    loadBookings();
    const logoutLinks = document.querySelectorAll('#logout-link, #mobile-logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'pages/auth/login.html';
        });
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Menu chính
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const adminLink = document.getElementById('admin-link');
    const scheduleLink = document.getElementById('schedule-link'); // Thêm liên kết "Đặt lịch"
    const classBookingButtons = document.querySelectorAll('.class-booking-btn');
    const startButton = document.getElementById('start-button');
    

    // Menu di động
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const mobileLogoutLink = document.getElementById('mobile-logout-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');
    const mobileScheduleLink = document.getElementById('mobile-schedule-link'); // Thêm liên kết "Đặt lịch" di động

    // Kiểm tra sự tồn tại của các phần tử trước khi thao tác
    if (currentUser) {
        if (loginLink) loginLink.classList.add('hidden');
        if (logoutLink) logoutLink.classList.remove('hidden');
        if (mobileLoginLink) mobileLoginLink.classList.add('hidden');
        if (mobileLogoutLink) mobileLogoutLink.classList.remove('hidden');
        if (scheduleLink) scheduleLink.classList.remove('hidden'); // Đảm bảo "Đặt lịch" hiển thị
        if (mobileScheduleLink) mobileScheduleLink.classList.remove('hidden'); // Đảm bảo "Đặt lịch" di động hiển thị

        // Hiển thị "Admin" nếu là admin
        if (currentUser.role === 'admin') {
            if (adminLink) adminLink.classList.remove('hidden');
            if (mobileAdminLink) mobileAdminLink.classList.remove('hidden');
            if (scheduleLink) scheduleLink.classList.add('hidden');
            if (mobileScheduleLink) mobileScheduleLink.classList.add('hidden');
            if (startButton) startButton.classList.add('hidden');
           
            classBookingButtons.forEach(button => {
                button.classList.add('hidden');
            });
        } else {
            if (adminLink) adminLink.classList.add('hidden');
            if (mobileAdminLink) mobileAdminLink.classList.add('hidden');
            if (scheduleLink) scheduleLink.classList.remove('hidden');
            if (mobileScheduleLink) mobileScheduleLink.classList.remove('hidden');
            if (startButton) startButton.classList.remove('hidden');
            classBookingButtons.forEach(button => {
                button.classList.remove('hidden');
            });
        
        }
    } else {
        if (loginLink) loginLink.classList.remove('hidden');
        if (logoutLink) logoutLink.classList.add('hidden');
        if (mobileLoginLink) mobileLoginLink.classList.remove('hidden');
        if (mobileLogoutLink) mobileLogoutLink.classList.add('hidden');
        if (adminLink) adminLink.classList.add('hidden');
        if (mobileAdminLink) mobileAdminLink.classList.add('hidden');
        if (scheduleLink) scheduleLink.classList.add('hidden');
        if (mobileScheduleLink) mobileScheduleLink.classList.add('hidden');
        if (startButton) startButton.classList.remove('hidden');
        classBookingButtons.forEach(button => {
            button.classList.add('hidden');
        });
        
    }
}
document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const service = document.getElementById('class-select').value;
    const date = document.getElementById('date-input').value;
    const time = document.getElementById('time-select').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const email = currentUser?.email;

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Kiểm tra trùng lịch
    const isDuplicate = bookings.some(booking =>
        booking.service === service &&
        booking.date === date &&
        booking.time === time &&
        booking.email === email
    );

    const errorDiv = document.getElementById('booking-error');

    if (isDuplicate) {
        errorDiv.textContent = 'Lịch bạn chọn đã trùng với lịch cũ. Vui lòng chọn thời gian khác.';
        errorDiv.classList.remove('hidden');
        return;
    }

    errorDiv.classList.add('hidden');

    // Tạo và lưu lịch mới
    const newBooking = {
        id: Date.now().toString(),
        service,
        date,
        time,
        email,
        userId: currentUser?.id || Date.now().toString(),
        status: 'Chờ xác nhận'
    };

    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert('Đặt lịch thành công!');
    location.reload(); // hoặc ẩn modal và cập nhật bảng
});
