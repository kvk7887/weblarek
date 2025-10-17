import './scss/styles.scss';
import { Products } from './components/Models/Products.ts';
import { Cart } from './components/Models/Cart.ts';
import { Buyer } from './components/Models/Buyer.ts';
//import { apiProducts } from "./utils/data";
import { IBuyer, IOrderRequest, TPayment, IProduct } from "./types/index";
import { ShopApi } from "./components/Api/ShopApi.ts";
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/cards/CardCatalog';
import { CardPreview } from './components/View/cards/CardPreview';
import { BasketView } from './components/View/BasketView';
import { CardBasket } from './components/View/cards/CardBasket';
import { OrderForm } from './components/View/forms/OrderForm';
import { ContactsForm } from './components/View/forms/ContactsForm';
import { OrderSuccess } from './components/View/OrderSuccess';
import { ensureElement, cloneTemplate } from './utils/utils';
const log = console.log;
const logTable = console.table;


const events = new EventEmitter();

// Model
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Api
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Views
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

let contactsForm: ContactsForm | null = null;

// Templates
const tplCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
const tplBasketItem = ensureElement<HTMLTemplateElement>('#card-basket');
const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');

// Helpers
function createCatalogCard(product: IProduct): HTMLElement {
  const el = cloneTemplate<HTMLElement>(tplCatalog);
  const card = new CardCatalog(el, events).render({
    id: product.id,
    title: product.title,
    image: product.image,
    category: product.category,
    price: product.price,
  });
  return card;
}

function renderCatalog(items: IProduct[]) {
  const nodes = items.map(createCatalogCard);
  gallery.render({ items: nodes });
}

function openPreview(product: IProduct) {
  const el = cloneTemplate<HTMLElement>(tplPreview);
  const card = new CardPreview(el, events);
  const inCart = cartModel.hasItem(product.id);
  card.render({
    id: product.id,
    title: product.title,
    image: product.image,
    category: product.category,
    price: product.price,
    description: product.description,
    inCart,
  });
  // disable buy if no price
  const btn = el.querySelector<HTMLButtonElement>('.card__button');
  if (btn && product.price === null) {
    btn.disabled = true;
    btn.textContent = 'Недоступно';
  }
  modal.setContent(card.render());
  modal.open();
}

function openBasket() {
  const el = cloneTemplate<HTMLElement>(tplBasket);
  const view = new BasketView(el, events);
  const items = cartModel.getItems().map((p, i) => {
    const li = cloneTemplate<HTMLElement>(tplBasketItem);
    return new CardBasket(li, events).render({
      id: p.id,
      title: p.title,
      image: p.image,
      category: p.category,
      price: p.price,
      index: i + 1,
    });
  });
  view.render({ items, total: cartModel.getTotalPrice(), isEmpty: items.length === 0 });
  modal.setContent(view.render());
  modal.open();
}

function openOrderStep1() {
  const el = cloneTemplate<HTMLElement>(tplOrder);
  const form = new OrderForm(el as HTMLFormElement, events);
  modal.setContent(form.render());
}

function openOrderStep2() {
  const el = cloneTemplate<HTMLElement>(tplContacts);
  contactsForm = new ContactsForm(el as HTMLFormElement, events);
  modal.setContent(contactsForm.render());
}

function openSuccess(total: number) {
  const el = cloneTemplate<HTMLElement>(tplSuccess);
  const success = new OrderSuccess(el, events);
  success.render({ total });
  modal.setContent(success.render());
}

// Event wiring
events.on<{ items: IProduct[] }>('products:changed', ({ items }) => {
  renderCatalog(items);
});

events.on('header:basket:open', () => openBasket());

events.on<{ id: string }>('catalog:card:selected', ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) {
    productsModel.setViewItem(product);
  }
});

events.on<{ item: IProduct | null }>('product:view:changed', ({ item }) => {
  if (item) openPreview(item);
});

events.on<{ id: string }>('preview:buy', ({ id }) => {
  const product = productsModel.getItemById(id);
  if ( !product ) return;
  if ( product.price === null ) return;
  if ( cartModel.hasItem(product.id) ) return;
  cartModel.addItem(product);
  modal.close();
});

events.on<{ id: string }>('preview:remove', ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) cartModel.removeItem(product);
  modal.close();
});

events.on('basket:checkout', () => openOrderStep1());

events.on<{ id: string }>('basket:item:remove', ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) cartModel.removeItem(product);
});

events.on('cart:changed', () => {
  header.render({ count: cartModel.getTotalCount() });
  if (document.querySelector('#modal-container.modal_active')) openBasket();
});

events.on<{ payment: TPayment | null; }>('order:change', ({ payment }) => {
  buyerModel.setData({ payment });
});

events.on<{ address: string }>('order:change', ({ address }) => {
  buyerModel.setAddress(address);
});

events.on('order:next', () => openOrderStep2());

events.on<{ email: string; phone: string }>('contacts:change', ({ email, phone }) => {
  buyerModel.setData({ email, phone });
});

events.on('contacts:submit', async () => {
  const validationErrors = buyerModel.validate();
  if (Object.keys(validationErrors).length > 0) {
    console.error('Ошибки валидации:', validationErrors);
    // Отображаем ошибки в форме
    if (contactsForm) {
      contactsForm.showValidationErrors(validationErrors);
    }
    return;
  }

  const order: IOrderRequest = {
    payment: buyerModel.getData().payment,
    email: buyerModel.getData().email,
    phone: buyerModel.getData().phone,
    address: buyerModel.getData().address,
    total: cartModel.getTotalPrice(),
    items: cartModel.getItems().map((i) => i.id),
  };
  try {
    const res = await shopApi.createOrder(order);
    openSuccess(res.total ?? order.total);
    cartModel.clear();
    buyerModel.clear();
  } catch (e) {
    console.error('Ошибка создания заказа', e);
  }
});

events.on('success:close', () => {
  modal.close();
});

// Класс каталог
/*
log("Инициализация каталога");

log("Массив товаров из data:");
const dataProducts = apiProducts.items;
logTable(dataProducts);


log("Products::setItems");
productsModel.setItems(dataProducts);

log("Массив товаров из каталога:");
log("Products::getItems");
logTable(productsModel.getItems());

log("Товар из каталога с id: ", dataProducts[0].id);
log("Products::getItemById");
logTable(productsModel.getItemById(dataProducts[0].id));

log("Сохранение товара для отображения:");
productsModel.setViewItem(productsModel.getItems()[1]);

log("Товар для отображения:")
logTable(productsModel.getViewItem());

*/

// Класс Покупатель
/*
log("Инициализация покупателя");
const buyerModel1 = new Buyer();

const buyerData: IBuyer = {
    payment: 'card',
    email: 'ivan1994@mail.ru',
    phone: '+7445005757',
    address: 'Belarus',
  };

buyerModel1.setData(buyerData);

logTable(buyerModel1.getData());
log("Проверка валидации:", buyerModel1.validate());

const buyerModel2 = new Buyer();
log('Оплата')
buyerModel2.setPayment('cash');

log('Почта');
buyerModel2.setEmail('test@example.com');

log('Телефон');
buyerModel2.setPhone('+7291234567');

log('Адрес');
buyerModel2.setAddress('Test Address');

log("Получены все данные покупателя:");
logTable(buyerModel2.getData());

log("Очистка данных покупателя:");
buyerModel2.clear();

log("Проверка после удаления данных:");
logTable(buyerModel2.getData());

log("Проверка валидации без ошибок: ", buyerModel1.validate());

buyerModel1.setAddress("");
log("Проверка валидации c ошибкой: ", buyerModel1.validate());

*/
// Класс корзина
/*
log("Инициализация корзины");

const selectedItem1 = productsModel.getItemById(dataProducts[0].id);
const selectedItem2 = productsModel.getItemById(dataProducts[1].id);

if (selectedItem1 !== undefined) {
    log("Добавляем первый товар)");
    cartModel.addItem(selectedItem1);
}

if (selectedItem2 !== undefined) {
    log("Добавляем второй товар)");
    cartModel.addItem(selectedItem2);
}

log("Проверка наличия товара в корзине c id:", dataProducts[0].id);
log(cartModel.hasItem(dataProducts[0].id));

log("Проверка наличия товара в корзине c id: bla bla");
log(cartModel.hasItem("bla bla"));

log("Смотрим содержимое корзины:");
logTable(cartModel.getItems());

log("Общая стоимость товаров в корзине: ", cartModel.getTotalPrice());
log("Общее количество товаров в корзине: ", cartModel.getTotalCount());

if (selectedItem1 !== undefined) {
log("Удаляем товар из корзины:");
cartModel.removeItem(selectedItem1);
}

log("Смотрим содержимое корзины:");
logTable(cartModel.getItems());

log("Очищаем корзину");
cartModel.clear();

log("Проверяем пустую корзину:");
logTable(cartModel.getItems());
*/

// Load catalog from API
shopApi
  .getProducts()
  .then((products) => {
    console.log("Получение данных по api:");
    productsModel.setItems(products);
    //log("Массив товаров из каталога по api:");
    //log("Products::getItems");
    //logTable(productsModel.getItems());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });

/*
const orderRequest: IOrderRequest = {
    payment: 'card',
    email: 'ivan1994@mail.ru',
    phone: '+7445005757',
    address: 'Belarus',
    total: dataProducts[1].price ? dataProducts[1].price : 0,
    items: [dataProducts[1].id]
}

shopApi.createOrder(orderRequest)
    .then((orderResponse) => {
        console.log("Полученно результата создания заказа по api:");
        logTable(orderResponse);
    })
  .catch((error) => {
    console.error('Ошибка создания заказа ', error);
  });
*/
