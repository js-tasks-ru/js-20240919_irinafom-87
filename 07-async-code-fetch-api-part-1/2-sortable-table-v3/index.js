import fetchJson from './utils/fetch-json.js';
import TableBase from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends TableBase {
  start = 0;
  end = 10;
  fieldValue = 'title';
  fieldOrder = 'asc';

  constructor(headersConfig, props = {}) {
    super(headersConfig, props);
    const {
      url = '',
      isSortLocally = false
    } = props;
    this.url = url;
    this.isSortLocally = isSortLocally;

    this.addLoadingElement(this.createLoadingTemplate());
    this.selectSubElements();

    this.to = new Date();
    this.from = new Date();
    this.from.setDate(this.to.getMonth() - 1);
    this.render();

    this.handleWindowScroll = this.handleWindowScroll.bind(this);
    window.addEventListener('scroll', this.handleWindowScroll);
  }

  handleHeaderPointerDown() {
    super.handleHeaderPointerDown();
    this.subElements.body.innerHTML = this.createRowsTemplate();
  }

  async handleWindowScroll() {
    // нижняя граница документа
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    let loadingCondition = windowRelativeBottom > document.documentElement.clientHeight + 100;
    // если пользователь не прокрутил достаточно далеко (>100px до конца страницы) — прерываем цикл
    if (loadingCondition) {
      return;
    }  
     
    // добавим больше данных
    this.start += 10;
    this.end += 10;
    await this.loadData({ id: this.fieldValue, order: this.fieldOrder });
    this.subElements.body.innerHTML = this.createRowsTemplate();
  }

  async loadData(sorted = { id: 'title', order: 'asc' }) {
    const url = new URL(`${BACKEND_URL}/${this.url}`);
    url.searchParams.set('from', this.from);
    url.searchParams.set('to', this.to);
    url.searchParams.set('_sort', sorted.id);
    url.searchParams.set('_order', sorted.order);
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);

    const data = await fetchJson(url.toString());

    this.data = data;
  }

  async render() {
    await this.loadData();
    this.subElements.body.innerHTML = this.createRowsTemplate();
  }

  async sortOnServer(fieldValue, fieldOrder) {
    await this.loadData({ id: fieldValue, order: fieldOrder });
    this.subElements.body.innerHTML = this.createRowsTemplate();
  }

  addLoadingElement(template) {
    const loadingElement = document.createElement('div');
    loadingElement.innerHTML = template;

    this.element.firstElementChild.append(loadingElement.firstElementChild);
  }

  createLoadingTemplate() {
    return `
      <div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    `;
  }
}
