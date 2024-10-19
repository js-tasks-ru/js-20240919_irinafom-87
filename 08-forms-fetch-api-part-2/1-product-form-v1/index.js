import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};
  categories;
  constructor (productId) {
    this.productId = productId;

    this.element = this.createElement(this.createElementTemplate());
    this.selectSubElements();

    this.loadData();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(item => {
      this.subElements[item.dataset.element] = item;
    });
    // console.dir(this.subElements);
  }

  async loadData() {
    await this.loadCategories();
    if (this.productId) {
      await this.loadProduct();
    }
  }

  async loadProduct() {
    const path = 'api/rest/products';
    const url = new URL(`${BACKEND_URL}/${path}`);
    url.searchParams.set('id', this.productId);
    const result = await fetchJson(url.toString());
    this.data = result[0];
    this.fillFormData();
  }

  fillFormData() {
    console.dir('fill');
    const defaultFormData = {
      title: '',
      // description: '',
      // quantity: 1,
      // subcategory: '',
      // status: 1,
      // price: 100,
      // discount: 0
    };

    const keys = Object.keys(defaultFormData);
    console.dir('----');
    // console.dir(this.data);
    for (const key of keys) {
      this.subElements.productForm.querySelector(`#${key}`).value = this.data[key];

      console.dir(key);
      console.dir(this.subElements.productForm.querySelector(`#${key}`).value);
    }
  }

  async loadCategories() {
    const path = 'api/rest/categories';
    const url = new URL(`${BACKEND_URL}/${path}`);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');
    const data = await fetchJson(url.toString());

    this.categories = data; 
    this.subElements.subcategory.innerHTML = this.createOptionsListTemplate(data);
    return data;    
  }

  createOptionsListTemplate(categories) {
    let options = [];
    for (let category of categories) {
      for (let subcategory of category.subcategories) {
        const option = `<option value="${subcategory.id}">${category.title} > ${subcategory.title}</option>`;
        options.push(option);
      }
    }

    return options.join('');
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createElementTemplate() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" name="title" id="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" id="description" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer"><ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
              <input type="hidden" name="url" value="https://fototrap.ru/wp-content/uploads/2023/10/milyi-multiashnyi-kot-1-1.webp">
              <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
              <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="https://fototrap.ru/wp-content/uploads/2023/10/milyi-multiashnyi-kot-1-1.webp">
                <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
              </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
              </button></li></ul></div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select data-element="subcategory" class="form-control" name="subcategory" id="subcategory">
              <option value="progulki-i-detskaya-komnata">Детские товары и игрушки &gt; Прогулки и детская комната</option>
              <option value="kormlenie-i-gigiena">Детские товары и игрушки &gt; Кормление и гигиена</option>
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" id="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" id="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" id="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status" id="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  async render () {
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
