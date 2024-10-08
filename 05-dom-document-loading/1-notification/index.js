export default class NotificationMessage {
  element;

  constructor(title = '', props = {}) {
    const {
      duration = 0,
      type = '',
    } = props;
    this.duration = duration;
    this.type = type;

    this.title = title;

    this.element = this.show();
  }

  show(targetElement) {
    const element = targetElement || document.createElement('div');
    
    element.innerHTML = this.createTemplate();

    const firstElement = element.firstElementChild;

    if (this.type) {
      firstElement.classList.add(this.type);
    }

    setTimeout(() => this.remove(), this.duration);

    return firstElement;
  }

  createTemplate() {
    return `
      <div class="notification" style="--value:20s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">success</div>
          <div class="notification-body">
            ${this.title}
          </div>
        </div>
      </div>
    `;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
