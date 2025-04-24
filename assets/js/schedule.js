document.addEventListener('DOMContentLoaded', function () {
    DB.init();
    setupBookingForm();
    loadBookings(); 
});
function setupBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const selectedClass = document.getElementById('class-select').value;
            const selectedDate = document.getElementById('date-input').value;
            const selectedTime = document.getElementById('time-select').value;

            if (!selectedClass || !selectedDate || !selectedTime) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            const newBooking = {
                id: Date.now().toString(), 
                service: selectedClass,
                date: selectedDate,
                time: selectedTime,
                name: DB.auth.getCurrentUser().fullName || 'Người dùng',
                email: DB.auth.getCurrentUser().email,
                status: 'Chờ xác nhận'
            };
            const bookings = DB.bookings.getAll();
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            loadBookings();
            alert('Đặt lịch thành công!');
            bookingForm.reset(); 
        });
    }
}
function loadBookings() {
    const bookings = DB.bookings.getAll();
    const currentUser = DB.auth.getCurrentUser();
    const tableBody = document.getElementById('schedule-table-body');
    const noSchedules = document.getElementById('no-schedules');
    const userBookings = bookings.filter(b => b.email === currentUser.email);
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