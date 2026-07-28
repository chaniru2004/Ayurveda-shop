/* ==========================================================================
   AYURVEDA VEDA - E-COMMERCE JAVASCRIPT APP & STORE ENGINE
   ========================================================================== */

// Store State & Product Catalog Data
let PRODUCTS_DATA = [
    {
        id: 1,
        name: 'Organic Ashwagandha Powder',
        category: 'Herbal Powders',
        ailment: 'stress',
        dosha: 'vata',
        price: 24.99,
        originalPrice: 29.99,
        rating: 4.9,
        reviewsCount: 128,
        badge: 'Best Seller',
        badgeType: 'badge-gold',
        image: 'assets/ashwagandha.png',
        ingredients: '100% Pure Organic Withania Somnifera Root Extract',
        benefits: 'Reduces stress & cortisol, improves stamina and sleep quality.',
        dosage: '1 tsp daily with warm milk or water',
        stock: 45
    },
    {
        id: 2,
        name: 'Triphala Churna Organic Blend',
        category: 'Gut Health & Cleansing',
        ailment: 'digestion',
        dosha: 'tridosha',
        price: 18.50,
        originalPrice: 22.00,
        rating: 4.8,
        reviewsCount: 94,
        badge: 'Organic',
        badgeType: 'badge-organic',
        image: 'assets/triphala.png',
        ingredients: 'Amalaki, Bibhitaki, Haritaki organic fruit powders',
        benefits: 'Cleanses colon, enhances nutrient absorption, regulates digestion.',
        dosage: '1/2 tsp before bedtime with warm water',
        stock: 50
    },
    {
        id: 3,
        name: 'Organic Tulsi Holy Basil Tea',
        category: 'Herbal Teas',
        ailment: 'immunity',
        dosha: 'kapha',
        price: 14.99,
        originalPrice: 17.99,
        rating: 4.9,
        reviewsCount: 76,
        badge: 'Immunity Boost',
        badgeType: 'badge-dosha',
        image: 'assets/tulsi_tea.png',
        ingredients: 'Rama Tulsi, Krishna Tulsi, Vana Tulsi organic leaves',
        benefits: 'Enhances natural immunity, calms mind, supports respiratory health.',
        dosage: 'Steep 1 tea bag for 5-7 minutes in hot water',
        stock: 60
    },
    {
        id: 4,
        name: 'Mahanarayan Joint Care Massage Oil',
        category: 'Ayurvedic Oils',
        ailment: 'joints',
        dosha: 'pitta',
        price: 29.99,
        originalPrice: 34.99,
        rating: 4.7,
        reviewsCount: 53,
        badge: 'Pain Relief',
        badgeType: 'badge-gold',
        image: 'assets/hero.png',
        ingredients: 'Sesame oil infused with 30+ revitalizing Ayurvedic herbs',
        benefits: 'Relieves joint stiffness, calms Vata, promotes muscle relaxation.',
        dosage: 'Gently massage warm oil onto affected joints for 10-15 mins',
        stock: 25
    }
];

// App State
let cart = [];
let wishlist = new Set();
let activeAilmentFilter = 'all';
let activeDoshaFilter = 'all';
let appliedPromo = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    fetchLiveProducts();
    initQuiz();
    updateCartUI();
    setupEventListeners();
});

async function fetchLiveProducts() {
    try {
        const res = await fetch('http://localhost:8090/api/products');
        if (res.ok) {
            const liveData = await res.json();
            if (liveData && liveData.length > 0) {
                PRODUCTS_DATA = liveData;
                renderProducts();
            }
        }
    } catch (err) {
        console.warn('Backend API offline, serving local catalog:', err);
    }
}

// Render Product Catalog Cards
function renderProducts(searchQuery = '') {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    let filtered = PRODUCTS_DATA.filter(product => {
        const matchesAilment = activeAilmentFilter === 'all' || product.ailment === activeAilmentFilter;
        const matchesDosha = activeDoshaFilter === 'all' || product.dosha.includes(activeDoshaFilter);
        const matchesSearch = searchQuery === '' || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.ingredients.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesAilment && matchesDosha && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin:0 auto 1rem; color: var(--color-accent-gold);">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <h3 style="font-family: var(--font-heading); color: var(--color-primary); margin-bottom: 0.5rem;">No Remedies Found</h3>
                <p style="color: var(--color-text-muted);">Try adjusting your search query or dosage filters.</p>
                <button class="btn btn-outline" onclick="resetFilters()" style="margin-top: 1rem;">Reset All Filters</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(product => {
        const isWishlisted = wishlist.has(product.id);
        const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        const stockCount = product.stock ?? 50;

        return `
            <article class="product-card">
                <div class="product-image-container">
                    <span class="badge ${product.badgeType || 'badge-gold'}">${product.badge || 'Organic'}</span>
                    
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" aria-label="Add to Wishlist">
                        <svg width="18" height="18" fill="${isWishlisted ? '#b85b40' : 'none'}" stroke="${isWishlisted ? '#b85b40' : 'currentColor'}" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>

                    <img src="${product.image || 'assets/ashwagandha.png'}" alt="${escapeHtml(product.name)}" class="product-image" loading="lazy" onerror="this.src='assets/ashwagandha.png'">
                    
                    <div class="quick-view-overlay">
                        <button class="quick-view-btn" onclick="openQuickView('${product.id}')">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            Quick Specs
                        </button>
                    </div>
                </div>

                <div class="product-content">
                    <div class="product-meta">
                        <span class="product-category">${escapeHtml(product.category)}</span>
                        <span class="dosha-tag dosha-${product.dosha || 'tridosha'}">${(product.dosha || 'TRIDOSHA').toUpperCase()}</span>
                    </div>

                    <h3 class="product-title">${escapeHtml(product.name)}</h3>

                    <div class="product-rating">
                        <div class="stars">★★★★★</div>
                        <span class="rating-text">${product.rating || '4.9'} (${product.reviewsCount || 42})</span>
                    </div>

                    <div class="product-price-row">
                        <div class="price-container">
                            <span class="current-price">$${Number(product.price).toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="original-price">$${Number(product.originalPrice).toFixed(2)}</span>` : ''}
                            ${discountPercent > 0 ? `<span class="discount-pill">-${discountPercent}%</span>` : ''}
                        </div>
                        <span style="font-size:0.75rem; font-weight:600; color:${stockCount <= 10 ? '#dc2626' : '#16a34a'};">
                            ${stockCount > 0 ? `${stockCount} in stock` : 'Out of Stock'}
                        </span>
                    </div>

                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')" ${stockCount === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        ${stockCount > 0 ? 'Add To Cart' : 'Out of Stock'}
                    </button>
                </div>
            </article>
        `;
    }).join('');
}

// Filter Actions
function filterByAilment(ailment, element) {
    activeAilmentFilter = ailment;
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    if (element) element.classList.add('active');
    renderProducts();
}

function filterByDosha(dosha) {
    activeDoshaFilter = dosha;
    renderProducts();
}

function resetFilters() {
    activeAilmentFilter = 'all';
    activeDoshaFilter = 'all';
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    document.querySelector('.filter-chip[onclick*="all"]')?.classList.add('active');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    renderProducts();
}

// Cart Drawer & Management
function openCartDrawer() {
    document.getElementById('cartDrawerOverlay')?.classList.add('active');
    document.getElementById('cartDrawer')?.classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cartDrawerOverlay')?.classList.remove('active');
    document.getElementById('cartDrawer')?.classList.remove('active');
}

function addToCart(productId) {
    const product = PRODUCTS_DATA.find(p => String(p.id) === String(productId));
    if (!product) return;

    const existingItem = cart.find(item => String(item.id) === String(productId));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`Added ${product.name} to your herbal cart.`);
    openCartDrawer();
}

function updateCartQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => String(item.id) === String(productId));
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCountEl = document.querySelector('.cart-count');
    const cartItemsEl = document.getElementById('cartItems');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
    const finalTotal = Math.max(0, subtotal - discount);

    if (cartCountEl) cartCountEl.textContent = totalCount;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${finalTotal.toFixed(2)}`;

    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart-state">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <p>Your herbal remedies cart is currently empty.</p>
                <button class="btn btn-gold btn-sm" onclick="closeCartDrawer(); scrollToShop();">Explore Remedies</button>
            </div>
        `;
        return;
    }

    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image || 'assets/ashwagandha.png'}" alt="${escapeHtml(item.name)}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
                <div class="cart-item-price">$${Number(item.price).toFixed(2)}</div>
                <div class="cart-quantity-controls">
                    <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="updateCartQuantity('${item.id}', -${item.quantity})">&times;</button>
        </div>
    `).join('');
}

// Quick Spec Modal
function openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => String(p.id) === String(productId));
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
            <img src="${product.image || 'assets/ashwagandha.png'}" alt="${escapeHtml(product.name)}" style="width:100%; border-radius:16px;">
            <div>
                <span class="badge ${product.badgeType || 'badge-gold'}" style="margin-bottom:0.5rem;">${product.badge || 'Pure Organic'}</span>
                <h2 style="font-family:var(--font-heading); color:var(--color-primary); font-size:1.6rem;">${escapeHtml(product.name)}</h2>
                <div style="font-size:1.4rem; font-weight:700; color:var(--color-accent-gold); margin:0.5rem 0 1rem;">$${Number(product.price).toFixed(2)}</div>
                <p style="color:var(--color-text-muted); font-size:0.9rem; margin-bottom:1rem;">${escapeHtml(product.benefits)}</p>
                <div style="background:#f4efe4; padding:0.8rem; border-radius:10px; margin-bottom:1.5rem; font-size:0.85rem;">
                    <strong>Dosage:</strong> ${escapeHtml(product.dosage || 'Take as recommended by physician')}
                </div>
                <button class="btn btn-gold" style="width:100%;" onclick="addToCart('${product.id}'); closeQuickView();">Add to Cart</button>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeQuickView() {
    document.getElementById('quickViewModal')?.classList.remove('active');
}

// Wishlist Handling
function toggleWishlist(productId) {
    if (wishlist.has(productId)) {
        wishlist.delete(productId);
        showToast('Removed item from your wishlist.');
    } else {
        wishlist.add(productId);
        showToast('Saved remedy to your wishlist.');
    }
    renderProducts();
}

// Checkout Modal
function openCheckoutModal() {
    if (cart.length === 0) {
        showToast('Your cart is empty! Add remedies before checking out.');
        return;
    }
    closeCartDrawer();
    document.getElementById('checkoutModalOverlay')?.classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModalOverlay')?.classList.remove('active');
}

async function submitOrder(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('custName')?.value || 'Guest Customer';
    const shippingAddress = document.getElementById('custAddress')?.value || 'Standard Shipping Address';
    const paymentMethod = document.getElementById('custPayment')?.value || 'Credit Card';
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderPayload = {
        customerName: customerName,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        status: 'PENDING'
    };

    try {
        const res = await fetch('http://localhost:8090/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        if (res.ok) {
            const savedOrder = await res.json();
            showToast(`🎉 Order ${savedOrder.orderTrackingNumber || ''} Placed! Thank you.`);
        } else {
            showToast('🎉 Order Successfully Placed!');
        }
    } catch (err) {
        console.warn('Backend order endpoint error:', err);
        showToast('🎉 Order Successfully Placed!');
    }

    closeCheckoutModal();
    cart = [];
    updateCartUI();

    const successModal = document.getElementById('orderSuccessModalOverlay');
    if (successModal) successModal.classList.add('active');
}

function closeOrderSuccessModal() {
    document.getElementById('orderSuccessModalOverlay')?.classList.remove('active');
}

// Toast Notifications
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        background: #1e3a2b;
        color: #ffffff;
        padding: 0.85rem 1.25rem;
        border-radius: 10px;
        margin-top: 0.5rem;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3200);
}

// Setup Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderProducts(e.target.value);
        });
    }
}

function scrollToShop() {
    document.getElementById('shopSection')?.scrollIntoView({ behavior: 'smooth' });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return map[match];
    });
}
