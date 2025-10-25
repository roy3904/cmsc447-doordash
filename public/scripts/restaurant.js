document.addEventListener('DOMContentLoaded', async () => {
    // Get restaurantId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurantId');
    
    // Check if Restaurant exists
    if (!restaurantId) {
        document.getElementById('food-container').innerHTML = '<p>Restaurant not found.</p>';
        return;
    }

    try {
        // Fetch restaurant details to get the name
        const restaurantsResponse = await fetch('/api/restaurants');
        const { restaurants } = await restaurantsResponse.json();
        const restaurant = restaurants.find(r => r.RestaurantID === restaurantId);

        // Update Title + Header
        if (restaurant) {
            document.getElementById('restaurant-name').textContent = restaurant.Name;
            document.title = restaurant.Name + ' | Gritdash';

            // TODO: Needs frontend formatting
            const restaurantInfoDiv = document.getElementById('restaurant-info');
            restaurantInfoDiv.innerHTML = `
                <p><b>Location:</b> ${restaurant.Location}</p>
                <p><b>Operating Hours:</b> ${restaurant.OperatingHours}</p>
            `;
        } else {
            document.getElementById('restaurant-name').textContent = 'Restaurant Not Found';
        }

        // Fetch menu items
        const menuResponse = await fetch(`/api/restaurants/${restaurantId}/menu`);
        const { menuItems } = await menuResponse.json();
        const container = document.getElementById('food-container');

        // Placeholder if no menu items
        if (menuItems.length === 0) {
            container.innerHTML = '<p>No menu items available for this restaurant.</p>';
            return;
        }

        // Loop through all items + render them
        menuItems.forEach(item => {
            // Food Item
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';

            // Food Description
            const foodDescription = document.createElement('div');
            foodDescription.className = 'food-description';

            // Food name
            const foodName = document.createElement('p');
            foodName.className = 'food-name';
            foodName.textContent = item.Name;
            foodDescription.appendChild(foodName);

            // Food image
            const foodImg = document.createElement('img');
            foodImg.className = 'food-img';

            // Build image path based on restaurant-name
            const restaurantNamePath = restaurant.Name.replace(/\s+/g, '-');
            // console.log('Restaurant Name:', restaurant.Name);
            // console.log('Restaurant Path:', restaurantNamePath);

            // Image path formatting 
            let imageFilePath;
            if (!item || !item.ImageFile) {
                // Derive filename from item name
                imageFilePath = item.Name.toLowerCase().replace(/\s+/g, '-') + '.png';
                // console.warn('Missing ImageFile, using derived path:', imageFilePath);
            } else {
                imageFilePath = item.ImageFile.toLowerCase();
                // console.log('Original ImageFile:', item.ImageFile);
                // console.log('Lowercased ImageFile:', imageFilePath);
            }

            // Construct image path
            foodImg.src = `../images/${restaurantNamePath}/${imageFilePath}`;
            foodImg.alt = item.Name;

            // console.log('Final Image Source:', foodImg.src);
            // console.log('Image Alt Text:', foodImg.alt);

            // foodImg.onload = () => console.log('Image loaded successfully:', foodImg.src);
            // foodImg.onerror = (err) => console.error('Image failed to load:', foodImg.src, err);

            // Append image + description
            foodItem.appendChild(foodImg);

            // Display price
            const foodCost = document.createElement('p');
            foodCost.className = 'food-cost';
            foodCost.textContent = `$${item.Price.toFixed(2)}`;
            foodDescription.appendChild(foodCost);

            foodItem.appendChild(foodDescription);

            const addToCartDiv = document.createElement('div');
            addToCartDiv.className = 'add-to-cart';

            // Add-To-Cart button
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

            // Attach to DOM
            container.appendChild(foodItem);
        });
    } catch (error) {
        console.error('Failed to load menu:', error);
        document.getElementById('food-container').innerHTML = '<p>Failed to load menu.</p>';
    }
});