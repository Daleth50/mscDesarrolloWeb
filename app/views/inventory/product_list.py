from flask import render_template
from app.view_model.product.list import ProductListViewModel


class ProductListView:
    def __init__(self):
        self.product_list_view_model = ProductListViewModel()

    def render(self):
        products = self.product_list_view_model.get_products_table_data()
        return render_template("products/list-products.html", products=products)