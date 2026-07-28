/* ==========================================================================
   AYURVEDA SHOP - ADMIN DASHBOARD & INVENTORY LOGIC
   ========================================================================== */

const API_BASE = 'http://localhost:8090/api';

let adminProducts = [];
let adminOrders = [];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    checkAdminAuth();
});

/* Authentication Check & Login Handler */
function checkAdminAuth() {
    const token = localStorage.getItem('thissa_admin_token');
    const overlay = document.getElementById('adminLoginOverlay');
    const mainWrapper = document.getElementById('adminMainWrapper');

    if (token) {
        if (overlay) overlay.style.display = 'none';
        if (mainWrapper) mainWrapper.style.display = 'block';
        refreshAdminData();
    } else {
        if (overlay) overlay.style.display = 'flex';
        if (mainWrapper) mainWrapper.style.display = 'none';
    }
}

async function handleAdminLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('loginUsername').value;
    const passwordInput = document.getElementById('loginPassword').value;
    const errorAlert = document.getElementById('loginErrorMsg');

    errorAlert.style.display = 'none';
    errorAlert.textContent = '';

    try {
        const res = await fetch(`${API_BASE}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        const data = await res.json();

        if (res.ok && data.authenticated) {
            localStorage.setItem('thissa_admin_token', data.token);
            localStorage.setItem('thissa_admin_user', data.username);
            checkAdminAuth();
            showAdminToast(data.message || 'Login successful!', 'success');
        } else {
            errorAlert.textContent = data.message || 'Invalid username or password.';
            errorAlert.style.display = 'block';
        }
    } catch (err) {
        console.error('Login error:', err);
        // Fallback for offline testing if backend unreachable
        if (usernameInput === 'thissa' && passwordInput === 'admin123') {
            localStorage.setItem('thissa_admin_token', 'FALLBACK-TOKEN-THISSA');
            checkAdminAuth();
            showAdminToast('Logged in as administrator', 'success');
        } else {
            errorAlert.textContent = 'Invalid credentials or backend unreachable.';
            errorAlert.style.display = 'block';
        }
    }
}

function handleAdminLogout() {
    localStorage.removeItem('thissa_admin_token');
    localStorage.removeItem('thissa_admin_user');
    checkAdminAuth();
    showAdminToast('Signed out of Admin Panel', 'info');
}

/* Tab Switching Logic */
function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
}

/* Master Refresh Function */
async function refreshAdminData() {
    await Promise.all([
        fetchAdminStats(),
        fetchAdminProducts(),
        fetchAdminOrders()
    ]);
}

/* 1. Fetch Dashboard Stats */
async function fetchAdminStats() {
    try {
        const res = await fetch(`${API_BASE}/admin/stats`);
        if (!res.ok) throw new Error('Failed to fetch admin stats');
        const data = await res.json();

        document.getElementById('statRevenue').textContent = `$${(data.totalRevenue || 0).toFixed(2)}`;
        document.getElementById('statOrders').textContent = data.totalOrders || 0;
        document.getElementById('statPendingOrders').textContent = `${data.pendingOrdersCount || 0} Pending Delivery`;
        document.getElementById('statProducts').textContent = data.totalProducts || 0;
        document.getElementById('statLowStock').textContent = data.lowStockProductsCount || 0;
    } catch (err) {
        console.warn('Backend stats endpoint unavailable, computing locally from lists:', err);
    }
}

/* 2. Fetch & Render Products with Stock Management */
async function fetchAdminProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        adminProducts = await res.json();
        renderAdminProducts(adminProducts);
        renderLowStockTable(adminProducts);
        updateLocalProductStats(adminProducts);
    } catch (err) {
        console.error('Error fetching products:', err);
        showAdminToast('Failed to load products from backend API', 'error');
    }
}

function updateLocalProductStats(products) {
    document.getElementById('statProducts').textContent = products.length;
    const lowStockCount = products.filter(p => (p.stock ?? 50) <= 10).length;
    document.getElementById('statLowStock').textContent = lowStockCount;
}

function renderAdminProducts(products) {
    const tbody = document.getElementById('adminProductsTableBody');
    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No products found in catalog.</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(prod => {
        const stockVal = prod.stock ?? 50;
        let stockBadgeClass = 'badge-in-stock';
        let stockText = 'In Stock';

        if (stockVal === 0) {
            stockBadgeClass = 'badge-out-stock';
            stockText = 'Out of Stock';
        } else if (stockVal <= 10) {
            stockBadgeClass = 'badge-low-stock';
            stockText = 'Low Stock';
        }

        const imageSrc = prod.image || 'assets/ashwagandha.png';

        return `
            <tr>
                <td>
                    <div class="table-product-cell">
                        <img src="${imageSrc}" alt="${escapeHtml(prod.name)}" class="table-thumb" onerror="this.src='assets/ashwagandha.png'">
                        <div>
                            <div class="product-title-bold">${escapeHtml(prod.name)}</div>
                            <small class="text-muted">${escapeHtml(prod.dosage || 'Standard dosage')}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div><strong>${escapeHtml(prod.category)}</strong></div>
                    <small class="text-muted">${escapeHtml(prod.ailment)}</small>
                </td>
                <td>
                    <span class="badge badge-dosha">${escapeHtml(prod.dosha || 'Tridosha')}</span>
                </td>
                <td>
                    <strong>$${Number(prod.price).toFixed(2)}</strong>
                    ${prod.originalPrice ? `<br><small class="text-muted" style="text-decoration:line-through">$${Number(prod.originalPrice).toFixed(2)}</small>` : ''}
                </td>
                <td>
                    <!-- Interactive Stock Control -->
                    <div class="stock-adjust-box">
                        <button type="button" class="stock-btn" onclick="adjustStock(${prod.id}, ${stockVal}, -1)" title="Decrease Stock">-</button>
                        <input type="number" class="stock-val-input" value="${stockVal}" min="0" onchange="changeStockDirect(${prod.id}, this.value)">
                        <button type="button" class="stock-btn" onclick="adjustStock(${prod.id}, ${stockVal}, 1)" title="Increase Stock">+</button>
                    </div>
                </td>
                <td>
                    <span class="stock-badge ${stockBadgeClass}">${stockText}</span>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-outline btn-xs" onclick="editProduct(${prod.id})">Edit</button>
                    <button class="btn btn-outline btn-xs text-warning" onclick="deleteProduct(${prod.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderLowStockTable(products) {
    const tbody = document.getElementById('lowStockTableBody');
    const lowStockItems = products.filter(p => (p.stock ?? 50) <= 10);

    if (lowStockItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-success" style="padding:1rem;">🌿 All products are well stocked! No low stock alerts.</td></tr>';
        return;
    }

    tbody.innerHTML = lowStockItems.map(p => `
        <tr>
            <td class="product-title-bold">${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.category)}</td>
            <td><span class="stock-badge badge-low-stock">${p.stock ?? 0} left</span></td>
            <td>
                <button class="btn btn-gold btn-xs" onclick="adjustStock(${p.id}, ${p.stock ?? 0}, 20)">Restock (+20)</button>
            </td>
        </tr>
    `).join('');
}

/* Quick Stock Level API Updates */
async function adjustStock(productId, currentStock, delta) {
    const newStock = Math.max(0, currentStock + delta);
    await updateStockOnServer(productId, newStock);
}

async function changeStockDirect(productId, value) {
    const newStock = Math.max(0, parseInt(value, 10) || 0);
    await updateStockOnServer(productId, newStock);
}

async function updateStockOnServer(productId, newStock) {
    try {
        const res = await fetch(`${API_BASE}/products/${productId}/stock?stock=${newStock}`, {
            method: 'PATCH'
        });
        if (!res.ok) throw new Error('Failed to update stock');
        showAdminToast(`Stock updated to ${newStock} units`, 'success');
        fetchAdminProducts();
        fetchAdminStats();
    } catch (err) {
        console.error('Error updating stock:', err);
        showAdminToast('Could not update stock on server', 'error');
    }
}

/* Filter Products Toolbar */
function filterAdminProducts() {
    const searchVal = document.getElementById('adminProductSearch').value.toLowerCase();
    const ailmentVal = document.getElementById('adminAilmentFilter').value.toLowerCase();
    const doshaVal = document.getElementById('adminDoshaFilter').value.toLowerCase();

    const filtered = adminProducts.filter(p => {
        const matchesSearch = !searchVal || 
            p.name.toLowerCase().includes(searchVal) || 
            (p.ingredients && p.ingredients.toLowerCase().includes(searchVal)) ||
            (p.category && p.category.toLowerCase().includes(searchVal));

        const matchesAilment = !ailmentVal || (p.ailment && p.ailment.toLowerCase() === ailmentVal);
        const matchesDosha = !doshaVal || (p.dosha && p.dosha.toLowerCase().includes(doshaVal));

        return matchesSearch && matchesAilment && matchesDosha;
    });

    renderAdminProducts(filtered);
}


/* 3. Fetch & Render Customer Orders */
async function fetchAdminOrders() {
    try {
        const res = await fetch(`${API_BASE}/orders`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        adminOrders = await res.json();
        renderAdminOrders(adminOrders);
        renderRecentOrdersTable(adminOrders);
        updateLocalOrderStats(adminOrders);
    } catch (err) {
        console.warn('Orders endpoint empty or error:', err);
        renderAdminOrders([]);
        renderRecentOrdersTable([]);
    }
}

function updateLocalOrderStats(orders) {
    document.getElementById('statOrders').textContent = orders.length;
    const pending = orders.filter(o => (o.status || 'PENDING') === 'PENDING').length;
    document.getElementById('statPendingOrders').textContent = `${pending} Pending Delivery`;

    const totalRev = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    document.getElementById('statRevenue').textContent = `$${totalRev.toFixed(2)}`;
}

function renderAdminOrders(orders) {
    const tbody = document.getElementById('adminOrdersTableBody');
    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No customer orders recorded yet.</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(ord => {
        const status = ord.status || 'PENDING';
        const statusClass = `status-${status.toLowerCase()}`;

        return `
            <tr>
                <td><strong>${escapeHtml(ord.orderTrackingNumber || 'AV-UNKNOWN')}</strong></td>
                <td>
                    <div><strong>${escapeHtml(ord.customerName || 'Guest Customer')}</strong></div>
                    <small class="text-muted">${escapeHtml(ord.shippingAddress || 'No address provided')}</small>
                </td>
                <td>${escapeHtml(ord.paymentMethod || 'Credit Card')}</td>
                <td><strong>$${Number(ord.totalAmount || 0).toFixed(2)}</strong></td>
                <td>
                    <select class="admin-select ${statusClass}" onchange="updateOrderStatus(${ord.id}, this.value)">
                        <option value="PENDING" ${status === 'PENDING' ? 'selected' : ''}>Pending</option>
                        <option value="PROCESSING" ${status === 'PROCESSING' ? 'selected' : ''}>Processing</option>
                        <option value="SHIPPED" ${status === 'SHIPPED' ? 'selected' : ''}>Shipped</option>
                        <option value="DELIVERED" ${status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
                        <option value="CANCELLED" ${status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-outline btn-xs text-warning" onclick="deleteOrder(${ord.id})">Remove</button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderRecentOrdersTable(orders) {
    const tbody = document.getElementById('recentOrdersTableBody');
    const recent = orders.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No recent orders yet.</td></tr>';
        return;
    }

    tbody.innerHTML = recent.map(o => `
        <tr>
            <td><strong>${escapeHtml(o.orderTrackingNumber)}</strong></td>
            <td>${escapeHtml(o.customerName)}</td>
            <td>$${Number(o.totalAmount || 0).toFixed(2)}</td>
            <td><span class="status-badge status-${(o.status || 'PENDING').toLowerCase()}">${o.status || 'PENDING'}</span></td>
        </tr>
    `).join('');
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}/status?status=${newStatus}`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error('Failed to update status');
        showAdminToast(`Order status updated to ${newStatus}`, 'success');
        fetchAdminOrders();
        fetchAdminStats();
    } catch (err) {
        console.error('Error updating order status:', err);
        showAdminToast('Could not update order status', 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete order');
        showAdminToast('Order record removed', 'success');
        fetchAdminOrders();
        fetchAdminStats();
    } catch (err) {
        console.error('Error deleting order:', err);
        showAdminToast('Failed to delete order', 'error');
    }
}

function filterAdminOrders() {
    const searchVal = document.getElementById('adminOrderSearch').value.toLowerCase();
    const statusVal = document.getElementById('adminOrderStatusFilter').value;

    const filtered = adminOrders.filter(o => {
        const matchesSearch = !searchVal || 
            (o.orderTrackingNumber && o.orderTrackingNumber.toLowerCase().includes(searchVal)) ||
            (o.customerName && o.customerName.toLowerCase().includes(searchVal)) ||
            (o.shippingAddress && o.shippingAddress.toLowerCase().includes(searchVal));

        const matchesStatus = !statusVal || (o.status && o.status === statusVal);

        return matchesSearch && matchesStatus;
    });

    renderAdminOrders(filtered);
}


/* 4. Product Create / Edit Modal Logic */
function openProductModal(prod = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');

    if (prod) {
        document.getElementById('modalTitle').textContent = 'Edit Product & Stock';
        document.getElementById('productId').value = prod.id;
        document.getElementById('prodName').value = prod.name || '';
        document.getElementById('prodCategory').value = prod.category || '';
        document.getElementById('prodAilment').value = prod.ailment || 'stress';
        document.getElementById('prodDosha').value = prod.dosha || 'vata';
        document.getElementById('prodPrice').value = prod.price || '';
        document.getElementById('prodOriginalPrice').value = prod.originalPrice || '';
        document.getElementById('prodStock').value = prod.stock ?? 50;
        document.getElementById('prodDosage').value = prod.dosage || '';
        document.getElementById('prodBadge').value = prod.badge || '';
        document.getElementById('prodBadgeType').value = prod.badgeType || 'badge-gold';
        document.getElementById('prodImage').value = prod.image || '';
        document.getElementById('prodIngredients').value = prod.ingredients || '';
        document.getElementById('prodBenefits').value = prod.benefits || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Product';
        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('prodStock').value = 50;
    }

    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function editProduct(productId) {
    const prod = adminProducts.find(p => p.id === productId);
    if (prod) openProductModal(prod);
}

async function saveProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;

    const payload = {
        name: document.getElementById('prodName').value,
        category: document.getElementById('prodCategory').value,
        ailment: document.getElementById('prodAilment').value,
        dosha: document.getElementById('prodDosha').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        originalPrice: parseFloat(document.getElementById('prodOriginalPrice').value) || null,
        stock: parseInt(document.getElementById('prodStock').value, 10) || 50,
        dosage: document.getElementById('prodDosage').value,
        badge: document.getElementById('prodBadge').value,
        badgeType: document.getElementById('prodBadgeType').value,
        image: document.getElementById('prodImage').value || 'assets/ashwagandha.png',
        ingredients: document.getElementById('prodIngredients').value,
        benefits: document.getElementById('prodBenefits').value
    };

    const isEdit = !!productId;
    const url = isEdit ? `${API_BASE}/products/${productId}` : `${API_BASE}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to save product');

        showAdminToast(`Product ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        closeProductModal();
        fetchAdminProducts();
        fetchAdminStats();
    } catch (err) {
        console.error('Error saving product:', err);
        showAdminToast('Failed to save product to backend', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product from catalog?')) return;
    try {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete product');

        showAdminToast('Product deleted from inventory', 'success');
        fetchAdminProducts();
        fetchAdminStats();
    } catch (err) {
        console.error('Error deleting product:', err);
        showAdminToast('Could not delete product from server', 'error');
    }
}

/* Toast Helper */
function showAdminToast(message, type = 'info') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        background: ${type === 'success' ? '#1e3a2b' : '#dc2626'};
        color: #ffffff;
        padding: 0.8rem 1.2rem;
        border-radius: 10px;
        margin-top: 0.5rem;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return map[match];
    });
}
