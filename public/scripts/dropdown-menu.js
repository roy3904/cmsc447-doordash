const menuButton = document.querySelector('.menu-icon');

let menuSelected = false;

menuButton.addEventListener('click', () => {
    const menu = document.querySelector('.header-dropdown');
    
    menuSelected = !(menuSelected);
    if(menuSelected === false){
        menu.classList.add('hidden');
    }
    else{
        menu.classList.remove('hidden');
    }
});

const menuChoices = document.querySelectorAll('.dropdown-selection')
menuChoices.forEach((choice) => {
    choice.addEventListener('click', () => {
        document.querySelector('.header-dropdown').classList.add('hidden');
        menuSelected = false;
    })
});