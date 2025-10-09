import './scss/styles.scss';
import { Products } from './components/Models/Products.ts';
import { Cart } from './components/Models/Cart.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { apiProducts } from "./utils/data";
import { IBuyer, IOrderRequest } from "./types/index";
import { ShopApi } from "./components/Api/ShopApi.ts";
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants';
const log = console.log;
const logTable = console.table;

// Класс каталог
log("Инициализация каталога");

log("Массив товаров из data:");
const dataProducts = apiProducts.items;
logTable(dataProducts);

const productsModel = new Products();

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


// Класс Покупатель
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


// Класс корзина
log("Инициализация корзины");
const cartModel = new Cart();

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

// Проверка API
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

shopApi
  .getProducts()
  .then((products) => {
    console.log("Получение данных по api:");
    logTable(products);
    productsModel.setItems(products);
    log("Массив товаров из каталога по api:");
    log("Products::getItems");
    logTable(productsModel.getItems());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });

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
