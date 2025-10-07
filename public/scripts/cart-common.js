// Shared cart utilities for GritDash
(function(){
  const CART_KEY = 'cart';

  function safeParse(v){ try { return JSON.parse(v||'[]'); } catch(e){ return []; } }

  function getCart(){ return safeParse(localStorage.getItem(CART_KEY)); }

  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); window.dispatchEvent(new Event('cart_updated')); }

  // Add item with deduplication by restaurant+name -> increments quantity
  function addToCart(item){
    if(!item || !item.name) return;
    const cart = getCart();
    // normalize price to number
    item.price = parseFloat(item.price) || 0;
    if(!item.quantity) item.quantity = 1;

    // find existing
    const idx = cart.findIndex(it => (it.restaurant||'') === (item.restaurant||'') && (it.name||'') === (item.name||''));
    if(idx >= 0){
      cart[idx].quantity = (cart[idx].quantity || 1) + (item.quantity || 1);
      // ensure price stored as number
      cart[idx].price = parseFloat(item.price) || cart[idx].price;
    } else {
      cart.push(item);
    }
    saveCart(cart);
  }

  function updateBadge(){
    const cart = getCart();
    const count = cart.reduce((s, it) => s + (it.quantity || 1), 0);
    // update any element with id cart-count
    document.querySelectorAll('#cart-count').forEach(el => {
      if(count>0){ el.style.display = 'inline-block'; el.textContent = count; }
      else { el.style.display = 'none'; }
    });
  }

  // Expose functions globally
  window.getCart = getCart;
  window.saveCart = saveCart;
  window.addToCart = addToCart;
  window.updateCartBadge = updateBadge;

  // react to storage changes
  window.addEventListener('storage', (e)=>{ if(e.key === CART_KEY || e.key === null) updateBadge(); });
  window.addEventListener('cart_updated', updateBadge);

  // init on load
  document.addEventListener('DOMContentLoaded', updateBadge);
})();
