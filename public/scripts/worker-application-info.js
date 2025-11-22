const params = new URLSearchParams(window.location.search);
const applicationId = params.get('id');

let currApplication = null;

async function fetchApplication() {
    try {
        const response = await fetch(`/api/worker-applications/${applicationId}`);
        const data = await response.json();
        currApplication = data.application;
        renderApplicationInfo();
    } catch (error) {
        console.error('Failed to fetch application:', error);
        currApplication = null;
        renderApplicationInfo();
    }
}

async function updateApplication(updates) {
    try {
        const response = await fetch(`/api/worker-applications/${applicationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update');
        await fetchApplication();
    } catch (error) {
        console.error('Failed to update application:', error);
        alert('Failed to update application');
    }
}

async function deleteApplication() {
    try {
        const response = await fetch(`/api/worker-applications/${applicationId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete');
        window.location.href = "admin.html";
    } catch (error) {
        console.error('Failed to delete application:', error);
        alert('Failed to delete application');
    }
}

async function approveApplication() {
    try {
        const response = await fetch(`/api/worker-applications/${applicationId}/approve`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to approve');
        alert('Application approved successfully! Worker has been created.');
        await fetchApplication();
    } catch (error) {
        console.error('Failed to approve application:', error);
        alert('Failed to approve application');
    }
}

async function declineApplication() {
    try {
        const response = await fetch(`/api/worker-applications/${applicationId}/decline`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to decline');
        alert('Application declined successfully');
        await fetchApplication();
    } catch (error) {
        console.error('Failed to decline application:', error);
        alert('Failed to decline application');
    }
}

function renderApplicationInfo(){
    let applicationInfoHTML = '';

    if(currApplication === null){
        applicationInfoHTML = '<p class="invalid-message">This is an empty application page!</p>';
    }
    else{
        const statusColor = currApplication.Status === 'Pending' ? '#f59e0b' :
                           currApplication.Status === 'Approved' ? '#10b981' : '#ef4444';

        applicationInfoHTML += `
            <div class="info-header">

                <div class="info-header-leftside">
                    <img class="profile-picture" src="./images/retriever-profile-picture.png">
                    <p class="title-name">${currApplication.Name}</p>
                </div>

                <div style="display:flex;gap:8px;align-items:center;">
                    ${currApplication.Status === 'Pending' ? `
                        <button class="approve-button" style="padding:8px 16px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;">Approve</button>
                        <button class="decline-button" style="padding:8px 16px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;">Decline</button>
                    ` : ''}
                    <button class="delete-user-button">Delete Application</button>
                </div>

            </div>
            <div class="info-body js-application-info-body">
                <div class="entity-info js-id-info">
                    <p class="entity-info-text js-id-text">Application ID: ${currApplication.ApplicationID}</p>
                </div>
                <div class="entity-info js-worker-id-info">
                    <p class="entity-info-text js-worker-id-text">Worker ID: ${currApplication.WorkerID}</p>
                </div>
                <div class="entity-info js-status-info">
                    <p class="entity-info-text js-status-text" style="font-weight:bold;color:${statusColor}">Status: ${currApplication.Status}</p>
                </div>
                <div class="entity-info js-name-info">
                    <p class="entity-info-text js-name-text">Name: ${currApplication.Name}</p>
                    <button class="entity-edit-button js-edit-name-button">Edit</button>
                </div>
                <div class="entity-info js-email-info">
                    <p class="entity-info-text js-email-text">Email: ${currApplication.Email}</p>
                    <button class="entity-edit-button js-edit-email-button">Edit</button>
                </div>
                <div class="entity-info js-phone-info">
                    <p class="entity-info-text js-phone-text">Phone: ${currApplication.Phone || 'N/A'}</p>
                    <button class="entity-edit-button js-edit-phone-button">Edit</button>
                </div>
                <div class="entity-info js-availability-info">
                    <p class="entity-info-text js-availability-text">Availability: ${currApplication.Availability || 'N/A'}</p>
                    <button class="entity-edit-button js-edit-availability-button">Edit</button>
                </div>
                <div class="entity-info js-submitted-info">
                    <p class="entity-info-text js-submitted-text">Submitted: ${new Date(currApplication.SubmittedAt).toLocaleString()}</p>
                </div>
            </div>
        `;
    }

    document.querySelector('.js-application-info-container').innerHTML = applicationInfoHTML;

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
        deleteApplication();
    })

    document.querySelector('.approve-button')?.addEventListener('click', () => {
        if(confirm('Approve this application and create a worker account?')) {
            approveApplication();
        }
    })

    document.querySelector('.decline-button')?.addEventListener('click', () => {
        if(confirm('Decline this application?')) {
            declineApplication();
        }
    })

    document.querySelector('.js-name-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-name-button')){
            document.querySelector('.js-name-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-name-text">Name: </p>
                <input class="info-input js-name-input" placeholder="Enter New Name" value="${currApplication.Name}">
            </div>
            <div class="edit-buttons js-edit-name-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderApplicationInfo();
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
            updateApplication({ Name: newName });
        }
    });

    document.querySelector('.js-email-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-email-button')){
            document.querySelector('.js-email-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-email-text">Email: </p>
                <input type="email" class="info-input js-email-input" placeholder="Enter New Email" value="${currApplication.Email}">
            </div>
            <div class="edit-buttons js-edit-email-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderApplicationInfo();
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

            updateApplication({ Email: input });
        }
    });

    document.querySelector('.js-phone-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-phone-button')){
            document.querySelector('.js-phone-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-phone-text">Phone: </p>
                <input class="info-input js-phone-input" type="tel" placeholder="Enter Phone Number" value="${currApplication.Phone || ''}" maxlength="12">
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
            renderApplicationInfo();
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
            updateApplication({ Phone: phoneInput });
        }
    });

    document.querySelector('.js-availability-info')?.addEventListener('click', (event) => {
        if(event.target.classList.contains('js-edit-availability-button')){
            document.querySelector('.js-availability-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-availability-text">Availability: </p>
                <input class="info-input js-availability-input" placeholder="Enter Availability" value="${currApplication.Availability || ''}">
            </div>
            <div class="edit-buttons js-edit-availability-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderApplicationInfo();
        }

        if(event.target.classList.contains('js-confirm-edit-button')){
            updateApplication({ Availability: document.querySelector('.js-availability-input').value.trim() });
        }
    });
}

fetchApplication();
