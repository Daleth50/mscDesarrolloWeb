from app.view_model.product.main import ProductViewModel
from flask import render_template

class MainView:
    def __init__(self):
        self.product_service = ProductViewModel()

    def render(self):
        products = self.product_service.get_all_products()
        return render_template("index.html", products=products)
    