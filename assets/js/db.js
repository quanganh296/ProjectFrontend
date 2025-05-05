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
function loadServices() {
    const servicesTableBody = document.getElementById('services-table-body');
    if (!servicesTableBody) {
        console.error('services-table-body not found');
        return;
    }
    // Populate the services table
    servicesTableBody.innerHTML = '<tr><td>Example Service</td></tr>'; // Example content
}

function loadBookings() {
    const bookingsTableBody = document.getElementById('bookings-table-body');
    if (!bookingsTableBody) {
        console.error('bookings-table-body not found');
        return;
    }
    // Populate the bookings table
    bookingsTableBody.innerHTML = '<tr><td>Example Booking</td></tr>'; // Example content
}
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    // Log the state of the DOM elements
    console.log('services-table-body:', document.getElementById('services-table-body'));
    console.log('bookings-table-body:', document.getElementById('bookings-table-body'));

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

    // Other initialization logic...
    setupServiceManagement();
    setupBookingManagement();
    setupNavigation();
    loadServices();
    if (typeof DB.bookings.getAll === 'function') {
        loadBookings();
    } else {
        console.error('DB.bookings.getAll is not defined');
    }
});
function initializeData() {
    if (!localStorage.getItem('bookings')) {
        const sampleBookings = [];
        localStorage.setItem('bookings', JSON.stringify(sampleBookings));
        console.log('Booking management setup is complete');
    }
    if (!localStorage.getItem('services')) {
        const sampleServices = [
            { id: '1', name: 'Gym', description: 'Lớp tập Gym', price: 100, image: '../../assets/pic/Gymclass.jpg' },
            { id: '2', name: 'Yoga', description: 'Lớp tập Yoga', price: 120, image: '../../assets/pic/yogaclass.jpg' },
            { id: '3', name: 'Zumba', description: 'Lớp tập Zumba', price: 150, image: '../../assets/pic/Zumbaclass.jpg' }
        ];
        localStorage.setItem('services', JSON.stringify(sampleServices));
    }
}
initializeData();

function setupNavigation() {
    console.log('Navigation setup is complete from db.js');
}

// Khởi tạo dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupNavigation();
});
function displayErrorMessage(formId, message) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found`);
        return;
    }

    // Remove any existing error message
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and append the new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-2';
    errorDiv.textContent = message;
    form.appendChild(errorDiv);
}

// Function to clear the error message
function clearErrorMessage(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}
// Add this at the end of db.js

// Override setupEventListeners to avoid errors when elements are not present
function setupEventListeners() {
    console.log('Event listeners are set up (final version)');

    // Check for confirm-delete-btn (Service deletion)
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const serviceIdToDelete = confirmDeleteBtn.getAttribute('data-service-id');
            console.log('Confirm delete service clicked, ID:', serviceIdToDelete);
            if (serviceIdToDelete) {
                deleteService(serviceIdToDelete);
                console.log('Service deleted successfully:', serviceIdToDelete);
            } else {
                console.error('No service ID found for deletion');
            }
        });
        console.log('confirm-delete-btn listener attached');
    }

    // Check for confirm-delete-booking-btn (Booking deletion)
    const confirmDeleteBookingBtn = document.getElementById('confirm-delete-booking-btn');
    if (confirmDeleteBookingBtn) {
        confirmDeleteBookingBtn.addEventListener('click', function() {
            const bookingIdToDelete = confirmDeleteBookingBtn.getAttribute('data-booking-id');
            console.log('Confirm delete booking clicked, ID:', bookingIdToDelete);
            if (bookingIdToDelete) {
                deleteBooking(bookingIdToDelete);
                hideModal('delete-booking-modal');
                console.log('Booking deleted successfully:', bookingIdToDelete);
            } else {
                console.error('No booking ID found for deletion');
            }
        });
        console.log('confirm-delete-booking-btn listener attached');
    }

    // Check for add-service-btn
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function () {
            const modal = document.getElementById('add-service-modal');
            if (modal) {
                modal.classList.remove('hidden');
                const addImagePreview = document.getElementById('add-image-preview');
                if (addImagePreview) {
                    addImagePreview.src = '';
                    addImagePreview.style.display = 'none';
                }
            }
        });
    }

    // Check for cancel-add-btn
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', function () {
            const modal = document.getElementById('add-service-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Check for save-add-btn
    const saveAddBtn = document.getElementById('save-add-btn');
    if (saveAddBtn) {
        saveAddBtn.addEventListener('click', function() {
            const newService = {
                id: Date.now().toString(),
                name: document.getElementById('service-name-input')?.value.trim(),
                description: document.getElementById('service-desc-input')?.value.trim(),
                price: parseFloat(document.getElementById('service-price-input')?.value),
                image: document.getElementById('service-img-input')?.value.trim() || ''
            };
            if (newService.name && newService.description && !isNaN(newService.price) && newService.price >= 0) {
                DB.services.add(newService);
                hideModal('add-service-modal');
                loadServices();
                document.getElementById('service-name-input').value = '';
                document.getElementById('service-desc-input').value = '';
                document.getElementById('service-price-input').value = '';
                document.getElementById('service-img-input').value = '';
            } 
        });
    }

    // Check for cancel-edit-btn
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            hideModal('edit-service-modal');
        });
    }

    // Check for save-edit-btn
    const saveEditBtn = document.getElementById('save-edit-btn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function() {
            const updatedService = {
                id: document.getElementById('edit-service-id')?.value,
                name: document.getElementById('edit-service-name')?.value.trim(),
                description: document.getElementById('edit-service-desc')?.value.trim(),
                price: parseFloat(document.getElementById('edit-service-price')?.value),
                image: document.getElementById('edit-service-img')?.value.trim()
            };
            if (updatedService.name && updatedService.description && !isNaN(updatedService.price) && updatedService.price >= 0) {
                DB.services.update(updatedService);
                hideModal('edit-service-modal');
                loadServices();
            } 
        });
    }

    // Check for cancel-delete-btn
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            hideModal('delete-confirm-modal');
        });
    }

    // Check for save-edit-booking-btn
    const saveEditBookingBtn = document.getElementById('save-edit-booking-btn');
    if (saveEditBookingBtn) {
        saveEditBookingBtn.addEventListener('click', function() {
            const updatedBooking = {
                id: document.getElementById('edit-booking-id').value,
                service: document.getElementById('edit-booking-service').value,
                date: document.getElementById('edit-booking-date').value,
                time: document.getElementById('edit-booking-time').value,
                userId: document.getElementById('edit-booking-id').value,
                email: document.getElementById('edit-booking-email').value,
                status: document.getElementById('edit-booking-status').value
            };
            
            const bookings = DB.bookings.getAll();
            if (isDuplicateBooking(updatedBooking, bookings)) {
                displayErrorMessage('edit-booking-modal-form', 'Lịch tập này đã tồn tại! Vui lòng chọn lịch khác.');
                return;
            }

            clearErrorMessage('edit-booking-modal-form');

            if (updatedBooking.service && updatedBooking.date && updatedBooking.time && updatedBooking.email && updatedBooking.status) {
                DB.bookings.update(updatedBooking);
                hideModal('edit-booking-modal');
                loadBookings();
            } else {
                displayErrorMessage('edit-booking-modal-form', 'Vui lòng điền đầy đủ thông tin lịch tập.');
            }
        });
    }

    // Check for cancel-delete-booking-btn
    const cancelDeleteBookingBtn = document.getElementById('cancel-delete-booking-btn');
    if (cancelDeleteBookingBtn) {
        cancelDeleteBookingBtn.addEventListener('click', function() {
            console.log('Cancel delete booking clicked');
            hideModal('delete-booking-modal');
        });
    }

    // Check for cancel-edit-booking-btn
    const cancelEditBookingBtn = document.getElementById('cancel-edit-booking-btn');
    if (cancelEditBookingBtn) {
        cancelEditBookingBtn.addEventListener('click', function() {
            clearErrorMessage('edit-booking-modal-form');
            hideModal('edit-booking-modal');
        });
    }

    // Check for service-nav
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

    // Check for apply-filter
    const applyFilterBtn = document.getElementById('apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            console.log('Apply filter button clicked');
            loadBookings(true);
        });
    }

    // Check for apply-service-filter
    const applyServiceFilterBtn = document.getElementById('apply-service-filter');
    if (applyServiceFilterBtn) {
        applyServiceFilterBtn.addEventListener('click', function() {
            console.log('Apply service filter button clicked');
            loadServices(true);
        });
    }

    // Check for add-booking-form (assumed in schedule.html)
    const addBookingForm = document.getElementById('add-booking-form');
    const saveAddBookingBtn = document.getElementById('save-add-booking-btn');
    if (addBookingForm && saveAddBookingBtn) {
        saveAddBookingBtn.addEventListener('click', function() {
            const newBooking = {
                service: document.getElementById('add-booking-service')?.value,
                date: document.getElementById('add-booking-date')?.value,
                time: document.getElementById('add-booking-time')?.value,
                email: document.getElementById('add-booking-email')?.value,
                userId: document.getElementById('add-booking-user-id')?.value || Date.now().toString(),
                status: document.getElementById('add-booking-status')?.value || 'Chờ xác nhận'
            };

            const bookings = DB.bookings.getAll();
            if (isDuplicateBooking(newBooking, bookings)) {
                displayErrorMessage('add-booking-form', 'Lịch tập này đã tồn tại! Vui lòng chọn lịch khác.');
                return;
            }

            clearErrorMessage('add-booking-form');

            if (newBooking.service && newBooking.date && newBooking.time && newBooking.email) {
                const addedBooking = DB.bookings.add(newBooking);
                if (addedBooking) {
                    hideModal('add-booking-modal');
                    loadBookings();
                }
            } else {
                displayErrorMessage('add-booking-form', 'Vui lòng điền đầy đủ thông tin lịch tập.');
            }
        });
    }

    // Check for cancel-add-booking-btn
    const cancelAddBookingBtn = document.getElementById('cancel-add-booking-btn');
    if (cancelAddBookingBtn) {
        cancelAddBookingBtn.addEventListener('click', function() {
            clearErrorMessage('add-booking-form');
            hideModal('add-booking-modal');
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
        modal.classList.remove('fade-out');
        console.log(`Modal ${modalId} shown`);
    } else {
        console.error(`Modal ${modalId} not found`);
    }
}

function hideModal(modalId, immediate = false) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (immediate) {
            // Ẩn ngay lập tức mà không cần hiệu ứng
            modal.classList.add('hidden');
            modal.classList.remove('fade-out');
            console.log(`Modal ${modalId} hidden immediately`);
        } else {
            // Sử dụng hiệu ứng fade-out như trước
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.classList.add('hidden');
                console.log(`Modal ${modalId} hidden`);
            }, 300);
        }
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
function loadServices(applyFilters = false) {
    console.log('loadServices called, applyFilters:', applyFilters);
    
    let services = DB.services.getAll();
    let updated = false;

    // Cập nhật đường dẫn hình ảnh nếu cần
    services.forEach(service => {
        if (service.name === 'Gym') {
            service.image = '../../assets/pic/Gymclass.jpg';
            updated = true;
        } else if (service.name === 'Yoga') {
            service.image = '../../assets/pic/yogaclass.jpg';
            updated = true;
        } else if (service.name === 'Zumba') {
            service.image = '../../assets/pic/Zumbaclass.jpg';
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem('services', JSON.stringify(services));
        console.log('Service images updated successfully');
    }

    // Áp dụng bộ lọc nếu có
    if (applyFilters) {
        const nameFilter = document.getElementById('service-name-filter')?.value.trim().toLowerCase();
        const priceMinFilter = parseFloat(document.getElementById('service-price-min-filter')?.value) || 0;

        console.log('Service Filter inputs:', { nameFilter, priceMinFilter });

        if (nameFilter) {
            services = services.filter(service => {
                if (!service.name) return false;
                return service.name.toLowerCase().includes(nameFilter);
            });
            console.log('After name filter:', services);
        }

        if (priceMinFilter > 0) {
            services = services.filter(service => {
                if (service.price === undefined) return false;
                return service.price >= priceMinFilter;
            });
            console.log('After price min filter:', services);
        }
    }

    const tableBody = document.getElementById('services-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        if (services.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="py-2 px-4 text-center">Không tìm thấy dịch vụ nào.</td></tr>';
        } else {
            services.forEach(service => {
                const row = document.createElement('tr');
                row.className = 'border-t';
                row.innerHTML = `
                    <td class="py-2 px-5">${service.name}</td>
                    <td class="py-2 px-4">${service.description}</td>
                    <td class="py-2 px-4">
                        ${service.image ? `<img src="${service.image}" alt="${service.name}" class="describe">` : 'Không có hình ảnh'}
                    </td>
                    <td class="py-2 px-4">
                        <button class="bg-blue-500 text-white action-btn" onclick="showEditServiceModal('${service.id}')">Sửa</button>
                        <button class="bg-red-500 text-white delete-btn" onclick="showDeleteServiceModal('${service.id}')">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        console.log('Services table reloaded:', services);
    } else {
        console.error('services-table-body not found');
    }
}
function showDeleteServiceModal(serviceId) {
    console.log('Opening delete service modal for ID:', serviceId);
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        // Chỉ cập nhật data-service-id, không cần gắn lại sự kiện
        confirmDeleteBtn.setAttribute('data-service-id', serviceId);
    } else {
        console.error('confirm-delete-btn not found in modal');
    }
    showModal('delete-confirm-modal');
}


function deleteService(serviceId) {
    console.log('deleteService called with ID:', serviceId);
    
    // Xóa dịch vụ khỏi localStorage
    DB.services.delete(serviceId);
    
    // Cập nhật lại bảng ngay lập tức
    console.log('Calling loadServices to refresh table');
    loadServices();
    
    // Ẩn modal ngay lập tức
    console.log('Hiding delete-confirm-modal');
    hideModal('delete-confirm-modal', true);
}
   
function isDuplicateBooking(newBooking, existingBookings) {
    return existingBookings.some(booking => 
        booking.id !== newBooking.id && // Exclude the booking being updated
        booking.service === newBooking.service &&
        booking.date === newBooking.date &&
        booking.time === newBooking.time &&
        booking.email === newBooking.email
    );
}

// Override DB.bookings.add to prevent duplicates
DB.bookings.add = function(booking) {
    const bookings = this.getAll();
    
    // Check for duplicates before adding
    if (isDuplicateBooking(booking, bookings)) {
        console.warn('Duplicate booking detected, not adding:', booking);
        alert('Lịch tập này đã tồn tại! Vui lòng chọn lịch khác.');
        return null; // Do not add the duplicate booking
    }

    booking.id = Date.now().toString(); // Tạo ID đơn giản
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log('Booking added successfully:', booking);
    return booking;
};

// Override DB.bookings.update to prevent duplicates
DB.bookings.update = function(updatedBooking) {
    let bookings = this.getAll();
    
    // Check for duplicates before updating
    if (isDuplicateBooking(updatedBooking, bookings)) {
        console.warn('Duplicate booking detected, not updating:', updatedBooking);
        alert('Lịch tập này đã tồn tại! Vui lòng chọn lịch khác.');
        return false; // Do not update if it creates a duplicate
    }

    const index = bookings.findIndex(booking => booking.id === updatedBooking.id);
    if (index !== -1) {
        bookings[index] = updatedBooking;
        localStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Booking updated successfully:', updatedBooking);
        return true;
    }
    return false;
};
function loadBookings(applyFilters = false) {
    let bookings = DB.bookings.getAll();
    
    // Deduplicate bookings (keep the latest entry based on ID)
    const seen = new Set();
    bookings = bookings.filter(booking => {
        if (!booking.id) return false; // Skip bookings without an ID
        const key = `${booking.service}|${booking.date}|${booking.time}|${booking.email}`;
        if (seen.has(key)) {
            console.log('Duplicate booking removed:', booking);
            return false; // Skip duplicate
        }
        seen.add(key);
        return true;
    });
    
    // Save deduplicated bookings back to localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Lấy danh sách users từ localStorage để lấy fullName
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (applyFilters) {
        const classFilter = document.getElementById('class-filter').value;
        const emailFilter = document.getElementById('email-filter').value.toLowerCase();
        const dateFilter = document.getElementById('date-filter').value;
        
        console.log('Filter inputs:', { classFilter, emailFilter, dateFilter });
        
        if (classFilter && classFilter !== 'all') {
            bookings = bookings.filter(booking => {
                if (!booking.service) return true;
                return booking.service.toLowerCase() === classFilter.toLowerCase();
            });
            console.log('After class filter:', bookings);
        }
        
        if (emailFilter) {
            bookings = bookings.filter(booking => {
                if (!booking.email) return true;
                return booking.email.toLowerCase().includes(emailFilter);
            });
            console.log('After email filter:', bookings);
        }
        
        if (dateFilter) {
            bookings = bookings.filter(booking => {
                if (!booking.date) return true;
                return booking.date === dateFilter;
            });
            console.log('After date filter:', bookings);
        }
    }
    
    const tableBody = document.getElementById('bookings-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        if (bookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="py-2 px-4 text-center">Không tìm thấy lịch tập nào.</td></tr>';
        } else {
            bookings.forEach(booking => {
                const user = users.find(u => u.email === booking.email) || { fullName: 'N/A', email: booking.email || 'N/A' };
                const row = document.createElement('tr');
                row.className = 'border-t';
                row.innerHTML = `
                    <td class="py-2 px-4">${booking.service || 'N/A'}</td>
                    <td class="py-2 px-4">${booking.date || 'N/A'}</td>
                    <td class="py-2 px-4">${booking.time || 'N/A'}</td>
                    <td class="py-2 px-4">${user.fullName}</td>
                    <td class="py-2 px-4">${booking.email}</td>
                    <td class="py-2 px-4">${booking.status || 'N/A'}</td>
                    <td class="py-2 px-4">
                        <button class="editBtn" onclick="showEditBookingModal('${booking.id}')">Sửa</button>
                        <button class="deleteBtn" onclick="showDeleteBookingModal('${booking.id}')">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        console.log('Bookings table reloaded:', bookings);
    } else {
        console.error('bookings-table-body not found');
    }
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
// Function to show the edit booking modal
// Removed unused function 'showEditBookingModal'
    }
}

function showEditBookingModal(bookingId) {
    const bookings = DB.bookings.getAll();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
        const user = users.find(u => u.id === booking.userId || u.email === booking.email) || { fullName: 'N/A', email: booking.email || 'N/A' };
        document.getElementById('edit-booking-id').value = booking.id;
        document.getElementById('edit-booking-service').value = booking.service;
        document.getElementById('edit-booking-date').value = booking.date;
        document.getElementById('edit-booking-time').value = booking.time;
        document.getElementById('edit-booking-name').value = user.fullName;
        document.getElementById('edit-booking-email').value = user.email;
        document.getElementById('edit-booking-status').value = booking.status;
        
        showModal('edit-booking-modal');
// Function to show the delete booking modal
// Removed unused function 'showDeleteBookingModal'
        console.error('Booking not found:', bookingId);
    }
}

function showDeleteBookingModal(bookingId) {
    console.log('Opening delete booking modal for ID:', bookingId);
    const confirmDeleteBookingBtn = document.getElementById('confirm-delete-booking-btn');
    if (confirmDeleteBookingBtn) {
        confirmDeleteBookingBtn.setAttribute('data-booking-id', bookingId);
        confirmDeleteBookingBtn.replaceWith(confirmDeleteBookingBtn.cloneNode(true));
        const newConfirmDeleteBookingBtn = document.getElementById('confirm-delete-booking-btn');
        newConfirmDeleteBookingBtn.addEventListener('click', function() {
            console.log('Confirm delete booking clicked, ID:', bookingId);
            deleteBooking(bookingId);
            hideModal('delete-booking-modal');
            console.log('Booking deleted successfully:', bookingId);
        });
        console.log('Set data-booking-id and listener:', bookingId);
    } else {
        console.error('confirm-delete-booking-btn not found in modal');
    }
    showModal('delete-booking-modal');
}

function deleteBooking(bookingId) {
    DB.bookings.delete(bookingId);
    loadBookings();
}

DB.bookings.getAll = function() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
};

DB.bookings.delete = function(bookingId) {
    let bookings = this.getAll();
    console.log('Deleting booking ID:', bookingId, 'Current bookings:', bookings);
    
    // More robust comparison that doesn't rely on toString()
    bookings = bookings.filter(booking => {
        // Skip comparing if either ID is missing
        if (!booking || !booking.id) return true;
        
        // Convert both to strings safely
        const bookingIdStr = String(booking.id);
        const targetIdStr = String(bookingId);
        
        // Compare as strings
        return bookingIdStr !== targetIdStr;
    });
// Function to update the add image preview
// Removed unused function 'updateAddImagePreview'
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log('Bookings after deletion:', bookings);
};

// Image Preview Functions
function updateAddImagePreview() {
    const imageUrl = document.getElementById('service-img-input')?.value.trim();
    const imagePreview = document.getElementById('add-image-preview');
    if (imageUrl && imagePreview) {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
        imagePreview.onerror = () => {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        alert('Không thể tải hình ảnh từ URL này.');
    }
}
const preview = document.getElementById('edit-image-preview');
    if (preview) {
        if (service.image) {
            preview.src = service.image;
            preview.style.display = 'block';
            preview.onerror = () => {
                preview.src = '';
                preview.style.display = 'none';
                alert('Không thể tải hình ảnh từ URL này.');
            };
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    }
};
// Function to update the edit image preview




function showEditServiceModal(serviceId) {
    const service = DB.services.getAll().find(s => String(s.id) === String(serviceId));
    if (!service) {
        console.error('Không tìm thấy dịch vụ với ID:', serviceId);
        return;
    }

    // Điền dữ liệu vào các trường của modal
    document.getElementById('edit-service-id').value = service.id;
    document.getElementById('edit-service-name').value = service.name;
    document.getElementById('edit-service-desc').value = service.description;
    document.getElementById('edit-service-img').value = service.image || '';

    // Hiển thị preview hình ảnh nếu có
    

    // Hiển thị modal
    showModal('edit-service-modal');
}


document.getElementById('save-edit-btn').addEventListener('click', function () {
    const serviceId = document.getElementById('edit-service-id').value;
    const updatedService = {
        id: document.getElementById('edit-service-id').value,
        name: document.getElementById('edit-service-name').value.trim(),
        description: document.getElementById('edit-service-desc').value.trim(),
        image: document.getElementById('edit-service-img').value.trim()
    };
    if (updatedService.name && updatedService.description) {
        DB.services.update(updatedService);
        hideModal('edit-service-modal');
        loadServices();
    } else {
        alert('Vui lòng điền đầy đủ thông tin!');
    }
    // Cập nhật dịch vụ trong DB
    DB.services.update(serviceId, updatedService);

    // Ẩn modal
    const modal = document.getElementById('edit-service-modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    // Tải lại danh sách dịch vụ
    loadServices();
});
DB.services.update = function(updatedService) {
    let services = this.getAll();
    const index = services.findIndex(service => service.id === updatedService.id);
    if (index !== -1) {
        services[index] = updatedService;
        localStorage.setItem('services', JSON.stringify(services));
    }
};

// Hàm xử lý cập nhật dịch vụ khi nhấn "Lưu" trong modal chỉnh sửa


function debugServices() {
    const services = DB.services.getAll();
    console.log('Current services in localStorage:', services);
}

const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        localStorage.removeItem('currentUser'); 
      
        window.location.href = '../../pages/auth/login.html';
    });
}

DB.services.delete = function(serviceId) {
    let services = this.getAll();
    console.log('Deleting service ID:', serviceId, 'Current services:', services);
    
    // So sánh ID bằng cách ép kiểu thành chuỗi
    services = services.filter(service => String(service.id) !== String(serviceId));
    
    // Lưu lại danh sách dịch vụ đã cập nhật
    localStorage.setItem('services', JSON.stringify(services));
    console.log('Services after deletion:', services);
};


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
    const maxCount = Math.max(gymCount, yogaCount, zumbaCount, 1); // Ensure maxCount is at least 1 to avoid division by 0

    const gymBar = document.getElementById('gym-bar');
    const yogaBar = document.getElementById('yoga-bar');
    const zumbaBar = document.getElementById('zumba-bar');

    if (gymBar && yogaBar && zumbaBar) {
        // Handle Gym bar
        if (gymCount === 0) {
            gymBar.style.display = 'none'; // Hide if no bookings
        } else {
            gymBar.style.display = 'block';
            gymBar.style.height = `${(gymCount / maxCount) * maxHeight}px`;
            gymBar.style.backgroundColor = '#93C5FD';
            gymBar.style.width = '100px';
        }

        // Handle Yoga bar
        if (yogaCount === 0) {
            yogaBar.style.display = 'none'; // Hide if no bookings
        } else {
            yogaBar.style.display = 'block';
            yogaBar.style.height = `${(yogaCount / maxCount) * maxHeight}px`;
            yogaBar.style.backgroundColor = '#86EFAC';
            yogaBar.style.width = '100px';
        }

        // Handle Zumba bar
        if (zumbaCount === 0) {
            zumbaBar.style.display = 'none'; // Hide if no bookings
        } else {
            zumbaBar.style.display = 'block';
            zumbaBar.style.height = `${(zumbaCount / maxCount) * maxHeight}px`;
            zumbaBar.style.backgroundColor = '#D8B4FE';
            zumbaBar.style.width = '100px';
            zumbaBar.style.minHeight = '10px'; // Ensure visibility if height is small
        }
    }

    // Log for debugging (optional, can be removed later)
    console.log('Booking Counts:', { gymCount, yogaCount, zumbaCount });
    console.log('Bar Styles:', {
        gymBarDisplay: gymBar ? gymBar.style.display : 'Not found',
        gymBarHeight: gymBar ? gymBar.style.height : 'Not found',
        yogaBarDisplay: yogaBar ? yogaBar.style.display : 'Not found',
        yogaBarHeight: yogaBar ? yogaBar.style.height : 'Not found',
        zumbaBarDisplay: zumbaBar ? zumbaBar.style.display : 'Not found',
        zumbaBarHeight: zumbaBar ? zumbaBar.style.height : 'Not found'
    });
}