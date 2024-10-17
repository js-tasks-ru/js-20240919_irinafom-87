export default class DoubleSlider {  
  element;
  subElements = {};

  constructor(props = {}) {
    const {
      min = 100,
      max = 1000,
      formatValue = value => value,
      selected: {from = min, to = max} = {},
    } = props;

    this.min = min;
    this.max = max;

    this.formatValue = formatValue;

    this.from = from;
    this.to = to;

    this.element = null;

    this.activeThumb = null;
    this.leftThumbler = null;
    this.rightThumbler = null;
    
    this.element = this.createSliderElement();
    this.selectSubElements();
    this.initialize();
    this.updateStyles();
  }

  selectSubElements = () => {
    const dataElements = this.element.querySelectorAll('[data-element]');
    dataElements.forEach(item => {
      this.subElements[item.dataset.element] = item;
    });
  }

  createSliderElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.createSliderTemplate();
    return wrapper.firstElementChild; 
  }

  initialize() {
    this.leftThumbler = this.subElements.leftThumbler;
    this.rightThumbler = this.subElements.rightThumbler;

    this.createEventListeners();
  }

  createEventListeners() {
    document.addEventListener('pointerdown', this.handleDocumentThumbDown);
    document.addEventListener('pointerup', this.handleDocumentThumbUp);
  }
  
  calculateThumblers(e) {
    const sliderInner = this.subElements.innerSlider;
    const rect = sliderInner.getBoundingClientRect();

    return Math.round(
      ((e.clientX - rect.left) / rect.width) * (this.max - this.min)
    ) + this.min;
  }

  handleDocumentThumbDown = (e) => {
    switch (e.target) {
    case this.leftThumbler:
      this.leftThumbler.classList.add('range-slider_dragging');
      this.activeThumb = 'left';
      break;

    case this.rightThumbler:
      this.rightThumbler.classList.add('range-slider_dragging');
      this.activeThumb = 'right';
      break;

    default:
      break;
    }

    document.addEventListener('pointermove', this.handleDocumentThumbMove);
  }

  handleDocumentThumbMove = (e) => {
    switch (this.activeThumb) {
    case 'left':
      this.from = Math.max(
        this.min, Math.min(
          this.calculateThumblers(e), this.to
        )
      );
      break;

    case 'right':
      this.to = Math.max(
        this.from, Math.min(
          this.calculateThumblers(e), this.max
        )
      );
      break;

    default:
      return;
    }
    
    this.updateStyles();
  } 
  
  handleDocumentThumbUp = () => {
    this.toggleDispatchEvent();
    if (this.leftThumbler.classList.contains('range-slider_dragging')) {
      this.leftThumbler.classList.remove('range-slider_dragging');
    } else {
      this.rightThumbler.classList.remove('range-slider_dragging');
    }

    document.removeEventListener('pointermove', this.handleDocumentThumbMove);
  }

  toggleDispatchEvent() {
    this.element.dispatchEvent(new CustomEvent("range-select", {
      detail: { from: this.from, to: this.to }
    }));
  }

  updateStyles() {
    const sliderProgress = this.subElements.sliderProgress;

    const fromDataElement = this.subElements.from;
    const toDataElement = this.subElements.to;

    const leftThumblerPosition = (this.from - this.min) / (this.max - this.min) * 100;
    const rightThumblerPosition = (this.max - this.to) / (this.max - this.min) * 100;

    this.leftThumbler.style = `left: ${leftThumblerPosition}%`;
    this.rightThumbler.style = `right: ${rightThumblerPosition}%`;

    sliderProgress.style = `
      left: ${leftThumblerPosition}%; 
      right: ${rightThumblerPosition}%
    `;

    fromDataElement.textContent = this.formatValue(`${this.from}`);
    toDataElement.textContent = this.formatValue(`${this.to}`);
  }

  createSliderTemplate() {
    return `
        <div class="range-slider">
            <span data-element="from">${this.formatValue(this.from)}</span>
            <div data-element="innerSlider" class="range-slider__inner">
                <span data-element="sliderProgress" class="range-slider__progress"></span>
                <span data-element="leftThumbler" class="range-slider__thumb-left"></span>
                <span data-element="rightThumbler" class="range-slider__thumb-right"></span>
            </div>
            <span data-element="to">${this.formatValue(this.to)}</span>
        </div>
    `;
  }

  removeEventListeners() {
    document.removeEventListener('pointerdown', this.handleDocumentThumbDown);
    document.removeEventListener('pointermove', this.handleDocumentThumbMove);
    document.removeEventListener('pointerup', this.handleDocumentThumbUp);
  }

  destroy() {
    this.removeEventListeners();
    this.element.remove();
  }
}