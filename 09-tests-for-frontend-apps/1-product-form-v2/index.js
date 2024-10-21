import SortableList from '../2-sortable-list/index.js';
import ProductForm from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductFormV2 extends ProductForm {
  constructor (productId) {
    super(productId);
    this.productId = productId;
  }

  async render () {
    return await super.render();
  }

  createList() {
    return new SortableList({ items: [...this.createItems()] }).element;
  }

  createItems() {
    let items = [];
    for (const image of this.data.images) {
      const div = document.createElement('div');
      div.innerHTML = this.createImageTemplate(image.url, image.source);
      items.push(div.firstElementChild);
    }

    return items;
  }
}
