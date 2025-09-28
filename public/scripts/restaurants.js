// Fetch and Display restaurant data table
async function populateRestaurants() {
  const response = await fetch('/api/restaurants'); // Fetch data
  const data = await response.json(); // Parse into JSON

  // Select the <tdbody> element
  const tableBody = document.querySelector('#restaurants-table tbody');
  tableBody.innerHTML = '';

  // Loop the db and populate element
  data.restaurants.forEach(restaurant => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${restaurant.RestaurantID}</td>
      <td>${restaurant.Name}</td>
      <td>${restaurant.Location}</td>
      <td>${restaurant.OperatingHours}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Load restaurant data when page loads
populateRestaurants();
