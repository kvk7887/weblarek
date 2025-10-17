import { BaseCard, CardState } from "./BaseCard";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface PreviewState extends CardState {
  inCart: boolean;
  description: string;
}

export class CardPreview extends BaseCard<PreviewState> {
  private readonly button: HTMLButtonElement;
  private readonly textEl: HTMLElement;
  private currentState: PreviewState | null = null;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.button = ensureElement<HTMLButtonElement>(".card__button", container);
    this.textEl = ensureElement<HTMLElement>(".card__text", container);
    this.button.addEventListener("click", () => {
      if (!this.currentState) return;
      const { id, inCart, price } = this.currentState;
      if (price === null) return; // disabled state is handled via Presenter
      this.events.emit(inCart ? "preview:remove" : "preview:buy", { id });
    });
  }

  set description(value: string) {
    this.textEl.textContent = value;
  }

  set inCart(value: boolean) {
    this.button.textContent = value ? "Удалить из корзины" : "В корзину";
  }

  render(data?: Partial<PreviewState>): HTMLElement {
    if (data) {
      this.currentState = { ...this.currentState, ...data } as PreviewState;
    }
    return super.render(data);
  }
}


