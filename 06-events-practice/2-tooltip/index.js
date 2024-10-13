class Tooltip {
  element;
  static instance;
  static tipOffset = { x: 10, y: 10 }

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.element = this.createElement(this.createTemplate(''));
  }

  initialize() {
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointerout', this.handlePointerOut);
  }

  handlePointerMove = (event) => {
    if (this.element) {
      this.element.style.left = `${event.target.clientX + Tooltip.tipOffset.x}px`;
      this.element.style.top = `${event.target.clientY + Tooltip.tipOffset.y}px`;
    }
  }

  handlePointerOver = (event) => {
    const target = event.target.closest('[data-tooltip]');
    if (!target) {
      return;
    }
    this.render(target.dataset.tooltip);
  }

  render(tip) {
    this.element.innerHTML = tip;
    document.body.append(this.element);
  }

  handlePointerOut = (event) => {
    this.remove();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  } 

  createTemplate(tip) {
    return `<div class="tooltip">${tip}</div>`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
  }
}

export default Tooltip;