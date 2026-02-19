import api from './api';

export const contactService = {
  getAll() {
    return api.get('/contacts');
  },

  create(contact) {
    return api.post('/contacts', contact);
  },

  delete(id) {
    return api.delete(`/contacts/${id}`);
  },
};

export default contactService;
