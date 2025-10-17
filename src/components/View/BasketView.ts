import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface BasketState {
  items: HTMLElement[];
  total: number;
  isEmpty: boolean;
}

export class BasketView extends Component<BasketState> {
  private readonly list: HTMLElement;
  private readonly totalEl: HTMLElement;
  private readonly checkoutButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.list = ensureElement<HTMLElement>(".basket__list", container);
    this.totalEl = ensureElement<HTMLElement>(".basket__price", container);
    this.checkoutButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );
    this.checkoutButton.addEventListener("click", () =>
      this.events.emit("basket:checkout")
    );
  }

  set items(value: HTMLElement[]) {
    if (value.length === 0) {
      this.list.replaceChildren(document.createTextNode("Корзина пуста"));
    } else {
      this.list.replaceChildren(...value);
    }
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }

  set isEmpty(value: boolean) {
    this.checkoutButton.disabled = value;
  }
}


