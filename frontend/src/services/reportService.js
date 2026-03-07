import api from './api';

export const reportService = {
  getOverview(params = {}) {
    const search = new URLSearchParams();

    if (params.from) {
      search.set('from', params.from);
    }

    if (params.to) {
      search.set('to', params.to);
    }

    if (params.topLimit) {
      search.set('top_limit', String(params.topLimit));
    }

    const query = search.toString();
    const endpoint = query ? `/reports/overview?${query}` : '/reports/overview';
    return api.get(endpoint);
  },
};

export default reportService;
