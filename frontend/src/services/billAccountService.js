import api from './api';

export const billAccountService = {
  getAll() {
    return api.get('/bill-accounts');
  },

  getById(id) {
    return api.get(`/bill-accounts/${id}`);
  },

  create(payload) {
    return api.post('/bill-accounts', payload);
  },

  update(id, payload) {
    return api.put(`/bill-accounts/${id}`, payload);
  },

  delete(id) {
    return api.delete(`/bill-accounts/${id}`);
  },
};

export default billAccountService;
