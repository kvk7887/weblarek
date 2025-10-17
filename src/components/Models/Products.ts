import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Products {
  private items: IProduct[] = []; // Массив всех товаров
  private viewItem: IProduct | null = null; // Товар, выбранный для отображения
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.items = [];
    this.viewItem = null;
    this.events = events;
  }

  // сохранение массива товаров полученного в параметрах метода
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events?.emit("products:changed", { items: this.items });
  }

  // получение массива товаров из модели
  getItems(): IProduct[] {
    return this.items;
  }

  // получение одного товара по его id
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // сохранение товара для подробного отображения
  setViewItem(item: IProduct): void {
    this.viewItem = item;
    this.events?.emit("product:view:changed", { item: this.viewItem });
  }

  // получение товара для подробного отображения
  getViewItem(): IProduct | null {
    return this.viewItem;
  }
}
