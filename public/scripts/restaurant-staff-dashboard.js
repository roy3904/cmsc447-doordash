// Check authentication
const currentStaff = JSON.parse(localStorage.getItem('restaurant_staff') || 'null');
if (!currentStaff) {
    window.location.href = 'restaurant-staff-login.html';
}

// Display staff info
const staffInfo = document.getElementById('staff-info');
staffInfo.textContent = `Signed in as ${currentStaff.Name} (${currentStaff.Email})`;

// Sign out handler
document.getElementById('signout-btn').addEventListener('click', () => {
    localStorage.removeItem('restaurant_staff');
    window.location.href = 'restaurant-staff-login.html';
});

// Current filter status
let currentStatus = 'Placed';

// ==========================================
// ORDERS SECTION
// ==========================================

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStatus = btn.dataset.status;
        loadOrders(currentStatus);
    });
});

// Load orders for restaurant
async function loadOrders(status = 'Placed') {
    const container = document.getElementById('orders-container');
    try {
        const response = await fetch(`/api/restaurants/${currentStaff.RestaurantID}/orders?status=${status}`);
        if (!response.ok) throw new Error('Failed to load orders');

        const data = await response.json();
        const orders = data.orders || [];

        if (orders.length === 0) {
            container.innerHTML = `<div class="empty-state">No ${status.toLowerCase()} orders at the moment.</div>`;
            return;
        }

        container.innerHTML = '';
        for (const order of orders) {
            const orderCard = createOrderCard(order);
            container.appendChild(orderCard);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        container.innerHTML = '<div class="empty-state" style="color: #e53e3e;">Failed to load orders. Please refresh the page.</div>';
    }
}

// Create order card HTML
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';

    // Build items list
    let itemsHTML = '';
    if (order.items && order.items.length > 0) {
        for (const item of order.items) {
            itemsHTML += `<div>${item.Quantity}× ${escapeHtml(item.Name || item.ItemID)} - $${(item.Price || 0).toFixed(2)}</div>`;
        }
    }

    // Get customer info
    const customerName = order.customer ? escapeHtml(order.customer.Name) : 'Unknown';
    const customerPhone = order.customer ? escapeHtml(order.customer.Phone || 'N/A') : 'N/A';

    // Get delivery location
    const deliveryBuilding = order.delivery?.building || order.DeliveryLocation || 'Not specified';
    const deliveryRoom = order.delivery?.room || '';
    const deliveryInstructions = order.delivery?.instructions || 'None';

    // Status badge
    const statusClass = getStatusClass(order.OrderStatus);

    card.innerHTML = `
        <h4>
            Order #${escapeHtml(order.OrderID)}
            <span class="status-badge ${statusClass}">${escapeHtml(order.OrderStatus)}</span>
        </h4>
        <div class="order-detail"><strong>Customer:</strong> ${customerName} (${customerPhone})</div>
        <div class="order-detail"><strong>Total:</strong> $${(order.TotalCost || 0).toFixed(2)} ${order.Tip ? `+ $${order.Tip.toFixed(2)} tip` : ''}</div>
        <div class="order-detail"><strong>Delivery Location:</strong> ${escapeHtml(deliveryBuilding)} ${escapeHtml(deliveryRoom)}</div>
        <div class="order-detail"><strong>Instructions:</strong> ${escapeHtml(deliveryInstructions)}</div>
        <div class="order-detail">
            <strong>Items:</strong>
            <div class="order-items">${itemsHTML || 'No items'}</div>
        </div>
        <div class="order-actions" id="actions-${order.OrderID}">
            ${getOrderActions(order)}
        </div>
    `;

    // Attach event listeners to buttons
    setTimeout(() => attachOrderActionListeners(order.OrderID, order.OrderStatus), 0);

    return card;
}

// Get action buttons based on order status
function getOrderActions(order) {
    const status = order.OrderStatus;

    if (status === 'Placed') {
        return `<button class="btn btn-success btn-small" data-action="preparing" data-order="${order.OrderID}">Start Preparing</button>`;
    } else if (status === 'Preparing') {
        return `<button class="btn btn-success btn-small" data-action="ready" data-order="${order.OrderID}">Mark Ready for Pickup</button>`;
    } else if (status === 'Ready for Pickup') {
        return `<span style="color: #38a169; font-weight: 600;">✓ Waiting for driver pickup</span>`;
    } else if (status === 'Accepted') {
        return `<span style="color: #6b46c1; font-weight: 600;">✓ Out for delivery</span>`;
    }
    return '';
}

// Attach event listeners to order action buttons
function attachOrderActionListeners(orderId, currentStatus) {
    const actionsContainer = document.getElementById(`actions-${orderId}`);
    if (!actionsContainer) return;

    const buttons = actionsContainer.querySelectorAll('button[data-action]');
    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.dataset.action;
            const orderIdFromBtn = btn.dataset.order; // Get orderId from button data attribute
            let newStatus = '';

            if (action === 'preparing') {
                newStatus = 'Preparing';
            } else if (action === 'ready') {
                newStatus = 'Ready for Pickup';
            }

            if (newStatus && orderIdFromBtn) {
                await updateOrderStatus(orderIdFromBtn, newStatus);
            }
        });
    });
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    // Validate inputs
    if (!orderId) {
        console.error('Cannot update order: orderId is null or undefined');
        return;
    }

    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update status');
        }

        // Reload orders
        await loadOrders(currentStatus);
    } catch (error) {
        console.error('Error updating order status:', error);
        alert(`Failed to update order status: ${error.message}`);
    }
}

// Get status CSS class
function getStatusClass(status) {
    const map = {
        'Placed': 'status-placed',
        'Preparing': 'status-preparing',
        'Ready for Pickup': 'status-ready',
        'Accepted': 'status-accepted'
    };
    return map[status] || '';
}

// ==========================================
// MENU MANAGEMENT SECTION
// ==========================================

// Load menu items
async function loadMenuItems() {
    const container = document.getElementById('menu-container');
    try {
        const response = await fetch(`/api/restaurants/${currentStaff.RestaurantID}/menu`);
        if (!response.ok) throw new Error('Failed to load menu');

        const data = await response.json();
        const items = data.menuItems || [];

        if (items.length === 0) {
            container.innerHTML = '<div class="empty-state">No menu items found.</div>';
            return;
        }

        // Create grid
        const grid = document.createElement('div');
        grid.className = 'menu-grid';

        for (const item of items) {
            const itemCard = createMenuItemCard(item);
            grid.appendChild(itemCard);
        }

        container.innerHTML = '';
        container.appendChild(grid);
    } catch (error) {
        console.error('Error loading menu items:', error);
        container.innerHTML = '<div class="empty-state" style="color: #e53e3e;">Failed to load menu items.</div>';
    }
}

// Create menu item card
function createMenuItemCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';

    const isAvailable = (item.Quantity || 0) > 0;

    card.innerHTML = `
        <div class="menu-item-header">
            <h4 style="margin: 0;">${escapeHtml(item.Name)}</h4>
            <span class="menu-item-price">$${(item.Price || 0).toFixed(2)}</span>
        </div>
        <div class="menu-item-description">${escapeHtml(item.Description || 'No description')}</div>
        <div class="menu-item-controls">
            <div class="quantity-control">
                <label style="font-size: 0.85rem; color: #4a5568;">Quantity:</label>
                <input
                    type="number"
                    class="quantity-input"
                    value="${item.Quantity || 0}"
                    min="0"
                    data-item-id="${item.ItemID}"
                    id="qty-${item.ItemID}"
                >
                <button class="btn btn-small" onclick="updateItemQuantity('${item.ItemID}')">Update</button>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
                <span style="font-size: 0.85rem; color: ${isAvailable ? '#00d12dff' : '#df0000ff'}">${isAvailable ? 'Available' : 'Out of Stock'}</span>
            </div>
        </div>
    `;

    return card;
}

// Update menu item quantity
window.updateItemQuantity = async function(itemId) {
    const input = document.getElementById(`qty-${itemId}`);
    const newQuantity = parseInt(input.value) || 0;

    try {
        const response = await fetch(`/api/menuitems/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Quantity: newQuantity })
        });

        if (!response.ok) {
            throw new Error('Failed to update quantity');
        }

        // Reload menu items to reflect changes
        await loadMenuItems();
    } catch (error) {
        console.error('Error updating menu item:', error);
        alert('Failed to update item quantity. Please try again.');
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (!unsafe && unsafe !== 0) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==========================================
// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

let notifications = [];
let previousNotificationCount = 0;

const notificationBell = document.getElementById('notification-bell');
const notificationBadge = document.getElementById('notification-badge');
const notificationDropdown = document.getElementById('notification-dropdown');
const notificationList = document.getElementById('notification-list');
const notificationToast = document.getElementById('notification-toast');
const toastMessage = document.getElementById('toast-message');
const markAllReadBtn = document.getElementById('mark-all-read');

// Toggle notification dropdown
notificationBell.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    notificationDropdown.classList.remove('show');
});

// Load notifications
async function loadNotifications() {
    if (!currentStaff || !currentStaff.StaffID) return;

    try {
        const response = await fetch(`/api/notifications/RestaurantStaff/${currentStaff.StaffID}`);
        if (!response.ok) throw new Error('Failed to load notifications');

        const data = await response.json();
        notifications = data.notifications || [];

        // Update badge
        const unreadCount = notifications.filter(n => !n.IsRead).length;
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.classList.add('show');
        } else {
            notificationBadge.classList.remove('show');
        }

        // Show toast for new notifications
        if (unreadCount > previousNotificationCount && previousNotificationCount > 0) {
            showToast('New order received!');
        }
        previousNotificationCount = unreadCount;

        // Render notifications
        renderNotifications();
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Render notifications in dropdown
function renderNotifications() {
    if (notifications.length === 0) {
        notificationList.innerHTML = '<p class="empty-state">No notifications</p>';
        return;
    }

    notificationList.innerHTML = notifications.map(n => {
        const time = new Date(n.CreatedAt).toLocaleString();
        const unreadClass = n.IsRead ? '' : 'unread';
        return `
            <div class="notification-item ${unreadClass}" data-id="${n.NotificationID}">
                <p class="notification-message">${n.Message}</p>
                <p class="notification-time">${time}</p>
            </div>
        `;
    }).join('');

    // Add click handlers to mark as read
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.addEventListener('click', async () => {
            const id = item.dataset.id;
            await markNotificationRead(id);
        });
    });
}

// Mark single notification as read
async function markNotificationRead(id) {
    try {
        const response = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
        if (!response.ok) throw new Error('Failed to mark as read');
        await loadNotifications();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Mark all notifications as read
markAllReadBtn.addEventListener('click', async () => {
    if (!currentStaff || !currentStaff.StaffID) return;

    try {
        const response = await fetch(`/api/notifications/RestaurantStaff/${currentStaff.StaffID}/read-all`, {
            method: 'PUT'
        });
        if (!response.ok) throw new Error('Failed to mark all as read');
        await loadNotifications();
    } catch (error) {
        console.error('Error marking all as read:', error);
    }
});

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    notificationToast.classList.add('show');
    setTimeout(() => {
        notificationToast.classList.remove('show');
    }, 3000);
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initial load
loadOrders(currentStatus);
loadMenuItems();
loadNotifications();

// WebSocket connection
const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
    console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message received:', data);

    if (data.event === 'new_order') {
        // Check if this order belongs to this restaurant (use loose equality for type flexibility)
        if (data.order && String(data.order.RestaurantID) === String(currentStaff.RestaurantID)) {
            console.log('New order for this restaurant!');
            showToast('New order received!');
            // Refresh page after a short delay to show the toast first
            setTimeout(() => {
                window.location.reload();
            }, 1);
        } else {
            console.log('New order but not for this restaurant', {
                orderRestaurantID: data.order?.RestaurantID,
                staffRestaurantID: currentStaff.RestaurantID
            });
        }
    }
};

socket.onclose = () => {
    console.log('WebSocket connection closed');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};
