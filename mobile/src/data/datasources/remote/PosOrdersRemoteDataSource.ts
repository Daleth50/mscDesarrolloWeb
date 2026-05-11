import type { CartItem } from "domain/entities/Cart";
import { ApiClient } from "infrastructure/http/ApiClient";

type CreateCartResponse = {
  id: string;
};

export class PosOrdersRemoteDataSource {
  constructor(private readonly apiClient: ApiClient) {}

  async createCart(token: string, contactId: string): Promise<CreateCartResponse> {
    return this.apiClient.post<CreateCartResponse>(
      "/api/pos/cart",
      {
        contact_id: contactId,
        payment_status: "pending",
      },
      token,
    );
  }

  async addCartItem(token: string, cartId: string, item: CartItem): Promise<void> {
    await this.apiClient.post(
      `/api/pos/cart/${cartId}/items`,
      {
        product_id: item.productId,
        quantity: item.quantity,
      },
      token,
    );
  }

  async completeCart(
    token: string,
    cartId: string,
    input: { billAccountId: string; paymentMethod: "cash" | "transfer" },
  ): Promise<void> {
    await this.apiClient.post(
      `/api/pos/cart/${cartId}/complete`,
      {
        bill_account_id: input.billAccountId,
        payment_method: input.paymentMethod,
      },
      token,
    );
  }
}
