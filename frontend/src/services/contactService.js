import api from './api';

export const contactService = {
  getAll(kind) {
    const query = kind ? `?kind=${encodeURIComponent(kind)}` : '';
    return api.get(`/contacts${query}`);
  },

  getById(id) {
    return api.get(`/contacts/${id}`);
  },

  create(contact) {
    return api.post('/contacts', contact);
  },

  update(id, contact) {
    return api.put(`/contacts/${id}`, contact);
  },

  delete(id) {
    return api.delete(`/contacts/${id}`);
  },
};

export default contactService;
