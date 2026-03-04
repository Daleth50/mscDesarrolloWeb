import api from './api';

export const billAccountService = {
  getAll() {
    return api.get('/bill-accounts');
  },

  getById(id) {
    return api.get(`/bill-accounts/${id}`);
  },

  getMovements(id) {
    return api.get(`/bill-accounts/${id}/movements`);
  },

  create(payload) {
    return api.post('/bill-accounts', payload);
  },

  update(id, payload) {
    return api.put(`/bill-accounts/${id}`, payload);
  },

  createMovement(id, payload) {
    return api.post(`/bill-accounts/${id}/movements`, payload);
  },

  delete(id) {
    return api.delete(`/bill-accounts/${id}`);
  },
};

export default billAccountService;
