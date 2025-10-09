import { IProduct } from "../../types/index";

export class Products {
  private items: IProduct[] = []; // Массив всех товаров
  private viewItem: IProduct | null = null; // Товар, выбранный для отображения

  constructor() {
    this.items = [];
    this.viewItem = null;
  }

  // сохранение массива товаров полученного в параметрах метода
  setItems(items: IProduct[]): void {
    this.items = items;
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
  }

  // получение товара для подробного отображения
  getViewItem(): IProduct | null {
    return this.viewItem;
  }
}
