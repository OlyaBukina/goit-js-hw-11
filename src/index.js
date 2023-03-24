import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiServer from './js/search-image';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import '../node_modules/simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchInput: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const imagesApiServer = new ImagesApiServer();

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

function appendImagesToGallery(images) {
  const galleryItem = images
    .map(image => {
      return `
      <div class="photo-card">
      <a href="${image.largeImageURL}">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
    <div class="info">
    <p class="info-item">
    <b>Likes</b> ${image.likes}
    </p>
    <p class="info-item">
    <b>Views</b> ${image.views}
    </p>
    <p class="info-item">
    <b>Comments</b> ${image.comments}
    </p>
    <p class="info-item">
    <b>Downloads</b> ${image.downloads}
    </p>
    </div>
    </div>
    `;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', galleryItem);
}
let galleryImg = new SimpleLightbox('.gallery a');

function clearGalleryEl() {
  refs.gallery.innerHTML = '';
}

async function fetchImages() {
  const images = await imagesApiServer.fetchImage();
  appendImagesToGallery(images.hits);
  loadMoreBtn.show();
  galleryImg.refresh();
}

async function onFormSubmit(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value;

  try {
    imagesApiServer.query = inputValue;
    imagesApiServer.resetPage();
    clearGalleryEl();
    loadMoreBtn.hide();
    // fetchImages();
    const images = await imagesApiServer.fetchImage();
    appendImagesToGallery(images.hits);
    galleryImg.refresh();
    loadMoreBtn.show();

    Notify.success(`"Hooray! We found ${images.totalHits} images."`);
    if (images.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    Notify.failure(error.message);
    console.log(error);
  }
}

async function loadMoreImages() {
  fetchImages();
  if (images.hits.length === 0) {
    loadMoreBtn.hide();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

refs.searchInput.addEventListener('submit', onFormSubmit);
loadMoreBtn.button.addEventListener('click', loadMoreImages);
