export const customers = [
    {
        name: "Joe Biden",
        id: "123456",
        phone: "123-456-7890",
        email: "jbiden1@umbc.edu",
        password: "encrypted-password",
    }, 
    {
        name: "Donald Trump",
        id: "987654",
        phone: "492-958-3984",
        email: "dtrump1@umbc.edu",
        password: "encrypted-password",
    }, 
    {
        name: "Barack Obama",
        id: "024681",
        phone: "948-391-8347",
        email: "bobama1@umbc.edu",
        password: "encrypted-password",
    } 
];

export let restaurants = [];

async function fetchRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        const data = await response.json();
        restaurants = data.restaurants;
        renderRestaurantList();
    } catch (error) {
        console.error('Failed to fetch restaurants:', error);
    }
}

function renderCustomerList(){
    let customerListHTML = '';
    customers.forEach((customer) => {
        const name = customer.name;
        const id = customer.id;
        const phone = customer.phone;
        const email = customer.email;
        const password = customer.password;

        customerListHTML += `
        <div class="database-item student-item">
            <p class="customer-name">${name}</p>
            <p class="customer-ID">${id}</p>
            <p class="customer-phone">${phone}</p>
            <p class="customer-email">${email}</p>
            <p class="password">${password}</p>
            <button class="modify-button js-modify-customer" data-user-id="${id}">Modify</button>
        </div>
        `
    })
    document.querySelector('.js-customer-list-content').innerHTML = customerListHTML;

    const modifyButtons = document.querySelectorAll('.js-modify-customer');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            window.location.href = `customer-info.html?id=${userId}`
        });
    });
}

function renderRestaurantList(){
    let restaurantListHTML = '';
    restaurants.forEach((restaurant) => {
        const name = restaurant.name;
        const id = restaurant.id;
        const location = restaurant.location;
        const hours = restaurant.hours;

        restaurantListHTML += `
        <div class="database-item restaurant-item">
            <p class="restaurant-name">${name}</p>
            <p class="restaurant-ID">${id}</p>
            <p class="restaurant-location">${location}</p>
            <p class="restaurant-hours">${hours}</p>
            <button class="modify-button js-modify-restaurant" data-restaurant-id="${id}">Modify</button>
        </div>
        `
    })
    document.querySelector('.js-restaurant-list-content').innerHTML = restaurantListHTML;

    const modifyButtons = document.querySelectorAll('.js-modify-restaurant');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const restaurantId = button.dataset.restaurantId;
            window.location.href = `restaurant-info.html?id=${restaurantId}`
        });
    });
}

function searchCustomerList(){
    let customerListHTML = '';

    const input = document.querySelector('.js-search-customers').value;
    customers.forEach((customer) => {
        const name = customer.name;
        const id = customer.id;
        const phone = customer.phone;
        const email = customer.email;
        const password = customer.password;

        if(name.toLowerCase().includes(input.toLowerCase()) || id.toLowerCase().includes(input.toLowerCase())){
            customerListHTML += `
        <div class="database-item student-item">
            <p class="customer-name">${name}</p>
            <p class="customer-ID">${id}</p>
            <p class="customer-phone">${phone}</p>
            <p class="customer-email">${email}</p>
            <p class="password">${password}</p>
            <button class="modify-button js-modify-customer" data-user-id="${id}">Modify</button>
        </div>
        `
        }
    })
    
    if(customerListHTML === ''){
        customerListHTML = '<p class="not-found-text">Sorry, there were no users found with that information!</p>'
    }
    document.querySelector('.js-customer-list-content').innerHTML = customerListHTML;

    const modifyButtons = document.querySelectorAll('.js-modify-customer');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            window.location.href = `customer-info.html?id=${userId}`
        });
    });
}

function searchRestaurantList(){
    let customerListHTML = '';

    const input = document.querySelector('.js-search-restaurants').value;
    restaurants.forEach((restaurant) => {
        const name = restaurant.name;
        const id = restaurant.id;
        const location = restaurant.location;
        const hours = restaurant.hours;

        if(name.toLowerCase().includes(input.toLowerCase()) || id.toLowerCase().includes(input.toLowerCase())){
            customerListHTML += `
        <div class="database-item restaurant-item">
            <p class="restaurant-name">${name}</p>
            <p class="restaurant-ID">${id}</p>
            <p class="restaurant-location">${location}</p>
            <p class="restaurant-hours">${hours}</p>
            <button class="modify-button js-modify-restaurant" data-restaurant-id="${id}">Modify</button>
        </div>
        `
        }
    })
    
    if(customerListHTML === ''){
        customerListHTML = '<p class="not-found-text">Sorry, there were no restaurants found with that information!</p>'
    }
    document.querySelector('.js-restaurant-list-content').innerHTML = customerListHTML;

    const modifyButtons = document.querySelectorAll('.js-modify-restaurant');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            window.location.href = `restaurant-info.html?id=${userId}`
        });
    });
}

export function findCustomer(customerId){
    for(let i = 0; i < customers.length; i++){
        if(customers[i].id === customerId){
            return customers[i];
        }
    }
    return null;
}

export function changeCustomerName(id, name){
    findCustomer(id).name = name;
}
export function changePhone(id, phone){
    findCustomer(id).phone = phone;
}
export function changeEmail(id, email){
    findCustomer(id).email = email;
}
export function changePassword(id, password){
    findCustomer(id).password = password;
}

export function removeCustomer(id){
    for(let i = 0; i < customers.length; i++){
        if(customers[i].id === id){
            customers.splice(i, 1);
            break;
        }
    }
}

export function changeRestaurantName(id, name){
    findRestaurant(id).name = name;
}
export function changeLocation(id, location){
    findRestaurant(id).location = location;
}
export function changeHours(id, hours){
    findRestaurant(id).hours = hours;
}

export function findRestaurant(restaurantId){
    for(let i = 0; i < restaurants.length; i++){
        if(restaurants[i].id === restaurantId){
            return restaurants[i];
        }
    }
    return null;
}

export function removeRestaurant(id){
    for(let i = 0; i < restaurants.length; i++){
        if(restaurants[i].id === id){
            restaurants.splice(i, 1);
            break;
        }
    }
}

if(window.location.href.includes('admin.html')){
    renderCustomerList();
    renderRestaurantList();
    const customerSearchInput = document.querySelector('.js-search-customers');
    customerSearchInput.addEventListener('keyup', (event) => {
        if(event.key === 'Enter'){
            searchCustomerList();
        }
        else if(event.key === 'Backspace' && customerSearchInput.value.length > 0){
            searchCustomerList();
        }
        else if(event.key === 'Backspace' && customerSearchInput.value.length === 0){
            renderCustomerList();
        }
    });

    const RestaurantSearchInput = document.querySelector('.js-search-restaurants');
    RestaurantSearchInput.addEventListener('keyup', (event) => {
        if(event.key === 'Enter'){
            searchRestaurantList();
        }
        else if(event.key === 'Backspace' && RestaurantSearchInput.value.length > 0){
            searchRestaurantList();
        }
        else if(event.key === 'Backspace' && RestaurantSearchInput.value.length === 0){
            searchRestaurantList();
        }
    });

    document.querySelector('.js-search-customer-button').addEventListener('click', () => {
        searchCustomerList();
    });

    document.querySelector('.js-search-restaurant-button').addEventListener('click', () => {
        searchRestaurantList();
    });
}

