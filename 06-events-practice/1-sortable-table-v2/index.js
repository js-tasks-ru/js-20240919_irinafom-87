import TableCommmon from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends TableCommmon {
  arrow;

  constructor(headerConfig = [], props = {}) {
    super(headerConfig, props.data);

    const {
      data = [],
      sorted = {},
    } = props;

    this.defaultSorted = {
      id: sorted.id,
      order: sorted.order
    };

    this.arrow = this.createElement(this.createArrowTemplate());

    const defaultSortedCell = this.subElements.header.querySelectorAll(`[data-id=${this.defaultSorted.id}]`)?.[0];
    defaultSortedCell.append(this.arrow);

    this.subElements.header.addEventListener('pointerdown', (e) => this.sortHandler(e));  
    const sortableColumns = this.subElements.header.querySelectorAll('.sortable-table__cell');
    for (let column of sortableColumns) {
      column.setAttribute('data-order', 'asc');
    }
  }

  sortHandler(event) {
    let headerCell = event.target.closest('.sortable-table__cell');

    if (!headerCell || !this.subElements.header.contains(headerCell)) {
      return;
    }

    const fieldValue = headerCell.dataset.id;
    const fieldOrder = headerCell.dataset.order === 'asc' ? 'desc' : 'asc';

    this.sort(fieldValue, fieldOrder);
    headerCell.append(this.arrow);
    headerCell.dataset.order = fieldOrder;
  }

  createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  destroy() {
    document.removeEventListener('pointerdown', (e) => this.sortHandler(e));
    super.destroy();
  }
}