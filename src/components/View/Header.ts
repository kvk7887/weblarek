import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface HeaderState {
  count: number;
}

export class Header extends Component<HeaderState> {
  private readonly basketButton: HTMLButtonElement;
  private readonly counter: HTMLElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.counter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.basketButton.addEventListener("click", () =>
      this.events.emit("header:basket:open")
    );
  }

  set count(value: number) {
    this.counter.textContent = String(value);
  }
}


