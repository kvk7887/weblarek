import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Cart {
  private items: IProduct[] = []; // Массив всех товаров
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.items = [];
    this.events = events;
  }

  // получение массива товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // добавление товара, который был получен в параметре, в массив корзины
  addItem(item: IProduct): void {
    this.items.push(item);
    this.emitChanged();
  }

  // удаление товара, полученного в параметре из массива корзины
  removeItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.emitChanged();
  }

  // очистка корзины
  clear(): void {
    this.items = [];
    this.emitChanged();
  }

  // получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  // получение количества товаров в корзине
  getTotalCount(): number {
    return this.items.length;
  }

  // проверка наличия товара в корзине по его id, полученного в параметр метода
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  private emitChanged() {
    this.events?.emit("cart:changed", {
      items: this.items,
      total: this.getTotalPrice(),
      count: this.getTotalCount(),
    });
  }
}
