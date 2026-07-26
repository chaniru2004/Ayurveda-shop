import { CartItemModel } from '../model/CartItemModel.js';

export class CartService {
    constructor() {
        this.cart = [];
        this.appliedPromo = null;
    }

    addToCart(product, quantity = 1) {
        const existing = this.cart.find(item => item.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.cart.push(new CartItemModel(product, quantity));
        }
        return this.cart;
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(i => i.product.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(i => i.product.id !== productId);
            }
        }
        return this.cart;
    }

    applyPromo(code) {
        if (code.toUpperCase() === 'HERBAL10') {
            this.appliedPromo = { code: 'HERBAL10', discount: 0.10 };
            return { success: true, message: '10% Discount Applied!' };
        }
        return { success: false, message: 'Invalid Promo Code' };
    }

    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        const discount = this.appliedPromo ? subtotal * this.appliedPromo.discount : 0;
        return Math.max(0, subtotal - discount);
    }
}
