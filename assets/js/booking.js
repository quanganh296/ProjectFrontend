document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '../auth/login.html';
        return;
    }

    // Hiển thị tên người dùng đăng nhập
    const userNameElement = document.getElementById('current-user-name');
    if (userNameElement) {
        userNameElement.textContent = `Xin chào, ${currentUser.fullName || 'Admin'}`;
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => {
                btn.classList.remove('border-blue-600', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            this.classList.remove('border-transparent', 'text-gray-500');
            this.classList.add('border-blue-600', 'text-blue-600');
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Hiển thị thống kê trên dashboard
    document.getElementById('total-users').textContent = users.length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(booking => booking.date === today);
    document.getElementById('today-bookings').textContent = todayBookings.length;

    // Hàm hiển thị danh sách lịch đặt
    function displayBookings(filteredBookings = bookings) {
        const bookingsTableBody = document.getElementById('bookings-table-body');
        if (bookingsTableBody) {
            if (filteredBookings.length > 0) {
                bookingsTableBody.innerHTML = filteredBookings.map((booking, index) => {
                    const user = users.find(u => u.id === booking.userId) || { email: booking.email || 'Không xác định' };
                    return `
                        <tr>
                            <td class="py-3 px-4 border-b">${index + 1}</td>
                            <td class="py-3 px-4 border-b">${user.email}</td>
                            <td class="py-3 px-4 border-b">${booking.date}</td>
                            <td class="py-3 px-4 border-b">${booking.time}</td>
                            <td class="py-3 px-4 border-b">${booking.service}</td>
                            <td class="py-3 px-4 border-b">${booking.name || 'N/A'}</td>
                            <td class="py-3 px-4 border-b">
                                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">${booking.status}</span>
                            </td>
                            <td class="py-3 px-4 border-b">
                                <button class="text-blue-600 hover:underline mr-2 edit-booking-btn" data-booking-id="${booking.id}">Sửa</button>
                                <button class="text-red-600 hover:underline delete-booking-btn" data-booking-id="${booking.id}">Xóa</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            } else {
                bookingsTableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="py-4 px-4 text-center text-gray-500">Không tìm thấy lịch đặt</td>
                    </tr>
                `;
            }

            // Gắn sự kiện cho các nút Sửa và Xóa lịch đặt
            document.querySelectorAll('.edit-booking-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const bookingId = this.getAttribute('data-booking-id');
                    console.log('Opening edit modal for ID:', bookingId);
                    const booking = bookings.find(b => b.id === bookingId);
                    if (booking) {
                        const editModal = document.getElementById('edit-booking-modal');
                        if (editModal) {
                            document.getElementById('edit-booking-id').value = bookingId;
                            document.getElementById('edit-booking-service').value = booking.service;
                            document.getElementById('edit-booking-date').value = booking.date;
                            document.getElementById('edit-booking-time').value = booking.time;
                            document.getElementById('edit-booking-name').value = booking.name || '';
                            document.getElementById('edit-booking-email').value = booking.email || '';
                            document.getElementById('edit-booking-status').value = booking.status;
                            editModal.classList.remove('hidden');
                        } else {
                            console.error('Edit booking modal not found');
                        }
                    } else {
                        console.error('Booking not found for edit:', bookingId);
                    }
                });
            });

            document.querySelectorAll('.delete-booking-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const bookingId = this.getAttribute('data-booking-id');
                    console.log('Opening delete modal for ID:', bookingId);
                    const deleteModal = document.getElementById('delete-booking-modal');
                    if (deleteModal) {
                        deleteModal.classList.remove('hidden');

                        const confirmDeleteBookingBtn = document.getElementById('confirm-delete-booking-btn');
                        const cancelDeleteBookingBtn = document.getElementById('cancel-delete-booking-btn');

                        if (confirmDeleteBookingBtn && cancelDeleteBookingBtn) {
                            const newConfirmDeleteBtn = confirmDeleteBookingBtn.cloneNode(true);
                            confirmDeleteBookingBtn.parentNode.replaceChild(newConfirmDeleteBtn, confirmDeleteBookingBtn);
                            const newCancelDeleteBtn = cancelDeleteBookingBtn.cloneNode(true);
                            cancelDeleteBookingBtn.parentNode.replaceChild(newCancelDeleteBtn, cancelDeleteBookingBtn);

                            newConfirmDeleteBtn.addEventListener('click', () => {
                                const index = bookings.findIndex(b => b.id === bookingId);
                                if (index !== -1) {
                                    bookings.splice(index, 1);
                                    localStorage.setItem('bookings', JSON.stringify(bookings));
                                    location.reload();
                                } else {
                                    console.error('Booking not found for delete:', bookingId);
                                }
                            });

                            newCancelDeleteBtn.addEventListener('click', () => {
                                console.log('Cancel delete booking clicked');
                                deleteModal.classList.add('hidden');
                            });
                        } else {
                            console.error('Confirm or Cancel button not found in delete-booking-modal');
                        }
                    }
                });
            });
        }
    }

    // Gắn sự kiện lưu chỉnh sửa lịch tập
    const saveEditBookingBtn = document.getElementById('save-edit-booking-btn');
    const cancelEditBookingBtn = document.getElementById('cancel-edit-booking-btn');
    const editModal = document.getElementById('edit-booking-modal');

    if (saveEditBookingBtn) {
        saveEditBookingBtn.addEventListener('click', () => {
            const bookingId = document.getElementById('edit-booking-id').value;
            const index = bookings.findIndex(b => b.id === bookingId);
            if (index !== -1) {
                bookings[index] = {
                    ...bookings[index],
                    service: document.getElementById('edit-booking-service').value,
                    date: document.getElementById('edit-booking-date').value,
                    time: document.getElementById('edit-booking-time').value,
                    name: document.getElementById('edit-booking-name').value,
                    email: document.getElementById('edit-booking-email').value,
                    status: document.getElementById('edit-booking-status').value
                };
                localStorage.setItem('bookings', JSON.stringify(bookings));
                location.reload();
            } else {
                console.error('Booking not found for saving edit:', bookingId);
            }
        });
    }

    if (cancelEditBookingBtn) {
        cancelEditBookingBtn.addEventListener('click', () => {
            editModal.classList.add('hidden');
        });
    }

    // Hàm hiển thị danh sách người dùng trong phần Quản lý lịch
    function displayUsers() {
        const usersTableBody = document.getElementById('users-in-booking-table-body');
        if (usersTableBody) {
            if (users.length > 0) {
                usersTableBody.innerHTML = users.map((user, index) => `
                    <tr>
                        <td class="py-3 px-4 border-b">${index + 1}</td>
                        <td class="py-3 px-4 border-b">${user.email}</td>
                        <td class="py-3 px-4 border-b">${user.fullName || 'N/A'}</td>
                        <td class="py-3 px-4 border-b">${user.role}</td>
                        <td class="py-3 px-4 border-b">${user.registeredDate || 'N/A'}</td>
                        <td class="py-3 px-4 border-b">
                            <button class="text-blue-600 hover:underline mr-2 edit-user-btn" data-id="${user.id}">Sửa</button>
                            <button class="text-red-600 hover:underline delete-user-btn" data-id="${user.id}">Xóa</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                usersTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="py-4 px-4 text-center text-gray-500">Chưa có người dùng nào</td>
                    </tr>
                `;
            }

            document.querySelectorAll('.edit-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                     showNotification('Chức năng sửa người dùng: ' + id);
                });
            });

            document.querySelectorAll('.delete-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                        const index = users.findIndex(u => u.id === id);
                        if (index !== -1) {
                            users.splice(index, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            location.reload();
                        }
                    }
                });
            });
        }
    }
    // Hiển thị danh sách lịch và người dùng ban đầu
    displayBookings();
    displayUsers();

    // Hiển thị danh sách dịch vụ
    const servicesTableBody = document.getElementById('services-table-body');
    const services = JSON.parse(localStorage.getItem('services')) || [];
    if (servicesTableBody) {
        if (services.length > 0) {
            servicesTableBody.innerHTML = services.map((service, index) => `
                <tr>
                    <td class="py-3 px-4 border-b">${service.name}</td>
                    <td class="py-3 px-4 border-b">${service.description}</td>
                    <td class="py-3 px-4 border-b">
                        <img src="${service.image || 'placeholder.jpg'}" alt="${service.name}" class="w-16 h-16 object-cover">
                    </td>
                    <td class="py-3 px-4 border-b">
                        <button class="text-blue-600 hover:underline mr-2 edit-service-btn" data-id="${index}">Sửa</button>
                        <button class="text-red-600 hover:underline delete-service-btn" data-id="${index}">Xóa</button>
                    </td>
                </tr>
            `).join('');
        } else {
            servicesTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="py-4 px-4 text-center text-gray-500">Chưa có dịch vụ nào</td>
                </tr>
            `;
        }
    }

    // Thêm sự kiện cho các nút trong dashboard
    const addServiceBtn = document.getElementById('add-service-btn');
    const addServiceModal = document.getElementById('add-service-modal');
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    const saveAddBtn = document.getElementById('save-add-btn');

    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            addServiceModal.classList.remove('hidden');
        });
    }

    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', () => {
            addServiceModal.classList.add('hidden');
        });
    }

    if (saveAddBtn) {
        saveAddBtn.addEventListener('click', () => {
            const name = document.getElementById('service-name-input').value;
            const description = document.getElementById('service-desc-input').value;
            const image = document.getElementById('service-img-input').value;

            if (name && description && image) {
                const newService = {
                    id: (services.length + 1).toString(),
                    name,
                    description,
                    image
                };
                services.push(newService);
                localStorage.setItem('services', JSON.stringify(services));
                location.reload();
            } else {
                 showNotification('Vui lòng nhập đầy đủ thông tin!');
            }
        });
    }

    document.querySelectorAll('.edit-service-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const service = services[id];
            const editModal = document.getElementById('edit-service-modal');
            document.getElementById('edit-service-id').value = id;
            document.getElementById('edit-service-name').value = service.name;
            document.getElementById('edit-service-desc').value = service.description;
            document.getElementById('edit-service-img').value = service.image;
            editModal.classList.remove('hidden');
        });
    });

    document.querySelectorAll('.delete-service-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const deleteModal = document.getElementById('delete-confirm-modal');
            deleteModal.classList.remove('hidden');

            const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
            const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

            if (confirmDeleteBtn && cancelDeleteBtn) {
                confirmDeleteBtn.addEventListener('click', () => {
                    services.splice(id, 1);
                    localStorage.setItem('services', JSON.stringify(services));
                    location.reload();
                });

                cancelDeleteBtn.addEventListener('click', () => {
                    deleteModal.classList.add('hidden');
                });
            }
        });
    });

    const applyFilterBtn = document.getElementById('apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', () => {
            const classFilter = document.getElementById('class-filter').value;
            const emailFilter = document.getElementById('email-filter').value.toLowerCase();
            const dateFilter = document.getElementById('date-filter').value;

            let filteredBookings = bookings;
            if (classFilter !== 'all') {
                filteredBookings = filteredBookings.filter(booking => booking.service === classFilter);
            }
            if (emailFilter) {
                filteredBookings = filteredBookings.filter(booking => booking.email.toLowerCase().includes(emailFilter));
            }
            if (dateFilter) {
                filteredBookings = filteredBookings.filter(booking => booking.date === dateFilter);
            }

            displayBookings(filteredBookings);
        });
    }
});