            document.addEventListener('DOMContentLoaded', async () => {
                try {
                    // Fetch list of restaurants from API
                    const response = await fetch('/api/restaurants');
                    const { restaurants } = await response.json();
                    const container = document.getElementById('restaurants-container');

                    // Render each restaurant block
                    restaurants.forEach(restaurant => {
                        const restaurantItem = document.createElement('div');
                        restaurantItem.className = 'restaurant-item';

                        // Create logo image
                        const restaurantImg = document.createElement('img');
                        restaurantImg.className = 'restaurant-img';
                        
                        // Create container for name + button
                        const restaurantInfo = document.createElement('div');
                        restaurantInfo.className = 'restaurant-info';

                        // Show restaurant name
                        const restaurantName = document.createElement('p');
                        restaurantName.className = 'restaurant-name';
                        restaurantName.textContent = restaurant.Name;
                        restaurantInfo.appendChild(restaurantName);

                        // Find image folder path based on restaurant name
                        const folderName = restaurant.Name.replaceAll(' ', '-');
                        restaurantImg.src = `images/${folderName}/logo.png`;
                        restaurantImg.alt = `${restaurant.Name} Logo`;

                        restaurantItem.appendChild(restaurantImg);

                        // Create "pick restaurant" button
                        const restaurantButton = document.createElement('button');
                        restaurantButton.className = 'restaurant-button';
                        restaurantButton.textContent = 'Pick Restaurant';

                        // Redirect to restaurant menu page on click
                        restaurantButton.addEventListener('click', () => {
                            window.location.href = `restaurant.html?restaurantId=${restaurant.RestaurantID}`;
                        });

                        // Append button + info
                        restaurantInfo.appendChild(restaurantButton);
                        restaurantItem.appendChild(restaurantInfo);

                        // Add to container
                        container.appendChild(restaurantItem);
                    });
                } catch (error) {
                    // Fallback
                    console.error('Failed to load restaurants:', error);
                    const container = document.getElementById('restaurants-container');
                    container.textContent = 'Failed to load restaurants.';
                }
            });