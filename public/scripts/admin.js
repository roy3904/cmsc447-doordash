if(sessionStorage.getItem('logged_in') !== 'true'){
    window.location.href = 'admin-login.html';
}
export let customers = [];

export let restaurants = [];

export function setRestaurants(restaurantList){
    restaurants = restaurantList;
}

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

export async function findWorker(id){
    const workerList = await fetchWorkersFromServer();
    for(let i = 0; i < workerList.length; ++i){
        if(workerList[i].WorkerID === id){
            return workerList[i];
        }
    }
    return null;
}

export function changeWorkerName(id, name){
    findWorker(id).Name = name;
}
export function changeWorkerPhone(id, phone){
    findWorker(id).Phone = phone;
}
export function changeWorkerEmail(id, email){
    findWorker(id).Email = email;
}
export function changeWorkerPassword(id, password){
    findCustomer(id).PasswordHash = password;
}
export function changeWorkerHours(id, hours){
    findWorker(id).AvailabilityStatus = hours;
}

export async function removeWorker(id){
    const workerList = await fetchWorkersFromServer();
    for(let i = 0; i < workerList.length; ++i){
        if(workerList[i].WorkerID === id){
            workerList.splice(i, 1);
            break;
        }
    }
}

export function changeRestaurantName(id, name){
    findRestaurant(id).Name = name;
}
export function changeLocation(id, location){
    findRestaurant(id).Location = location;
}
export function changeHours(id, hours){
    findRestaurant(id).OperatingHours = hours;
}

export function findRestaurant(restaurantId){
    console.log(restaurants.length);
    for(let i = 0; i < restaurants.length; i++){
        if(restaurants[i].RestaurantID === restaurantId){
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
export async function fetchWorkersFromServer(){
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
        console.log(w);
        html += `
        <div class="database-item worker-item">
            <p class="worker-name">${w.Name}</p>
            <p class="worker-id">${w.WorkerID}</p>
            <p class="worker-phone">${w.Phone}</p>
            <p class="worker-email">${w.Email}</p>
            <p class="worker-availability">${w.AvailabilityStatus || ''}</p>
            <button class="modify-button js-modify-worker" data-worker-id="${w.WorkerID}">Modify</button>
        </div>
        `;
    });
    document.querySelector('.js-worker-list-content').innerHTML = html || '<p class="not-found-text">No workers</p>';

    const modifyButtons = document.querySelectorAll('.js-modify-worker');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const workerId = button.dataset.workerId;
            window.location.href = `worker-info.html?id=${workerId}`
        });
    });
}

// Application state
const appState = {
    search: '',
    status: 'Pending',
    sortBy: 'SubmittedAt',
    sortOrder: 'DESC',
    page: 1,
    limit: 10,
    selectedApps: new Set()
};

async function fetchApplications(){
    try{
        const params = new URLSearchParams({
            search: appState.search,
            status: appState.status,
            sortBy: appState.sortBy,
            sortOrder: appState.sortOrder,
            limit: appState.limit,
            offset: (appState.page - 1) * appState.limit
        });
        const resp = await fetch(`/api/worker-applications?${params}`);
        if(!resp.ok) return { applications: [], total: 0 };
        const data = await resp.json();
        return data;
    }catch(e){ console.error(e); return { applications: [], total: 0 }; }
}

async function renderApplications(){
    const data = await fetchApplications();
    const apps = data.applications || [];
    const total = data.total || 0;
    const totalPages = Math.ceil(total / appState.limit);

    let html = `
        <div style="margin-bottom:1rem;">
            <input type="text" class="js-app-search" placeholder="Search by name, email, or ID" value="${appState.search}" style="width:250px;padding:6px;margin-right:8px;">
            <select class="js-app-status-filter" style="padding:6px;margin-right:8px;">
                <option value="">All Status</option>
                <option value="Pending" ${appState.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Approved" ${appState.status === 'Approved' ? 'selected' : ''}>Approved</option>
                <option value="Declined" ${appState.status === 'Declined' ? 'selected' : ''}>Declined</option>
            </select>
            <select class="js-app-sort" style="padding:6px;margin-right:8px;">
                <option value="SubmittedAt-DESC" ${appState.sortBy === 'SubmittedAt' && appState.sortOrder === 'DESC' ? 'selected' : ''}>Newest First</option>
                <option value="SubmittedAt-ASC" ${appState.sortBy === 'SubmittedAt' && appState.sortOrder === 'ASC' ? 'selected' : ''}>Oldest First</option>
                <option value="Name-ASC" ${appState.sortBy === 'Name' && appState.sortOrder === 'ASC' ? 'selected' : ''}>Name (A-Z)</option>
                <option value="Name-DESC" ${appState.sortBy === 'Name' && appState.sortOrder === 'DESC' ? 'selected' : ''}>Name (Z-A)</option>
                <option value="Status-ASC" ${appState.sortBy === 'Status' && appState.sortOrder === 'ASC' ? 'selected' : ''}>Status (A-Z)</option>
            </select>
            <button class="js-bulk-approve" style="padding:6px 12px;margin-right:4px;background:#2b6cb0;color:white;border:none;border-radius:4px;cursor:pointer;">Bulk Approve</button>
            <button class="js-bulk-decline" style="padding:6px 12px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;">Bulk Decline</button>
        </div>
    `;

    if(!apps.length){
        html += '<p>No applications found</p>';
    } else {
        apps.forEach(a => {
            const isSelected = appState.selectedApps.has(a.ApplicationID);
            html += `
            <div class="database-item app-item" style="position:relative;padding-left:40px;">
                <input type="checkbox" class="js-app-checkbox" data-app-id="${a.ApplicationID}" ${isSelected ? 'checked' : ''} style="position:absolute;left:10px;top:50%;transform:translateY(-50%);">
                <p class="worker-name">${a.Name}</p>
                <p class="worker-id">${a.WorkerID}</p>
                <p class="worker-email">${a.Email}</p>
                <p class="worker-availability">${a.Availability || ''}</p>
                <p style="font-weight:bold;color:${a.Status==='Pending'?'#f59e0b':a.Status==='Approved'?'#10b981':'#ef4444'}">${a.Status}</p>
                <div style="margin-top:8px;">
                    <button class="js-edit-app" data-app-id="${a.ApplicationID}" style="margin-right:4px;">Edit</button>
                    ${a.Status === 'Pending' ? `
                        <button class="approve js-approve" data-app-id="${a.ApplicationID}">Approve</button>
                        <button class="decline js-decline" data-app-id="${a.ApplicationID}">Decline</button>
                    ` : ''}
                </div>
            </div>
            `;
        });

        // Pagination
        html += `<div style="margin-top:1rem;display:flex;align-items:center;gap:8px;">
            <button class="js-prev-page" ${appState.page === 1 ? 'disabled' : ''} style="padding:6px 12px;cursor:${appState.page === 1 ? 'not-allowed' : 'pointer'};">Previous</button>
            <span>Page ${appState.page} of ${totalPages || 1} (${total} total)</span>
            <button class="js-next-page" ${appState.page >= totalPages ? 'disabled' : ''} style="padding:6px 12px;cursor:${appState.page >= totalPages ? 'not-allowed' : 'pointer'};">Next</button>
        </div>`;
    }

    document.querySelector('.js-worker-apps-content').innerHTML = html;

    // Attach event listeners
    document.querySelector('.js-app-search')?.addEventListener('input', (e) => {
        appState.search = e.target.value;
        appState.page = 1;
        renderApplications();
    });

    document.querySelector('.js-app-status-filter')?.addEventListener('change', (e) => {
        appState.status = e.target.value;
        appState.page = 1;
        renderApplications();
    });

    document.querySelector('.js-app-sort')?.addEventListener('change', (e) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        appState.sortBy = sortBy;
        appState.sortOrder = sortOrder;
        appState.page = 1;
        renderApplications();
    });

    document.querySelector('.js-prev-page')?.addEventListener('click', () => {
        if(appState.page > 1) {
            appState.page--;
            renderApplications();
        }
    });

    document.querySelector('.js-next-page')?.addEventListener('click', () => {
        if(appState.page < totalPages) {
            appState.page++;
            renderApplications();
        }
    });

    // Checkbox handlers
    document.querySelectorAll('.js-app-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const appId = e.target.dataset.appId;
            if(e.target.checked) {
                appState.selectedApps.add(appId);
            } else {
                appState.selectedApps.delete(appId);
            }
        });
    });

    // Bulk approve
    document.querySelector('.js-bulk-approve')?.addEventListener('click', async () => {
        if(appState.selectedApps.size === 0) {
            alert('Please select applications to approve');
            return;
        }
        if(!confirm(`Approve ${appState.selectedApps.size} application(s)?`)) return;

        try {
            for(const appId of appState.selectedApps) {
                await fetch(`/api/worker-applications/${encodeURIComponent(appId)}/approve`, { method: 'POST' });
            }
            appState.selectedApps.clear();
            await renderApplications();
            const workers = await fetchWorkersFromServer(); renderWorkerList(workers);
            alert('Applications approved successfully');
        } catch(e) {
            alert('Failed to approve some applications');
            console.error(e);
        }
    });

    // Bulk decline
    document.querySelector('.js-bulk-decline')?.addEventListener('click', async () => {
        if(appState.selectedApps.size === 0) {
            alert('Please select applications to decline');
            return;
        }
        if(!confirm(`Decline ${appState.selectedApps.size} application(s)?`)) return;

        try {
            for(const appId of appState.selectedApps) {
                await fetch(`/api/worker-applications/${encodeURIComponent(appId)}/decline`, { method: 'POST' });
            }
            appState.selectedApps.clear();
            await renderApplications();
            alert('Applications declined successfully');
        } catch(e) {
            alert('Failed to decline some applications');
            console.error(e);
        }
    });

    // Individual approve/decline
    document.querySelectorAll('.js-approve').forEach(btn => {
        btn.addEventListener('click', async () => {
            const appId = btn.dataset.appId;
            if(!appId) return;
            try{
                const resp = await fetch(`/api/worker-applications/${encodeURIComponent(appId)}/approve`, { method: 'POST' });
                if(!resp.ok) throw new Error('Failed to approve');
                await renderApplications();
                const workers = await fetchWorkersFromServer(); renderWorkerList(workers);
                alert('Application approved successfully');
            }catch(e){ alert('Failed to approve: ' + e.message); console.error(e); }
        });
    });

    document.querySelectorAll('.js-decline').forEach(btn => {
        btn.addEventListener('click', async () => {
            const appId = btn.dataset.appId;
            if(!appId) return;
            try{
                const resp = await fetch(`/api/worker-applications/${encodeURIComponent(appId)}/decline`, { method: 'POST' });
                if(!resp.ok) throw new Error('Failed to decline');
                await renderApplications();
                alert('Application declined successfully');
            }catch(e){ alert('Failed to decline: ' + e.message); console.error(e); }
        });
    });

    // Edit handlers - redirect to dedicated page
    document.querySelectorAll('.js-edit-app').forEach(btn => {
        btn.addEventListener('click', () => {
            const appId = btn.dataset.appId;
            window.location.href = `worker-application-info.html?id=${appId}`;
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

