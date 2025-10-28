(function(){
  async function getCart() {
    try {
      const response = await fetch('/api/cart');
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
      const response = await fetch('/api/cart/item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId: item.id, quantity: item.quantity })
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      window.dispatchEvent(new Event('cart_updated'));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  }

  async function removeFromCart(item) {
    try {
      const response = await fetch('/api/cart/item', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId: item.id, quantity: item.quantity })
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      window.dispatchEvent(new Event('cart_updated'));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }

  async function updateBadge(){
    const cart = await getCart();
    const count = cart ? cart.items.reduce((s, it) => s + (it.quantity || 1), 0) : 0;
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
