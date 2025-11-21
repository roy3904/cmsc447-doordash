const params = new URLSearchParams(window.location.search);
const workerId = params.get('id');

let currWorker = null;

async function fetchWorker() {
    try {
        const response = await fetch(`/api/workers/${workerId}`);
        const data = await response.json();
        currWorker = data.worker;
        renderWorkerInfo();
    } catch (error) {
        console.error('Failed to fetch worker:', error);
        currWorker = null;
        renderWorkerInfo();
    }
}

async function updateWorker(updates) {
    try {
        const response = await fetch(`/api/workers/${workerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update');
        await fetchWorker();
    } catch (error) {
        console.error('Failed to update worker:', error);
        alert('Failed to update worker');
    }
}

async function deleteWorker() {
    try {
        const response = await fetch(`/api/workers/${workerId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete');
        window.location.href = "admin.html";
    } catch (error) {
        console.error('Failed to delete worker:', error);
        alert('Failed to delete worker');
    }
}

function renderWorkerInfo(){
    let workerInfoHTML = '';

    if(currWorker === null){
        workerInfoHTML = '<p class="invalid-message">This is an empty worker page!</p>';
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
            <div class="info-body js-worker-info-body">
                <div class="entity-info js-id-info">
                    <p class="entity-info-text js-id-text">Worker ID: ${currWorker.WorkerID}</p>
                </div>
                <div class="entity-info js-name-info">
                    <p class="entity-info-text js-name-text">Name: ${currWorker.Name}</p>
                    <button class="entity-edit-button js-edit-name-button">Edit</button>
                </div>
                <div class="entity-info js-email-info">
                    <p class="entity-info-text js-email-text">Email: ${currWorker.Email}</p>
                    <button class="entity-edit-button js-edit-email-button">Edit</button>
                </div>
                <div class="entity-info js-phone-info">
                    <p class="entity-info-text js-phone-text">Phone: ${currWorker.Phone || 'N/A'}</p>
                    <button class="entity-edit-button js-edit-phone-button">Edit</button>
                </div>
                <div class="entity-info js-availability-info">
                    <p class="entity-info-text js-availability-text">Availability: ${currWorker.AvailabilityStatus}</p>
                    <button class="entity-edit-button js-edit-availability-button">Edit</button>
                </div>
                <div class="entity-info js-password-info">
                    <p class="entity-info-text js-password-text">Password: ${currWorker.PasswordHash}</p>
                    <button class="entity-edit-button js-edit-password-button">Edit</button>
                </div>
            </div>
        `;
    }

    document.querySelector('.js-worker-info-container').innerHTML = workerInfoHTML;

    renderButtons();
}

function renderButtons(){
    document.querySelector('.delete-user-button')?.addEventListener('click', () => {
        document.querySelector('.delete-confirm-window').classList.remove('hidden');
    })

    document.querySelector('.js-delete-deny-button')?.addEventListener('click', () => {
        document.querySelector('.delete-confirm-window').classList.add('hidden');
    })

    document.querySelector('.js-delete-accept-button')?.addEventListener('click', () => {
        deleteWorker();
    })

    document.querySelector('.js-name-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-name-button')){
            document.querySelector('.js-name-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-name-text">Name: </p>
                <input class="info-input js-name-input" placeholder="Enter New Name" value="${currWorker.Name}">
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
            const newName = document.querySelector('.js-name-input').value.trim();
            if(!newName) {
                document.querySelector('.js-edit-name-buttons').innerHTML = `
                    <p class="error-text">Name is required.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `;
                return;
            }
            updateWorker({ Name: newName });
        }
    });

    document.querySelector('.js-email-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-email-button')){
            document.querySelector('.js-email-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-email-text">Email: </p>
                <input type="email" class="info-input js-email-input" placeholder="Enter New Email" value="${currWorker.Email}">
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
            const input = document.querySelector('.js-email-input').value.trim();
            const emailVerifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!input) {
                document.querySelector('.js-edit-email-buttons').innerHTML = `
                    <p class="error-text">Email is required.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `;
                return;
            }

            if(!emailVerifier.test(input)){
                document.querySelector('.js-edit-email-buttons').innerHTML = `
                    <p class="error-text">Email is Invalid.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `;
                return;
            }

            updateWorker({ Email: input });
        }
    });

    document.querySelector('.js-phone-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-phone-button')){
            document.querySelector('.js-phone-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-phone-text">Phone: </p>
                <input class="info-input js-phone-input" type="tel" placeholder="Enter Phone Number" value="${currWorker.Phone || ''}" maxlength="12">
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
            const phoneInput = document.querySelector('.js-phone-input').value;
            if(phoneInput && phoneInput.length !== 12 && phoneInput.length !== 0){
                document.querySelector('.js-edit-phone-buttons').innerHTML = `
                    <p class="error-text">Phone Number is Invalid Length.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `;
                return;
            }
            updateWorker({ Phone: phoneInput });
        }
    });

    document.querySelector('.js-availability-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-availability-button')){
            document.querySelector('.js-availability-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-availability-text">Availability: </p>
                <input class="info-input js-availability-input" placeholder="Enter Availability Status" value="${currWorker.AvailabilityStatus}">
            </div>
            <div class="edit-buttons js-edit-availability-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderWorkerInfo();
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            updateWorker({ AvailabilityStatus: document.querySelector('.js-availability-input').value.trim() });
        }
    });

    document.querySelector('.js-password-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-password-button')){
            document.querySelector('.js-password-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-password-text">Password: </p>
                <input class="info-input js-password-input" type="password" placeholder="Enter New Password">
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
            const input = document.querySelector('.js-password-input').value;

            if(input.length < 8){
                document.querySelector('.js-edit-password-buttons').innerHTML = `
                    <p class="error-text">Password Must Contain at Least 8 Characters.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `;
                return;
            }
            if(input.includes(' ')){
                document.querySelector('.js-edit-password-buttons').innerHTML = `
                    <p class="error-text">Password Can't Contain Any Spaces.</p>
                    <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                    <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
                `;
                return;
            }

            updateWorker({ PasswordHash: input });
        }
    });
}

fetchWorker();
