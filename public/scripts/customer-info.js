import {customers} from './admin.js';

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');


function renderCustomerInfo(){
    console.log(userId);
}

renderCustomerInfo();