document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'D:/code/ProjectFrontend/pages/auth/login.html';
        return;
    }

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

    // Ensure nav-links is visible for logged-in user
    if (navLinks) {
        navLinks.classList.remove('hidden');
        navLinks.classList.add('flex'); // Ensure Tailwind flex is applied
    }

    // Load existing bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Function to display bookings in the table
    function displayBookings() {
        if (bookings.length === 0) {
            noSchedulesDiv.classList.remove('hidden');
            scheduleTableBody.innerHTML = '';
            return;
        }

        noSchedulesDiv.classList.add('hidden');
        scheduleTableBody.innerHTML = bookings.map((booking, index) => `
            <tr>
                <td class="py-2 px-4 border-b">${booking.class}</td>
                <td class="py-2 px-4 border-b">${booking.date}</td>
                <td class="py-2 px-4 border-b">${booking.time}</td>
                <td class="py-2 px-4 border-b">${currentUser.fullName || 'N/A'}</td>
                <td class="py-2 px-4 border-b">${currentUser.email}</td>
                <td class="py-2 px-4 border-b">
                    <button class="text-red-600 hover:underline" onclick="deleteBooking(${index})">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    // Initial display of bookings
    displayBookings();

    // Open modal
    openModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        bookingForm.reset();
    });

    // Handle form submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newBooking = {
            class: document.getElementById('class-select').value,
            date: document.getElementById('date-input').value,
            time: document.getElementById('time-select').value,
            userId: currentUser.id,
            email: currentUser.email
        };

        // Add new booking to the array
        bookings.push(newBooking);

        // Save to localStorage
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Update table
        displayBookings();

        // Close modal and reset form
        modal.classList.add('hidden');
        bookingForm.reset();
    });

    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Logout functionality
    function handleLogout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'D:/code/ProjectFrontend/pages/auth/login.html';
    }

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

    mobileLogoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

    // Make deleteBooking function globally available
    window.deleteBooking = function(index) {
        if (confirm('Bạn có chắc chắn muốn xóa lịch này?')) {
            bookings.splice(index, 1);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            displayBookings();
        }
    };
});