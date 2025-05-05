document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../../pages/auth/login.html';
        return;
    }

    // Debug: Log currentUser để kiểm tra fullName
    console.log('Current User:', currentUser);

    const openModalBtn = document.getElementById('open-booking-modal');
    const modal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const bookingForm = document.getElementById('booking-form');
    const scheduleTableBody = document.getElementById('schedule-table-body');
    const noSchedulesDiv = document.getElementById('no-schedules');
    const logoutLink = document.getElementById('logout-link');
    const mobileLogoutLink = document.getElementById('mobile-logout-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    // Đảm bảo nav-links hiển thị cho người dùng đã đăng nhập
    if (navLinks) {
        navLinks.classList.remove('hidden');
        navLinks.classList.add('flex');
    }

    // Load existing bookings từ localStorage và lọc theo người dùng hiện tại
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    let userBookings = bookings.filter(booking => booking.email === currentUser.email);

    // Hàm hiển thị lịch của người dùng hiện tại
    // Add this at the end of schedule.js

// Override displayBookings to remove duplicate IDs from "Xóa" buttons
function displayBookings() {
    if (userBookings.length === 0) {
        noSchedulesDiv.classList.remove('hidden');
        scheduleTableBody.innerHTML = '';
        return;
    }

    noSchedulesDiv.classList.add('hidden');
    scheduleTableBody.innerHTML = userBookings.map((booking, index) => `
        <tr>
            <td class="py-2 px-4 border-b">${booking.service}</td>
            <td class="py-2 px-4 border-b">${booking.date}</td>
            <td class="py-2 px-4 border-b">${booking.time}</td>
            <td class="py-2 px-4 border-b">${currentUser.fullName || 'N/A'}</td>
            <td class="py-2 px-4 border-b">${booking.email}</td>
            <td class="py-2 px-4 border-b">
                <button class="editBtn1 text-blue-600  mr-2" onclick="editBooking('${booking.id}', ${index})">Sửa</button>
                <button class="editBtn2 text-red-600 " onclick="deleteBooking('${booking.id}', ${index})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// Override deleteBooking to properly handle the delete confirmation modal
window.deleteBooking = function(bookingId, index) {
    const deleteModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    if (!deleteModal || !confirmDeleteBtn || !cancelDeleteBtn) {
        console.error('Delete modal or buttons not found');
        return;
    }

    // Show the modal
    deleteModal.classList.remove('hidden');
    console.log('Delete confirmation modal opened for booking ID:', bookingId);

    // Remove any existing event listeners by cloning the buttons
    const newConfirmDeleteBtn = confirmDeleteBtn.cloneNode(true);
    const newCancelDeleteBtn = cancelDeleteBtn.cloneNode(true);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmDeleteBtn, confirmDeleteBtn);
    cancelDeleteBtn.parentNode.replaceChild(newCancelDeleteBtn, cancelDeleteBtn);

    // Reassign buttons after cloning
    const updatedConfirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const updatedCancelDeleteBtn = document.getElementById('cancel-delete-btn');

    // Handle confirm delete
    updatedConfirmDeleteBtn.addEventListener('click', function() {
        const globalIndex = bookings.findIndex(b => b.id === bookingId && b.email === currentUser.email);
        if (globalIndex !== -1) {
            bookings.splice(globalIndex, 1);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            userBookings = bookings.filter(booking => booking.email === currentUser.email);
            displayBookings();
            console.log('Booking deleted successfully, ID:', bookingId);
        }
        deleteModal.classList.add('hidden');
    });

    // Handle cancel
    updatedCancelDeleteBtn.addEventListener('click', function() {
        deleteModal.classList.add('hidden');
        console.log('Delete action canceled for booking ID:', bookingId);
    });
};
    // Hiển thị lịch ban đầu
    displayBookings();

    // Mở modal đặt lịch mới
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            bookingForm.reset();
            document.getElementById('booking-form').dataset.editIndex = '';
        });
    }

    // Đóng modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            bookingForm.reset();
        });
    }

    // Xử lý form đặt lịch (thêm hoặc sửa)
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const editIndex = bookingForm.dataset.editIndex;
            const newBooking = {
                service: document.getElementById('class-select').value,
                date: document.getElementById('date-input').value,
                time: document.getElementById('time-select').value,
                userId: currentUser.id,
                email: currentUser.email,
                status: 'Chờ xác nhận'
            };

            if (editIndex) {
                // Sửa lịch
                const globalIndex = bookings.findIndex(b => b.id === userBookings[editIndex].id && b.email === currentUser.email);
                if (globalIndex !== -1) {
                    newBooking.id = bookings[globalIndex].id; // Giữ nguyên ID
                    bookings[globalIndex] = newBooking;
                }
            } else {
                // Thêm lịch mới
                newBooking.id = Date.now().toString();
                bookings.push(newBooking);
            }

            localStorage.setItem('bookings', JSON.stringify(bookings));
            userBookings = bookings.filter(booking => booking.email === currentUser.email);
            displayBookings();
            modal.classList.add('hidden');
            bookingForm.reset();
        });
    }

    // Toggle menu di động
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Xử lý đăng xuất
    function handleLogout() {
        localStorage.removeItem('currentUser');
        window.location.href = '../../pages/auth/login.html';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    if (mobileLogoutLink) {
        mobileLogoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Hàm sửa lịch
    window.editBooking = function(bookingId, index) {
        const booking = userBookings[index];
        if (booking && booking.id === bookingId) {
            // Điền thông tin vào form
            document.getElementById('class-select').value = booking.service;
            document.getElementById('date-input').value = booking.date;
            document.getElementById('time-select').value = booking.time;
            document.getElementById('booking-form').dataset.editIndex = index;
            modal.classList.remove('hidden');
        }
    };

    // Hàm xóa lịch
    window.deleteBooking = function(bookingId, index) {
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
        const deleteModal = document.getElementById('delete-confirm-modal');
    
        if (deleteModal) {
            deleteModal.classList.remove('hidden'); // Hiển thị modal xóa
        }
    
        if (confirmDeleteBtn) {
            confirmDeleteBtn.onclick = function () {
                const globalIndex = bookings.findIndex(b => b.id === bookingId && b.email === currentUser.email);
                if (globalIndex !== -1) {
                    bookings.splice(globalIndex, 1);
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                    userBookings = bookings.filter(booking => booking.email === currentUser.email);
                    displayBookings();
                }
                if (deleteModal) {
                    deleteModal.classList.add('hidden'); // Ẩn modal sau khi xóa
                }
            };
        }
    
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', function () {
                if (deleteModal) {
                    deleteModal.classList.add('hidden'); // Ẩn modal
                }
            });
        }
    };

function addBooking(bookingData) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const newBooking = {
        id: Date.now().toString(),
        ...bookingData
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}});
document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const classType = document.getElementById('class-select').value;
    const date = document.getElementById('date-input').value;
    const time = document.getElementById('time-select').value;

    // Lấy danh sách lịch tập từ localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Kiểm tra trùng lịch
    const isDuplicate = bookings.some(booking => 
        booking.service === classType && booking.date === date && booking.time === time
    );

    if (isDuplicate) {
        // Chuyển hướng đến trang thông báo trùng lịch
        window.location.href = 'coincide.html';
        return;
    }

    // Nếu không trùng, thêm lịch mới
    const newBooking = {
        id: Date.now().toString(),
        service: classType,
        date,
        time,
        email: JSON.parse(localStorage.getItem('currentUser')).email,
    };

    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert('Đặt lịch thành công!');
    window.location.href = 'schedule.html';
});