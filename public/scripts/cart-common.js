(function(){
  async function getCart() {
    try {
      const currentCustomer = window.localStorage && JSON.parse(localStorage.getItem('current_customer') || 'null');
      const query = currentCustomer && currentCustomer.CustomerID ? `?customerId=${encodeURIComponent(currentCustomer.CustomerID)}` : '';
      const response = await fetch('/api/cart' + query);
      if (!response.ok) {
        throw new Error('Failed to get cart');
      }
      const { cart } = await response.json();
      return cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      return null;
    }
  }

  async function addToCart(item) {
    try {
      const currentCustomer = window.localStorage && JSON.parse(localStorage.getItem('current_customer') || 'null');
      const body = { itemId: item.id, quantity: item.quantity || 1 };
      if (currentCustomer && currentCustomer.CustomerID) body.customerId = currentCustomer.CustomerID;
      console.log('addToCart body ->', body);
      const response = await fetch('/api/cart/item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const text = await response.text().catch(()=>null);
        console.error('Failed to add item to cart response:', response.status, text);
        throw new Error('Failed to add item to cart');
      }
      window.dispatchEvent(new Event('cart_updated'));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  }

  async function removeFromCart(item) {
    try {
      const currentCustomer = window.localStorage && JSON.parse(localStorage.getItem('current_customer') || 'null');
      const body = { itemId: item.id, quantity: item.quantity || 1 };
      if (currentCustomer && currentCustomer.CustomerID) body.customerId = currentCustomer.CustomerID;
      console.log('removeFromCart body ->', body);
      const response = await fetch('/api/cart/item', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const text = await response.text().catch(()=>null);
        console.error('Failed to remove item from cart response:', response.status, text);
        throw new Error('Failed to remove item from cart');
      }
      window.dispatchEvent(new Event('cart_updated'));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }

  async function updateBadge(){
    const cart = await getCart();
    const count = cart ? cart.items.reduce((s, it) => s + ((it.Quantity || it.quantity) || 1), 0) : 0;
    // update any element with id cart-count
    document.querySelectorAll('#cart-count').forEach(el => {
      if(count>0){ el.style.display = 'inline-block'; el.textContent = count; }
      else { el.style.display = 'none'; }
    });
  }

  // Expose functions globally
  window.getCart = getCart;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateCartBadge = updateBadge;

  // react to storage changes
  window.addEventListener('cart_updated', updateBadge);

  // init on load
  document.addEventListener('DOMContentLoaded', updateBadge);

  async function getMenuItem(itemId) {
    try {
      const response = await fetch(`/api/menuitems/${itemId}`);
      if (!response.ok) {
        throw new Error('Failed to get menu item');
      }
      const { menuItem } = await response.json();
      return menuItem;
    } catch (error) {
      console.error('Error getting menu item:', error);
      return null;
    }
  }

  window.getMenuItem = getMenuItem;
})();
