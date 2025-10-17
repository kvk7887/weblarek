import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<unknown> {
  private readonly closeButton: HTMLButtonElement;
  private readonly content: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    super(root);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.root
    );
    this.content = ensureElement<HTMLElement>(".modal__content", this.root);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.closeButton.addEventListener("click", () => this.close());
    this.root.addEventListener("mousedown", this.handleOutsideClick);
  }

  setContent(element: HTMLElement) {
    this.content.replaceChildren(element);
  }

  open() {
    this.root.classList.add("modal_active");
  }

  close() {
    this.root.classList.remove("modal_active");
    this.content.replaceChildren();
  }

  private handleOutsideClick(event: MouseEvent) {
    if (event.target === this.root) {
      this.close();
    }
  }
}


