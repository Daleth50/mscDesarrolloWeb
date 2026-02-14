from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from app.views.main import MainView
from app.views.inventory.main import InventoryView
from app.views.inventory.product_detail import ProductDetailView
from app.views.inventory.product_list import ProductListView
from app.views.pos.main import PosView
from app.views.pos.contact_list import ContactListView

main_bp = Blueprint("main", __name__)


@main_bp.route("/", methods=["GET"])
def index():
    return MainView().render()


@main_bp.route("/products", methods=["GET"])
def products_list():
    return ProductListView().render()


@main_bp.route("/contacts", methods=["GET"])
def contacts_list():
    return ContactListView().render()


@main_bp.route("/health", methods=["GET"])
def health():
    """Health check for load balancers"""
    return jsonify({"status": "healthy"}), 200


# Ruta detalle de producto
@main_bp.route("/product/<string:product_id>")
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


@main_bp.route("/contact/new", methods=["GET", "POST"])
def new_contact():
    if request.method == "POST":
        form_data = request.form
        try:
            PosView().create_contact(form_data)
            return redirect(url_for("main.contacts_list"))
        except ValueError as e:
            return render_template("contacts/new-contact.html", error=str(e))
    return render_template("contacts/new-contact.html")


@main_bp.route("/product/<string:product_id>/edit", methods=["GET", "POST"])
def edit_product(product_id):
    inventory_view = InventoryView()

    if request.method == "POST":
        form_data = request.form
        try:
            updated_product = inventory_view.update_product(product_id, form_data)
            return redirect(
                url_for("main.product_detail", product_id=updated_product["id"])
            )
        except ValueError as e:
            product_data = {
                "id": product_id,
                "name": form_data.get("name", ""),
                "sku": form_data.get("sku", ""),
                "price": form_data.get("price", 0),
                "cost": form_data.get("cost", 0),
                "category": form_data.get("category", ""),
                "tax_rate": form_data.get("tax_rate", 0),
                "taxonomy_id": form_data.get("taxonomy_id", ""),
                "attribute_combinations": form_data.get("attribute_combinations", ""),
            }
            return render_template(
                "products/edit-product.html",
                product=product_data,
                error=str(e),
            )

    product = inventory_view.get_product_detail_data(product_id)
    if not product:
        return "Product not found", 404
    return render_template("products/edit-product.html", product=product)


@main_bp.route("/product/<string:product_id>/delete", methods=["POST"])
def delete_product(product_id):
    inventory_view = InventoryView()
    try:
        inventory_view.delete_product(product_id)
    except ValueError:
        pass
    return redirect(url_for("main.products_list"))
