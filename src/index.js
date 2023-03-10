import './sass/index.scss';
import { ImgsApiService } from './js/imgs-service';
import { cardTemplate } from './js/card-markup.js';
import { LoadMoreBtn } from './js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  input: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('button[type="submit"]'),
};

const imgsApiService = new ImgsApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoomFactor: false,
});

refs.searchForm.addEventListener('submit', onSearch);
refs.input.addEventListener('input', () => (refs.searchBtn.disabled = false));
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();
  /* refs.searchBtn.disabled = true; */

  imgsApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (imgsApiService.searchQuery === '') {
    Notify.failure('Please, enter text');
    return;
  }

  loadMoreBtn.show();
  imgsApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();

  imgsApiService.fetchImages().then(({ data }) => {
    imgsApiService.totalPage = Math.ceil(data.total / imgsApiService.per_page);
    imgsApiService.loadedNow += data.hits.length;

    if (imgsApiService.page === 2) {
      Notify.success(`Hooray! We found ${data.total} images.`);
    }

    if (imgsApiService.totalPage + 1 === imgsApiService.page) {
      loadMoreBtn.hide();
    }

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Loaded ${imgsApiService.loadedNow} images.`);
    appendImagesMarkup(data.hits);
    simpleLightbox.refresh();

    loadMoreBtn.enable();
  });
}

function appendImagesMarkup(images) {
  const cardsMarkup = images.map(image => cardTemplate(image));
  refs.imagesContainer.insertAdjacentHTML('beforeend', cardsMarkup.join(''));
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}
