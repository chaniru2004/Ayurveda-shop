import { ProductService } from '../service/ProductService.js';
import { CartService } from '../service/CartService.js';

export class HomePage {
    constructor() {
        this.productService = new ProductService();
        this.cartService = new CartService();
    }

    init() {
        console.log('HomePage Initialized with Modular Architecture');
    }
}
