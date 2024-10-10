export default class SortableTable {
  element;
  subElements = {};
  arrow;

  constructor(headerConfig = [], props = {}) {
    this.headerConfig = headerConfig;

    const {
      data = [],
      sorted = {},
    } = props;

    this.data = data;
    this.defaultSorted = {
      id: sorted.id,
      order: sorted.order
    };
    this.fieldsFromHeader = this.headerConfig.map(object => object.id);
    this.element = this.createElement(this.createTableTemplate());

    this.selectSubElements();
    this.arrow = this.createElement(this.createArrowTemplate());

    const defaultSortedCell = this.subElements.header.querySelectorAll(`[data-id=${this.defaultSorted.id}]`)?.[0];
    defaultSortedCell.append(this.arrow);
    
    this.addSortHandler();
  }

  addSortHandler() {
    this.subElements.header.addEventListener('pointerdown', (event) => {

      let headerCell = event.target.closest('.sortable-table__cell');

      if (!headerCell || !this.subElements.header.contains(headerCell)) {
        return;
      }

      const fieldValue = headerCell.dataset.id;
      const fieldOrder = headerCell.dataset.order === 'asc' ? 'desc' : 'asc';

      this.sort(fieldValue, fieldOrder);
      headerCell.append(this.arrow);
      headerCell.dataset.order = fieldOrder;
    });
  }

  createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(item => {
      this.subElements[item.dataset.element] = item;
    });
  }

  sort(fieldValue, orderValue) {
    const locales = ['ru', 'en'];
    const options = { sensitivity: 'variant', caseFirst: 'upper', numeric: true };
    const collator = new Intl.Collator(locales, options);
    const sortDesc = (a, b) => collator.compare(b[fieldValue], a[fieldValue]);
    const sortAsc = (a, b) => collator.compare(a[fieldValue], b[fieldValue]);
    const sortFunction = orderValue === 'asc' ? sortAsc : sortDesc;

    this.data.sort(sortFunction);
    this.subElements.body.innerHTML = this.createRowsTemplate();
  }

  createElement(template) {
    const div = document.createElement('div');

    div.innerHTML = template;

    return div.firstElementChild;
  }

  createHeaderColumnsTemplate() {
    let headerColumns = '';
    for (const headerColumnData of this.headerConfig) {
      headerColumns += `
      <div class="sortable-table__cell" data-id="${headerColumnData.id}" data-sortable="${headerColumnData.sortable}" data-order="asc">
        <span>${headerColumnData.title}</span>
      </div>
    `;
    }
    return headerColumns;
  }

  createRowsTemplate() {
    let row = '';
    for (const item of this.data) {
      let cells = '';
      for (const field of this.fieldsFromHeader) {
        cells += `<div class="sortable-table__cell">${item[field]}</div>`;
      }
      row += `
        <a href="/" class="sortable-table__row">
          ${cells}
        </a>
      `;
    }

    return row;
  }

  createTableTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">

          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.createHeaderColumnsTemplate()}
          </div>

          <div data-element="body" class="sortable-table__body">
            ${this.createRowsTemplate()}
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