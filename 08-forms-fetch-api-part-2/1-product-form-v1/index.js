import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const PRODUCTS_PATH = 'api/rest/products';

export default class ProductForm {
  element;
  subElements = {};
  categories;
  productId;
  savedEvent = new CustomEvent('product-saved');
  updatedEvent = new CustomEvent('product-updated');
  constructor (productId) {
    this.productId = productId;

    this.element = this.createElement(this.createElementTemplate());
    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(item => {
      this.subElements[item.dataset.element] = item;
    });
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

  async render () {
    await this.loadData();
    document.body.append(this.element);
  }

  async loadData() {
    await this.loadCategories();
    if (this.productId) {
      await this.loadProduct();
    }
  }

  async loadProduct() {
    const url = new URL(`${BACKEND_URL}/${PRODUCTS_PATH}`);
    url.searchParams.set('id', this.productId);
    const result = await fetchJson(url.toString());
    this.data = result[0];
    this.fillFormData();
    this.fillImagesData();

    this.subElements.productForm.addEventListener('submit', this.handleSubmit);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.save();
  }

  async save() {
    const url = new URL(`${BACKEND_URL}/${PRODUCTS_PATH}`);
    const formData = new FormData(this.subElements.productForm);
    const method = this.productId ? 'PATCH' : 'PUT';
    const result = await fetchJson(url.toString(), {
      body: formData,
      method: method
    });

    const customEvent = this.productId ? this.updatedEvent : this.savedEvent ;

    this.element.dispatchEvent(customEvent);
  }

  fillImagesData() {
    const imageContainer = this.subElements.imageListContainer.firstElementChild;
    for (let image of this.data.images) {
      const div = document.createElement('div');
      div.innerHTML = this.createImageTemplate(image.url, image.source);
      imageContainer.append(div.firstElementChild);
    }
  }

  createImageTemplate(url, source) {
    return `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${url}">
        <input type="hidden" name="source" value="${source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="${source}" src="${url}">
          <span>${source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `;
  }

  fillFormData() {
    const defaultFormData = {
      title: '',
      description: '',
      quantity: 1,
      subcategory: '',
      status: 1,
      price: 100,
      discount: 0
    };

    const keys = Object.keys(defaultFormData);

    for (const key of keys) {
      this.subElements.productForm.querySelector(`#${key}`).value = this.data[key];
      this.subElements.productForm.querySelector(`#${key}`).setAttribute('value', this.data[key]);
    }

    // const formData = new FormData(this.subElements.productForm);
    // console.log(...formData);
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
              <input required="" type="text" name="title" id="title" value="" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" id="description" value="" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list">
              </ul>
            </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select data-element="subcategory" class="form-control" name="subcategory" id="subcategory" value="">
              <option value="progulki-i-detskaya-komnata">Детские товары и игрушки &gt; Прогулки и детская комната</option>
              <option value="kormlenie-i-gigiena">Детские товары и игрушки &gt; Кормление и гигиена</option>
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" id="price" value="" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" id="discount" value="" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" id="quantity" value="" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status" id="status" value="">
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

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
