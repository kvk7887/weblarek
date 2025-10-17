import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface SuccessState {
  total: number;
}

export class OrderSuccess extends Component<SuccessState> {
  private readonly description: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container
    );
    this.closeButton.addEventListener("click", () =>
      this.events.emit("success:close")
    );
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}


