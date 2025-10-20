const customers = [
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

renderCustomerList();

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
            <button class="modify-button">Modify</button>
        </div>
        `
    })
    document.querySelector('.database-list-content').innerHTML = customerListHTML;
}