import api from './api';

export const supplierService = {
  getAll() {
    return api.get('/suppliers');
  },

  create(supplier) {
    return api.post('/suppliers', supplier);
  },

  delete(id) {
    return api.delete(`/contacts/${id}`);
  },
};

export default supplierService;
