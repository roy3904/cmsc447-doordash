export let customers = [];

export let restaurants = [];

async function fetchCustomers() {
    try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        customers = data.customers;
        renderCustomerList();
    } catch (error) {
        console.error('Failed to fetch customers:', error);
        customers = [];
    }
}

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
        const name = customer.Name;
        const id = customer.CustomerID;
        const phone = customer.Phone;
        const email = customer.Email;
        const password = customer.PasswordHash;

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
        const name = restaurant.Name;
        const id = restaurant.RestaurantID;
        const location = restaurant.Location;
        const hours = restaurant.OperatingHours;

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
        const name = customer.Name;
        const id = customer.CustomerID;
        const phone = customer.Phone;
        const email = customer.Email;
        const password = customer.PasswordHash;

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
    let restaurantListHTML = '';

    const input = document.querySelector('.js-search-restaurants').value;
    restaurants.forEach((restaurant) => {
        const name = restaurant.Name;
        const id = restaurant.RestaurantID;
        const location = restaurant.Location;
        const hours = restaurant.OperatingHours;

        if(name.toLowerCase().includes(input.toLowerCase()) || id.toLowerCase().includes(input.toLowerCase())){
            restaurantListHTML += `
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
    
    if(restaurantListHTML === ''){
        restaurantListHTML = '<p class="not-found-text">Sorry, there were no restaurants found with that information!</p>'
    }
    document.querySelector('.js-restaurant-list-content').innerHTML = restaurantListHTML;

    const modifyButtons = document.querySelectorAll('.js-modify-restaurant');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const restaurantId = button.dataset.restaurantId;
            window.location.href = `restaurant-info.html?id=${restaurantId}`
        });
    });
}

export function findCustomer(customerId){
    for(let i = 0; i < customers.length; i++){
        if(customers[i].CustomerID === customerId){
            return customers[i];
        }
    }
    return null;
}

export function changeCustomerName(id, name){
    findCustomer(id).Name = name;
}
export function changePhone(id, phone){
    findCustomer(id).Phone = phone;
}
export function changeEmail(id, email){
    findCustomer(id).Email = email;
}
export function changePassword(id, password){
    findCustomer(id).PasswordHash = password;
}

export function removeCustomer(id){
    for(let i = 0; i < customers.length; i++){
        if(customers[i].CustomerID === id){
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
    fetchCustomers();
    fetchRestaurants();
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

// Worker management
async function fetchWorkersFromServer(){
    try{
        const resp = await fetch('/api/workers');
        if(!resp.ok) return [];
        const data = await resp.json();
        return data.workers || [];
    }catch(e){ console.error(e); return []; }
}

function renderWorkerList(workers){
    let html = '';
    workers.forEach(w => {
        html += `
        <div class="database-item worker-item">
            <p class="worker-name">${w.Name}</p>
            <p class="worker-id">${w.WorkerID}</p>
            <p class="worker-email">${w.Email}</p>
            <p class="worker-availability">${w.AvailabilityStatus || ''}</p>
                        <div style="margin-top:8px">
                            <button class="modify-button js-delete-worker" data-id="${w.WorkerID}">Delete</button>
                        </div>
        </div>
        `;
    });
    document.querySelector('.js-worker-list-content').innerHTML = html || '<p class="not-found-text">No workers</p>';

    // attach delete handlers
    document.querySelectorAll('.js-delete-worker').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if(!confirm(`Delete worker ${id}? This cannot be undone.`)) return;
            try{
                const resp = await fetch(`/api/workers/${encodeURIComponent(id)}`, { method: 'DELETE' });
                if(!resp.ok) throw new Error('Failed to delete');
                const workers = await fetchWorkersFromServer(); renderWorkerList(workers);
            }catch(e){ alert('Failed to delete worker'); console.error(e); }
        });
    });
}

function renderApplications(){
    const apps = JSON.parse(localStorage.getItem('worker_applications') || '[]');
    if(!apps.length){ document.querySelector('.js-worker-apps-content').innerHTML = '<p>No pending applications</p>'; return; }
    let html = '';
    apps.forEach((a, i) => {
        html += `
        <div class="database-item app-item">
            <p class="worker-name">${a.Name}</p>
            <p class="worker-id">${a.WorkerID}</p>
            <p class="worker-email">${a.Email}</p>
            <p class="worker-availability">${a.Availability || ''}</p>
            <button class="approve js-approve" data-idx="${i}">Approve</button>
            <button class="decline js-decline" data-idx="${i}">Decline</button>
        </div>
        `;
    });
    document.querySelector('.js-worker-apps-content').innerHTML = html;

    document.querySelectorAll('.js-approve').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idx = parseInt(btn.dataset.idx,10);
            const apps = JSON.parse(localStorage.getItem('worker_applications') || '[]');
            const app = apps[idx];
            if(!app) return;
            // send to server to create worker
            try{
                const resp = await fetch('/api/workers', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ WorkerID: app.WorkerID, Name: app.Name, Email: app.Email, Phone: app.Phone, AvailabilityStatus: app.Availability, PasswordHash: app.PasswordHash || '' }) });
                if(!resp.ok) throw new Error('Failed');
                apps.splice(idx,1);
                localStorage.setItem('worker_applications', JSON.stringify(apps));
                renderApplications();
                // refresh worker list
                const workers = await fetchWorkersFromServer(); renderWorkerList(workers);
            }catch(e){ alert('Failed to approve'); console.error(e); }
        });
    });

    document.querySelectorAll('.js-decline').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx,10);
            const apps = JSON.parse(localStorage.getItem('worker_applications') || '[]');
            apps.splice(idx,1);
            localStorage.setItem('worker_applications', JSON.stringify(apps));
            renderApplications();
        });
    });
}

if(window.location.href.includes('admin.html')){
    // load worker list
    fetchWorkersFromServer().then(renderWorkerList).catch(e=>console.error(e));
    renderApplications();
    // search worker input
    const workerSearchInput = document.querySelector('.js-search-workers');
    if(workerSearchInput){
        workerSearchInput.addEventListener('keyup', async (event)=>{
            const q = workerSearchInput.value.trim().toLowerCase();
            const workers = await fetchWorkersFromServer();
            const filtered = workers.filter(w => (w.Name||'').toLowerCase().includes(q) || (w.WorkerID||'').toLowerCase().includes(q));
            renderWorkerList(filtered);
        });
    }
    document.querySelector('.js-search-worker-button').addEventListener('click', async ()=>{
        const q = document.querySelector('.js-search-workers').value.trim().toLowerCase();
        const workers = await fetchWorkersFromServer();
        const filtered = workers.filter(w => (w.Name||'').toLowerCase().includes(q) || (w.WorkerID||'').toLowerCase().includes(q));
        renderWorkerList(filtered);
    });
}

