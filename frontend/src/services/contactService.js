import api from './api';

export const contactService = {
  getAll() {
    return api.get('/contacts');
  },

  create(contact) {
    return api.post('/contacts', contact);
  },
};

export default contactService;
