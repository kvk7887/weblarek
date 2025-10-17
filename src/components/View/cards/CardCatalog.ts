import { BaseCard, CardState } from "./BaseCard";
import { IEvents } from "../../base/Events";

export class CardCatalog extends BaseCard<CardState> {
  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    container.addEventListener("click", () => {
      const id = (this as unknown as CardState).id;
      if (id) this.events.emit("catalog:card:selected", { id });
    });
  }
}


