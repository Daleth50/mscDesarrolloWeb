from app.view_model.product.main import ProductViewModel
from flask import render_template

class MainViewModel:
    def __init__(self):
       self.product_service = ProductViewModel()

    def get_index_data(self):
        return self.product_service.get_all_products()