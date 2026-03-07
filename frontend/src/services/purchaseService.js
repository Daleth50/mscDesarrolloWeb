import api from './api';

export const purchaseService = {
  getProducts() {
    return api.get('/purchases/products');
  },

  createCart(payload) {
    return api.post('/purchases/cart', payload);
  },

  getCart(cartId) {
    return api.get(`/purchases/cart/${cartId}`);
  },

  updateCart(cartId, payload) {
    return api.put(`/purchases/cart/${cartId}`, payload);
  },

  addItem(cartId, payload) {
    return api.post(`/purchases/cart/${cartId}/items`, payload);
  },

  updateItem(cartId, itemId, payload) {
    return api.put(`/purchases/cart/${cartId}/items/${itemId}`, payload);
  },

  removeItem(cartId, itemId) {
    return api.delete(`/purchases/cart/${cartId}/items/${itemId}`);
  },

  complete(cartId) {
    return api.post(`/purchases/cart/${cartId}/complete`, {});
  },
};

export default purchaseService;
