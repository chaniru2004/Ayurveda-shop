import { ProductModel } from '../model/ProductModel.js';

export class ProductService {
    constructor() {
        this.products = [
            new ProductModel({
                id: 'ashwagandha-ksm66',
                name: 'Ashwagandha KSM-66 Premium Extract',
                category: 'Stress & Vitality',
                ailment: 'stress',
                dosha: 'v-p',
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
            }),
            new ProductModel({
                id: 'triphala-digestive',
                name: 'Triphala Organic Digestive Care',
                category: 'Digestion & Detox',
                ailment: 'digestion',
                dosha: 'tridosha',
                price: 19.50,
                originalPrice: 22.00,
                rating: 4.8,
                reviewsCount: 94,
                badge: 'Organic',
                badgeType: 'badge-organic',
                image: 'assets/triphala.png',
                ingredients: 'Equal blend of Organic Amla, Haritaki, and Bibhitaki',
                benefits: 'Cleanses colon, enhances nutrient absorption, regulates digestion, and boosts antioxidant levels.',
                dosage: 'Take 2 capsules before sleep with lukewarm water.'
            }),
            new ProductModel({
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
            })
        ];
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    filterProducts(ailment = 'all', dosha = 'all', search = '') {
        return this.products.filter(p => {
            const matchAilment = ailment === 'all' || p.ailment === ailment;
            const matchDosha = dosha === 'all' || p.dosha.includes(dosha) || p.dosha === 'tridosha';
            const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
            return matchAilment && matchDosha && matchSearch;
        });
    }
}
