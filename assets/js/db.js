document.addEventListener('DOMContentLoaded', function () {
    DB.init();
    setupBookingForm();
    loadBookings(); // Hiển thị lịch đã đặt khi tải trang
});

// Xử lý form đặt lịch
function setupBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của form

            // Lấy dữ liệu từ form
            const selectedClass = document.getElementById('class-select').value;
            const selectedDate = document.getElementById('date-input').value;
            const selectedTime = document.getElementById('time-select').value;

            if (!selectedClass || !selectedDate || !selectedTime) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            // Tạo lịch mới
            const newBooking = {
                id: Date.now().toString(), // Tạo ID duy nhất
                service: selectedClass,
                date: selectedDate,
                time: selectedTime,
                name: DB.auth.getCurrentUser().fullName || 'Người dùng',
                email: DB.auth.getCurrentUser().email,
                status: 'Chờ xác nhận'
            };

            // Lưu vào localStorage
            const bookings = DB.bookings.getAll();
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Cập nhật giao diện
            loadBookings();
            alert('Đặt lịch thành công!');
            bookingForm.reset(); // Reset form sau khi đặt lịch
        });
    }
}

// Hiển thị lịch đã đặt
function loadBookings() {
    const bookings = DB.bookings.getAll();
    const currentUser = DB.auth.getCurrentUser();
    const tableBody = document.getElementById('schedule-table-body');
    const noSchedules = document.getElementById('no-schedules');

    // Lọc lịch của người dùng hiện tại
    const userBookings = bookings.filter(b => b.email === currentUser.email);

    // Cập nhật giao diện
    tableBody.innerHTML = '';
    if (userBookings.length === 0) {
        noSchedules.classList.remove('hidden');
    } else {
        noSchedules.classList.add('hidden');
        userBookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-3 px-4">${booking.service}</td>
                <td class="py-3 px-4">${booking.date}</td>
                <td class="py-3 px-4">${booking.time}</td>
                <td class="py-3 px-4 text-yellow-500 font-medium">${booking.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}