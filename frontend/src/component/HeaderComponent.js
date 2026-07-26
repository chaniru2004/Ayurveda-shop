export class HeaderComponent {
    render() {
        return `
            <header class="site-header">
                <div class="container nav-container">
                    <a href="#" class="brand-logo">🌿 AYURVEDA VEDA</a>
                    <div class="nav-actions">
                        <input type="text" id="searchInput" class="search-input" placeholder="Search remedies...">
                        <button class="icon-btn" onclick="openCartDrawer()">🛒 <span class="cart-count">0</span></button>
                    </div>
                </div>
            </header>
        `;
    }
}
