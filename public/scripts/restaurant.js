document.addEventListener('DOMContentLoaded', async () => {
    // Get restaurantId from URL path or query parameter
    let restaurantId;
    const pathParts = window.location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    if (lastPart && lastPart !== 'restaurant.html' && lastPart !== '') {
        // From path /restaurant/1
        restaurantId = lastPart;
    } else {
        // From query /restaurant.html?restaurantId=1
        const urlParams = new URLSearchParams(window.location.search);
        restaurantId = urlParams.get('restaurantId');
    }
    
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
            addButton.type = 'button';
            addButton.setAttribute('data-item-id', item.ItemID);
            addButton.setAttribute('data-quantity', '1');

            addToCartDiv.appendChild(addButton);
            foodItem.appendChild(addToCartDiv);

            // Attach to DOM
            container.appendChild(foodItem);
        });

        // Event delegation for Add to Cart buttons - more robust than per-button closures
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.food-button');
            if (!btn) return;
            const itemId = btn.getAttribute('data-item-id');
            const qty = parseInt(btn.getAttribute('data-quantity') || '1', 10) || 1;
            if (window && typeof window.addToCart === 'function') {
                window.addToCart({ id: itemId, quantity: qty }).catch(err => console.error('Add to cart failed', err));
            } else if (typeof addToCart === 'function') {
                addToCart({ id: itemId, quantity: qty }).catch(err => console.error('Add to cart failed', err));
            } else {
                console.error('addToCart function not found');
            }
        });
    } catch (error) {
        console.error('Failed to load menu:', error);
        document.getElementById('food-container').innerHTML = '<p>Failed to load menu.</p>';
    }
});