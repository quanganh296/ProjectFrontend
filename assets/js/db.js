const DB = {}; // Khởi tạo đối tượng DB

DB.init = function () {
    console.log('DB initialized');
    // Thêm các logic khởi tạo khác nếu cần
};

DB.services = {
    getAll() {
        return JSON.parse(localStorage.getItem('services') || '[]');
    },
    add(service) {
        const services = this.getAll();
        services.push(service);
        localStorage.setItem('services', JSON.stringify(services));
    },
    update(updatedService) {
        let services = this.getAll();
        const index = services.findIndex(service => service.id === updatedService.id);
        if (index !== -1) {
            services[index] = updatedService;
            localStorage.setItem('services', JSON.stringify(services));
            return true;
        }
        return false;
    },
    delete(serviceId) {
        let services = this.getAll();
        services = services.filter(service => service.id !== serviceId);
        localStorage.setItem('services', JSON.stringify(services));
    }
};

DB.bookings = {
    getAll() {
        return JSON.parse(localStorage.getItem('bookings') || '[]');
    },
    add(booking) {
        const bookings = this.getAll();
        booking.id = Date.now().toString(); // Tạo ID đơn giản
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        return booking;
    },
    update(updatedBooking) {
        let bookings = this.getAll();
        const index = bookings.findIndex(booking => booking.id === updatedBooking.id);
        if (index !== -1) {
            bookings[index] = updatedBooking;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return true;
        }
        return false;
    },
    delete(bookingId) {
        let bookings = this.getAll();
        bookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (startButton) {
        if (currentUser) {
            // Nếu đã đăng nhập, dẫn đến trang đặt lịch
            startButton.setAttribute('href', 'pages/booking/schedule.html');
        } else {
            // Nếu chưa đăng nhập, dẫn đến trang đăng ký
            startButton.setAttribute('href', 'pages/auth/register.html');
        }
    }
    initializeData();
    setupEventListeners();
    if (typeof DB !== 'undefined') {
        if (typeof DB.init === 'function') {
            DB.init();
        } else {
            console.warn('DB.init is not defined');
        }
    } else {
        console.error('DB is not defined');
    }
    setupServiceManagement();
    setupBookingManagement();
    setupNavigation();
    loadServices();
    loadBookings();
});

function initializeData() {
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
    if (!localStorage.getItem('services')) {
        const sampleServices = [
            { id: '1', name: 'Gym', description: 'Lớp tập Gym', price: 100, image: '' },
            { id: '2', name: 'Yoga', description: 'Lớp tập Yoga', price: 120, image: '' },
            { id: '3', name: 'Zumba', description: 'Lớp tập Zumba', price: 150, image: '' }
        ];
        localStorage.setItem('services', JSON.stringify(sampleServices));
    }
    if (!localStorage.getItem('bookings')) {
        const sampleBookings = [
            { 
                id: '1', 
                service: 'Gym', 
                date: '2025-04-25', 
                time: '08:00 - 10:00', 
                name: 'Nguyễn Văn A', 
                email: 'nguyenvana@example.com', 
                status: 'Đã xác nhận' 
            },
            { 
                id: '2', 
                service: 'Yoga', 
                date: '2025-04-26', 
                time: '14:00 - 15:30', 
                name: 'Trần Thị B', 
                email: 'tranthib@example.com', 
                status: 'Chờ xác nhận' 
            }
        ];
        localStorage.setItem('bookings', JSON.stringify(sampleBookings));
    }
}

function setupEventListeners() {
    console.log('Event listeners are set up');
    
    // Service Management Modal Events
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function () {
            const modal = document.getElementById('add-service-modal');
            if (modal) {
                modal.classList.remove('hidden'); // Hiển thị modal
            }
        });
    }
    
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', function () {
            const modal = document.getElementById('add-service-modal');
            if (modal) {
                modal.classList.add('hidden'); // Ẩn modal
            }
        });
    }
const saveAddBtn = document.getElementById('save-add-btn');
    if (saveAddBtn) {
        saveAddBtn.addEventListener('click', function() {
            const newService = {
                id: Date.now().toString(),
                name: document.getElementById('service-name-input').value,
                description: document.getElementById('service-desc-input').value,
                image: document.getElementById('service-img-input').value || ''
            };
            if (newService.name && newService.description) {
                DB.services.add(newService);
                hideModal('add-service-modal');
                loadServices();
                document.getElementById('service-name-input').value = '';
                document.getElementById('service-desc-input').value = '';
                document.getElementById('service-img-input').value = '';
            } else {
                alert('Vui lòng điền đầy đủ thông tin dịch vụ.');
            }
        });
    }
    
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            hideModal('edit-service-modal');
        });
    }
    
    const saveEditBtn = document.getElementById('save-edit-btn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function() {
            const updatedService = {
                id: document.getElementById('edit-service-id').value,
                name: document.getElementById('edit-service-name').value,
                description: document.getElementById('edit-service-desc').value,
                image: document.getElementById('edit-service-img').value
            };
            if (updatedService.name && updatedService.description) {
                DB.services.update(updatedService);
                hideModal('edit-service-modal');
                loadServices();
            } else {
                alert('Vui lòng điền đầy đủ thông tin dịch vụ.');
            }
        });
    }
    
    // Delete Service Modal Events
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            hideModal('delete-confirm-modal');
        });
    }
    
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const serviceIdToDelete = confirmDeleteBtn.getAttribute('data-service-id');
            if (serviceIdToDelete) {
                deleteService(serviceIdToDelete);
                hideModal('delete-confirm-modal');
                console.log('Xóa dịch vụ thành công');
            }
        });
    }
    
    // Booking Management Modal Events
    const cancelEditBookingBtn = document.getElementById('cancel-edit-booking-btn');
    if (cancelEditBookingBtn) {
        cancelEditBookingBtn.addEventListener('click', function() {
            hideModal('edit-booking-modal');
        });
    }
    
    const saveEditBookingBtn = document.getElementById('save-edit-booking-btn');
    if (saveEditBookingBtn) {
        saveEditBookingBtn.addEventListener('click', function() {
            const updatedBooking = {
                id: document.getElementById('edit-booking-id').value,
                service: document.getElementById('edit-booking-service').value,
                date: document.getElementById('edit-booking-date').value,
                time: document.getElementById('edit-booking-time').value,
                name: document.getElementById('edit-booking-name').value,
                email: document.getElementById('edit-booking-email').value,
                status: document.getElementById('edit-booking-status').value
            };
            if (updatedBooking.service && updatedBooking.date && updatedBooking.time && updatedBooking.name && updatedBooking.email && updatedBooking.status) {
                DB.bookings.update(updatedBooking);
                hideModal('edit-booking-modal');
                loadBookings();
            } else {
                alert('Vui lòng điền đầy đủ thông tin lịch tập.');
            }
        });
    }
    
    const cancelDeleteBookingBtn = document.getElementById('cancel-delete-booking-btn');
    if (cancelDeleteBookingBtn) {
        cancelDeleteBookingBtn.addEventListener('click', function() {
            console.log('Cancel delete booking clicked');
            hideModal('delete-booking-modal');
        });
    } else {
        console.error('cancel-delete-booking-btn not found');
    }
    
    const confirmDeleteBookingBtn = document.getElementById('confirm-delete-booking-btn');
    if (confirmDeleteBookingBtn) {
        confirmDeleteBookingBtn.addEventListener('click', function() {
            const bookingIdToDelete = confirmDeleteBookingBtn.getAttribute('data-booking-id');
            if (bookingIdToDelete) {
                deleteBooking(bookingIdToDelete);
                hideModal('delete-booking-modal');
                console.log('Xóa lịch tập thành công');
            }
        });
    }
    
    // Navigation Events
    const serviceNav = document.getElementById('service-nav');
    const bookingNav = document.getElementById('booking-nav');
    
    if (serviceNav) {
        serviceNav.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('service-section');
            hideSection('booking-section');
            serviceNav.classList.add('bg-gray-900');
            bookingNav.classList.remove('bg-gray-900');
        });
    }
    
    if (bookingNav) {
        bookingNav.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('booking-section');
            hideSection('service-section');
            bookingNav.classList.add('bg-gray-900');
            serviceNav.classList.remove('bg-gray-900');
        });
    }
    
    // Filter Events
    const applyFilterBtn = document.getElementById('apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            loadBookings(true); // true để áp dụng bộ lọc
        });
    }
}

function setupServiceManagement() {
    console.log('Service management setup is complete');
}

function setupBookingManagement() {
    console.log('Booking management setup is complete');
}

function setupNavigation() {
    console.log('Navigation setup is complete');
}

// Modal utility functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.remove('fade-out'); // Xóa class fade-out khi hiển thị
        console.log(`Modal ${modalId} shown`);
    } else {
        console.error(`Modal ${modalId} not found`);
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Thêm class fade-out để chạy hiệu ứng ẩn
        modal.classList.add('fade-out');
        // Chờ hiệu ứng hoàn tất (300ms) rồi thêm class hidden
        setTimeout(() => {
            modal.classList.add('hidden');
            console.log(`Modal ${modalId} hidden`);
        }, 300);
    } else {
        console.error(`Modal ${modalId} not found`);
    }
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('hidden');
    }
}

// Service Functions
function loadServices() {
    const services = DB.services.getAll();
    const tableBody = document.getElementById('services-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        services.forEach(service => {
            const row = document.createElement('tr');
            row.className = 'border-t';
            row.innerHTML = `
                <td class="py-2 px-4">${service.name}</td>
                <td class="py-2 px-4">${service.description}</td>
                <td class="py-2 px-4">${service.image || 'Không có hình ảnh'}</td>
                <td class="py-2 px-4">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="editService('${service.id}')">Sửa</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="showDeleteServiceModal('${service.id}')">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function showDeleteServiceModal(serviceId) {
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.setAttribute('data-service-id', serviceId);
    }
    showModal('delete-confirm-modal');
}

function deleteService(serviceId) {
    DB.services.delete(serviceId);
    loadServices();
}

function editService(serviceId) {
    const services = DB.services.getAll();
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
        document.getElementById('edit-service-id').value = service.id;
        document.getElementById('edit-service-name').value = service.name;
        document.getElementById('edit-service-desc').value = service.description;
        document.getElementById('edit-service-img').value = service.image || '';
        
        showModal('edit-service-modal');
    }
}

// Booking Functions
function loadBookings(applyFilters = false) {
    let bookings = DB.bookings.getAll();
    
    if (applyFilters) {
        const classFilter = document.getElementById('class-filter').value;
        const emailFilter = document.getElementById('email-filter').value.toLowerCase();
        const dateFilter = document.getElementById('date-filter').value;
        
        if (classFilter && classFilter !== 'all') {
            bookings = bookings.filter(booking => booking.service.toLowerCase() === classFilter.toLowerCase());
        }
        
        if (emailFilter) {
            bookings = bookings.filter(booking => booking.email.toLowerCase().includes(emailFilter));
        }
        
        if (dateFilter) {
            bookings = bookings.filter(booking => booking.date === dateFilter);
        }
    }
    
    const tableBody = document.getElementById('bookings-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.className = 'border-t';
            row.innerHTML = `
                <td class="py-2 px-4">${booking.service}</td>
                <td class="py-2 px-4">${booking.date}</td>
                <td class="py-2 px-4">${booking.time}</td>
                <td class="py-2 px-4">${booking.name}</td>
                <td class="py-2 px-4">${booking.email}</td>
                <td class="py-2 px-4">${booking.status}</td>
                <td class="py-2 px-4">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="showEditBookingModal('${booking.id}')">Sửa</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="showDeleteBookingModal('${booking.id}')">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Cập nhật biểu đồ và thống kê
    updateBookingStats(bookings);
}

function updateBookingStats(bookings) {
    const gymCount = bookings.filter(b => b && b.service && b.service.toLowerCase() === 'gym').length;
    const yogaCount = bookings.filter(b => b && b.service && b.service.toLowerCase() === 'yoga').length;
    const zumbaCount = bookings.filter(b => b && b.service && b.service.toLowerCase() === 'zumba').length;
    
    const gymCountElement = document.getElementById('gym-count');
    const yogaCountElement = document.getElementById('yoga-count');
    const zumbaCountElement = document.getElementById('zumba-count');
    
    if (gymCountElement) gymCountElement.textContent = gymCount;
    if (yogaCountElement) yogaCountElement.textContent = yogaCount;
    if (zumbaCountElement) zumbaCountElement.textContent = zumbaCount;
    
    const maxHeight = 200;
    const maxCount = Math.max(gymCount, yogaCount, zumbaCount);
    
    const gymBar = document.getElementById('gym-bar');
    const yogaBar = document.getElementById('yoga-bar');
    const zumbaBar = document.getElementById('zumba-bar');
    
    if (gymBar && yogaBar && zumbaBar) {
        gymBar.style.height = maxCount > 0 ? `${(gymCount / maxCount) * maxHeight}px` : '10px';
        yogaBar.style.height = maxCount > 0 ? `${(yogaCount / maxCount) * maxHeight}px` : '10px';
        zumbaBar.style.height = maxCount > 0 ? `${(zumbaCount / maxCount) * maxHeight}px` : '10px';
    }
}

function showEditBookingModal(bookingId) {
    const bookings = DB.bookings.getAll();
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
        document.getElementById('edit-booking-id').value = booking.id;
        document.getElementById('edit-booking-service').value = booking.service;
        document.getElementById('edit-booking-date').value = booking.date;
        document.getElementById('edit-booking-time').value = booking.time;
        document.getElementById('edit-booking-name').value = booking.name;
        document.getElementById('edit-booking-email').value = booking.email;
        document.getElementById('edit-booking-status').value = booking.status;
        
        showModal('edit-booking-modal');
    } else {
        console.error('Booking not found:', bookingId);
    }
}

function showDeleteBookingModal(bookingId) {
    const confirmDeleteBookingBtn = document.getElementById('confirm-delete-booking-btn');
    if (confirmDeleteBookingBtn) {
        confirmDeleteBookingBtn.setAttribute('data-booking-id', bookingId);
    }
    showModal('delete-booking-modal');
}

function deleteBooking(bookingId) {
    DB.bookings.delete(bookingId);
    loadBookings();
}