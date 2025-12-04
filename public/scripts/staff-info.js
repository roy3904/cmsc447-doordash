const params = new URLSearchParams(window.location.search);
const staffId = params.get('id');

let currStaff = null;

async function fetchStaff() {
    try {
        const response = await fetch(`/api/restaurant-staff`);
        const data = await response.json();
        const staffList = data.restaurantStaff;

        for(let i = 0; i < staffList.length; i++){
            if(staffList[i].StaffID === staffId){
                currStaff = staffList[i];
                break;
            }
        }

        renderStaffInfo();

    } catch (error) {
        console.error('Failed to fetch staff:', error);
    }
}

async function updateStaff(updates) {
    try {
        const response = await fetch(`/api/restaurant-staff/${staffId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update');
        await fetchStaff();
    } catch (error) {
        console.error('Failed to update customer:', error);
        alert('Failed to update customer');
    }
}

function renderStaffInfo(){
    let staffInfoHTML = '';

    if(currStaff === null){
        staffInfoHTML = '<p class="invalid-message">This is an empty staff page!</p>';
    }
    else{
        staffInfoHTML += `
            <div class="info-header">

                <div class="info-header-leftside">
                    <img class="profile-picture" src="./images/retriever-profile-picture.png">
                    <p class="title-name">${currStaff.Name}</p>
                </div>

            </div>
            <div class="info-body js-staff-info-body">
                <div class="entity-info js-id-info">
                    <p class="entity-info-text js-id-text">ID: ${currStaff.StaffID}</p>
                </div>
                <div class="entity-info js-name-info">
                    <p class="entity-info-text js-name-text">Name: ${currStaff.Name}</p>
                    <button class="entity-edit-button js-edit-name-button">Edit</button>
                </div>
                <div class="entity-info js-phone-info">
                    <p class="entity-info-text js-phone-text">Phone: ${currStaff.Phone}</p>
                    <button class="entity-edit-button js-edit-phone-button">Edit</button>
                </div>
                <div class="entity-info js-email-info">
                    <p class="entity-info-text js-email-text">Email: ${currStaff.Email}</p>
                    <button class="entity-edit-button js-edit-email-button">Edit</button>
                </div>
            </div>
        `
    }

    document.querySelector('.js-staff-info-container').innerHTML = staffInfoHTML;

    renderButtons();

}

function renderButtons(){
    document.querySelector('.js-name-info').addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-name-button')){
            document.querySelector('.js-name-info').innerHTML = `
            <div class="enter-input-container">
                <p class="staff-info-text js-name-text">Name: </p>
                <input class="info-input js-name-input" placeholder="Enter New Name">
            </div>
            <div class="edit-buttons js-edit-name-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderStaffInfo({ Name: document.querySelector('.js-name-input').value });
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            console.log(document.querySelector('.js-name-input').value);
            updateStaff({ Name: document.querySelector('.js-name-input').value });
        }
    });

    document.querySelector('.js-phone-info').addEventListener('click', (event) => {
        //(event.target.classList);
        if(event.target.classList.contains('js-edit-phone-button')){
            document.querySelector('.js-phone-info').innerHTML = `
            <div class="enter-input-container">
                <p class="staff-info-text js-phone-text">Phone: </p>
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
            renderStaffInfo();
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
                updateStaff({ Phone: document.querySelector('.js-phone-input').value });
            }
        }
    });

    document.querySelector('.js-email-info').addEventListener('click', (event) => {
        
        if(event.target.classList.contains('js-edit-email-button')){
            document.querySelector('.js-email-info').innerHTML = `
            <div class="enter-input-container">
                <p class="staff-info-text js-email-text">Email: </p>
                <input type="email" class="info-input js-email-input" placeholder="Enter New Email">
            </div>
            <div class="edit-buttons js-edit-email-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderStaffInfo();
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            const input = document.querySelector('.js-email-input').value;
            const emailVerifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(emailVerifier.test(input)){
                updateStaff({ Email: document.querySelector('.js-email-input').value });
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
}

fetchStaff();