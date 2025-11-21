import {findWorker, changeWorkerName, changeWorkerPhone, changeWorkerEmail, changeWorkerPassword, changeWorkerHours, removeWorker} from './admin.js';

const params = new URLSearchParams(window.location.search);
const workerID = params.get('id');

const currWorker = await findWorker(workerID);

function renderWorkerInfo(){

    let workerInfoHTML = '';

    if(currWorker === null){
        workerInfoHTML += '<p class="invalid-message">This is an empty worker page!</p>';
    }
    else{
        workerInfoHTML += `
            <div class="info-header">
                    
                <div class="info-header-leftside">
                    <img class="profile-picture" src="./images/retriever-profile-picture.png">
                    <p class="title-name">${currWorker.Name}</p>
                </div>
                
                <button class="delete-user-button">Delete Worker</button>
                
            </div> 
            <div class="info-body js-restaurant-info-body">
                <div class="entity-info js-id-info">
                    <p class="entity-info-text js-id-text">ID: ${currWorker.WorkerID}</p>
                </div>
                <div class="entity-info js-name-info">
                    <p class="entity-info-text js-name-text">Name: ${currWorker.Name}</p>
                    <button class="entity-edit-button js-edit-name-button">Edit</button>
                </div>
                <div class="entity-info js-phone-info">
                    <p class="entity-info-text js-phone-text">Phone: ${currWorker.Phone}</p>
                    <button class="entity-edit-button js-edit-phone-button">Edit</button>
                </div>
                <div class="entity-info js-email-info">
                    <p class="entity-info-text js-hours-text">Email: ${currWorker.Email}</p>
                    <button class="entity-edit-button js-edit-email-button">Edit</button>
                </div>
                <div class="entity-info js-password-info">
                    <p class="entity-info-text js-hours-text">Password: ${currWorker.PasswordHash}</p>
                    <button class="entity-edit-button js-edit-password-button">Edit</button>
                </div>
                <div class="entity-info js-hours-info">
                    <p class="entity-info-text js-hours-text">Availability: ${currWorker.AvailabilityStatus}</p>
                    <button class="entity-edit-button js-edit-hours-button">Edit</button>
                </div>
            </div>
        `;
    }
    document.querySelector('.js-worker-info-container').innerHTML = workerInfoHTML;

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
        removeWorker(workerID);
        window.location.href="admin.html";
    })

    document.querySelector('.js-name-info').addEventListener('click', (event) => {
        console.log(event.target.classList);
        if(event.target.classList.contains('js-edit-name-button')){
            document.querySelector('.js-name-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-name-text">Name: </p>
                <input class="info-input js-name-input" placeholder="Enter New Name">
            </div>
            <div class="edit-buttons js-edit-name-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderWorkerInfo();
        }
        
        if(event.target.classList.contains('js-confirm-edit-button')){
            changeWorkerName(workerID, document.querySelector('.js-name-input').value);
            renderWorkerInfo();
        }
    });

    document.querySelector('.js-phone-info').addEventListener('click', (event) => {
        console.log(event.target.classList);
        if(event.target.classList.contains('js-edit-phone-button')){
            document.querySelector('.js-phone-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-phone-text">Phone: </p>
                <input class="info-input js-phone-input" placeholder="Enter New Phone">
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
            renderWorkerInfo();
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
                changeWorkerPhone(workerId, document.querySelector('.js-phone-input').value);
                renderWorkerInfo();
            }
        }
    });

    document.querySelector('.js-email-info').addEventListener('click', (event) => {
        
        if(event.target.classList.contains('js-edit-email-button')){
            document.querySelector('.js-email-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-email-text">Email: </p>
                <input class="info-input js-email-input" placeholder="Enter New Email">
            </div>
            <div class="edit-buttons js-edit-email-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderWorkerInfo();
        }
        
        if(event.target.classList.contains('js-confirm-edit-button')){
            const input = document.querySelector('.js-email-input').value;
            const emailVerifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(emailVerifier.test(input)){
                changeEmail(userId, document.querySelector('.js-email-input').value);
                renderCustomerInfo();
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
                <p class="info-text js-password-text">Password: </p>
                <input class="info-input js-password-input" placeholder="Enter New Password">
            </div>
            <div class="edit-buttons js-edit-password-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderWorkerInfo();
        }
        
        if(event.target.classList.contains('js-confirm-edit-button')){
            changeWorkerPassword(workerID, document.querySelector('.js-password-input').value);
            renderWorkerInfo();
        }
    });

    document.querySelector('.js-hours-info').addEventListener('click', (event) => {
        
        if(event.target.classList.contains('js-edit-hours-button')){
            document.querySelector('.js-hours-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-hours-text">Availability: </p>
                <input class="info-input js-hours-input" placeholder="Enter New Availability">
            </div>
            <div class="edit-buttons js-edit-hours-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderWorkerInfo();
        }
        
        if(event.target.classList.contains('js-confirm-edit-button')){
            changeWorkerHours(workerID, document.querySelector('.js-hours-input').value);
            renderWorkerInfo();
        }
    });
}

renderWorkerInfo();

