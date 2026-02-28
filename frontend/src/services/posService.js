import api from './api';

export const posService = {
  getProducts() {
    return api.get('/pos/products');
  },

  getBillAccounts(type) {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return api.get(`/pos/bill-accounts${query}`);
  },

  createCart(payload) {
    return api.post('/pos/cart', payload);
  },

  getCart(cartId) {
    return api.get(`/pos/cart/${cartId}`);
  },

  updateCart(cartId, payload) {
    return api.put(`/pos/cart/${cartId}`, payload);
  },

  addItem(cartId, payload) {
    return api.post(`/pos/cart/${cartId}/items`, payload);
  },

  updateItem(cartId, itemId, payload) {
    return api.put(`/pos/cart/${cartId}/items/${itemId}`, payload);
  },

  removeItem(cartId, itemId) {
    return api.delete(`/pos/cart/${cartId}/items/${itemId}`);
  },

  completeCart(cartId, payload) {
    return api.post(`/pos/cart/${cartId}/complete`, payload);
  },
};

export default posService;
