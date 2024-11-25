import { Api, ApiListResponse } from './api';
import { RemoteAPI, IProduct, IOrder, ILarekAPI } from "../../types";

export class LarekAPI extends Api implements ILarekAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
        (item: IProduct) => ({
            ...item,
            image: this.cdn + item.image,
        })
    );
  }

  getProductList(): Promise<RemoteAPI.IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<RemoteAPI.IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

  orderProducts(order: IOrder): Promise<RemoteAPI.IOrder> {
    return this.post(`/order`, order).then(
      (data: RemoteAPI.IOrder) => data
    );
  }

}
