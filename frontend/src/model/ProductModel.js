export class ProductModel {
    constructor({ id, name, category, ailment, dosha, price, originalPrice, rating, reviewsCount, badge, badgeType, image, ingredients, benefits, dosage }) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.ailment = ailment;
        this.dosha = dosha;
        this.price = price;
        this.originalPrice = originalPrice;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        this.badge = badge;
        this.badgeType = badgeType;
        this.image = image;
        this.ingredients = ingredients;
        this.benefits = benefits;
        this.dosage = dosage;
    }
}
