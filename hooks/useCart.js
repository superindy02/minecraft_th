import { useState } from 'react';
import { create } from 'zustand';


export function useCart() {
    const [cart, setCart] = useState([]);
    const addToCart = (product) => setCart([...cart, product]);
    return { cart, addToCart };
  }
const useCart = create((set) => ({
    items: [],
    addItem: (item) => set((state) => ({
        items: [...state.items, item]
    })),
    removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => item.id !== itemId)
    })),
    clearCart: () => set({ items: [] })
}));

export default useCart;