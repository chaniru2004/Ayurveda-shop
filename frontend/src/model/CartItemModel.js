export class CartItemModel {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    get totalPrice() {
        return this.product.price * this.quantity;
    }
}
