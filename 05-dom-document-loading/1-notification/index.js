export default class NotificationMessage {
  element;
  timerId;
  static lastShownComponent;

  constructor(title = '', props = {}) {
    const {
      duration = 0,
      type = '',
    } = props;
    this.duration = duration;
    this.type = type;

    this.title = title;

    this.element = this.createElement();
  }

  createElement() {  
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();

    const firstElement = element.firstElementChild;

    return firstElement;
  }

  show(targetElement = document.body) {
    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.destroy();
    }
    NotificationMessage.lastShownComponent = this;
    targetElement.append(this.element);
    this.timerId = setTimeout(() => this.remove(), this.duration);
  }

  createTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:20s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
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
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }
}
