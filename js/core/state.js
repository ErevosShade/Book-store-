export const state = {
  user: null,
  cart: [],
};

/* -------------------------
   SUBSCRIBERS
------------------------- */
const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
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
  notify();
}

export function clearState() {
  state.user = null;
  state.cart = [];
  notify();
}
