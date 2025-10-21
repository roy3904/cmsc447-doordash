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
            <button class="modify-button" data-user-id="${id}">Modify</button>
        </div>
        `
    })
    document.querySelector('.database-list-content').innerHTML = customerListHTML;

    const modifyButtons = document.querySelectorAll('.modify-button');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            window.location.href = `customer-info.html?id=${userId}`
        });
    });
}

function searchCustomerList(){
    let customerListHTML = '';

    const input = searchInput.value;
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
            <button class="modify-button" data-user-id="${id}">Modify</button>
        </div>
        `
        }
    })
    
    if(customerListHTML === ''){
        customerListHTML = '<p class="not-found-text">Sorry, there were no students found with that information!</p>'
    }
    document.querySelector('.database-list-content').innerHTML = customerListHTML;

    const modifyButtons = document.querySelectorAll('.modify-button');
    modifyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            window.location.href = `customer-info.html?id=${userId}`
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

export function changeName(id, name){
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

if(window.location.href.includes('admin.html')){
    renderCustomerList();
    const searchInput = document.querySelector('.search');
    searchInput.addEventListener('keyup', (event) => {
        if(event.key === 'Enter'){
            searchCustomerList();
        }
        else if(event.key === 'Backspace' && searchInput.value.length > 0){
            searchCustomerList();
        }
        else if(event.key === 'Backspace' && searchInput.value.length === 0){
            renderCustomerList();
        }
    });

    document.querySelector('.search-button').addEventListener('click', () => {
        searchCustomerList();
});
}

