const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

let currCustomer = null;

async function fetchCustomer() {
    try {
        const response = await fetch(`/api/customers/${userId}`);
        const data = await response.json();
        currCustomer = data.customer;
        renderCustomerInfo();
    } catch (error) {
        console.error('Failed to fetch customer:', error);
        currCustomer = null;
        renderCustomerInfo();
    }
}

async function updateCustomer(updates) {
    try {
        const response = await fetch(`/api/customers/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update');
        await fetchCustomer();
    } catch (error) {
        console.error('Failed to update customer:', error);
        alert('Failed to update customer');
    }
}

async function deleteCustomer() {
    try {
        const response = await fetch(`/api/customers/${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete');
        window.location.href = "admin.html";
    } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Failed to delete customer');
    }
}

function renderCustomerInfo(){
    let customerInfoHTML = '';

    if(currCustomer === null){
        customerInfoHTML = '<p class="invalid-message">This is an empty customer page!</p>';
    }
    else{
        customerInfoHTML += `
            <div class="info-header">

                <div class="info-header-leftside">
                    <img class="profile-picture" src="./images/retriever-profile-picture.png">
                    <p class="title-name">${currCustomer.Name}</p>
                </div>

                <button class="delete-user-button">Delete User</button>

            </div>
            <div class="info-body js-customer-info-body">
                <div class="entity-info js-id-info">
                    <p class="entity-info-text js-id-text">ID: ${currCustomer.CustomerID}</p>
                </div>
                <div class="entity-info js-name-info">
                    <p class="entity-info-text js-name-text">Name: ${currCustomer.Name}</p>
                    <button class="entity-edit-button js-edit-name-button">Edit</button>
                </div>
                <div class="entity-info js-phone-info">
                    <p class="entity-info-text js-phone-text">Phone: ${currCustomer.Phone}</p>
                    <button class="entity-edit-button js-edit-phone-button">Edit</button>
                </div>
                <div class="entity-info js-email-info">
                    <p class="entity-info-text js-email-text">Email: ${currCustomer.Email}</p>
                    <button class="entity-edit-button js-edit-email-button">Edit</button>
                </div>
                <div class="entity-info js-password-info">
                    <p class="entity-info-text js-password-text">Password: ${currCustomer.PasswordHash}</p>
                    <button class="entity-edit-button js-edit-password-button">Edit</button>
                </div>
            </div>
        `
    }

    document.querySelector('.js-customer-info-container').innerHTML = customerInfoHTML;

    renderButtons();

}

function renderButtons(){
    document.querySelector('.delete-user-button').addEventListener('click', () => {
        document.querySelector('.delete-confirm-window').classList.remove('hidden');
    })

    document.querySelector('.js-delete-deny-button').addEventListener('click', () => {
        document.querySelector('.delete-confirm-window').classList.add('hidden');
    })

    document.querySelector('.js-delete-accept-button').addEventListener('click', () => {
        deleteCustomer();
    })

    document.querySelector('.js-name-info').addEventListener('click', (event) => {
        //console.log(event.target.classList);
        if(event.target.classList.contains('js-edit-name-button')){
            document.querySelector('.js-name-info').innerHTML = `
            <div class="enter-input-container">
                <p class="customer-info-text js-name-text">Name: </p>
                <input class="info-input js-name-input" placeholder="Enter New Name">
            </div>
            <div class="edit-buttons js-edit-name-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderCustomerInfo();
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            updateCustomer({ Name: document.querySelector('.js-name-input').value });
        }
    });

    document.querySelector('.js-phone-info').addEventListener('click', (event) => {
        //(event.target.classList);
        if(event.target.classList.contains('js-edit-phone-button')){
            document.querySelector('.js-phone-info').innerHTML = `
            <div class="enter-input-container">
                <p class="customer-info-text js-phone-text">Phone: </p>
                <input class="info-input js-phone-input" type="tel" placeholder="Enter New Phone" maxlength="12" pattern="[0-9]">
            </div>
            <div class="edit-buttons js-edit-phone-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;

        document.querySelector('.js-phone-input').addEventListener('keyup', (event) => {
            
            let input = document.querySelector('.js-phone-input').value;
            

            if((input.length === 3 || input.length === 7) && event.key !== 'Backspace'){
                input += '-';
            }
            else if(input.length === 4  && input[3] !== '-'){
                input = input.slice(0, 3) + '-' + input.slice(3);
            }
            else if(input.length === 8 && input[7] !== '-'){
                input = input.slice(0, 7) + '-' + input.slice(7);
            }
            for(let i = 0; i < input.length; i++){
                if(input[i] === '-' && (i !== 3 && i !== 7)){
                    input = input.slice(0, i) + input.slice(i + 1);
                }
            }
            document.querySelector('.js-phone-input').value = input.replace(/[^0-9-]/g, '');
        });
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderCustomerInfo();
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            if(document.querySelector('.js-phone-input').value.length !== 12){
                document.querySelector('.js-edit-phone-buttons').innerHTML = `
                    <p class="error-text">Phone Number is Invalid Length.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `
            }
            else{
                updateCustomer({ Phone: document.querySelector('.js-phone-input').value });
            }
        }
    });

    document.querySelector('.js-email-info').addEventListener('click', (event) => {
        
        if(event.target.classList.contains('js-edit-email-button')){
            document.querySelector('.js-email-info').innerHTML = `
            <div class="enter-input-container">
                <p class="customer-info-text js-email-text">Email: </p>
                <input type="email" class="info-input js-email-input" placeholder="Enter New Email">
            </div>
            <div class="edit-buttons js-edit-email-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderCustomerInfo();
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            const input = document.querySelector('.js-email-input').value;
            const emailVerifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(emailVerifier.test(input)){
                updateCustomer({ Email: document.querySelector('.js-email-input').value });
            }
            else{
                document.querySelector('.js-edit-email-buttons').innerHTML = `
                    <p class="error-text">Email is Invalid.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `
            }

        }
    });

    document.querySelector('.js-password-info').addEventListener('click', (event) => {
        
        if(event.target.classList.contains('js-edit-password-button')){
            document.querySelector('.js-password-info').innerHTML = `
            <div class="enter-input-container">
                <p class="customer-info-text js-password-text">Password: </p>
                <input class="info-input js-password-input" placeholder="Enter New Password">
            </div>
            <div class="edit-buttons js-edit-password-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderCustomerInfo();
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            const input = document.querySelector('.js-password-input').value;

            if(input.length < 8){
                document.querySelector('.js-edit-password-buttons').innerHTML = `
                    <p class="error-text">Password Must Contain at Least 8 Characters.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `
            }
            else if(input.includes(' ')){
                document.querySelector('.js-edit-password-buttons').innerHTML = `
                    <p class="error-text">Password Can't Contain Any Spaces.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `
            }
            else{
                updateCustomer({ PasswordHash: document.querySelector('.js-password-input').value });
            }
        }
    });
}

fetchCustomer();



