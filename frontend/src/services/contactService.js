import api from './api';

export const contactService = {
  getAll(kind) {
    const query = kind ? `?kind=${encodeURIComponent(kind)}` : '';
    return api.get(`/contacts${query}`);
  },

  create(contact) {
    return api.post('/contacts', contact);
  },

  delete(id) {
    return api.delete(`/contacts/${id}`);
  },
};

export default contactService;
