import { BaseForm } from "./BaseForm";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";

interface OrderFormState {
  payment: TPayment;
  address: string;
}

export class OrderForm extends BaseForm<OrderFormState> {
  private readonly addressInput: HTMLInputElement;
  private readonly payCardBtn: HTMLButtonElement;
  private readonly payCashBtn: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );
    this.payCardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.payCashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

    this.payCardBtn.addEventListener("click", () => this.setPayment("card"));
    this.payCashBtn.addEventListener("click", () => this.setPayment("cash"));
  }

  set payment(value: TPayment) {
    this.togglePaymentButtons(value);
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  private setPayment(payment: TPayment) {
    this.togglePaymentButtons(payment);
    this.events.emit("order:change", {
      payment,
      address: this.addressInput.value,
    });
    this.validate();
  }

  private togglePaymentButtons(payment: TPayment) {
    const active = "button_alt-active";
    [this.payCardBtn, this.payCashBtn].forEach((b) => b.classList.remove(active));
    if (payment === "card") this.payCardBtn.classList.add(active);
    if (payment === "cash") this.payCashBtn.classList.add(active);
  }

  protected onChange(): void {
    this.events.emit("order:change", {
      payment: this.payCardBtn.classList.contains("button_alt-active")
        ? "card"
        : this.payCashBtn.classList.contains("button_alt-active")
        ? "cash"
        : null,
      address: this.addressInput.value,
    });
    this.validate();
  }

  protected onSubmit(): void {
    if (this.validate()) this.events.emit("order:next");
  }

  private validate(): boolean {
    const payment = this.payCardBtn.classList.contains("button_alt-active")
      ? "card"
      : this.payCashBtn.classList.contains("button_alt-active")
      ? "cash"
      : null;
    const address = this.addressInput.value.trim();
    const errors: string[] = [];
    if (!payment) errors.push("Укажите способ оплаты");
    if (!address) errors.push("Укажите адрес");
    this.setErrors(errors.join(". "));
    this.setSubmitEnabled(errors.length === 0);
    return errors.length === 0;
  }
}


