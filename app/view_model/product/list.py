from app.view_model.product.main import ProductViewModel


class ProductListViewModel:
    def __init__(self):
        self.product_service = ProductViewModel()

    def get_products_table_data(self):
        return self.product_service.list_products()

    def delete_product(self, product_id):
        return self.product_service.delete_product(product_id)