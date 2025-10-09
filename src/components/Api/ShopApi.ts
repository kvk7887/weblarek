import { IApi, IOrderRequest, IOrderResponse, IProduct } from "../../types";

export class ShopApi {
    constructor(private api: IApi) {
        this.api = api; 
    }

    // Получение списка товаров
    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{ total: number; items: IProduct[] }>('/product/');
        return response.items;
    }

    // Создание заказа
    async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post('/order/', order);
    }
}