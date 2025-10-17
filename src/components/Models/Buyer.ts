import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment | null;
  private email: string;
  private phone: string;
  private address: string;
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events = events;
  }

  // сохранение данных в модели
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
    if (data.address !== undefined) this.address = data.address;
    this.emitChanged();
  }

  // сохранение способа оплаты
  setPayment(payment: TPayment): void {
      this.payment = payment;
      this.emitChanged();
  }

  // сохранение email
  setEmail(email: string): void {
      this.email = email;
      this.emitChanged();
  }

  // сохранение телефона
  setPhone(phone: string): void {
      this.phone = phone;
      this.emitChanged();
  }

  // сохранение адреса
  setAddress(address: string): void {
      this.address = address;
      this.emitChanged();
  }

  // получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  // очистка данных покупателя
  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.emitChanged();
  }
  
  // валидация данных
  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.payment) {
      errors.payment = "Укажите способ оплаты";
    }
    if (!this.email) {
      errors.email = "Укажите электронную почту";
    }
    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this.address) {
      errors.address = "Укажите адрес";
    }
    return errors;
  }

  private emitChanged() {
    this.events?.emit("buyer:changed", { buyer: this.getData() });
  }
}
