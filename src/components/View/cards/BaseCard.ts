import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export interface CardState {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
}

export abstract class BaseCard<T extends CardState> extends Component<T> {
  protected readonly titleEl: HTMLElement;
  protected readonly imageEl: HTMLImageElement | null;
  protected readonly priceEl: HTMLElement | null;
  protected readonly categoryEl: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>(".card__title", container);
    this.imageEl = container.querySelector(".card__image");
    this.priceEl = container.querySelector(".card__price");
    this.categoryEl = container.querySelector(".card__category");
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  set image(value: string) {
    if (this.imageEl) this.setImage(this.imageEl, `${CDN_URL}/${value}`, this.titleEl.textContent || "");
  }

  set category(value: string) {
    if (!this.categoryEl) return;
    this.categoryEl.textContent = value;
    // reset previous modifiers
    Object.values(categoryMap).forEach((cls) => this.categoryEl!.classList.remove(cls));
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) this.categoryEl.classList.add(modifier);
  }

  set price(value: number | null) {
    if (!this.priceEl) return;
    this.priceEl.textContent = value === null ? "Недоступно" : `${value} синапсов`;
  }
}


