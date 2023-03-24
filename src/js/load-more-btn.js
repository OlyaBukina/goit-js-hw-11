export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.button = this.getButton(selector);

    hidden && this.hide();
  }

  getButton(selector) {
    const button = document.querySelector(selector);
    return button;
  }

  enable() {
    this.button.disabled = false;
  }

  disable() {
    this.button.disabled = true;
  }

  show() {
    this.button.classList.remove('is-hidden');
  }

  hide() {
    this.button.classList.add('is-hidden');
  }
}
