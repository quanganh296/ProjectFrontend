// db.js - Khởi tạo dữ liệu mẫu cho hệ thống

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
});

// Khởi tạo dữ liệu mẫu
function initializeData() {
    // Khởi tạo người dùng mẫu nếu chưa có
    if (!localStorage.getItem('users')) {
        const sampleUsers = [
            {
                id: '1',
                username: 'admin',
                password: 'admin123',
                email: 'admin@example.com'.toLowerCase(),
                fullName: 'Admin User',
                role: 'admin',
                phone: '0123456789',
                registeredDate: '2025-01-15'
            },
            {
                id: '2',
                username: 'user',
                password: 'user123',
                email: 'user@example.com'.toLowerCase(),
                fullName: 'Regular User',
                role: 'user',
                phone: '0987654321',
                registeredDate: '2025-02-20'
            }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }

    // Khởi tạo dữ liệu đặt lịch mẫu nếu chưa có
    if (!localStorage.getItem('bookings')) {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];
        
        const sampleBookings = [
            {
                id: '1',
                userId: '2',
                date: today,
                time: '10:00 - 11:00',
                class: 'Yoga',
                trainer: 'Emma Wilson',
                status: 'confirmed'
            },
            {
                id: '2',
                userId: '2',
                date: tomorrowDate,
                time: '15:00 - 16:00',
                class: 'Gym',
                trainer: 'John Smith',
                status: 'confirmed'
            }
        ];
        localStorage.setItem('bookings', JSON.stringify(sampleBookings));
    }
}