import { BaseForm } from "./BaseForm";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface ContactsState {
  email: string;
  phone: string;
}

export class ContactsForm extends BaseForm<ContactsState> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  protected onChange(): void {
    this.events.emit("contacts:change", {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    });
  }

  protected onSubmit(): void {
    this.events.emit("contacts:submit");
  }

  // Метод для отображения ошибок валидации из модели
  public showValidationErrors(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors);
    this.setErrors(errorMessages.join(". "));
    this.setSubmitEnabled(errorMessages.length === 0);
  }
}


