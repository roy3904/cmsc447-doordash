//JS file for restaurant admin page, NOT DATABASE like restaurant.js
import {restaurants, setRestaurants, findRestaurant, changeRestaurantName, changeLocation, changeHours, removeRestaurant} from './admin.js';

const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('id');

async function fetchRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        const data = await response.json();
        setRestaurants(data.restaurants);
    } catch (error) {
        console.error('Failed to fetch restaurants:', error);
    }
}

function renderRestaurantInfo(){
    const currRestaurant = findRestaurant(restaurantId);

    console.log("Current Restaurant is ", currRestaurant, " with id ", restaurantId, "ARRRR DARRRRR");

    let restaurantInfoHTML = '';

    if(currRestaurant === null){
        restaurantInfoHTML = '<p class="invalid-message">This is an empty restaurant page!</p>';
    }
    else{
        restaurantInfoHTML += `
            <div class="info-header">
                    
                <div class="info-header-leftside">
                    <img class="profile-picture" src="./images/retriever-profile-picture.png">
                    <p class="title-name">${currRestaurant.Name}</p>
                </div>
                
                <button class="delete-user-button">Delete Restaurant</button>
                
            </div> 
            <div class="info-body js-restaurant-info-body">
                <div class="entity-info js-id-info">
                    <p class="entity-info-text js-id-text">ID: ${currRestaurant.RestaurantID}</p>
                </div>
                <div class="entity-info js-name-info">
                    <p class="entity-info-text js-name-text">Name: ${currRestaurant.Name}</p>
                    <button class="entity-edit-button js-edit-name-button">Edit</button>
                </div>
                <div class="entity-info js-location-info">
                    <p class="entity-info-text js-location-text">Location: ${currRestaurant.Location}</p>
                    <button class="entity-edit-button js-edit-location-button">Edit</button>
                </div>
                <div class="entity-info js-hours-info">
                    <p class="entity-info-text js-hours-text">Hours: ${currRestaurant.OperatingHours}</p>
                    <button class="entity-edit-button js-edit-hours-button">Edit</button>
                </div>
            </div>
        `;
    }
    document.querySelector('.js-restaurant-info-container').innerHTML = restaurantInfoHTML;

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
        removeRestaurant(restaurantId);
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
            renderRestaurantInfo();
        }
        
        if(event.target.classList.contains('js-confirm-edit-button')){
            changeRestaurantName(restaurantId, document.querySelector('.js-name-input').value);
            renderRestaurantInfo();
        }
    });

    document.querySelector('.js-location-info').addEventListener('click', (event) => {
        console.log(event.target.classList);
        if(event.target.classList.contains('js-edit-location-button')){
            document.querySelector('.js-location-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-location-text">Location: </p>
                <input class="info-input js-location-input" placeholder="Enter New Location">
            </div>
            <div class="edit-buttons js-edit-location-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderRestaurantInfo();
        }
        
        if(event.target.classList.contains('js-confirm-edit-button')){
            changeLocation(restaurantId, document.querySelector('.js-location-input').value);
            renderRestaurantInfo();
        }
    });

    document.querySelector('.js-hours-info').addEventListener('click', (event) => {
        
        if(event.target.classList.contains('js-edit-hours-button')){
            document.querySelector('.js-hours-info').innerHTML = `
            <div class="enter-input-container">
                <p class="info-text js-hours-text">Hours: </p>
                <input class="info-input js-hours-input" placeholder="Enter New Hours">
            </div>
            <div class="edit-buttons js-edit-hours-buttons">
                <button class="cancel-edit-button js-cancel-edit-button">Cancel</button>
                <button class="confirm-edit-button js-confirm-edit-button">Confirm Changes</button>
            </div>
        `;
        }

        if(event.target.classList.contains('js-cancel-edit-button')){
            renderRestaurantInfo();
        }
        
        if(event.target.classList.contains('js-confirm-edit-button')){
            const input = document.querySelector('.js-hours-input').value;
            changeHours(restaurantId, input);
            renderRestaurantInfo();
        }
    });
}

await fetchRestaurants();
renderRestaurantInfo();