document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
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
    if (!localStorage.getItem('bookings')) {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];
        
        const sampleBookings = [
            {
                id: '1',
                userId: '2',
                date: today,
                time: '10:00 - 11:00',
                class: 'Yoga',
                trainer: 'Emma Wilson',
                status: 'confirmed'
            },
            {
                id: '2',
                userId: '2',
                date: tomorrowDate,
                time: '15:00 - 16:00',
                class: 'Gym',
                trainer: 'John Smith',
                status: 'confirmed'
            }
        ];
        localStorage.setItem('bookings', JSON.stringify(sampleBookings));
    }
}
const DB = {
    init() {
        if (!localStorage.getItem('services')) {
            localStorage.setItem('services', JSON.stringify([
                { id: 1, name: 'Gym', description: 'Tập luyện với các thiết bị hiện đại', image: 'https://img.freepik.com/free-photo/gym-with-various-equipment_23-2149146303.jpg' },
                { id: 2, name: 'Yoga', description: 'Lớp học yoga với huấn luyện viên chuyên nghiệp', image: 'https://img.freepik.com/free-photo/young-woman-practicing-yoga-home_1303-22212.jpg' },
                { id: 3, name: 'Zumba', description: 'Khiêu vũ Zumba sôi động và giảm cân hiệu quả', image: 'https://img.freepik.com/free-photo/group-people-doing-zumba-class-dance-studio_23-2148517452.jpg' }
            ]));
        }
        
        if (!localStorage.getItem('bookings')) {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            localStorage.setItem('bookings', JSON.stringify([
                { id: 1, service: 'Gym', date: today.toISOString().split('T')[0], time: '08:00 - 10:00', name: 'Nguyễn Văn A', email: 'vana@example.com', status: 'Đã xác nhận' },
                { id: 2, service: 'Yoga', date: today.toISOString().split('T')[0], time: '10:00 - 12:00', name: 'Trần Thị B', email: 'thib@example.com', status: 'Đã xác nhận' },
                { id: 3, service: 'Zumba', date: tomorrow.toISOString().split('T')[0], time: '14:00 - 16:00', name: 'Lê Văn C', email: 'vanc@example.com', status: 'Chờ xác nhận' },
                { id: 4, service: 'Gym', date: yesterday.toISOString().split('T')[0], time: '16:00 - 18:00', name: 'Phạm Thị D', email: 'thid@example.com', status: 'Đã xác nhận' },
                { id: 5, service: 'Yoga', date: yesterday.toISOString().split('T')[0], time: '18:00 - 20:00', name: 'Vũ Văn E', email: 'vane@example.com', status: 'Đã hủy' }
            ]));
        }
        
        if (!localStorage.getItem('currentUser')) {
            localStorage.setItem('currentUser', JSON.stringify({ email: 'admin@gym.com', role: 'admin' }));
        }
    },
    services: {
        getAll() {
            return JSON.parse(localStorage.getItem('services') || '[]');
        },
        
        add(service) {
            const services = this.getAll();
            service.id = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
            services.push(service);
            localStorage.setItem('services', JSON.stringify(services));
            return service;
        },
        
        update(service) {
            const services = this.getAll();
            const index = services.findIndex(s => s.id === service.id);
            if (index !== -1) {
                services[index] = service;
                localStorage.setItem('services', JSON.stringify(services));
                return service;
            }
            return null;
        },
        
        delete(id) {
            const services = this.getAll();
            const filtered = services.filter(s => s.id !== id);
            localStorage.setItem('services', JSON.stringify(filtered));
            return id;
        }
    },
    bookings: {
        getAll() {
            return JSON.parse(localStorage.getItem('bookings') || '[]');
        },
        
        getFiltered(filters = {}) {
            let bookings = this.getAll();
            
            if (filters.service && filters.service !== 'all') {
                bookings = bookings.filter(b => b.service.toLowerCase() === filters.service.toLowerCase());
            }
            
            if (filters.email) {
                bookings = bookings.filter(b => b.email.toLowerCase().includes(filters.email.toLowerCase()));
            }
            
            if (filters.date) {
                bookings = bookings.filter(b => b.date === filters.date);
            }
            
            return bookings;
        },
        
        getCounts() {
            const bookings = this.getAll();
            const counts = {
                gym: bookings.filter(b => b.service.toLowerCase() === 'gym').length,
                yoga: bookings.filter(b => b.service.toLowerCase() === 'yoga').length,
                zumba: bookings.filter(b => b.service.toLowerCase() === 'zumba').length
            };
            return counts;
        }
    },
    auth: {
        getCurrentUser() {
            return JSON.parse(localStorage.getItem('currentUser') || 'null');
        },
        
        logout() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }
};
document.addEventListener('DOMContentLoaded', function() {
    DB.init();
    setupServiceManagement();
    setupBookingManagement();
    setupNavigation();
});
function setupNavigation() {
    document.getElementById('service-nav').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('service-section').classList.remove('hidden');
        document.getElementById('booking-section').classList.add('hidden');
        document.getElementById('service-nav').classList.add('bg-gray-900');
        document.getElementById('booking-nav').classList.remove('bg-gray-900');
    });
    
    document.getElementById('booking-nav').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('booking-section').classList.remove('hidden');
        document.getElementById('service-section').classList.add('hidden');
        document.getElementById('booking-nav').classList.add('bg-gray-900');
        document.getElementById('service-nav').classList.remove('bg-gray-900');
        updateBookingStats();
    });
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        DB.auth.logout();
    });
}
function setupServiceManagement() {
    loadServices();
    document.getElementById('add-service-btn').addEventListener('click', function() {
        document.getElementById('add-service-modal').classList.remove('hidden');
    });
    document.getElementById('cancel-add-btn').addEventListener('click', function() {
        document.getElementById('add-service-modal').classList.add('hidden');
        document.getElementById('add-service-form').reset();
    });
    document.getElementById('cancel-edit-btn').addEventListener('click', function() {
        document.getElementById('edit-service-modal').classList.add('hidden');
    });
    document.getElementById('cancel-delete-btn').addEventListener('click', function() {
        document.getElementById('delete-confirm-modal').classList.add('hidden');
    });
    document.getElementById('add-service-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newService = {
            name: document.getElementById('service-name-input').value,
            description: document.getElementById('service-desc-input').value,
            image: document.getElementById('service-img-input').value
        };
        DB.services.add(newService);
        loadServices();
        document.getElementById('add-service-modal').classList.add('hidden');
        document.getElementById('add-service-form').reset();
    });
    document.getElementById('edit-service-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedService = {
            id: parseInt(document.getElementById('edit-service-id').value),
            name: document.getElementById('edit-service-name').value,
            description: document.getElementById('edit-service-desc').value,
            image: document.getElementById('edit-service-img').value
        };
        
        DB.services.update(updatedService);
        loadServices();
        document.getElementById('edit-service-modal').classList.add('hidden');
    });
    document.getElementById('confirm-delete-btn').addEventListener('click', function() {
        const serviceId = parseInt(this.getAttribute('data-service-id'));
        DB.services.delete(serviceId);
        loadServices();
        document.getElementById('delete-confirm-modal').classList.add('hidden');
    });
}
function loadServices() {
    const services = DB.services.getAll();
    const tableBody = document.getElementById('services-table-body');
    tableBody.innerHTML = '';
    
    services.forEach(service => {
        const row = document.createElement('tr');
        row.className = 'border-t';
        
        row.innerHTML = `
            <td class="py-3 px-4">${service.name}</td>
            <td class="py-3 px-4">${service.description}</td>
            <td class="py-3 px-4">
                <img src="${service.image}" alt="${service.name}" class="h-16 w-24 object-cover">
            </td>
            <td class="py-3 px-4">
                <button class="text-blue-500 hover:underline mr-2 edit-btn" data-id="${service.id}">Sửa</button>
                <button class="text-red-500 hover:underline delete-btn" data-id="${service.id}">Xóa</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = parseInt(this.getAttribute('data-id'));
            const service = services.find(s => s.id === serviceId);
            
            if (service) {
                document.getElementById('edit-service-id').value = service.id;
                document.getElementById('edit-service-name').value = service.name;
                document.getElementById('edit-service-desc').value = service.description;
                document.getElementById('edit-service-img').value = service.image;
                
                document.getElementById('edit-service-modal').classList.remove('hidden');
            }
        });
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = parseInt(this.getAttribute('data-id'));
            document.getElementById('confirm-delete-btn').setAttribute('data-service-id', serviceId);
            document.getElementById('delete-confirm-modal').classList.remove('hidden');
        });
    });
}
function setupBookingManagement() {
    loadBookings();
    updateBookingStats();
    document.getElementById('apply-filter').addEventListener('click', function() {
        loadBookings({
            service: document.getElementById('class-filter').value,
            email: document.getElementById('email-filter').value,
            date: document.getElementById('date-filter').value
        });
    });
}
function loadBookings(filters = {}) {
    const bookings = DB.bookings.getFiltered(filters);
    const tableBody = document.getElementById('bookings-table-body');
    tableBody.innerHTML = '';
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.className = 'border-t';
        let statusClass = 'text-gray-500';
        if (booking.status === 'Đã xác nhận') statusClass = 'text-green-500';
        else if (booking.status === 'Chờ xác nhận') statusClass = 'text-yellow-500';
        else if (booking.status === 'Đã hủy') statusClass = 'text-red-500';
        
        row.innerHTML = `
            <td class="py-3 px-4">${booking.service}</td>
            <td class="py-3 px-4">${formatDate(booking.date)}</td>
            <td class="py-3 px-4">${booking.time}</td>
            <td class="py-3 px-4">${booking.name}</td>
            <td class="py-3 px-4">${booking.email}</td>
            <td class="py-3 px-4 ${statusClass} font-medium">${booking.status}</td>
        `;
        
        tableBody.appendChild(row);
    });
};
function updateBookingStats() {
    const counts = DB.bookings.getCounts();
    document.getElementById('gym-count').textContent = counts.gym;
    document.getElementById('yoga-count').textContent = counts.yoga;
    document.getElementById('zumba-count').textContent = counts.zumba;
    const maxValue = Math.max(counts.gym, counts.yoga, counts.zumba);
    const maxHeight = 200; 
    
    const gymHeight = maxValue > 0 ? Math.max(20, (counts.gym / maxValue) * maxHeight) : 20;
    const yogaHeight = maxValue > 0 ? Math.max(20, (counts.yoga / maxValue) * maxHeight) : 20;
    const zumbaHeight = maxValue > 0 ? Math.max(20, (counts.zumba / maxValue) * maxHeight) : 20;
    
    document.getElementById('gym-bar').style.height = `${gymHeight}px`;
    document.getElementById('yoga-bar').style.height = `${yogaHeight}px`;
    document.getElementById('zumba-bar').style.height = `${zumbaHeight}px`;
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
}


