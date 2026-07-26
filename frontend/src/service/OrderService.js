export class OrderService {
    createOrder(customerDetails, cartItems, totalAmount) {
        return {
            trackingNumber: 'AV-' + Math.floor(100000 + Math.random() * 900000),
            customer: customerDetails,
            items: cartItems,
            total: totalAmount,
            status: 'CONFIRMED',
            date: new Date().toISOString()
        };
    }
}
