from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from app.views.main import MainView
from app.views.inventory.main import InventoryView
from app.views.inventory.product_detail import ProductDetailView

main_bp = Blueprint("main", __name__)


@main_bp.route("/", methods=["GET"])
def index():
    return MainView().render()


@main_bp.route("/health", methods=["GET"])
def health():
    """Health check for load balancers"""
    return jsonify({"status": "healthy"}), 200


# Ruta detalle de producto
@main_bp.route("/product/<int:product_id>")
def product_detail(product_id):
    return ProductDetailView().render(product_id)


@main_bp.route("/product/new/product", methods=["GET", "POST"])
def new_product():
    if request.method == "POST":
        form_data = request.form
        try:
            new_product = InventoryView().create_product(form_data)
            return redirect(
                url_for("main.product_detail", product_id=new_product["id"])
            )
        except ValueError as e:
            return render_template("products/new-product.html", error=str(e))
    return render_template("products/new-product.html")
