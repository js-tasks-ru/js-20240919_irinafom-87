import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;
  data = [];

  constructor(props = {}) {
    const {
      url = '',
      range = {},
      label = '',
      link = '#',
      data = []
    } = props;
    const { from = new Date().setDate(new Date().getMonth() - 1), to = new Date() } = range;

    this.url = url;
    this.from = from;
    this.to = to;
    this.label = label;
    this.link = link;
    this.data = data;

    this.element = this.createElement(this.createElementTemplate());
    this.selectSubElements();
    this.toggleChartLoadingClass();
  }

  selectSubElements() {
    const dataElements = this.element.querySelectorAll('[data-element]');
    dataElements.forEach(item => {
      this.subElements[item.dataset.element] = item;
    });
  }

  async update() {
    const url = new URL(`${BACKEND_URL}/${this.url}`);
    url.searchParams.set('from', this.from);
    url.searchParams.set('to', this.to);
    
    const data = await fetchJson(url.toString());

    this.data = Array.from(Object.entries(data));
    this.toggleChartLoadingClass();

    this.subElements.body.innerHTML = this.createChartTemplate();
    return data;
  }

  toggleChartLoadingClass() {
    if (this.data.length == 0) {
      this.element.classList.add('column-chart_loading');
    } else {
      this.element.classList.remove('column-chart_loading');
    }
  }

  createChartTemplate() {
    const columnsProps = this.getColumnProps(this.data.map(dayData => dayData[1]));
    return columnsProps.map(
      ({ value, percent }) => (`<div style="--value: ${value}" data-tooltip="${percent}"></div>`))
      .join('');
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;
  
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createElementTemplate() {
    return `
      <div class="dashboard__chart_orders">
        <div class="column-chart" style="--chart-height: 50">
          <div class="column-chart__title">
            ${this.label}
            <a href="/sales" class="column-chart__link">View all</a>
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">344</div>
            <div data-element="body" class="column-chart__chart">
              ${this.createChartTemplate()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    this.element.remove();
  }
}
