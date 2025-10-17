import { BaseCard, CardState } from "./BaseCard";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface BasketState extends CardState {
  index: number;
}

export class CardBasket extends BaseCard<BasketState> {
  private readonly deleteButton: HTMLButtonElement;
  private readonly indexEl: HTMLElement;
  private currentId: string | null = null;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.indexEl = ensureElement<HTMLElement>(".basket__item-index", container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );
    this.deleteButton.addEventListener("click", () => {
      if (this.currentId) {
        this.events.emit("basket:item:remove", { id: this.currentId });
      }
    });
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }

  render(data?: Partial<BasketState>): HTMLElement {
    if (data && data.id) {
      this.currentId = data.id;
    }
    return super.render(data);
  }
}


