import api from './api';

export const orderService = {
  getAll() {
    return api.get('/orders');
  },

  getById(id) {
    return api.get(`/orders/${id}`);
  },

  create(order) {
    return api.post('/orders', order);
  },

  update(id, order) {
    return api.put(`/orders/${id}`, order);
  },

  delete(id) {
    return api.delete(`/orders/${id}`);
  },
};

export default orderService;
