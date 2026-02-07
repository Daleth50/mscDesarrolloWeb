from app.models.inventory.product import Product
from app.view_model.product.main import ProductViewModel
from flask import render_template

class ProductDetailView:
    def __init__(self):
        self.product_service = ProductViewModel()

    def render(self, product_id):
        product = self.product_service.get_product_by_id(product_id)
        if product:
            return render_template("products/product-detail.html", product=product)
        else:
            return "Product not found", 404
