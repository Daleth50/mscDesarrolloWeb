import api from './api';

export const productService = {
  getAll() {
    return api.get('/products');
  },

  getById(id) {
    return api.get(`/products/${id}`);
  },

  getMovements(id, params = {}) {
    const search = new URLSearchParams();

    if (params.page) {
      search.set('page', String(params.page));
    }

    if (params.perPage) {
      search.set('per_page', String(params.perPage));
    }

    const query = search.toString();
    const endpoint = query ? `/products/${id}/movements?${query}` : `/products/${id}/movements`;
    return api.get(endpoint);
  },

  create(product) {
    return api.post('/products', product);
  },

  update(id, product) {
    return api.put(`/products/${id}`, product);
  },

  delete(id) {
    return api.delete(`/products/${id}`);
  },
};

export default productService;
