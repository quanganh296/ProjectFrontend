const DB = {}; 

DB.init = function () {
    console.log('DB initialized');
  
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
        if (isDuplicateBooking(booking, bookings)) {
            console.warn('Duplicate booking detected, not adding:', booking);
            showNotification('Lịch tập này đã tồn tại! Vui lòng chọn lịch khác.', 'error');
            return null;
        }
        booking.id = Date.now().toString();
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Booking added successfully:', booking);
        return booking;
    },
    update(updatedBooking) {
        let bookings = this.getAll();
        if (isDuplicateBooking(updatedBooking, bookings)) {
            console.warn('Duplicate booking detected, not updating:', updatedBooking);
            showNotification('Lịch tập này đã tồn tại! Vui lòng chọn lịch khác.', 'error');
            return false;
        }
        const index = bookings.findIndex(booking => booking.id === updatedBooking.id);
        if (index !== -1) {
            bookings[index] = updatedBooking;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            console.log('Booking updated successfully:', updatedBooking);
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
 
    servicesTableBody.innerHTML = '<tr><td>Example Service</td></tr>'; // Example content
}

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

function setupNavigation() {
    console.log('Navigation setup is complete from db.js');
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');
    console.log('services-table-body:', document.getElementById('services-table-body'));
    console.log('bookings-table-body:', document.getElementById('bookings-table-body'));

    const startButton = document.getElementById('start-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (startButton) {
        if (currentUser) {
            startButton.setAttribute('href', 'pages/booking/schedule.html');
        } else {
            startButton.setAttribute('href', 'pages/auth/register.html');
        }
    }
    initializeData();
    setupEventListeners();
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

function displayErrorMessage(formId, message) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found`);
        return;
    }
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-2';
    errorDiv.textContent = message;
    form.appendChild(errorDiv);
}

function clearErrorMessage(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function setupEventListeners() {
    console.log('Event listeners are set up (final version)');

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

    const cancelAddBtn = document.getElementById('cancel-add-btn');
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', function () {
            const modal = document.getElementById('add-service-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    }

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

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            hideModal('delete-confirm-modal');
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

    const cancelDeleteBookingBtn = document.getElementById('cancel-delete-booking-btn');
    if (cancelDeleteBookingBtn) {
        cancelDeleteBookingBtn.addEventListener('click', function() {
            console.log('Cancel delete booking clicked');
            hideModal('delete-booking-modal');
        });
    }

    const cancelEditBookingBtn = document.getElementById('cancel-edit-booking-btn');
    if (cancelEditBookingBtn) {
        cancelEditBookingBtn.addEventListener('click', function() {
            clearErrorMessage('edit-booking-modal-form');
            hideModal('edit-booking-modal');
        });
    }

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

    const applyFilterBtn = document.getElementById('apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            console.log('Apply filter button clicked');
            loadBookings(true);
        });
    }

    const applyServiceFilterBtn = document.getElementById('apply-service-filter');
    if (applyServiceFilterBtn) {
        applyServiceFilterBtn.addEventListener('click', function() {
            console.log('Apply service filter button clicked');
            loadServices(true);
        });
    }

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
            modal.classList.add('hidden');
            modal.classList.remove('fade-out');
            console.log(`Modal ${modalId} hidden immediately`);
        } else {
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

function loadServices(applyFilters = false) {
    console.log('loadServices called, applyFilters:', applyFilters);
    
    let services = DB.services.getAll();
    let updated = false;

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
        confirmDeleteBtn.setAttribute('data-service-id', serviceId);
    } else {
        console.error('confirm-delete-btn not found in modal');
    }
    showModal('delete-confirm-modal');
}

function deleteService(serviceId) {
    console.log('deleteService called with ID:', serviceId);
    DB.services.delete(serviceId);
    console.log('Calling loadServices to refresh table');
    loadServices();
    console.log('Hiding delete-confirm-modal');
    hideModal('delete-confirm-modal', true);
}

function isDuplicateBooking(newBooking, existingBookings) {
    return existingBookings.some(booking => 
        booking.id !== newBooking.id &&
        booking.service === newBooking.service &&
        booking.date === newBooking.date &&
        booking.time === newBooking.time &&
        booking.email === newBooking.email
    );
}

let currentPage = 0;
const bookingsPerPage = 4;

function loadBookings(applyFilters = false, page = currentPage) {
    let bookings = DB.bookings.getAll();
    
    const seen = new Set();
    bookings = bookings.filter(booking => {
        if (!booking.id) return false;
        const key = `${booking.service}|${booking.date}|${booking.time}|${booking.email}`;
        if (seen.has(key)) {
            console.log('Duplicate booking removed:', booking);
            return false;
        }
        seen.add(key);
        return true;
    });
    
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
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
    
    const totalBookings = bookings.length;
    const totalPages = Math.ceil(totalBookings / bookingsPerPage);
    currentPage = Math.max(0, Math.min(page, totalPages - 1));
    
    const startIndex = currentPage * bookingsPerPage;
    const paginatedBookings = bookings.slice(startIndex, startIndex + bookingsPerPage);
    
    const tableBody = document.getElementById('bookings-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        if (paginatedBookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="py-2 px-4 text-center">Không tìm thấy lịch tập nào.</td></tr>';
        } else {
            paginatedBookings.forEach(booking => {
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
        console.log('Bookings table reloaded:', paginatedBookings);
    } else {
        console.error('bookings-table-body not found');
    }
    
    const pageNumbersContainer = document.getElementById('page-numbers');
    if (pageNumbersContainer) {
        pageNumbersContainer.innerHTML = '';
        if (totalPages <= 0) {
            const button = document.createElement('button');
            button.className = 'bg-gray-500 text-white px-3 py-1 rounded disabled:bg-gray-300';
            button.textContent = '0';
            button.disabled = true;
            pageNumbersContainer.appendChild(button);
        } else {
            for (let i = 0; i < totalPages; i++) {
                const button = document.createElement('button');
                button.className = i === currentPage 
                    ? 'bg-blue-500 text-white px-3 py-1 rounded' 
                    : 'bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600';
                button.textContent = i;
                button.onclick = () => loadBookings(applyFilters, i);
                pageNumbersContainer.appendChild(button);
            }
        }
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
    const maxCount = Math.max(gymCount, yogaCount, zumbaCount, 1);
    
    const gymBar = document.getElementById('gym-bar');
    const yogaBar = document.getElementById('yoga-bar');
    const zumbaBar = document.getElementById('zumba-bar');
    
    if (gymBar && yogaBar && zumbaBar) {
        gymBar.style.height = `${(gymCount / maxCount) * maxHeight}px`;
        yogaBar.style.height = `${(yogaCount / maxCount) * maxHeight}px`;
        zumbaBar.style.height = `${(zumbaCount / maxCount) * maxHeight}px`;
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
    } else {
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
    bookings = bookings.filter(booking => {
        if (!booking || !booking.id) return true;
        const bookingIdStr = String(booking.id);
        const targetIdStr = String(bookingId);
        return bookingIdStr !== targetIdStr;
    });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log('Bookings after deletion:', bookings);
};

function updateAddImagePreview() {
    const imageUrl = document.getElementById('service-img-input')?.value.trim();
    const imagePreview = document.getElementById('add-image-preview');
    if (imageUrl && imagePreview) {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
        imagePreview.onerror = () => {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        };
    }
}

function showEditServiceModal(serviceId) {
    const service = DB.services.getAll().find(s => String(s.id) === String(serviceId));
    if (!service) {
        console.error('Không tìm thấy dịch vụ với ID:', serviceId);
        return;
    }
    document.getElementById('edit-service-id').value = service.id;
    document.getElementById('edit-service-name').value = service.name;
    document.getElementById('edit-service-desc').value = service.description;
    document.getElementById('edit-service-img').value = service.image || '';
    const preview = document.getElementById('edit-image-preview');
    if (preview) {
        if (service.image) {
            preview.src = service.image;
            preview.style.display = 'block';
            preview.onerror = () => {
                preview.src = '';
                preview.style.display = 'none';
            };
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    }
    showModal('edit-service-modal');
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) {
        const tempNotification = document.createElement('div');
        tempNotification.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        tempNotification.textContent = message;
        document.body.appendChild(tempNotification);
        setTimeout(() => {
            tempNotification.remove();
        }, 3000);
        return;
    }
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg show ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}