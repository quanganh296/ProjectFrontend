document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'D:\code\ProjectFrontend\pages\auth\login.html';
        return;
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
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('total-users').textContent = users.length;
    
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(booking => booking.date === today);
    document.getElementById('today-bookings').textContent = todayBookings.length;
    const bookingsList = document.getElementById('bookings-list');
    if (bookingsList) {
        if (bookings.length > 0) {
            bookingsList.innerHTML = bookings.map((booking, index) => {
                const user = users.find(u => u.id === booking.userId) || { email: 'Không xác định' };
                return `
                    <tr>
                        <td class="py-3 px-4 border-b">${index + 1}</td>
                        <td class="py-3 px-4 border-b">${user.email}</td>
                        <td class="py-3 px-4 border-b">${booking.date}</td>
                        <td class="py-3 px-4 border-b">${booking.time}</td>
                        <td class="py-3 px-4 border-b">${booking.class}</td>
                        <td class="py-3 px-4 border-b">${booking.trainer}</td>
                        <td class="py-3 px-4 border-b">
                            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Đã xác nhận</span>
                        </td>
                        <td class="py-3 px-4 border-b">
                            <button class="text-blue-600 hover:underline mr-2" data-id="${index}" onclick="editBooking(${index})">Sửa</button>
                            <button class="text-red-600 hover:underline" data-id="${index}" onclick="deleteBooking(${index})">Xóa</button>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            bookingsList.innerHTML = `
                <tr>
                    <td colspan="8" class="py-4 px-4 text-center text-gray-500">Chưa có lịch đặt nào</td>
                </tr>
            `;
        }
    }
    const usersList = document.getElementById('users-list');
    if (usersList) {
        if (users.length > 0) {
            usersList.innerHTML = users.map((user, index) => `
                <tr>
                    <td class="py-3 px-4 border-b">${index + 1}</td>
                    <td class="py-3 px-4 border-b">${user.email}</td>
                    <td class="py-3 px-4 border-b">${user.email || 'N/A'}</td>
                    <td class="py-3 px-4 border-b">${user.fullName || 'N/A'}</td>
                    <td class="py-3 px-4 border-b">${user.role}</td>
                    <td class="py-3 px-4 border-b">${user.registeredDate || 'N/A'}</td>
                    <td class="py-3 px-4 border-b">
                        <button class="text-blue-600 hover:underline mr-2" data-id="${user.id}" onclick="editUser('${user.id}')">Sửa</button>
                        <button class="text-red-600 hover:underline" data-id="${user.id}" onclick="deleteUser('${user.id}')">Xóa</button>
                    </td>
                </tr>
            `).join('');
        } else {
            usersList.innerHTML = `
                <tr>
                    <td colspan="7" class="py-4 px-4 text-center text-gray-500">Chưa có người dùng nào</td>
                </tr>
            `;
        }
    }
    const classes = [
        { id: 1, name: 'Gym', description: 'Tập luyện với các thiết bị hiện đại', trainer: 'David Laid', time: '06:00 - 22:00', maxCapacity: 30 },
        { id: 2, name: 'Yoga', description: 'Khám phá sự cân bằng và thư giãn', trainer: 'Emma Wilson', time: '08:00 - 20:00', maxCapacity: 20 },
        { id: 3, name: 'Zumba', description: 'Đốt cháy calo với các bài tập nhịp điệu', trainer: 'Carlos Rodriguez', time: '10:00 - 18:00', maxCapacity: 25 }
    ];
    
    const classesList = document.getElementById('classes-list');
    if (classesList) {
        classesList.innerHTML = classes.map(cls => `
            <tr>
                <td class="py-3 px-4 border-b">${cls.id}</td>
                <td class="py-3 px-4 border-b">${cls.name}</td>
                <td class="py-3 px-4 border-b">${cls.description}</td>
                <td class="py-3 px-4 border-b">${cls.trainer}</td>
                <td class="py-3 px-4 border-b">${cls.time}</td>
                <td class="py-3 px-4 border-b">${cls.maxCapacity}</td>
                <td class="py-3 px-4 border-b">
                    <button class="text-blue-600 hover:underline mr-2" data-id="${cls.id}" onclick="editClass(${cls.id})">Sửa</button>
                    <button class="text-red-600 hover:underline" data-id="${cls.id}" onclick="deleteClass(${cls.id})">Xóa</button>
                </td>
            </tr>
        `).join('');
    }
});
function editBooking(id) {
    alert('Chức năng sửa lịch đặt: ' + id);
}

function deleteBooking(id) {
    if (confirm('Bạn có chắc chắn muốn xóa lịch đặt này?')) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.splice(id, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        location.reload();
    }
}

function editUser(id) {
    alert('Chức năng sửa người dùng: ' + id);
}
function deleteUser(id) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            location.reload();
        }
    }
}
function editClass(id) {
    alert('Chức năng sửa lớp học: ' + id);
}
function deleteClass(id) {
    alert('Chức năng xóa lớp học: ' + id);
}
