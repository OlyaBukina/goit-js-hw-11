export default class ImagesApiServer {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImage() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '28875858-be00e402ceba03ed1852ded5b';
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=20`;

    this.incrementPage();
    const response = await fetch(url);
    try {
      const images = await response.json();
      return images;
    } catch (error) {
      throw new Error('Sorry, something goes wrong.');
    }
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
