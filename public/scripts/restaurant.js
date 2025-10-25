document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurantId');

    if (!restaurantId) {
        document.getElementById('food-container').innerHTML = '<p>Restaurant not found.</p>';
        return;
    }

    try {
        // Fetch restaurant details to get the name
        const restaurantsResponse = await fetch('/api/restaurants');
        const { restaurants } = await restaurantsResponse.json();
        const restaurant = restaurants.find(r => r.RestaurantID === restaurantId);

        if (restaurant) {
            document.getElementById('restaurant-name').textContent = restaurant.Name;
            document.title = restaurant.Name + ' | Gritdash';
        } else {
            document.getElementById('restaurant-name').textContent = 'Restaurant Not Found';
        }

        // Fetch menu items
        const menuResponse = await fetch(`/api/restaurants/${restaurantId}/menu`);
        const { menuItems } = await menuResponse.json();
        const container = document.getElementById('food-container');

        if (menuItems.length === 0) {
            container.innerHTML = '<p>No menu items available for this restaurant.</p>';
            return;
        }

        menuItems.forEach(item => {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';

            const foodDescription = document.createElement('div');
            foodDescription.className = 'food-description';

            const foodName = document.createElement('p');
            foodName.className = 'food-name';
            foodName.textContent = item.Name;
            foodDescription.appendChild(foodName);

            const foodImg = document.createElement('img');
            foodImg.className = 'food-img';

            foodImg.src = `../images/${item.ImageFile}`;
            foodImg.alt = item.Name;

            foodItem.appendChild(foodImg);

            const foodCost = document.createElement('p');
            foodCost.className = 'food-cost';
            foodCost.textContent = `$${item.Price.toFixed(2)}`;
            foodDescription.appendChild(foodCost);

            foodItem.appendChild(foodDescription);

            const addToCartDiv = document.createElement('div');
            addToCartDiv.className = 'add-to-cart';

            const addButton = document.createElement('button');
            addButton.className = 'food-button';
            addButton.textContent = 'Add to Cart';
            addButton.addEventListener('click', () => {
                if(typeof addToCart === 'function'){
                    addToCart({ restaurant: restaurant.Name, name: item.Name, price: item.Price, quantity: 1 });
                } else {
                    // Fallback
                    const CART_KEY = 'cart';
                    try{ const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); cart.push({ restaurant: restaurant.Name, name: item.Name, price: item.Price, quantity:1 }); localStorage.setItem(CART_KEY, JSON.stringify(cart)); window.dispatchEvent(new Event('cart_updated')); }catch(e){}
                }
            });

            addToCartDiv.appendChild(addButton);
            foodItem.appendChild(addToCartDiv);
            container.appendChild(foodItem);
        });
    } catch (error) {
        console.error('Failed to load menu:', error);
        document.getElementById('food-container').innerHTML = '<p>Failed to load menu.</p>';
    }
});