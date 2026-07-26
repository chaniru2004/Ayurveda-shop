export class ProductGridComponent {
    renderProducts(products) {
        return products.map(p => `
            <div class="product-card">
                <div class="product-img-box"><img src="${p.image}" alt="${p.name}"></div>
                <div class="product-content">
                    <span class="product-category">${p.category}</span>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }
}
