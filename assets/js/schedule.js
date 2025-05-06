document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../../pages/auth/login.html';
        return;
    }
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
    const pageNumbersContainer = document.getElementById('page-numbers');
    if (navLinks) {
        navLinks.classList.remove('hidden');
        navLinks.classList.add('flex');
    }

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    let userBookings = bookings.filter(booking => booking.email === currentUser.email);
    let currentPage = 0;
    const bookingsPerPage = 4;

    function displayBookings(page = currentPage) {
        if (userBookings.length === 0) {
            noSchedulesDiv.classList.remove('hidden');
            scheduleTableBody.innerHTML = '';
            pageNumbersContainer.innerHTML = '';
            return;
        }

        noSchedulesDiv.classList.add('hidden');
        const startIndex = page * bookingsPerPage;
        const paginatedBookings = userBookings.slice(startIndex, startIndex + bookingsPerPage);
        const totalPages = Math.ceil(userBookings.length / bookingsPerPage);

        scheduleTableBody.innerHTML = paginatedBookings.map((booking, index) => `
            <tr>
                <td class="py-2 px-4 border-b">${booking.service}</td>
                <td class="py-2 px-4 border-b">${booking.date}</td>
                <td class="py-2 px-4 border-b">${booking.time}</td>
                <td class="py-2 px-4 border-b">${currentUser.fullName || 'N/A'}</td>
                <td class="py-2 px-4 border-b">${booking.email}</td>
                <td class="py-2 px-4 border-b">${booking.status || 'Chờ xác nhận'}</td>
                <td class="py-2 px-4 border-b">
                    <button class="editBtn1 text-blue-600 mr-2" onclick="editBooking('${booking.id}', ${startIndex + index})">Sửa</button>
                    <button class="editBtn2 text-red-600" onclick="deleteBooking('${booking.id}', ${startIndex + index})">Xóa</button>
                </td>
            </tr>
        `).join('');

        pageNumbersContainer.innerHTML = '';
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Prev';
        prevButton.className = `bg-gray-500 text-white px-3 py-1 rounded ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`;
        prevButton.disabled = page === 0;
        prevButton.onclick = () => {
            if (page > 0) displayBookings(page - 1);
        };
        pageNumbersContainer.appendChild(prevButton);

        const maxVisiblePages = 5;
        let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
        startPage = Math.max(0, endPage - maxVisiblePages + 1);

        if (startPage > 0) {
            const firstButton = document.createElement('button');
            firstButton.textContent = '1';
            firstButton.className = 'bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600';
            firstButton.onclick = () => displayBookings(0);
            pageNumbersContainer.appendChild(firstButton);

            if (startPage > 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'px-3 py-1';
                pageNumbersContainer.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i + 1;
            button.className = i === page 
                ? 'bg-blue-500 text-white px-3 py-1 rounded' 
                : 'bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600';
            button.onclick = () => displayBookings(i);
            pageNumbersContainer.appendChild(button);
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'px-3 py-1';
                pageNumbersContainer.appendChild(dots);
            }

            const lastButton = document.createElement('button');
            lastButton.textContent = totalPages;
            lastButton.className = 'bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600';
            lastButton.onclick = () => displayBookings(totalPages - 1);
            pageNumbersContainer.appendChild(lastButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.className = `bg-gray-500 text-white px-3 py-1 rounded ${page === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`;
        nextButton.disabled = page === totalPages - 1;
        nextButton.onclick = () => {
            if (page < totalPages - 1) displayBookings(page + 1);
        };
        pageNumbersContainer.appendChild(nextButton);
    }
    displayBookings();

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            bookingForm.reset();
            document.getElementById('booking-form').dataset.editIndex = '';
        });
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            bookingForm.reset();
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const classType = document.getElementById('class-select').value;
            const date = document.getElementById('date-input').value;
            const time = document.getElementById('time-select').value;

            const isDuplicate = bookings.some(booking =>
                booking.service === classType && booking.date === date && booking.time === time
            );

            if (isDuplicate) {
                window.location.href = 'coincide.html';
                return;
            }

            const editIndex = bookingForm.dataset.editIndex;
            const newBooking = {
                service: classType,
                date: date,
                time: time,
                userId: currentUser.id,
                email: currentUser.email,
                status: 'Chờ xác nhận'
            };

            if (editIndex) {
                const globalIndex = bookings.findIndex(b => b.id === userBookings[editIndex].id && b.email === currentUser.email);
                if (globalIndex !== -1) {
                    newBooking.id = bookings[globalIndex].id;
                    newBooking.status = bookings[globalIndex].status;
                    bookings[globalIndex] = newBooking;
                }
            } else {
                newBooking.id = Date.now().toString();
                bookings.push(newBooking);
            }

            localStorage.setItem('bookings', JSON.stringify(bookings));
            userBookings = bookings.filter(booking => booking.email === currentUser.email);
            displayBookings();
            modal.classList.add('hidden');
            bookingForm.reset();
            showNotification('Đặt lịch thành công!');
        });
    }
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
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
    window.editBooking = function(bookingId, index) {
        const booking = userBookings[index];
        if (booking && booking.id === bookingId) {
            document.getElementById('class-select').value = booking.service;
            document.getElementById('date-input').value = booking.date;
            document.getElementById('time-select').value = booking.time;
            document.getElementById('booking-form').dataset.editIndex = index;
            modal.classList.remove('hidden');
        }
    };

    window.deleteBooking = function(bookingId, index) {
        const deleteModal = document.getElementById('delete-confirm-modal');
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

        if (!deleteModal || !confirmDeleteBtn || !cancelDeleteBtn) {
            console.error('Delete modal or buttons not found');
            return;
        }
        deleteModal.classList.remove('hidden');
        console.log('Delete confirmation modal opened for booking ID:', bookingId);

        const newConfirmDeleteBtn = confirmDeleteBtn.cloneNode(true);
        const newCancelDeleteBtn = cancelDeleteBtn.cloneNode(true);
        confirmDeleteBtn.parentNode.replaceChild(newConfirmDeleteBtn, confirmDeleteBtn);
        cancelDeleteBtn.parentNode.replaceChild(newCancelDeleteBtn, cancelDeleteBtn);

        const updatedConfirmDeleteBtn = document.getElementById('confirm-delete-btn');
        const updatedCancelDeleteBtn = document.getElementById('cancel-delete-btn');

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

        updatedCancelDeleteBtn.addEventListener('click', function() {
            deleteModal.classList.add('hidden');
            console.log('Delete action canceled for booking ID:', bookingId);
        });
    };

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});