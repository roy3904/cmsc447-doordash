// Sample restaurant and food data
const restaurantsData = {
    restaurants: [
        {
            id: 1,
            name: "True Grits",
            category: "American",
            image: "images/restaurant-placeholder.jpg",
            menu: [
                { id: 101, name: "Classic Burger", price: 8.99, description: "Beef burger with lettuce, tomato, and cheese" },
                { id: 102, name: "Chicken Sandwich", price: 7.99, description: "Grilled chicken with mayo and lettuce" },
                { id: 103, name: "Fries", price: 3.99, description: "Crispy golden fries" },
                { id: 104, name: "Soda", price: 1.99, description: "Fountain drink" }
            ]
        },
        {
            id: 2,
            name: "Chick-fil-A",
            category: "Fast Food",
            image: "images/restaurant-placeholder.jpg",
            menu: [
                { id: 201, name: "Chicken Sandwich", price: 6.99, description: "Original chicken sandwich" },
                { id: 202, name: "Nuggets (8 count)", price: 5.99, description: "8 piece chicken nuggets" },
                { id: 203, name: "Waffle Fries", price: 2.99, description: "Signature waffle fries" },
                { id: 204, name: "Lemonade", price: 2.49, description: "Fresh squeezed lemonade" }
            ]
        },
        {
            id: 3,
            name: "Panda Express",
            category: "Chinese",
            image: "images/restaurant-placeholder.jpg",
            menu: [
                { id: 301, name: "Orange Chicken", price: 9.99, description: "Crispy chicken in orange sauce" },
                { id: 302, name: "Beef & Broccoli", price: 10.99, description: "Tender beef with fresh broccoli" },
                { id: 303, name: "Fried Rice", price: 4.99, description: "Classic fried rice" },
                { id: 304, name: "Spring Rolls", price: 3.99, description: "Vegetable spring rolls" }
            ]
        },
        {
            id: 4,
            name: "Starbucks",
            category: "Coffee",
            image: "images/restaurant-placeholder.jpg",
            menu: [
                { id: 401, name: "Caffe Latte", price: 4.95, description: "Espresso with steamed milk" },
                { id: 402, name: "Iced Coffee", price: 3.95, description: "Cold brewed coffee" },
                { id: 403, name: "Breakfast Sandwich", price: 5.95, description: "Egg, cheese, and bacon" },
                { id: 404, name: "Muffin", price: 3.25, description: "Fresh baked muffin" }
            ]
        }
    ]
};

// Cart management
let cart = [];

function addToCart(restaurantId, item) {
    const restaurant = restaurantsData.restaurants.find(r => r.id === restaurantId);
    cart.push({
        restaurantId: restaurantId,
        restaurantName: restaurant.name,
        item: item
    });
    updateCartDisplay();
    saveCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    saveCart();
}

function getCart() {
    return cart;
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    saveCart();
}

function getCartTotal() {
    return cart.reduce((total, item) => total + item.item.price, 0);
}

function saveCart() {
    localStorage.setItem('gritdash-cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('gritdash-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// Initialize cart on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', loadCart);
}
