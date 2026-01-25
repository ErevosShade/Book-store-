export const state = {
  user: null,
  cart: [],
  cartCount: 0,
};

/* -------------------------
   SUBSCRIBERS
------------------------- */
const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => fn(state));
}

/* -------------------------
   STATE SETTERS
------------------------- */
export function setUser(user) {
  state.user = user;
  notify();
}

export function setCart(cart) {
  state.cart = cart;
  state.cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  notify();
}

export function clearState() {
  state.user = null;
    state.cart = [];
  state.cartCount = 0;
  notify();
}
