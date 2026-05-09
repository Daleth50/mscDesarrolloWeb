import type { ProductsLocalDataSource } from "data/datasources/local/ProductsLocalDataSource";

export class GetLocalProductsUseCase {
  constructor(private readonly productsLocalDataSource: ProductsLocalDataSource) {}

  execute() {
    return this.productsLocalDataSource.getProducts();
  }
}
