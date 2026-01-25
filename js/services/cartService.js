import { db } from "../core/firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  onSnapshot,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { setCart } from "../core/state.js";

/* ➕ ADD TO CART */
export async function addToCart(uid, product) {
  const ref = doc(db, "users", uid, "cart", product.id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      quantity: increment(1)
    });
  } else {
    await setDoc(ref, {
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description,
      quantity: 1
    });
  }
}

/* 🔄 LOAD CART (REALTIME) */
export function listenToCart(uid) {
  return onSnapshot(
    collection(db, "users", uid, "cart"),
    (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCart(items);
    }
  );
}

/* ❌ REMOVE ITEM */
export async function removeFromCart(uid, id) {
  await deleteDoc(doc(db, "users", uid, "cart", id));
}

export async function updateCartQuantity(uid, productId, delta) {
  const ref = doc(db, "users", uid, "cart", productId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const qty = snap.data().quantity + delta;

  if (qty <= 0) {
    await deleteDoc(ref);
  } else {
    await updateDoc(ref, { quantity: qty });
  }
}


