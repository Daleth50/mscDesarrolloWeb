import api from './api';

export const categoryService = {
  getAll() {
    return api.get('/categories');
  },

  create(category) {
    return api.post('/categories', category);
  },

  update(id, category) {
    return api.put(`/categories/${id}`, category);
  },

  delete(id) {
    return api.delete(`/categories/${id}`);
  },
};

export default categoryService;
