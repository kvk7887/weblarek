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
  private currentId: string | null = null;
  private currentInCart: boolean = false;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.button = ensureElement<HTMLButtonElement>(".card__button", container);
    this.textEl = ensureElement<HTMLElement>(".card__text", container);
    this.button.addEventListener("click", () => {
      if (!this.currentId) return;
      this.events.emit(this.currentInCart ? "preview:remove" : "preview:buy", { id: this.currentId });
    });
  }

  set description(value: string) {
    this.textEl.textContent = value;
  }

  set inCart(value: boolean) {
    this.currentInCart = value;
    this.button.textContent = value ? "Удалить из корзины" : "В корзину";
  }

  render(data?: Partial<PreviewState>): HTMLElement {
    if (data) {
      // Сохраняем только необходимые данные
      if (data.id) this.currentId = data.id;
      if (data.inCart !== undefined) this.currentInCart = data.inCart;
      
      // Обрабатываем состояние кнопки в зависимости от цены
      if (data.price === null) {
        this.button.disabled = true;
        this.button.textContent = 'Недоступно';
      } else {
        this.button.disabled = false;
        // Восстанавливаем правильный текст кнопки
        this.button.textContent = this.currentInCart ? "Удалить из корзины" : "В корзину";
      }
    }
    return super.render(data);
  }
}


