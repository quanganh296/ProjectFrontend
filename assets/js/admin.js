// admin.js
document.addEventListener('DOMContentLoaded', () => {
    const services = [
        { id: 1, name: 'Gym Membership', description: 'Access to gym equipment', price: 500000 },
        { id: 2, name: 'Yoga Class', description: 'Weekly yoga sessions', price: 300000 },
    ];
    const tableBody = document.getElementById('services-table-body');
    tableBody.innerHTML = services.map(service => `
        <tr>
            <td class="py-3 px-4">${service.id}</td>
            <td class="py-3 px-4">${service.name}</td>
            <td class="py-3 px-4">${service.description}</td>
            <td class="py-3 px-4">${service.price} VNĐ</td>
            <td class="py-3 px-4">
                <button class="text-blue-600 hover:underline mr-2" onclick="editService(${service.id})">Sửa</button>
                <button class="text-red-600 hover:underline" onclick="deleteService(${service.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
});

function editService(id) {
     showNotification(`Sửa dịch vụ ID: ${id}`);
}

function deleteService(id) {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
         showNotification(`Xóa dịch vụ ID: ${id}`);
    }
}