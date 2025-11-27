document.addEventListener('DOMContentLoaded', async () => {
    cartTest();
});

async function cartTest(){
    const cartTestObject = document.querySelector('.cart-test');
    cartTestObject.innerHTML = '<p>CART UNIT TEST</p>';

    const cartItems = [{id: "1", quantity: 3}, {id: "4", quantity: 1}, {id: "8", quantity: 11}];

    //Test getCart Function

    await addToCart({id: "1", quantity: 3})
    await addToCart({id: "4", quantity: 1})
    await addToCart({id: "8", quantity: 11});

    let cartList = await getCart();
    cartList = cartList.items;

    if(cartList === undefined){
        cartTestObject.innerHTML += '<p>getCart() function failed</p>';
    }
    else{
        cartTestObject.innerHTML += '<p>getCart() function succeeded</p>';
    }

    //Test addToCart Function

    for(let i = 0; i < cartItems.length; i++){
        if(cartItems[i].id !== cartList[i].ItemID || cartItems[i].quantity !== cartList[i].Quantity){
            cartTestObject.innerHTML += '<p>addToCart() function failed</p>';
        }
    }
    cartTestObject.innerHTML += '<p>addToCart() function Succeeded</p>';

    //Test Accuracy of cart items

    foodname0 = await getMenuItem(cartList[0].ItemID);
    foodname1 = await getMenuItem(cartList[1].ItemID);
    foodname2 = await getMenuItem(cartList[2].ItemID);

    if(foodname0.Name !== "Scrambled Eggs" || foodname1.Name !== "Grits" || foodname2.Name !== "Egg and Cheese on Croissant"){
        
        cartTestObject.innerHTML += '<p>getMenuItem() function Failed</p>';
    }
    else{
        cartTestObject.innerHTML += '<p>getMenuItem() function Succeeded</p>';
    }
    

    for(let i = 0; i < cartList.length; i++){
        await removeFromCart({id: cartList[i].ItemID, quantity: cartList[i].Quantity});
    }

    cartList = await getCart();

    if(cartList.items.length === 0){
        cartTestObject.innerHTML += '<p>removeFromCart() function Succeeded</p>';
    }
    else{
        cartTestObject.innerHTML += '<p>removeFromCart() function Succeeded</p>';
    }
}