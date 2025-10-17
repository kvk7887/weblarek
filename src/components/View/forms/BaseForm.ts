import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export abstract class BaseForm<TState extends object> extends Component<TState> {
  protected readonly form: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsEl: HTMLElement;

  constructor(container: HTMLElement, protected readonly events: IEvents) {
    super(container);
    this.form = container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>("button[type=submit]", container);
    this.errorsEl = ensureElement<HTMLElement>(".form__errors", container);
    this.form.addEventListener("input", () => this.onChange());
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected setErrors(text: string) {
    this.errorsEl.textContent = text;
  }

  protected setSubmitEnabled(isEnabled: boolean) {
    this.submitButton.disabled = !isEnabled;
  }

  protected abstract onChange(): void;
  protected abstract onSubmit(): void;
}


