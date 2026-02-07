from app.view_model.product.main import ProductViewModel

class InventoryView:
    def __init__(self):
        self.product_service = ProductViewModel()

    def get_index_data(self):
        return self.product_service.get_all_products()
    
    def get_product_detail_data(self, product_id):
        product = self.product_service.get_product_by_id(product_id)
        return product
    
    def create_product(self, form_data):
        return self.product_service.create_product(form_data)