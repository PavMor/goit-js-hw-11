import axios from 'axios';

const API_KEY = '34125001-552eb8cc5bd5517d5b42222f1';
const BASE_URL = 'https://pixabay.com/api/';
const BASE_SEARCH_OPTIONS = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export class ImgsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.totalPage = 0;
    this.loadedNow = 0;
  }

  async fetchImages() {
    try {
      const searchOptions = {
        ...BASE_SEARCH_OPTIONS,
        q: this.searchQuery,
        page: this.page,
        per_page: this.per_page,
      };
      this.incrementPage();
      this.resetLoaded();

      const url = `${BASE_URL}?key=${API_KEY}`;

      return axios.get(url, { params: searchOptions });
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetLoaded() {
    this.loadedNow = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
