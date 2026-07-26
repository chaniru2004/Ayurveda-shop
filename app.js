/* ==========================================================================
   AYURVEDA VEDA - E-COMMERCE JAVASCRIPT APP & STORE ENGINE
   ========================================================================== */

// Store State & Product Catalog Data
const PRODUCTS_DATA = [
    {
        id: 'ashwagandha-ksm66',
        name: 'Ashwagandha KSM-66 Premium Extract',
        category: 'Stress & Vitality',
        ailment: 'stress',
        dosha: 'v-p', // Vata & Pitta balancing
        price: 24.99,
        originalPrice: 29.99,
        rating: 4.9,
        reviewsCount: 128,
        badge: 'Best Seller',
        badgeType: 'badge-gold',
        image: 'assets/ashwagandha.png',
        ingredients: 'Standardized Withania Somnifera (500mg), BioPerine (5mg)',
        benefits: 'Supports Cortisol reduction, deep restorative sleep, stress resilience, and physical endurance.',
        dosage: 'Take 1-2 capsules daily after meals with warm water or milk.'
    },
    {
        id: 'triphala-digestive',
        name: 'Triphala Organic Digestive Care',
        category: 'Digestion & Detox',
        ailment: 'digestion',
        dosha: 'tridosha', // Balances all 3 doshas
        price: 19.50,
        originalPrice: 22.00,
        rating: 4.8,
        reviewsCount: 94,
        badge: 'Organic',
        badgeType: 'badge-organic',
        image: 'assets/triphala.png',
        ingredients: 'Equal blend of Organic Amla (Emblica officinalis), Haritaki, and Bibhitaki',
        benefits: 'Cleanses colon, enhances nutrient absorption, regulates digestion, and boosts antioxidant levels.',
        dosage: 'Take 2 capsules before sleep with lukewarm water.'
    },
    {
        id: 'tulsi-holy-basil-tea',
        name: 'Organic Tulsi Holy Basil Herbal Tea',
        category: 'Immunity & Respiration',
        ailment: 'immunity',
        dosha: 'k-v',
        price: 14.00,
        originalPrice: 16.50,
        rating: 4.9,
        reviewsCount: 210,
        badge: 'Top Rated',
        badgeType: 'badge-organic',
        image: 'assets/tulsi_tea.png',
        ingredients: 'Rama Tulsi, Krishna Tulsi, Vana Tulsi whole tea leaves',
        benefits: 'Soothes respiratory passages, boosts cellular immunity, relieves cold symptoms & mental fatigue.',
        dosage: 'Steep 1 tsp in boiling water for 4-5 minutes. Enjoy twice daily.'
    },
    {
        id: 'pain-relief-balm',
        name: 'Maha Narayan Pain Relief Balm',
        category: 'Joint & Muscle Care',
        ailment: 'joint',
        dosha: 'vata',
        price: 16.50,
        originalPrice: 19.99,
        rating: 4.7,
        reviewsCount: 76,
        badge: 'Fast Relief',
        badgeType: 'badge-gold',
        image: 'assets/hero.png', // Uses rich herb graphic
        ingredients: 'Eucalyptus Oil, Camphor, Mahanarayan Taila, Nilgiri & Sesame Oil Base',
        benefits: 'Rapidly warms sore joints, relieves muscular stiffness, reduces arthritis pain.',
        dosage: 'Gently massage a small quantity over affected joint/muscle area 2-3 times daily.'
    },
    {
        id: 'kumkumadi-saffron-oil',
        name: 'Kumkumadi Saffron Radiant Face Serum',
        category: 'Skin & Beauty',
        ailment: 'skin',
        dosha: 'pitta',
        price: 34.99,
        originalPrice: 42.00,
        rating: 5.0,
        reviewsCount: 312,
        badge: 'Luxury Beauty',
        badgeType: 'badge-gold',
        image: 'assets/hero.png',
        ingredients: 'Kashmiri Saffron (Kumkuma), Sandalwood, Lotus, Vetiver & Sesame Oil',
        benefits: 'Brightens skin complexions, reduces hyperpigmentation, smooths fine lines, imparts golden glow.',
        dosage: 'Apply 3-4 drops onto clean face & neck at bedtime, gently massaging upwards.'
    },
    {
        id: 'shatavari-hormonal-balance',
        name: 'Shatavari Women Vitality & Wellness',
        category: 'Vitality & Balance',
        ailment: 'energy',
        dosha: 'p-v',
        price: 21.99,
        originalPrice: 25.00,
        rating: 4.8,
        reviewsCount: 88,
        badge: 'Pure Herbal',
        badgeType: 'badge-organic',
        image: 'assets/ashwagandha.png',
        ingredients: 'Pure Organic Asparagus Racemosus Extract (500mg)',
        benefits: 'Supports female hormonal health, reproductive vitality, lactation, and emotional equilibrium.',
        dosage: '1 capsule twice daily with milk or water after meals.'
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
    initQuiz();
    updateCartUI();
    setupEventListeners();
});

// Render Product Catalog Cards
function renderProducts(searchQuery = '') {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    let filtered = PRODUCTS_DATA.filter(product => {
        // Ailment filter
        const matchAilment = activeAilmentFilter === 'all' || product.ailment === activeAilmentFilter;
        // Dosha filter
        const matchDosha = activeDoshaFilter === 'all' || product.dosha.includes(activeDoshaFilter) || product.dosha === 'tridosha';
        // Search query
        const matchSearch = searchQuery === '' || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

        return matchAilment && matchDosha && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 1rem; opacity: 0.5;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3>No Ayurvedic Remedies Found</h3>
                <p>Try clearing filters or searching for alternative herbs like Ashwagandha or Tulsi.</p>
                <button class="btn btn-outline" style="margin-top: 1rem;" onclick="resetFilters()">Reset All Filters</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-badge-group">
                <span class="badge ${product.badgeType}">${product.badge}</span>
            </div>
            <button class="product-wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" aria-label="Add to Wishlist">
                <svg width="18" height="18" fill="${wishlist.has(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
            </button>
            <div class="product-img-box" onclick="openQuickView('${product.id}')" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-content">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title" onclick="openQuickView('${product.id}')" style="cursor: pointer;">${product.name}</h3>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))} 
                    <strong>${product.rating}</strong> 
                    <span>(${product.reviewsCount} reviews)</span>
                </div>
                <p class="product-ingredients">🌿 <em>${product.ingredients}</em></p>
                <div class="product-footer">
                    <div class="product-price">
                        $${product.price.toFixed(2)}
                        ${product.originalPrice ? `<del>$${product.originalPrice.toFixed(2)}</del>` : ''}
                    </div>
                    <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="addToCart('${product.id}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Event Handlers
function filterByAilment(ailment, element) {
    activeAilmentFilter = ailment;
    document.querySelectorAll('.ailment-card').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    renderProducts();
}

function filterByDosha(dosha, element) {
    activeDoshaFilter = dosha;
    document.querySelectorAll('.dosha-btn').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    renderProducts();
}

function resetFilters() {
    activeAilmentFilter = 'all';
    activeDoshaFilter = 'all';
    document.querySelectorAll('.ailment-card').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.dosha-btn').forEach(el => el.classList.remove('active'));
    document.querySelector('.ailment-card[data-ailment="all"]')?.classList.add('active');
    document.querySelector('.dosha-btn[data-dosha="all"]')?.classList.add('active');
    document.getElementById('searchInput').value = '';
    renderProducts();
}

// Shopping Cart Functions
function addToCart(productId, qty = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }

    updateCartUI();
    showToast(`Added ${product.name} to your cart!`);
    openCartDrawer();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
    showToast('Item removed from cart');
}

function updateCartUI() {
    // Update badge count
    const totalCount = cart.reduce((acc, i) => acc + i.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalCount);

    // Render cart items
    const cartBody = document.getElementById('cartItemsBody');
    if (!cartBody) return;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 1rem; opacity: 0.4;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <p>Your shopping basket is empty</p>
                <button class="btn btn-outline" style="margin-top: 1rem;" onclick="closeCartDrawer()">Explore Remedies</button>
            </div>
        `;
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: var(--color-text-muted); padding: 5px;">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        `).join('');
    }

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
    const finalTotal = Math.max(0, subtotal - discount);

    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartDiscount').textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
    document.getElementById('cartTotal').textContent = `$${finalTotal.toFixed(2)}`;
}

function applyPromoCode() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    if (code === 'HERBAL10') {
        appliedPromo = { code: 'HERBAL10', discount: 0.10 };
        showToast('Promo code HERBAL10 applied: 10% OFF!');
    } else if (code === 'AYURVEDA20') {
        appliedPromo = { code: 'AYURVEDA20', discount: 0.20 };
        showToast('Promo code AYURVEDA20 applied: 20% OFF!');
    } else {
        showToast('Invalid promo code. Try HERBAL10');
    }
    updateCartUI();
}

function openCartDrawer() {
    document.getElementById('cartDrawerOverlay')?.classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cartDrawerOverlay')?.classList.remove('active');
}

// Wishlist Logic
function toggleWishlist(productId) {
    if (wishlist.has(productId)) {
        wishlist.delete(productId);
        showToast('Removed from Wishlist');
    } else {
        wishlist.add(productId);
        showToast('Added to your Wishlist ❤️');
    }
    renderProducts();
}

// Quick View Modal
function openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; padding: 2.5rem 2rem 2rem;">
            <div style="background: #f7f5ef; border-radius: var(--radius-md); overflow: hidden;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
                <span class="badge ${product.badgeType}">${product.badge}</span>
                <h2 style="font-size: 1.8rem; margin: 0.5rem 0; color: var(--color-primary);">${product.name}</h2>
                <div class="product-rating" style="margin-bottom: 1rem;">
                    ${'★'.repeat(Math.floor(product.rating))} <strong>${product.rating}</strong> (${product.reviewsCount} customer reviews)
                </div>
                <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem;">
                    $${product.price.toFixed(2)} ${product.originalPrice ? `<del style="font-size: 1rem; color: var(--color-text-muted);">$${product.originalPrice.toFixed(2)}</del>` : ''}
                </div>
                <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">${product.benefits}</p>

                <div style="background: var(--color-cream-bg); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; border: 1px solid var(--color-border);">
                    <div style="font-weight: 600; font-size: 0.85rem; color: var(--color-primary);">🌿 Key Herbal Ingredients:</div>
                    <div style="font-size: 0.85rem; color: var(--color-text-muted);">${product.ingredients}</div>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center;">
                    <button class="btn btn-gold" style="flex-grow: 1;" onclick="addToCart('${product.id}'); closeQuickView();">
                        Add to Cart
                    </button>
                    <button class="btn btn-outline" onclick="toggleWishlist('${product.id}')">
                        Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('quickViewOverlay')?.classList.add('active');
}

function closeQuickView() {
    document.getElementById('quickViewOverlay')?.classList.remove('active');
}

// Dosha Interactive Diagnostic Quiz Widget Logic
let quizAnswers = { q1: null, q2: null, q3: null };

function initQuiz() {
    // Quiz logic will handle user selection steps
}

function selectQuizOption(question, val, cardElement) {
    quizAnswers[question] = val;
    cardElement.parentNode.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
}

function calculateDoshaResult() {
    if (!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3) {
        showToast('Please answer all 3 questions to reveal your Prakriti (Dosha)!');
        return;
    }

    // Count score
    const counts = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(quizAnswers).forEach(val => counts[val]++);

    let primaryDosha = 'vata';
    if (counts.pitta >= counts.vata && counts.pitta >= counts.kapha) primaryDosha = 'pitta';
    if (counts.kapha >= counts.vata && counts.kapha >= counts.pitta) primaryDosha = 'kapha';

    const doshaDescriptions = {
        vata: {
            title: 'Vata Prakriti (Air & Ether)',
            desc: 'Your constitution is characterized by quick movement, creativity, and alertness. Balance yourself with warming, grounding herbs like Ashwagandha and nourishing oils.',
            recommendedHerb: 'ashwagandha-ksm66'
        },
        pitta: {
            title: 'Pitta Prakriti (Fire & Water)',
            desc: 'Your constitution is driven by strong focus, high metabolism, and warmth. Balance your inner fire with cooling, soothing herbs like Shatavari and Saffron facial oil.',
            recommendedHerb: 'kumkumadi-saffron-oil'
        },
        kapha: {
            title: 'Kapha Prakriti (Earth & Water)',
            desc: 'Your constitution is grounded, strong, patient, and calm. Invigorate your body with stimulating spices, digestive teas, and warm Tulsi blends.',
            recommendedHerb: 'tulsi-holy-basil-tea'
        }
    };

    const res = doshaDescriptions[primaryDosha];
    document.getElementById('quizFormBlock').style.display = 'none';
    const resultBlock = document.getElementById('quizResultBlock');
    resultBlock.classList.add('active');

    resultBlock.innerHTML = `
        <div class="dosha-type-badge">🌿 Your Dominant Prakriti: ${res.title}</div>
        <p style="max-width: 600px; margin: 1rem auto 2rem; color: rgba(255,255,255,0.85);">${res.desc}</p>
        <button class="btn btn-gold" onclick="filterByDosha('${primaryDosha}'); scrollToShop();">
            Shop Recommended ${primaryDosha.toUpperCase()} Remedies
        </button>
    `;
}

function scrollToShop() {
    document.getElementById('shopSection')?.scrollIntoView({ behavior: 'smooth' });
}

// Checkout Modal Simulator
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

function submitOrder(e) {
    e.preventDefault();
    closeCheckoutModal();
    
    // Show success confirmation
    cart = [];
    updateCartUI();
    showToast('🎉 Order Successfully Placed! Thank you for choosing Ayurveda Veda.');

    // Show order success modal
    document.getElementById('orderSuccessModalOverlay')?.classList.add('active');
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
    toast.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Search bar live filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderProducts(e.target.value);
        });
    }
}
