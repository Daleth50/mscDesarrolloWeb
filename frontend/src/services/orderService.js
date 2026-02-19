import api from './api';

export const orderService = {
  getAll() {
    return api.get('/orders');
  },

  create(order) {
    return api.post('/orders', order);
  },
};

export default orderService;
